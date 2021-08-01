import { sendMessageEmbed } from "../../modules/discord";
import { API_MESSAGES_CHANNEL_ID, USER_ID } from "../../modules/discord/contants";
import { addRoute } from "../utils";

export default function (app) {
    addRoute('/contact/discord', app.post.bind(app), async (req, res) => {
        const { name, message, returnAddress } = req.body;
        await sendMessageEmbed(
            API_MESSAGES_CHANNEL_ID,
            `New Message from ${name}!`,
            `<@${USER_ID}> \n${message}\nReach me at [${returnAddress}](mailto:${returnAddress})!`,
        );
        res.json({
            status: 0,
        });
    });
}