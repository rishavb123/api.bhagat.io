import Discord from 'discord.js';
import { delay } from '../utils/misc';
import { LOGS_CHANNEL_ID } from './contants';

const client = new Discord.Client();

export async function startDiscordBot() {
    // Init Bot
    await client.login(process.env.DISCORD_BOT_TOKEN);
    if (process.env.NODE_ENV === 'PROD') {
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
    await (await getChannel(channelId))?.send(message);
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
    for (const key in state) {
        if (first) {
            logMessage += ' — ';
            first = false;
        }
        const value = state[key];
        logMessage += `${key}=${value}, `;
    }
    if (!first)
        logMessage = logMessage.substring(0, logMessage.length - 2);
    sendMessage(LOGS_CHANNEL_ID, logMessage);
}
