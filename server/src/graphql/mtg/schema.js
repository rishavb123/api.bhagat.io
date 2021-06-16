import { gql } from 'apollo-server-express';

export default gql`
    type Deck {
        url: String!
        cards: [Card]!
        name: String
        deckType: String
        commander: Card
    } 
    type Card {
        name: String!
        count: Int,
        link: String,
        scryfallApiData: JSON!
    }
    type User {
        user: String!
        decks: [Deck]!
    }
`;
