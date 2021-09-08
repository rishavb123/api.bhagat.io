import Discord from 'discord.js';
import { delay } from '../utils/misc';
import { SANDBOX_CHANNEL_ID, WELCOME_CHANNEL_ID, ROLES_CHANNEL_ID, INTRODUCTIONS_CHANNEL_ID, ANNOUNCEMENTS_CHANNEL_ID } from './constants';
import { addPerson } from './roster';


const client = new Discord.Client();
const botState = {};

export async function startGTMTGDiscordBot() {
    await client.login(process.env.GTMTG_DISCORD_BOT_TOKEN);
    if (process.env.NODE_ENV === 'production') {
        await sendMessage(SANDBOX_CHANNEL_ID, 'Discord Bot is up and running in the heroku environment.');
    }
    client.on('guildMemberAdd', async (member) => {
        await sendMessageEmbed(
            WELCOME_CHANNEL_ID,
            `Welcome, fellow Planeswalker!`,
            `<@${member.id}> \n Make sure to give yourself <#${ROLES_CHANNEL_ID}> and introduce yourself in <#${INTRODUCTIONS_CHANNEL_ID}>. Also, please change your server nickname to your real name. \n
            Check <#${ANNOUNCEMENTS_CHANNEL_ID}> or our website https://mtg.bhagat.io/ for any upcoming events. Feel free to poke around various channels and join us on Fridays for our weekly game nights!`
        );
    });
    client.on('message', async (message) => {
        if (message.channel.type == 'dm' && !message.author.bot) {
            const content = message.content;
            const userId = message.author.id;
            const state = botState[userId];
            if (state && state.process) {
                switch (state.process) {
                    case "sign_up":
                        state.info.push(message.content.trim());
                        await message.reply(state.dialogs[state.step - 1])
                        state.step++;
                        if (state.step == 4) {
                            const result = await addPerson(state.info[0], state.info[1], state.info[2], message.author.username, userId);
                            botState[userId] = {};
                            if (!result)
                                message.reply('It looks like you are already in our database!');
                        }
                        break;
                }
            } else if (content.toLowerCase().match(/sign up/g)) {
                await message.reply('Starting sign up process . . .');
                await message.reply('Please type your first name');
                botState[userId] = {
                    process: 'sign_up',
                    step: 1,
                    info: [],
                    dialogs: [
                        'Thanks! Please type your last name',
                        'What is your GT user name? (ex: gburdell3)',
                        'Awesome! Thanks for the info! I\'ll add you into our database now!',
                    ],
                };

            } else {

            }
        }
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
