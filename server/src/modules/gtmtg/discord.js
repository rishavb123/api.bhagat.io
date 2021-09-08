import Discord from 'discord.js';
import { delay, toTitleCase } from '../utils/misc';
import { SANDBOX_CHANNEL_ID, WELCOME_CHANNEL_ID, ROLES_CHANNEL_ID, INTRODUCTIONS_CHANNEL_ID, ANNOUNCEMENTS_CHANNEL_ID } from './constants';
import { addPerson } from './roster';
import { USER_ID } from '../discord/constants';


const client = new Discord.Client();
const botState = {};

const dialogStates = {
    'sign up': {
        dialogs: [
            (trigger, state) => {
                state.step++;
                return 'Please type your first name';
            },
            (first, state) => {
                state.data.first = toTitleCase(first);
                state.step++;
                return 'Thanks! Please type your last name';
            },
            (last, state) => {
                state.data.last = toTitleCase(last);
                state.step++;
                return 'What is your GT username? (ex gburdell3)';
            },
            (gtUser, state) => {
                state.data.gtUser = gtUser.toLowerCase();
                state.step++;
                return `Is this information correct? (Y/N) \nFirst Name: ${state.data.first}\nLast Name: ${state.data.last}\nGT User: ${state.data.gtUser}\nDiscord User: ${state.username}`;
            },
            async (confirmation, state) => {
                if (confirmation.toLowerCase().charAt(0) == 'y') {
                    const result = await addPerson(state.data.first, state.data.last, state.data.gtUser, state.username, state.userId);
                    if (result) {
                        state.step = -1;
                        return 'Awesome! Thanks for the info! I added you into our database!';
                    } else {
                        state.step = -1;
                        return `Looks like your already in the database. If you would like to update your information, DM <@${USER_ID}>`;
                    }
                } else if (confirmation.toLowerCase().charAt(0) == 'n') {
                    state.step = 0;
                    state.skipResponse = true;
                    return 'Ok let\'s try it again!';
                } else {
                    return 'Invalid input try again. Is this information correct? (Y/N)';
                }
            }
        ]
    }
}

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

    async function takeStep(message, state) {
        return await dialogStates[state.process].dialogs[state.step](message, state);
    }

    client.on('message', async (message) => {

        if (message.channel.type == 'dm' && !message.author.bot) {
            
            async function takeStepWithMessage(m, s) {
                const result = await takeStep(m, s);
                if (result && result.length > 0)
                    await message.reply(result);
                if (s.skipResponse) {
                    s.skipResponse = false;
                    await takeStepWithMessage(m, s);
                }
            }

            const content = message.content;
            const userId = message.author.id;
            const state = botState[userId];

            if (state && state.process) {
                await takeStepWithMessage(content, state);
                if (state.step == -1) {
                    botState[userId] = null;
                }
            } else if (Object.keys(dialogStates).includes(content.toLowerCase())) {
                botState[userId] = dialogStates[content.toLowerCase()].defaultState || {};
                botState[userId].data = botState[userId].data || {};
                botState[userId].step = botState[userId].step || 0;
                botState[userId].process = content.toLowerCase();
                botState[userId].userId = userId;
                botState[userId].username = message.author.tag;
                await takeStepWithMessage(content, botState[userId]);
                
            } else {
                await message.reply('Sorry that does not match any of my known processes. Please DM the mods for any questions.');
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
