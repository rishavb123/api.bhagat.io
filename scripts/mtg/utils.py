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