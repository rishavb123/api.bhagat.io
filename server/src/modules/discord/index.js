import Discord from 'discord.js';

const client = new Discord.Client();

export async function startDiscordBot() {
    // Init Bot
    await client.login(process.env.DISCORD_BOT_TOKEN);
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
