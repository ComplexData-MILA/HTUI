from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from ray import serve

class GraphState(BaseModel):
    nodeIds: List[str] = []
    actions: Optional[List[Dict[str, Any]]] = None

class ProviderQuery(BaseModel):
    state: Optional[GraphState] = GraphState()
    k: int = 10

class Provider:
    def __init__(self, graph_handle: str = 'graph') -> None:
        self.graph = serve.get_deployment(graph_handle).get_handle(sync=False)

    # async def recommend(self, query: ProviderQuery):
    #     raise NotImplementedError()