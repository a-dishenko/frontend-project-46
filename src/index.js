import { getFile, getDiff } from './main.js';

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const json1 = getFile(filepath1);
  const json2 = getFile(filepath2);

  if (!json1 || !json2) {
    throw new Error('One or both files could not be read');
  }

  return getDiff(json1, json2, format);
};

export default genDiff;
