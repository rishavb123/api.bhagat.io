export const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}` +
    `@${process.env.MONGODB_CLUSTER}.vjvrg.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority`;

// TODO: move the mongo db constants like cluster and dbname to this file
