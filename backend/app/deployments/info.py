import ray
from ray import serve
import urllib.parse

from ray.worker import get

from ..app import app

def get_endpoint(deployment_name: str):
    return urllib.parse.urlparse(serve.get_deployment(deployment_name).url).path

@serve.deployment(name='info', route_prefix="/", ray_actor_options={"num_cpus": 0.1})
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
        return {
            'Random' : { 'name': 'Random', 'description': '', 'endpoint': get_endpoint('provider.random') },
            'PageRank' : { 'name': 'PageRank', 'description': '', 'endpoint': get_endpoint('provider.pagerank') }
        }