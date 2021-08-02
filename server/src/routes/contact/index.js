import { sendMessageEmbed } from '../../modules/discord';
import { API_MESSAGES_CHANNEL_ID, USER_ID } from '../../modules/discord/contants';
import { makeComposeUrl, validateEmail } from '../../modules/email/utils';
import { addRoute } from '../utils';

export default function(app) {
    addRoute('/contact/discord', app.post.bind(app), async (req, res) => {
        const { name, message, returnAddress } = req.body;
        const composedUrl = makeComposeUrl(returnAddress, '', `Hey ${name}, \n\n\n\nRegards,\nRishav Bhagat`);

        if (!validateEmail(returnAddress)) {
            res.json({
                status: 1,
                msg: 'Invalid Email Address',
            });
            return;
        }

        await sendMessageEmbed(
            API_MESSAGES_CHANNEL_ID,
            `New Message from ${name}!`,
            `<@${USER_ID}> \n${message}\nReach me at [${returnAddress}](${composedUrl})!`,
        );

        res.json({
            status: 0,
        });
    });
}
