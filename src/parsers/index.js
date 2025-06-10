import parseYaml from './yaml.js';
import parseJSON from './json.js';

const getParser = (format) => {
  switch (format) {
    case 'json':
      return parseJSON;
    case 'yaml':
    default:
      return parseYaml;
  }
};

export default getParser;