import { gql } from 'apollo-server-express';

export default gql`
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
`;
