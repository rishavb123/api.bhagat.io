import sys
from gql import gql

rionya = gql(
    """

    query {
        deck(url: "https://scryfall.com/@rishavb123/decks/63e8df2a-949b-4450-ab00-b2e9bf531845") {
            cards {
                name,
                scryfallApiData
            }
        }
    }

"""
)

superfriends_proxies = gql(
    """

    query {
        deck(url: "https://scryfall.com/@rishavb123/decks/da75e583-a192-46a6-85ec-9af5cf0ae8c1?as=list&with=usd") {
            cards {
                name,
                scryfallApiData
            }
        }
    }

"""
)

araumi_proxies = gql(
    """

    query {
        deck(url: "https://scryfall.com/@rishavb123/decks/c39a4c33-21f7-4cd9-b9ab-ae07e3fa742d?as=list&with=usd") {
            cards {
                name,
                scryfallApiData
            }
        }
    }

"""
)

tatyova_proxies = gql(
    """

    query {
        deck(url: "https://scryfall.com/@rishavb123/decks/840ff970-b653-4d10-8510-ad8909d0c813?as=list&with=usd") {
            cards {
                name,
                scryfallApiData
            }
        }
    }

"""
)

kruphix_proxies = gql(
    """

    query {
        deck(url: "https://scryfall.com/@rishavb123/decks/bd903d18-a2f8-426a-9891-e6e803782c12?as=list&with=usd") {
            cards {
                name,
                scryfallApiData
            }
        }
    }

"""
)

edric_proxies = gql(
    """

    query {
        deck(url: "https://scryfall.com/@rishavb123/decks/64b88456-104d-4069-91aa-41e9aad03f71?as=list&with=usd") {
            cards {
                name,
                scryfallApiData
            }
        }
    }

"""
)

jodah_proxies = gql(
    """

    query {
        deck(url: "https://scryfall.com/@rishavb123/decks/c5451926-3299-4cdf-b145-bf455630133b?as=list&with=usd") {
            cards {
                name,
                scryfallApiData
            }
        }
    }

"""
)

query = rionya

l, h = float(sys.argv[1] if len(sys.argv) > 1 else 0), float(sys.argv[2] if len(sys.argv) > 2 else 100)


def map_func(card):
    nfloat = lambda s: 999 if s is None else float(s)
    price = min(nfloat(card["scryfallApiData"]["prices"]["usd"]), nfloat(card["scryfallApiData"]["prices"]["usd_foil"]))
    price = 0 if price == 999 else price
    return price, card["name"]

def filter_func(card):
    price, _ = card
    return l <= price <= h

def reduce_func(total, card):
    price, _ = card
    if type(total) == tuple:
        total = total[0]
    return total + price