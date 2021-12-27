import os
import ray
from ray import serve
import logging

class Provider:
    def __init__(self) -> None:
        self.graph = serve.get_deployment('graph').get_handle(sync=False)

    async def recommend(self, state: 'GraphState'):
        raise NotImplementedError()

    async def __call__(self, request):
        return await self.recommend(**request.query_params)


def random_nodes(tx, k):
    logging.basicConfig(level=logging.INFO)
    result = tx.run("""
        MATCH (n)
        WITH n, rand() AS r
        ORDER BY r
        RETURN n LIMIT $k""", k=int(k))
    logging.info(result)
    return [r['n'].id for r in result]

@serve.deployment
class RandomProvider(Provider):
    async def recommend(self, k: int):
        logging.basicConfig(level=logging.INFO)
        ref = await self.graph.read.remote(random_nodes, k=int(k))
        result = ray.get(ref)
        logging.info(result)
        return result