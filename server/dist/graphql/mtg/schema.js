"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _apolloServerExpress=require("apollo-server-express"),_default=_apolloServerExpress.gql`
    type Deck {
        url: String!
        cards: [Card]!
        name: String!
    } 
    type Card {
        name: String!
        count: Int,
        link: String,
        scryfallApiData: JSON!
    }
`;exports.default=_default;