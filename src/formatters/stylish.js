// formatters/stylish.js
const formatValue = (value, depth) => {
  if (typeof value === 'string') {
    return `"${value}"`; // Добавляем кавычки вокруг строки
  }

  if (value === null) {
    return 'null';
  }

  if (typeof value === 'boolean') {
    return value.toString();
  }

  if (typeof value === 'number') {
    return value.toString();
  }

  if (isObject(value)) {
    const indentSize = 4;
    const currentIndent = ' '.repeat((depth + 1) * indentSize);
    const closingIndent = ' '.repeat(depth * indentSize);

    const lines = Object.entries(value).map(
      ([key, val]) => `${currentIndent}${key}: ${formatValue(val, depth + 1)}`
    );

    return `{\n${lines.join('\n')}\n${closingIndent}}`;
  }

  return String(value);
};

  
  const isObject = (value) => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  };
  
  const formatStylishDiff = (diff, depth = 1) => {
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
          return `${signIndent}  ${key}: {\n${formatStylishDiff(node.children, depth + 1)}\n${currentIndent}}`;
        default:
          throw new Error(`Unknown node type: ${node.type}`);
      }
    });
  
    return depth == 1 ? `{\n${lines.join('\n')}\n}` : lines.join('\n'); // добавляем начальне скобки только на 1м уровне
  };
  
  export default formatStylishDiff;