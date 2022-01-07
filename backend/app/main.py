import os
import logging

import ray
from ray import serve

from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware

logging.basicConfig(level='INFO')
ray.init(address=os.getenv('RAY_ADDRESS', 'auto'), namespace='serve', ignore_reinit_error=True)# 'ray://ray-head:10001', )
serve.start(detached=True, http_options={"middlewares": [
        Middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"])
    ]}
)


from .app import app

from .deployments.info import APIInfoDeployment
from .deployments.graph import POLEGraph
from .deployments.recommenders import PageRankProvider, RandomProvider
# from .deployments.recommenders.ppr import PageRankProvider
# from .deployments.recommenders.random import RandomProvider


APIInfoDeployment.deploy()
POLEGraph.options(name='graph').deploy()
RandomProvider.deploy()
PageRankProvider.deploy()

logging.info([(r.path, r.endpoint, r.name, r.methods) for r in app.routes])