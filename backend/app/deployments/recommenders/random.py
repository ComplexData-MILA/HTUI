import ray
from ray import serve
import logging

from ...app import app
from .provider import Provider, ProviderQuery

def random_nodes(tx, k):
    result = tx.run("""
        MATCH (n)
        WITH n, rand() AS r
        ORDER BY r
        RETURN n LIMIT $k""", k=k)
    return [r['n'].id for r in result]

@serve.deployment(name='provider.random', route_prefix='/random')
@serve.ingress(app)
class RandomProvider(Provider):
    @app.post('/recommend')
    async def random_recommend(self, query: ProviderQuery):
        logging.basicConfig(level=logging.INFO)
        ref = await self.graph.read.remote(random_nodes, k=query.k)
        result = ray.get(ref)
        logging.info(result)
        print(result)
        return result