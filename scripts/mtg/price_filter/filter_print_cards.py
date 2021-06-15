import sys
import os

PACKAGE_PARENT = "../.."
SCRIPT_DIR = os.path.dirname(
    os.path.realpath(os.path.join(os.getcwd(), os.path.expanduser(__file__)))
)
sys.path.append(os.path.normpath(os.path.join(SCRIPT_DIR, PACKAGE_PARENT)))

from gql import Client
from gql.transport.aiohttp import AIOHTTPTransport

from constants import graphql_endpoint

from mtg.price_filter.funcs import *
from mtg.price_filter.config import *

transport = AIOHTTPTransport(url=graphql_endpoint)
client = Client(transport=transport, fetch_schema_from_transport=True)

basic_lands = {"Plains", "Island", "Swamp", "Mountain", "Forest"}

result = client.execute(query)["deck"]
result = list(filter(lambda card: card["name"] not in basic_lands, result["cards"]))

mapped_result = map(map_func, result)
filtered_result = list(filter(filter_func, mapped_result))

for card in filtered_result:
    print(f"1 {card[1]}")
