import os
import logging

import ray
from ray import serve

from .deployments.graph import POLEGraph
from .deployments.recommenders import RandomProvider


from .app import app

logging.basicConfig(level='INFO')
ray.init(address=os.getenv('RAY_ADDRESS', 'auto'), namespace='serve', ignore_reinit_error=True)# 'ray://ray-head:10001', )
serve.start()

@app.get("/")
async def index():
    return 'Hello!'

@app.get("/graph")
async def graphs():
    return ['pole']

@app.get("/provider")
async def providers():
    return ['random']

    

POLEGraph.deploy()
RandomProvider.deploy('graph.pole')