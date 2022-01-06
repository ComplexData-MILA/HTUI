import os
import logging

import ray
from ray import serve

from fastapi import FastAPI
app = FastAPI()

logging.basicConfig(level='INFO')
ray.init(address=os.getenv('RAY_ADDRESS', 'auto'), namespace='serve', ignore_reinit_error=True)
serve.start(detached=True)

class APIDeployment:
    message = "Hello from #{}!"

@serve.deployment(name='api.one', route_prefix="/api/1")
@serve.ingress(app)
class FirstAPIDeployment(APIDeployment):
    @app.post("/test")
    async def index(self):
        return self.message.format(1)

@serve.deployment(name='api.two', route_prefix="/api/2")
@serve.ingress(app)
class SecondAPIDeployment(APIDeployment):
    @app.post("/test")
    async def index(self):
        return self.message.format(2)


FirstAPIDeployment.deploy()
SecondAPIDeployment.deploy()