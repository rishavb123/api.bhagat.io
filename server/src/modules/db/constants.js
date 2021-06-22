export const MONGODB_CLUSTER = 'bhagat-cluster';
export const MONGODB_DBNAME = 'bhagat-db';

export const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}` +
    `@${MONGODB_CLUSTER}.vjvrg.mongodb.net/${MONGODB_DBNAME}?retryWrites=true&w=majority`;
