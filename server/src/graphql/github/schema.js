import { gql } from 'apollo-server-express';

export default gql`
    """A github repository with some fields read from the repository's files & commits and some from the github api"""
    type Repo {
        """The name of the repository on github"""
        name: String!

        """The username of the owner of the repository (usually rishavb123)"""
        owner: String!

        """Additional information on the repository read in from the project_info.json file in the repository"""
        info: ExtraRepoInfo

        """A description of the project"""
        description: String

        """ISO date string for when the repository was created"""
        createdDate: String!

        """ISO date string for when the repository was last updated"""
        lastUpdated: String!

        """The programming languages used in the repository and usage percentage split"""
        languages: [Language]!
    }

    """Additional info read from the project_info.json file"""
    type ExtraRepoInfo {
        """The url to the project image to display on my personal website"""
        imageUrl: String

        """The links to display on my website"""
        links: [Link]!

        """The priority of the project in the sort for my website"""
        priority: Int
    }

    """Programming language information in a repository"""
    type Language {
        """The name of the programming language"""
        name: String!

        """The fraction of the repository in this language (50% is 0.5)"""
        percent: Float
    }

    """Link to display on my website projects section"""
    type Link {
        """The name of the link to show on my website"""
        name: String!

        """The url to go to when the link is actually clicked"""
        url: String!
    }

    type Query {
        """Get the repositories marked with the """
        repos(page: Int, pageSize: Int, forceNoDb: Boolean, caching: Boolean): [Repo]!
    }
`;
