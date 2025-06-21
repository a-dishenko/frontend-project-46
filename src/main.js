/*global console, process*/
import fs from 'fs';
import * as path from 'path';
import getParser from './parsers/index.js';
import getFormatter from './formatters/index.js';

const isPathRelative = (fpath) => {
  if (fpath[0] === '/' || fpath[1] === ':') return false;
  return true;
};

const getFile = (fpath) => {
  const fullPath = isPathRelative(fpath) ? path.resolve(process.cwd(), fpath) : fpath;
  //console.log('Reading file at:', fullPath); // <--- диагностика
  try {
    const myfile = fs.readFileSync(fullPath, 'utf8');
    const ext = path.extname(fpath).slice(1).toLowerCase();
    const parser = getParser(ext);
    return parser(myfile);
  } catch (e) {
    console.error('ERROR: File cannot be found or parsed:', fullPath);
    console.error(e);
  }
};


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
};

const isObject = (value) => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const getDiff = (obj1, obj2, format = 'stylish') => {
    const diff = calcDiff(obj1, obj2);
    const formatter = getFormatter(format);
    return formatter(diff);
  };

export { getFile, calcDiff, isObject, getDiff};