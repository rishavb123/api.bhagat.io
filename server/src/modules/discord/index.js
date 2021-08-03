import Discord from 'discord.js';
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
    return await client.channels.fetch(channelId);
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
    const logMessage = `__${new Date().toLocaleString()}__ - **${app}** - ${message}`;
    let first = true;
    for (let key in state) {
        if (first) {
            logMessage += ' - ';
            first = false;
        }
        logMessage += `${key}=${value}, `;
    }
    if (!first)
        logMessage = logMessage.substring(logMessage.length - 2);
    sendMessage(LOGS_CHANNEL_ID, logMessage);
}
