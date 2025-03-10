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
const parseYaml = (text) => {
    const lines = text.split('\n').slice(1);
    return lines.reduce((acc, el)=>{
        const _s = el.split(':');
        const key = _s[0].trim();
        let value = _s[1].trim();
        if (!isNaN(Number(value))) value = Number(value);
        if (value === 'true') value = true;
        if (value === 'false') value = false;
        if (value === 'null') value = null;
        acc[key] = value;
        return acc;
    }, {});
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
const printLine = (k, o, s) => {
    return `${s} ${k}: ${o[k]}`;
};
const getDiff = (obj1, obj2, format) => {
    if (format === 'plain') return getPlainDiff(obj1, obj2);
    const delimeter = '\n    ';
    const mergedObj = {...obj1, ...obj2};
    const mergedKeys = Object.keys(mergedObj).sort();
    const diffArr = mergedKeys.map((key)=>{
        if(Object.hasOwn(obj1,key) && !Object.hasOwn(obj2, key)) return printLine(key, obj1, '-');
        if(!Object.hasOwn(obj1,key) && Object.hasOwn(obj2, key)) return printLine(key, obj2, '+');
        if(obj1[key] === obj2[key]) return printLine(key, obj1, ' ')
        return printLine(key, obj1, '-')+delimeter+printLine(key, obj2, '+');
    });
    const diffStr = diffArr.join(delimeter);
    return `\n{${delimeter + diffStr}\n}`;
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
export { getFile, getDiff, getType };