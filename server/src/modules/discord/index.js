import Discord from 'discord.js';
import { delay } from '../utils/misc';
import commands from '../../commands';
import { COMMANDS_CHANNEL_ID, LOGS_CHANNEL_ID } from './constants';

const client = new Discord.Client();

export async function startDiscordBot() {
    await client.login(process.env.DISCORD_BOT_TOKEN);
    if (process.env.NODE_ENV === 'production') {
        discordLog('bhagat-api', 'Server up and running in the heroku environment');
    }
}

export async function getChannel(channelId) {
    const result = await client.channels.fetch(channelId);
    if (result == null) {
        await delay(1000);
        return await client.channels.fetch(channelId);
    }
    return result;
}

export async function sendMessage(channelId, message) {
    await (await getChannel(channelId)).send(message);
}

export async function sendMessageEmbed(
    channelId,
    title,
    message,
    author = '',
    color = '',
    footer = '',
    imageUrl = '',
    thumbnail = '',
    url = '',
) {
    const msgEmbed = new Discord.MessageEmbed()
        .setTitle(title)
        .setDescription(message)
        .setAuthor(author)
        .setColor(color)
        .setFooter(footer)
        .setImage(imageUrl)
        .setThumbnail(thumbnail)
        .setURL(url);
    await sendMessage(channelId, msgEmbed);
}

export async function discordLog(app, message, state = {}) {
    let logMessage = `__${new Date().toLocaleString()}__ — **${app}** — *${message}*`;
    let first = true;
    for (const key of Object.keys(state)) {
        if (first) {
            logMessage += ' — ';
            first = false;
        }
        const value = state[key];
        logMessage += `${key}=${value}, `;
    }
    if (!first) {
        logMessage = logMessage.substring(0, logMessage.length - 2);
    }
    sendMessage(LOGS_CHANNEL_ID, logMessage);
}

client.on('message', async (message) => {
    if (message.channel.id == COMMANDS_CHANNEL_ID && !message.author.bot && message.content.startsWith('!')) {
        const commandStr = message.content.split(' ')[0].substring(1);
        const content = message.content.substring(commandStr.length + 2).replaceAll('“', '"').replaceAll('”', '"');
        let reply = '\n';

        if (commandStr == 'help') {
            reply = '\n__Commands:__ \n';
            for (const command of commands) {
                reply += `**!${command.name.replaceAll('_', '-')}**: ${command.help}\n`;
            }
            reply += '**!help**: Shows this message\n';
        } else {
            const command = commands.find((command) => command.triggers.includes(commandStr));
            if (command) {
                reply += await command.run(command.parseArgs(content));
            } else {
                reply = `Command ${commandStr} not found! Try !help to see all commands.`;
            }
        }

        await message.reply(reply);
    }
});
