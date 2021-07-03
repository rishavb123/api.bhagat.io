import { gql } from 'apollo-server-express';

export default gql`
    """A Magic: the Gathering deck loaded in from a deck-building website"""
    type Deck {
        """The url for the deck"""
        url: String!

        """A list of the cards in the deck"""
        cards: [Card]!

        """The name of the deck"""
        name: String

        """The format of the deck. Ex: Commander / EDH, Modern, Standard"""
        deckType: String

        """The commander of the deck. Only accurate for formats that include commanders"""
        commander: Card

        """The description of the deck loaded in from the deck building site"""
        description: String
    }
    
    """A single Magic: the Gathering card"""
    type Card {
        """The name of the card"""
        name: String!

        """The count of the card (in a deck)"""
        count: Int,

        """A link for the card from a deck-building website"""
        link: String,

        """Scryfall api data including a variety of fields"""
        scryfallApiData: JSON!
    }

    """A moxfield user"""
    type User {
        """The username of the user"""
        user: String!

        """A list of the user's decks"""
        decks: [Deck]!
    }

    type Query {
        """Get a deck from a url (from a deck-building site)"""
        deck(url: String): Deck!,

        """Get a card by exact name"""
        card(name: String): Card!,

        """Get one of my decks by name using a fuzzy search"""
        mydeck(name: String): Deck,

        """Get all my decks"""
        mydecks(name: String): [Deck!]!,

        """Get a moxfield user by username"""
        user(user: String): User!,
    }
`;
