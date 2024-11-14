import { program } from 'commander';
import { getFile, getDiff } from './main,js';

const run = () => {
    console.log('Running!');
    program
    .name('gendiff')
    .description('Compares two configuration files and shows a difference.')
    .version('1.0.0');

    program.option('-f, --format [type]', 'output format')
    .argument('<filepath1>').argument('<filepath2>')
    .action((first, second, options) => {
        console.log('action '+first+' '+second);
        const json1 = getFile(first);
        const json2 = getFile(second);
        console.log(json1,json2);
        const diff = getDiff(json1,json2);
        console.log(diff);
    });
    
    program.parse();
};
export default run;