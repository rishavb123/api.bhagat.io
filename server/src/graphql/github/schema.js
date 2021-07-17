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

        """The web hooks that the github repo is connected to"""
        hooks: [Hook]!
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

    """Link to display on my website projects section"""
    type Link {
        """The name of the link to show on my website"""
        name: String!

        """The url to go to when the link is actually clicked"""
        url: String!
    }

    """Programming language information in a repository"""
    type Language {
        """The name of the programming language"""
        name: String!

        """The fraction of the repository in this language (50% is 0.5)"""
        percent: Float
    }

    """Github WebHook information"""
    type Hook {
        """The hook id"""
        id: Int!

        """The url that the hook calls on updates"""
        url: String!

        """The content type of the webhook"""
        contentType: String!

        """Whether the web hook uses SSL or not"""
        secure: Boolean!

        """Whether or not this webhook is active"""
        active: Boolean!

        """ISO date string for when the hook was created"""
        createdDate: String!

        """ISO date string for when the hook was last updated"""
        lastUpdated: String!

        """The last response from the webhook"""
        lastResponse: HookResponse

    }

    """Response information from a github web hook call"""
    type HookResponse {
        """The status code of the hook response"""
        code: Int!

        """The message from the response"""
        message: String!

        """The status from the response"""
        status: String!
    }

    type Query {
        """Get the repositories marked with the """
        repos(
            """The page number to get data from. Defaults to 1"""
            page: Int,
            """The number of repositories per page. Defaults to 100"""
            pageSize: Int,
            """Force the query to not fallback to the database rate limiting becomes a problem. Defaults to false"""
            forceNoDb: Boolean,
            """Whether or not to cache the query results. Defaults to true"""
            caching: Boolean
        ): [Repo]!
    }
`;
