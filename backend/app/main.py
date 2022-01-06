import os
import logging

import ray
from ray import serve

from .deployments.info import APIInfoDeployment
from .deployments.graph import POLEGraph
from .deployments.recommenders import RandomProvider, PageRankProvider

from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware

from .app import app



logging.basicConfig(level='INFO')
ray.init(address=os.getenv('RAY_ADDRESS', 'auto'), namespace='serve', ignore_reinit_error=True)# 'ray://ray-head:10001', )
serve.start(detached=True, http_options={"middlewares": [
        Middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],)
    ]}
)

# APIInfoDeployment.deploy()
POLEGraph.options(name='graph').deploy()
PageRankProvider.deploy()
# RandomProvider.deploy()

# PageRankProvider.deploy('graph.pole')