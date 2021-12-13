import os
from neo4j import GraphDatabase
import json
import uvicorn
from fastapi import FastAPI

from uuid import UUID

import sqlalchemy as sa
from fastapi import Depends, Header, HTTPException
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
from starlette.status import HTTP_403_FORBIDDEN, HTTP_404_NOT_FOUND

import ray
from ray import serve

from fastapi_utils.api_model import APIMessage, APIModel
from fastapi_utils.cbv import cbv
from fastapi_utils.guid_type import GUID
from fastapi_utils.inferring_router import InferringRouter

# CORS stuff
from fastapi.middleware.cors import CORSMiddleware

from .queries import *
from .models import Subgraph

ray.init(address='ray-head:6379')
serve.start()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = InferringRouter()

# @app.on_startup

@serve.deployment
@serve.ingress(app)
class Counter:
  def __init__(self):
      self.count = 0

  @app.get("/")
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

@cbv(router)
class App:
    def __init__(self, uri: str = None):
        uri = os.getenv('NEO4J_URI', "neo4j://localhost:7687")
        auth = tuple(os.getenv('NEO4J_AUTH', 'neo4j/ReadThread').split('/'))
        self.driver = GraphDatabase.driver(uri, auth=auth)
        self.session = self.driver.session()
        # self.session.write_transaction(runFullTextIdx)

    @router.get('/friends/{person}')
    def get_friends(self, person: str):
        friends = self.session.read_transaction(get_friends_of, person)
        return friends

    @router.get('/allpeople')
    def get_all_people(self):
        people = self.session.read_transaction(get_all)
        return people

    @router.get('/search')
    def full_text_search(self, q: str = ''):
        if not q:
            return []
        return self.session.read_transaction(text_search, q)

    @router.post("/subgraph")
    async def subgraph(self, seeds: Subgraph):
        # print(f'{k}-hop subgraph for {seeds}')
        print(f'Subgraph for {seeds}')
        graph = self.session.read_transaction(get_subgraph_json, seeds)
        print(graph)
        return graph

app.include_router(router)