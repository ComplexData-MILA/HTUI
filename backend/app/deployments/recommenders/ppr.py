from typing import Optional, List

import logging
import ray
from ray import serve

from ...app import app
from .provider import Provider, ProviderQuery

from fastapi import APIRouter
router = APIRouter()
app.include_router(router)

class PPRQuery(ProviderQuery):
    maxIterations: int = 5
    dampingFactor: float = 0.85

@serve.deployment(name='provider.pagerank', route_prefix='/provider/pagerank')
@serve.ingress(router)
class PageRankProvider(Provider):
    @router.post('/')
    async def endpoint(self, query: PPRQuery):
        return await self.recommend(query)

    @staticmethod
    def call_db(tx, query: PPRQuery):
        logging.basicConfig(level=logging.INFO)
        logging.info('PPR')
        
        result = tx.run("""
                MATCH (s)
                WHERE id(s) in $sourceNodes
                WITH collect(s) as seeds
                CALL gds.pageRank.stream({nodeProjection: '*', relationshipProjection: '*', maxIterations: $maxIterations, sourceNodes: seeds})
                YIELD nodeId, score
                RETURN nodeId AS node, score
                ORDER BY score DESC
                LIMIT $k""", sourceNodes=query.state.nodeIds, k=query.k, maxIterations=query.maxIterations)
        logging.info(result)
        return [r['node'] for r in result]