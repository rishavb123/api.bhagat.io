import { gql } from 'apollo-server-express';

export default gql`
    type Deck {
        url: String!
        cards: [Card]!
    } 
    type Card {
        name: String!
        count: Int,
        link: String
    }
`;
