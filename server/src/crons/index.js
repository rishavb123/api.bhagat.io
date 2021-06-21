import mtgCrons from './mtg';

// TODO: Add cron to get data from github and store it into mongo db
// (use local executable schema)
// TODO: only run crons in production environment unless runOnDev: true

export default [
    {
        name: 'hello_world',
        expression: '* * * * *',
        task: async () => {
            const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            await delay(5000);
            console.log('Good Morning!');
        },
        disabled: false,
        runInDev: false,
    },
    ...mtgCrons,
];
