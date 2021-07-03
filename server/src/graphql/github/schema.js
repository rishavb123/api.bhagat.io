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
        priority: Int
    }
    type Language {
        name: String!
        percent: Float
    }
    type Link {
        name: String!
        url: String!
    }
    type Query {
        repos(page: Int=1, pageSize: Int=100, forceNoDb: Boolean=false): [Repo]!
    }
`;
