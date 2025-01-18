import { getDiff, getFile } from '../src/main.js';

const obj1 = getFile('__fixtures__/file1.json');
const obj2 = getFile('__fixtures__/file2.json');

const diff = `
{
    - follow: false
      host: hexlet.io
    - proxy: 123.234.53.22
    - timeout: 50
    + timeout: 20
    + verbose: true
}`;

test('getDiff', () => {
  expect(getDiff(obj1, obj2)).toBe(diff);
});