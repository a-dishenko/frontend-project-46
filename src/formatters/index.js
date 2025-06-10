// formatters/index.js
import formatPlainDiff from './plain.js';
import formatStylishDiff from './stylish.js';

const formatJsonDiff = (diff) => {
  return JSON.stringify(diff, null, 2);
}

const getFormatter = (format) => {
  switch (format) {
    case 'json':
        return formatJsonDiff;
    case 'plain':
      return formatPlainDiff;
    case 'stylish':
    default:
      return formatStylishDiff;
  }
};

export default getFormatter;