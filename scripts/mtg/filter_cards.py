import sys
import os

PACKAGE_PARENT = ".."
SCRIPT_DIR = os.path.dirname(
    os.path.realpath(os.path.join(os.getcwd(), os.path.expanduser(__file__)))
)
sys.path.append(os.path.normpath(os.path.join(SCRIPT_DIR, PACKAGE_PARENT)))

from gql import gql, Client
from gql.transport.aiohttp import AIOHTTPTransport
from functools import reduce
import json

from constants import graphql_endpoint

transport = AIOHTTPTransport(url=graphql_endpoint)
client = Client(transport=transport, fetch_schema_from_transport=True)

basic_lands = {"Plains", "Island", "Swamp", "Mountain", "Forest"}

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

query = superfriends_proxies

l, h = float(sys.argv[1] if len(sys.argv) > 1 else 0), float(sys.argv[2] if len(sys.argv) > 2 else 100)

result = client.execute(query)["deck"]
result = list(filter(lambda card: card["name"] not in basic_lands, result["cards"]))

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

mapped_result = map(map_func, result)
filtered_result = list(filter(filter_func, mapped_result))

print(json.dumps(filtered_result, indent=4))
print(len(filtered_result))

reduced_result = reduce(reduce_func, filtered_result)

print(reduced_result)