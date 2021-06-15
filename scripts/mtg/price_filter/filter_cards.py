import sys
import os

PACKAGE_PARENT = "../.."
SCRIPT_DIR = os.path.dirname(
    os.path.realpath(os.path.join(os.getcwd(), os.path.expanduser(__file__)))
)
sys.path.append(os.path.normpath(os.path.join(SCRIPT_DIR, PACKAGE_PARENT)))

from gql import Client
from gql.transport.aiohttp import AIOHTTPTransport
from functools import reduce
import json

from constants import graphql_endpoint

from mtg.price_filter.funcs import *
from mtg.price_filter.config import *

url = graphql_endpoint.prod if env.upper() == "PROD" else graphql_endpoint.dev

transport = AIOHTTPTransport(url=url)
client = Client(transport=transport, fetch_schema_from_transport=True)

basic_lands = {"Plains", "Island", "Swamp", "Mountain", "Forest"}

result = client.execute(query)["deck"]
result = list(filter(lambda card: card["name"] not in basic_lands, result["cards"]))

mapped_result = map(map_func, result)
filtered_result = list(filter(filter_func, mapped_result))

print(json.dumps(filtered_result, indent=4))
print(len(filtered_result))

reduced_result = reduce(reduce_func, filtered_result)

print(reduced_result)