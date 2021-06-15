from collections import namedtuple

Endpoint = namedtuple("Endpoint", "dev prod")

endpoint = Endpoint("http://localhost:3000", "https://bhagat-api.herokuapp.com")
graphql_endpoint = Endpoint(f"{endpoint.dev}/graphql", f"{endpoint.prod}/graphql")