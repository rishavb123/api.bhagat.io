import { wrapWithDbClient } from '../../modules/db';

function processDate(date) {
    let retVal = null;
    if (!date) {
        const d = new Date();
        retVal = {
            month: d.getMonth() + 1,
            day: d.getDate(),
            year: d.getFullYear(),
        };
    } else {
        const arr = date.split('/');
        retVal = {
            month: parseInt(arr[0]),
            day: parseInt(arr[1]),
            year: parseInt(arr[2]),
        };
    }
    retVal.stamp = Math.floor(new Date(retVal.year, retVal.month - 1, retVal.day).getTime() / 86400000);
    return retVal;
}

export default [
    {
        name: 'add_event',
        help: 'Adds an event to the database to be displayed on the timeline at https://bhagat.io#timeline. ' +
            'Usage: !add-event {startDate} --> {endDate} "{name}" "{description}" {medialink}.' +
            'All the parameters are optional except name and description.',
        parseArgs: (message) => {
            const regex = /(?:([0-9]*\/[0-9]*\/[0-9]*)(?:.*> ?([0-9]*\/[0-9]*\/[0-9]*))?.)?\"(.*)\".\"(.*)\"(?:.(.*))?/;
            const lineReplacer = '~';
            message = message.replaceAll('\n', lineReplacer);

            if (regex.test(message)) {
                const matches = message.match(regex);
                return {
                    startDate: matches[1],
                    endDate: matches[2] ? matches[2] : matches[1],
                    name: matches[3],
                    description: matches[4],
                    media: matches[5],
                };
            }
            return {};
        },
        run: async (params) => {
            const errorResp = 'Invalid Input. Please edit your command and try again.';
            if (!params.name || !params.description) {
                return errorResp;
            }
            return await wrapWithDbClient(async (client) => {
                const db = await client.db('bhagat-db');
                const collection = await db.collection('timeline-events');

                const startDate = processDate(params.startDate);
                const endDate = processDate(params.endDate);

                if (!startDate || !endDate) {
                    return errorResp;
                }

                startDate.stamp = Math.floor(
                    new Date(startDate.year, startDate.month - 1, startDate.day).getTime() / 86400000,
                );
                endDate.stamp = Math.floor(new Date(endDate.year, endDate.month - 1, endDate.day).getTime() / 86400000);

                await collection.insertOne({
                    name: params.name,
                    description: params.description,
                    startDate,
                    endDate,
                    media: params.media,
                });

                return 'Added event to timeline';
            });
        },
    },
];
