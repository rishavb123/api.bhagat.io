import mtgCrons from './mtg';

// TODO: Add cron to get data from github and store it into mongo db
// (use local executable schema)

export default [
    {
        name: 'good_morning',
        expression: '30 7 * * *',
        task: async () => {
            const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            await delay(5000);
            console.log('Good Morning!');
        },
        disabled: true,
    },
    ...mtgCrons,
];
