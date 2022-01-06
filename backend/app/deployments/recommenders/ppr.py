from typing import Optional, List

import logging
import ray
from ray import serve

from ...app import app
from .provider import Provider, ProviderQuery

class PPRQuery(ProviderQuery):
    maxIterations: int = 5
    dampingFactor: float = 0.85

def ppr(
    tx, 
    query: PPRQuery
):
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

@serve.deployment(name='provider.pagerank', route_prefix='/pagerank')
@serve.ingress(app)
class PageRankProvider(Provider):
    @app.post('/recommend')
    async def ppr_recommend(self, query: PPRQuery):
        logging.basicConfig(level=logging.INFO)
        ref = await self.graph.read.remote(ppr, query=query)
        result = ray.get(ref)
        logging.info(query)
        logging.info(result)
        print(result)
        return result