import { program } from 'commander';
import { getFile, getDiff } from './main,js';

const run = () => {
    program
    .name('gendiff')
    .description('Compares two configuration files and shows a difference.')
    .version('1.0.0');

    program.option('-f, --format [type]', 'output format')
    .argument('<filepath1>').argument('<filepath2>')
    .action((first, second, options) => {
        const json1 = getFile(first);
        const json2 = getFile(second);
        const diff = getDiff(json1,json2);
        console.log(`\n{${diff}\n}`);
    });
    program.parse();
};
export default run;