import Discord from 'discord.js';
import { delay } from '../utils/misc';
import { SANDBOX_CHANNEL_ID, WELCOME_CHANNEL_ID, ROLES_CHANNEL_ID, INTRODUCTIONS_CHANNEL_ID, ANNOUNCEMENTS_CHANNEL_ID } from './constants';


const client = new Discord.Client();

export async function startGTMTGDiscordBot() {
    await client.login(process.env.GTMTG_DISCORD_BOT_TOKEN);
    if (process.env.NODE_ENV === 'production') {
        await sendMessage(SANDBOX_CHANNEL_ID, 'Discord Bot is up and running in the heroku environment.');
    }
    client.on('guildMemberAdd', async (member) => {
        await sendMessageEmbed(
            WELCOME_CHANNEL_ID,
            `Welcome to the server!`,
            `<@${member.id}> \n Make sure to check out <#${ROLES_CHANNEL_ID}> to add any roles you want and throw an introduction for yourself in <#${INTRODUCTIONS_CHANNEL_ID}>.` +
            `Also, please change your nickname on the server to your first name (and last name if you want). \n\n` +
            `To see any upcoming events or announcements, see the <#${ANNOUNCEMENTS_CHANNEL_ID}> or check our website at https://mtg.bhagat.io ! \n\n` +
            `Feel free to poke around the different server channels and join us on Friday for our weekly game nights!`
        );
    });
}

// TODO: modularize this code with the discord module
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
