import os

import ray
from ray import serve

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import queries as Q
from .models import Subgraph, GraphState
from .deployments.graph import POLEGraph
from .deployments.recommenders import RandomProvider


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

serve_handle = None

@app.on_event('startup')
async def startup():
    ray.init(address=os.getenv('RAY_ADDRESS', 'auto'), namespace='serve', ignore_reinit_error=True)# 'ray://ray-head:10001', )
# 'host': None
    serve.start()# http_options={'host': None, 'port': 8001}) # 'location': None
    POLEGraph.options(name='graph', route_prefix='/graph').deploy() # TODO: make this configurable 

    RandomProvider.options(name='provider.random', route_prefix='/providers/random').deploy()
    rp_handle = RandomProvider.get_handle(sync=False)
    # print(ray.get(await rp_handle.remote(state=GraphState(k=5))))

    global serve_handle
    serve_handle = POLEGraph.get_handle(sync=False)
    ray.get(await serve_handle.build_index.remote())


@app.get("/")
async def index():
    return 'Hello!'

@app.get('/search')
async def full_text_search(q: str = ''):
    if not q:
        print('Got empty query')
        return []
    ref = serve_handle.read.remote(Q.text_search, q)
    data = ray.get(await ref)
    print(data)
    return data

@app.post("/subgraph")
async def subgraph(seeds: Subgraph):
    ref = serve_handle.read.remote(Q.get_subgraph_json, seeds)
    data = ray.get(await ref)
    print(data)
    return data