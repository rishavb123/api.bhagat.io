"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _apolloServerExpress=require("apollo-server-express"),_schema=_interopRequireDefault(require("./mtg/schema"));function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}const schema=_apolloServerExpress.gql`
    scalar JSON
    type Query {
        deck(url: String): Deck!,
        card(name: String): Card!,
        mydeck(name: String): Deck,
        mydecks(name: String): [Deck!]!
    }
`,typeDefs=[schema,_schema.default];var _default=typeDefs;exports.default=_default;