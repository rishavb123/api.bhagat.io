// import { MongoClient } from 'mongodb';

// const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}` +
//     `@${process.env.MONGODB_CLUSTER}.vjvrg.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority`;

export default [
    // {
    //     expression: '* * * * * *',
    //     task: () => console.log('Running every second!'),
    //     options: {},
    // },
    // {
    //     expression: '*/10 * * * * *',
    //     task: async () => {
    //         try {
    //             const client = new MongoClient(uri, {
    //                 useNewUrlParser: true,
    //                 useUnifiedTopology: true,
    //             });
    //             await client.connect();
    //             await client.db('bhagat-db').command({ ping: 1 });
    //             console.log('Connected successfully to server');
    //         } catch (e) {
    //             console.log(e);
    //         } finally {
    //             await client.close();
    //         }
    //     },
    //     options: {},
    // },
];
