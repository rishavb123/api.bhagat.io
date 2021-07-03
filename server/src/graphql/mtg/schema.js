import { gql } from 'apollo-server-express';

export default gql`
    type Deck {
        url: String!
        cards: [Card]!
        name: String
        deckType: String
        commander: Card
        description: String
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
    type Query {
        deck(url: String): Deck!,
        card(name: String): Card!,
        mydeck(name: String): Deck,
        mydecks(name: String): [Deck!]!,
        user(user: String): User!,
    }
`;
