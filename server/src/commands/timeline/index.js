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
            'Usage: !add-event {startDate} --> {endDate} "{name}" "{description}" {medialink}. ' +
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

                const result = await collection.insertOne({
                    name: params.name,
                    description: params.description,
                    startDate,
                    endDate,
                    media: params.media,
                });

                if (result.insertedCount === 1) {
                    return 'Added event to timeline with id ' + result.insertedId;
                } else {
                    return 'Error inserting event into timeline. Please try again later';
                }
            });
        },
    },
    {
        name: 'list_events',
        help: 'Lists all the events in the database displayed on the timeline at https://bhagat.io#timeline. ' +
            'Usage: !list-events {startIndex} {endIndex}' +
            'All the parameters are optional.',
        parseArgs: (message) => {
            const arr = message.split(' ');
            return {
                startIndex: arr[0] ? (parseInt(arr[0])? parseInt(arr[0]): 0) : 0,
                endIndex: arr[1] ? (parseInt(arr[1])? parseInt(arr[1]): -1) : -1,
            };
        },
        run: async ({ startIndex, endIndex }) => {
            return await wrapWithDbClient(async (client) => {
                const db = await client.db('bhagat-db');
                const collection = await db.collection('timeline-events');

                const events = await collection.find({}).toArray();

                startIndex = (startIndex < 0) ? 0 : startIndex;
                endIndex = (endIndex < 0) ? events.length : endIndex;

                let retVal = '**Events in timeline:**\n';
                for (let i = startIndex; i < events.length && i < endIndex; i++) {
                    const event = events[i];
                    retVal += `\t${event.name}\n`;
                }

                if (retVal.length > 3999) {
                    return 'Too many events to display. Please use !list-events {startIndex} {endIndex}';
                }

                return retVal;
            });
        },
    },
    {
        name: 'remove_event',
        help: 'Removes an event from the database displayed on the timeline at https://bhagat.io#timeline. ' +
            'Usage: !remove-event {eventName}',
        parseArgs: (message) => ({ eventName: message }),
        run: async ({ eventName }) => {
            return await wrapWithDbClient(async (client) => {
                const db = await client.db('bhagat-db');
                const collection = await db.collection('timeline-events');

                const result = await collection.deleteOne({ name: eventName });

                if (result.deletedCount === 0) {
                    return `Error removing event ${eventName} from timeline. Please try again later.`;
                } else {
                    return `Removed event with name ${eventName} from timeline.`;
                }
            });
        },
    },
    {
        name: 'edit_event',
        help: 'Edits an event in the database displayed on the timeline at https://bhagat.io#timeline. ' +
            'Usage: !edit-event {eventName} {startDate} --> {endDate} "{name}" "{description}" {medialink}. ' +
            'All the parameters are optional except name and description. ' +
            'Leave the parameters blank to keep the existing value. ' +
            'For description enter "" to keep the existing value.',
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
            if (!params.name) {
                return errorResp;
            }
            return await wrapWithDbClient(async (client) => {
                const db = await client.db('bhagat-db');
                const collection = await db.collection('timeline-events');

                const startDate = !params.startDate? undefined: processDate(params.startDate);
                const endDate = !params.endDate? undefined: processDate(params.endDate);

                if (startDate) {
                    startDate.stamp = Math.floor(
                        new Date(startDate.year, startDate.month - 1, startDate.day).getTime() / 86400000,
                    );
                }
                if (endDate) {
                    endDate.stamp = Math.floor(
                        new Date(endDate.year, endDate.month - 1, endDate.day).getTime() / 86400000,
                    );
                }

                const updateSet = {};
                if (startDate) {
                    updateSet.startDate = startDate;
                }
                if (endDate) {
                    updateSet.endDate = endDate;
                }
                if (params.description) {
                    updateSet.description = params.description;
                }
                if (params.media) {
                    updateSet.media = params.media;
                }

                await collection.updateOne({
                    name: params.name,
                }, {
                    $set: updateSet,
                });

                return 'Edited event in timeline with name ' + params.name;
            });
        },
    },
];
