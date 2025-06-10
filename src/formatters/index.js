// formatters/index.js
import formatPlainDiff from './plain.js';
import formatStylishDiff from './stylish.js';

const getFormatter = (format) => {
  switch (format) {
    case 'plain':
      return formatPlainDiff;
    case 'stylish':
    default:
      return formatStylishDiff;
  }
};

export default getFormatter;