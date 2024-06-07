import { program } from 'commander';

const run = () => {
    console.log('Running!');
    program
    .name('gendiff')
    .description('Compares two configuration files and shows a difference.')
    .version('1.0.0');
    
    program.parse();
};
export default run;