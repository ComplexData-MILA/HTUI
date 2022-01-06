import os
import logging

import ray
from ray import serve

from ..app import app

@serve.deployment(name='info', route_prefix="/")
@serve.ingress(app)
class APIInfoDeployment:
    @app.get("/")
    async def index(self):
        return 'Hello!'

    @app.get("/graph")
    async def graphs(self):
        return ['pole']

    @app.get("/provider")
    async def providers(self):
        return [
            { 'name': 'Random', 'description': '', 'endpoint': serve.get_deployment('provider.random').url },
            { 'name': 'PageRank', 'description': '', 'endpoint': serve.get_deployment('provider.pagerank').url }
        ]