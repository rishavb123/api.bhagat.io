import mtgCrons from './mtg';

export default [
    ...mtgCrons,
    {
        expression: '* * * * * *',
        task: () => console.log('hi'),
        disabled: true,
    },
];
