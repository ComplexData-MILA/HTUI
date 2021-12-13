import requests
import ray
from ray import serve
from fastapi import FastAPI

# ignore_reinit_error

app = FastAPI()

ray.init(ignore_reinit_error=True, include_dashboard=False)# 
# ray.init(address='ray://ray-head:10001', )#address="auto", namespace="summarizer")
# 'host': None
serve.start(http_options={'host': None, 'port': 8009})

serve_handle = None

# @app.on_event('startup')
# async def startup():
#     # ray.init(ignore_reinit_error=True)# 
#     # # ray.init(address='ray://ray-head:10001', )#address="auto", namespace="summarizer")
#     # serve.start(http_options={'host': None})# host=None, port=8001)#http_options={"http_host": None})# detached=True)
#     Counter.deploy()# _blocking=True)

#     # global serve_handle
#     # serve_handle = Counter.get_handle(sync=False)

@app.on_event("shutdown")  # Code to be run when the server shuts down.
async def shutdown_event():
    serve.shutdown()  # Shut down Ray Serve.


@serve.deployment(route_prefix="/hello")
# @serve.deployment
@serve.ingress(app)
class Counter:
    def __init__(self):
        self.count = 0

    def get(self):
        return {"count": self.count}

    @app.get("/incr")
    def incr(self):
        self.count += 1
        return {"count": self.count}

    @app.get("/decr")
    def decr(self):
        self.count -= 1
        return {"count": self.count}

@app.get("/")
async def get():
    # print(serve_handle)
    return await Counter.get_handle().get.remote()

# @app.get("/incr")
# def incr():
#     self.count += 1
#     return {"count": self.count}

# @app.get("/decr")
# def decr():
#     self.count -= 1
#     return {"count": self.count}

# print(requests.get('http://localhost:8000').text) # ray-head:6379

Counter.deploy()