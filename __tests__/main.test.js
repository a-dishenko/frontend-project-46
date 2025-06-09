import { getDiff, getFile } from '../src/main.js';

const obj1 = getFile('__fixtures__/file1.json');
const obj2 = getFile('__fixtures__/file2.json');

const expected = `
{
    common: {
      + follow: false
        setting1: "Value 1"
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: "blah blah"
      + setting5: {
            key5: "value5"
        }
        setting6: {
            doge: {
              - wow: ""
              + wow: "so much"
            }
            key: "value"
          + ops: "vops"
        }
    }
    group1: {
      - baz: "bas"
      + baz: "bars"
        foo: "bar"
      - nest: {
            key: "value"
        }
      + nest: "str"
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}`.trim();

test('getDiff with nested structure', () => {
  expect(getDiff(obj1, obj2)).toBe(expected);
});