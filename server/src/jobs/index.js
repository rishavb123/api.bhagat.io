import mtgCrons from './mtg';
import githubCrons from './github';

export default [
    {
        name: 'hello_world',
        expression: '* * * * *',
        task: async () => {
            const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            await delay(5000);
            console.log('Good Morning!');
        },
        disabled: true,
        runInDev: false,
    },
    ...mtgCrons,
    ...githubCrons,
];
