import { sendMessageEmbed } from "../../modules/discord";
import { API_MESSAGES_CHANNEL_ID, USER_ID } from "../../modules/discord/contants";
import { makeComposeUrl } from "../../modules/email/urls";
import { addRoute } from "../utils";

export default function (app) {
    addRoute('/contact/discord', app.post.bind(app), async (req, res) => {
        const { name, message, returnAddress } = req.body;
        const composeUrl = makeComposeUrl(returnAddress);

        await sendMessageEmbed(
            API_MESSAGES_CHANNEL_ID,
            `New Message from ${name}!`,
            `<@${USER_ID}> \n${message}\nReach me at [${returnAddress}](${composeUrl})!`,
        );
        
        res.json({
            status: 0,
        });
    });
}