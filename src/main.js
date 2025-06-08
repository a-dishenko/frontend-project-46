/*global console, process*/
import fs from 'fs';
import * as path from 'path';
const isPathRelative = (fpath)=>{
    if (fpath[0] === '/' || fpath[1] === ':') return false;
    return true;
};
const getType = (fpath) => {
    const ext = fpath.split('.').slice(-1)[0];
    if (ext === 'json') return 'JSON';
    if (ext === 'yml') return 'YAML';
    return null;
};
/**
 * Простейший YAML-парсер без внешних библиотек.
 * Поддерживает:
 * - примитивы: строки, числа, true/false, null
 * - вложенные объекты и списки
 */
export const parseYaml = (ymlText) => {
  const lines = ymlText.split('\n');
  const result = {};
  const stack = [{ indent: -1, obj: result }];

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (line === '' || line.trimStart().startsWith('#')) continue;

    const indent = rawLine.match(/^ */)[0].length;
    const parent = [...stack].reverse().find(item => item.indent < indent).obj;

    if (line.trimStart().startsWith('- ')) {
      const value = parseYamlValue(line.trimStart().slice(2).trim());
      const lastKey = Object.keys(parent).at(-1);
      if (!Array.isArray(parent[lastKey])) {
        parent[lastKey] = [];
      }
      parent[lastKey].push(value);
      continue;
    }

    const [keyPart, ...valueParts] = line.split(':');
    const key = keyPart.trim();
    const valueRaw = valueParts.join(':').trim();

    if (valueRaw === '') {
      const newObj = {};
      parent[key] = newObj;
      stack.push({ indent, obj: newObj });
    } else {
      parent[key] = parseYamlValue(valueRaw);
    }
  }

  return result;
};

const parseYamlValue = (value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null') return null;
  if (!isNaN(value)) return Number(value);
  return value;
};

const getFile = (fpath) => {
    const fullPath = isPathRelative(fpath) ? path.resolve(process.cwd(),fpath) : fpath;
    try {
        const myfile = fs.readFileSync(fullPath, 'utf8');
        return getType(fpath) === 'JSON' ? JSON.parse(myfile) : parseYaml(myfile);
    }catch(e){
        console.log('ERROR: File cannot be found: ', fullPath);
        console.log(e);
    }
};

const getDiff = (obj1, obj2, format) => {
    if (format === 'plain') return getPlainDiff(obj1, obj2);
    return formatDiff(calcDiff(obj1, obj2))
};


const getPlainDiff = (obj1, obj2) => {
    const mergedObj = {...obj1, ...obj2};
    const mergedKeys = Object.keys(mergedObj).sort();
    const diffArr = mergedKeys.map((key)=>{
        const start = `Property '${key}' was `;
        if(Object.hasOwn(obj1,key) && !Object.hasOwn(obj2, key)) return start +'removed';
        if(!Object.hasOwn(obj1,key) && Object.hasOwn(obj2, key)) return start + `added with value  '${obj2[key]}'`;
        if(obj1[key] === obj2[key]) start + 'unchanged';
        return start + `updated. From '${obj1[key]}' to '${obj2[key]}'`;
    });
    return diffArr.join('\n');
};

/**
 * Строит древовидное представление различий между двумя объектами.
 * @param {Object} obj1 - Первый объект.
 * @param {Object} obj2 - Второй объект.
 * @returns {Array} Массив различий в виде объектов с типом и значениями.
 */
const calcDiff = (obj1, obj2) => {
  const keys = Array.from(new Set([...Object.keys(obj1), ...Object.keys(obj2)]))
    .sort();

  return keys.map((key) => {
    const val1 = obj1[key];
    const val2 = obj2[key];

    if (!(key in obj1)) {
      return { key, type: 'added', value: val2 };
    }

    if (!(key in obj2)) {
      return { key, type: 'removed', value: val1 };
    }

    const bothAreObjects = isObject(val1) && isObject(val2);
    if (bothAreObjects) {
      return {
        key,
        type: 'nested',
        children: calcDiff(val1, val2),
      };
    }

    if (val1 !== val2) {
      return {
        key,
        type: 'changed',
        oldValue: val1,
        newValue: val2,
      };
    }

    return { key, type: 'unchanged', value: val1 };
  });
}

/**
 * Форматирует различия в читаемую строку.
 * @param {Array} diff - Результат работы calcDiff.
 * @param {number} depth - Текущая глубина вложенности.
 * @returns {string} Строка форматированного диффа.
 */
const formatDiff = (diff, depth = 1) => {
  const indentSize = 4;
  const currentIndent = ' '.repeat(depth * indentSize);
  const signIndent = ' '.repeat((depth * indentSize) - 2);

  const lines = diff.flatMap((node) => {
    const key = node.key;

    switch (node.type) {
      case 'added':
        return `${signIndent}+ ${key}: ${formatValue(node.value, depth)}`;
      case 'removed':
        return `${signIndent}- ${key}: ${formatValue(node.value, depth)}`;
      case 'unchanged':
        return `${signIndent}  ${key}: ${formatValue(node.value, depth)}`;
      case 'changed':
        return [
          `${signIndent}- ${key}: ${formatValue(node.oldValue, depth)}`,
          `${signIndent}+ ${key}: ${formatValue(node.newValue, depth)}`,
        ];
      case 'nested':
        return `${signIndent}  ${key}: {\n${formatDiff(node.children, depth + 1)}\n${currentIndent}}`;
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  });

  return depth == 1 ? `{\n${lines.join('\n')}\n}` : lines.join('\n'); // добавляем начальне скобки только на 1м уровне
}


/**
 * Форматирует значение в виде строки с учётом вложенности.
 * @param {any} value - Значение.
 * @param {number} depth - Текущая глубина вложенности.
 * @returns {string} Форматированная строка.
 */
function formatValue(value, depth) {
  if (typeof value === 'string') {
    return `"${value}"`; // обернуть строку в кавычки
  }

  if (!isObject(value)) {
    return String(value);
  }

  const indentSize = 4;
  const currentIndent = ' '.repeat((depth + 1) * indentSize);
  const closingIndent = ' '.repeat(depth * indentSize);

  const lines = Object.entries(value).map(
    ([key, val]) => `${currentIndent}${key}: ${formatValue(val, depth + 1)}`
  );

  return `{\n${lines.join('\n')}\n${closingIndent}}`;
}

/**
 * Проверяет, является ли значение объектом (и не массивом).
 * @param {any} value - Проверяемое значение.
 * @returns {boolean} Результат проверки.
 */
function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}


export { getFile, getDiff, getType };