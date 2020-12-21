import sys
import os

PACKAGE_PARENT = "../.."
SCRIPT_DIR = os.path.dirname(
    os.path.realpath(os.path.join(os.getcwd(), os.path.expanduser(__file__)))
)
sys.path.append(os.path.normpath(os.path.join(SCRIPT_DIR, PACKAGE_PARENT)))

from gql import gql, Client
from gql.transport.aiohttp import AIOHTTPTransport
import json

from constants import graphql_endpoint

transport = AIOHTTPTransport(url=graphql_endpoint)
client = Client(transport=transport, fetch_schema_from_transport=True)

basic_lands = {"Plains", "Island", "Swamp", "Mountain", "Forest"}

query = gql(
    """

    query {
        mydecks {
            name,
            cards {
                name
            }
        }
    }

"""
)

result = client.execute(query)["mydecks"]
result = {obj["name"]: obj["cards"] for obj in result}
result = {key: set([card["name"] for card in val]) for key, val in result.items()}

proxies = {key: set() for key in result}
keys = list(result.keys())

for i in range(len(keys)):
    for j in range(len(keys)):
        if i != j:
            proxies[keys[i]] = proxies[keys[i]].union(
                result[keys[i]].intersection(result[keys[j]])
            )

total = set()

for key in proxies:
    total = total.union(proxies[key])
    proxies[key] = list(proxies[key])

proxies["binder"] = list(total)

with open("proxies.json", "w") as f:
    json.dump(proxies, f)