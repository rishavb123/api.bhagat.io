import mtgCrons from './mtg';

// TODO: Add cron to get data from github and store it into mongo db
// (use local executable schema)

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
];
