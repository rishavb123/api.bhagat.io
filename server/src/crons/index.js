import mtgCrons from './mtg';

export default [
    ...mtgCrons,
    {
        expression: '* * * * * *',
        task: () => console.log('Running every second!'),
        disabled: true,
    },
];
