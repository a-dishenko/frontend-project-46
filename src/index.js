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
        if(!json1 || !json2) return;
        const diff = getDiff(json1, json2, options.format || 'default');
        console.log(diff);
    });
    program.parse();
};
export default run;