import ray
from ray import serve
import urllib.parse

from ray.worker import get

from ..app import app

def get_endpoint(deployment_name: str):
    return urllib.parse.urlparse(serve.get_deployment(deployment_name).url).path

@serve.deployment(name='info', route_prefix="/")
@serve.ingress(app)
class APIInfoDeployment:
    @app.get("/")
    async def index(self):
        return 'Hello!'

    @app.get("/graph")
    async def graphs(self):
        return ['pole']

    @app.get("/provider")
    async def providers(self):
        return [
            { 'name': 'Random', 'description': '', 'endpoint': get_endpoint('provider.random') },
            { 'name': 'PageRank', 'description': '', 'endpoint': get_endpoint('provider.pagerank') }
        ]