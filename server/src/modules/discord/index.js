import Discord from 'discord.js';

import { DEV_CHANNEL_ID, GUILD_ID } from './contants';

const client = new Discord.Client();
let guild;

export async function startDiscordBot() {
    
    // Init Bot
    await client.login(process.env.DISCORD_BOT_TOKEN);
    guild = await client.guilds.fetch(GUILD_ID);

}

export async function getChannel(channelId) {
    return await client.channels.fetch(channelId);
}

export async function sendMessage(channelId, message) {
    await (await getChannel(channelId)).send(message);
}

export async function sendMessageEmbed(channelId, title, message, author='', color='', footer='', imageUrl='', thumbnail='', url='') {
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