from pydantic import BaseModel
from typing import Optional, List


class Subgraph(BaseModel):
    node_ids: List[int] = []
    k: Optional[int] = 1

class GraphState(BaseModel):
    k: int