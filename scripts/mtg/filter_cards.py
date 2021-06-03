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

query = gql(
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

result = client.execute(query)["deck"]
result = list(filter(lambda card: card["name"] not in basic_lands, result["cards"]))

def map_func(card):
    nfloat = lambda s: 999 if s is None else float(s)
    price = min(nfloat(card["scryfallApiData"]["prices"]["usd"]), nfloat(card["scryfallApiData"]["prices"]["usd_foil"]))
    price = 0 if price == 999 else price
    return price, card["name"]

def filter_func(card):
    price, _ = card
    l, h = 0, 3
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

# 13 cards proxied that I don't have (over 2.5 bucks)
# 18 cards over 2.5 bucks

# 57 + 32 Mountains under 2.5 bucks totalling to 37 dollars