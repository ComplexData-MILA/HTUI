import ray
from ray import serve
import logging

from ...app import app, get_router
from .provider import Provider, ProviderQuery

@serve.deployment(name='provider.random', route_prefix='/provider/random', ray_actor_options={"num_cpus": 0.1})
@serve.ingress(app)
class RandomProvider(Provider):

    @app.post('/')
    async def endpoint(self, query: ProviderQuery):
        return await self.recommend(query)

    @staticmethod
    def call_db(tx, query: ProviderQuery):
        result = tx.run("""
        MATCH (n)
        WITH n, rand() AS r
        ORDER BY r
        RETURN n AS node
        LIMIT $k""", k=query.k)
        return [r['node'].id for r in result]