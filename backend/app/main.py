import os
import logging

import ray
from ray import serve

from .deployments.graph import POLEGraph
from .deployments.recommenders import RandomProvider

from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware

from .app import app
# from fastapi import FastAPI
# app = FastAPI()

logging.basicConfig(level='INFO')
ray.init(address=os.getenv('RAY_ADDRESS', 'auto'), namespace='serve', ignore_reinit_error=True)# 'ray://ray-head:10001', )
serve.start(http_options={"middlewares": [
        Middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],)
    ]}
)

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
# PageRankProvider.deploy('graph.pole')