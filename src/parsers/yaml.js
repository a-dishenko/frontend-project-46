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
        const value = parseValue(line.trimStart().slice(2).trim());
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
        parent[key] = parseValue(valueRaw);
      }
    }
  
    return result;
  };
  
  const parseValue = (value) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === 'null') return null;
    if (!isNaN(value)) return Number(value);
    return value;
  };
  
  export default parseYaml;