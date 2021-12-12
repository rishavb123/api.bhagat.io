import jobsCommands from './jobs';
import timelineCommands from './timeline';

function processCommands(commands) {
    for (const command of commands) {
        if (!command.parseArgs) {
            command.parseArgs = (message) => {
                try {
                    return JSON.parse(message);
                } catch {
                    return {};
                }
            };
        }
        if (!command.triggers) {
            command.triggers = [];
        }
        if (command.triggers instanceof String) {
            command.triggers = [command.triggers];
        }
        command.triggers.push(command.name.replaceAll('_', '-'));
        if (!command.name) {
            command.name = command.triggers[0].replaceAll('-', '_');
        }
        if (!command.help) {
            command.help = `Usage: !${command.name} {ARGS}`;
        }
    }
    return commands;
}

export default processCommands([
    {
        name: 'hello_world',
        help: 'Says hello! Usage: !hello-world or !hello-world {name: {NAME}}',
        triggers: ['test', 'hello', 'hello-world'],
        run: async (params) => {
            if (params.name) {
                return `Hello, ${params.name}!`;
            } else {
                return 'Hello, World!';
            }
        },
    },
    ...jobsCommands,
    ...timelineCommands,
]);
