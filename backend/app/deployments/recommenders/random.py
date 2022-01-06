import ray
from ray import serve
import logging

from ...app import app
from .provider import Provider, ProviderQuery

from fastapi import APIRouter
router = APIRouter()
app.include_router(router)

@serve.deployment(name='provider.random', route_prefix='/provider/random')
@serve.ingress(router)
class RandomProvider(Provider):

    @router.post('/')
    async def endpoint(self, query: ProviderQuery):
        return await self.recommend(query)

    @staticmethod
    def call_db(tx, query: ProviderQuery):
        result = tx.run("""
        MATCH (n)
        WITH n, rand() AS r
        ORDER BY r
        RETURN n LIMIT $k""", k=query.k)
        return [r['n'].id for r in result]