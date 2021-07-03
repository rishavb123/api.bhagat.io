import schemas from './schema';
import resolvers from './resolvers';
import { mergeSchemas } from 'apollo-server-express';

// TODO: add linkedIn section and automate website with it
// TODO: add discord module to allow people to message me from website

export default mergeSchemas({
    schemas,
    resolvers
});