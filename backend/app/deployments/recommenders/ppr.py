from typing import Optional, List

import logging
import ray
from ray import serve

from ...app import app
from .provider import Provider, ProviderQuery

class PPRQuery(ProviderQuery):
    maxIterations: int = 5
    dampingFactor: float = 0.85


@serve.deployment(name='provider.pagerank', route_prefix='/provider/pagerank', ray_actor_options={"num_cpus": 0.1})
@serve.ingress(app)
class PageRankProvider(Provider):
    @app.post('/')
    async def endpoint(self, query: PPRQuery):
        return await self.recommend(query)
        # return dict(query)

    @staticmethod
    def call_db(tx, query: PPRQuery):
        logging.basicConfig(level=logging.INFO)
        logging.info('PPR')
        print(query.state.nodeIds)
        logging.info(query.state.nodeIds)
        
        result = tx.run("""
                MATCH (s)
                WHERE id(s) in $sourceNodes
                WITH collect(s) as seeds
                CALL gds.pageRank.stream({nodeProjection: '*', relationshipProjection: '*', maxIterations: $maxIterations, sourceNodes: seeds})
                YIELD nodeId, score
                MATCH (n) WHERE ID(n) = nodeId
                RETURN nodeId AS node, score
                ORDER BY score DESC
                LIMIT $k""", sourceNodes=query.state.nodeIds, k=query.k, maxIterations=query.maxIterations)
        logging.info(result)
        return [r['node'] for r in result]