import mtgCrons from './mtg';

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
