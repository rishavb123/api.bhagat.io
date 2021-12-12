import { wrapWithDbClient } from "../../modules/db";

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
        const arr = date.split("/");
        if (arr.length !== 3)
            return null;
        for (const a of arr) {
            const num = parseInt(a);
            if (isNaN(num) || num < 0)
                return null;
        }
        retVal = {
            month: parseInt(arr[0]),
            day: parseInt(arr[1]),
            year: parseInt(arr[2]),
        }
    }
    retVal.stamp = Math.floor(new Date(retVal.year, retVal.month - 1, retVal.day).getTime() / 86400000);
    return retVal;
}

export default [
    {
        name: 'add_event',
        parseArgs: (message) => {
            const regex = /(.*)-*>(.*) \"(.*)\" \"(.*)\"/;
            const regex2 = /\"(.*)\" \"(.*)\"/;
            if (regex.test(message)) {
                const matches = message.match(regex);
                return {
                    startDate: matches[1],
                    endDate: matches[2],
                    name: matches[3],
                    description: matches[4],
                };
            }
            if (regex2.test(message)) {
                const matches = message.match(regex2);
                return {
                    name: matches[1],
                    description: matches[2],
                };
            }
            return {};
        },
        run: async (params) => {
            const errorResp = 'Invalid Input. Please edit your command and try again.';
            console.log(params);
            if (!params.name || !params.description)
                return errorResp;
            return await wrapWithDbClient(async (client) => {
                const db = await client.db('bhagat-db');
                const collection = await db.collection('timeline-events');

                const startDate = processDate(params.startDate);
                const endDate = processDate(params.endDate);

                if (!startDate || !endDate)
                    return errorResp;
                
                startDate.stamp = Math.floor(new Date(startDate.year, startDate.month - 1, startDate.day).getTime() / 86400000)
                endDate.stamp = Math.floor(new Date(endDate.year, endDate.month - 1, endDate.day).getTime() / 86400000)
                
                await collection.insertOne({
                    name: params.name,
                    description: params.description,
                    startDate,
                    endDate
                });

                return "Added event to timeline";
            });
        }
    }
];