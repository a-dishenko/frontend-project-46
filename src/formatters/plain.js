export default (diff) => {
  const formatPlainDiff = (diff, path = '') => {
    return diff.reduce((acc, node) => {
      const currentPath = path ? `${path}.${node.key}` : node.key;

      switch (node.type) {
        case 'added':
          acc.push(`Property '${currentPath}' was added with value: ${formatValue(node.value)}`);
          break;
        case 'removed':
          acc.push(`Property '${currentPath}' was removed`);
          break;
        case 'changed':
          acc.push(`Property '${currentPath}' was updated. From ${formatValue(node.oldValue)} to ${formatValue(node.newValue)}`);
          break;
        case 'nested':
          acc.push(...formatPlainDiff(node.children, currentPath));
          break;
        default:
          break;
      }
      return acc;
    }, []);
  };

  const formatValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      return '[complex value]';
    }
    return typeof value === 'string' ? `'${value}'` : value;
  };

  return formatPlainDiff(diff).join('\n');
};