from typing import Optional, List, Dict, Any
from pydantic import BaseModel

import logging
import ray
from ray import serve

class GraphState(BaseModel):
    nodeIds: List[int] = []
    actions: Optional[List[Dict[str, Any]]] = None

class ProviderQuery(BaseModel):
    state: Optional[GraphState] = GraphState()
    k: int = 10

class Provider:
    def __init__(self, graph_handle: str = 'graph') -> None:
        self.graph = serve.get_deployment(graph_handle).get_handle(sync=False)

    async def recommend(self: 'Provider', query): # : ProviderQuery
        logging.basicConfig(level=logging.INFO)
        logging.info(f'Serving recommendation from {type(self)} for query {query}.')
        ref = await self.graph.read.remote(self.call_db, query=query)
        result = ray.get(ref)
        logging.info(result)
        print(result)
        return result

    @staticmethod
    def call_db(tx, query: ProviderQuery):
        raise NotImplementedError()