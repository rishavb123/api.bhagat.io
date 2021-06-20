import { gql } from 'apollo-server-express';

export default gql`
    type Repo {
        name: String!
        owner: String!
        info: ExtraRepoInfo
        description: String
        createdDate: String!
        lastUpdated: String!
        languages: [Language]!
    }
    type ExtraRepoInfo {
        imageUrl: String
        links: [Link]!
    }
    type Language {
        name: String!
        percent: Float
    }
    type Link {
        name: String!
        url: String!
    }
`;
