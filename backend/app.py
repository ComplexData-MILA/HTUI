from neo4j import GraphDatabase
import json
import uvicorn
from fastapi import FastAPI

from typing import NewType, Optional, List
from uuid import UUID

import sqlalchemy as sa
from fastapi import Depends, Header, HTTPException
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
from starlette.status import HTTP_403_FORBIDDEN, HTTP_404_NOT_FOUND

from fastapi_utils.api_model import APIMessage, APIModel
from fastapi_utils.cbv import cbv
from fastapi_utils.guid_type import GUID
from fastapi_utils.inferring_router import InferringRouter

def get_friends_of(tx, name):
    friends = []
    result = tx.run("MATCH (a:Person)-[:KNOWS]->(f) "
                         "WHERE a.name = $name "
                         "RETURN f.name AS friend", name=name)
    for record in result:
        friends.append(record["friend"])
    return friends

def get_subgraph_json(tx, seeds):
    subgraphs = []
    result = tx.run("CALL apoc.path.subgraphAll($seeds, {maxLevel:1}) YIELD nodes, relationships "
        "WITH [node in nodes | node {.*, label:labels(node)[0], id: toString(id(node))}] as nodes, " 
            "[rel in relationships | rel {.*, source:toString(id(startNode(rel))), target:toString(id(endNode(rel))), label:type(rel)}] as edges "
        "WITH { nodes: nodes, edges: edges, numNodes: size(nodes), numEdges:size(edges) } as graph "
        "RETURN apoc.convert.toJson(graph) AS subgraph", seeds=seeds)
    for sg in result:
        subgraphs.append(json.loads(sg["subgraph"]))
    return subgraphs

app = FastAPI()
router = InferringRouter()
@cbv(router)
class App:
    def __init__(self, uri: str = "neo4j://localhost:7687"):
        self.driver = GraphDatabase.driver(uri, auth=("neo4j", "RedThread"))
        self.session = self.driver.session()

    @router.get('/friends/{person}')
    def get_friends(self, person: str):
        friends = self.session.read_transaction(get_friends_of, person)
        return friends
    
    # seeds should be of form string "431 1198 828 59 1206" for [431, 1198, 828, 59, 1206]
    @router.get('/subgraph/{seeds}')
    def subgraph(self, seeds: str): 
        intList = list(map(int, seeds.split(" ")))
        return self.session.read_transaction(get_subgraph_json, intList)

app.include_router(router)