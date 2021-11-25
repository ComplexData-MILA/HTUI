import os
from neo4j import GraphDatabase
import json
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel

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

# CORS stuff
from fastapi.middleware.cors import CORSMiddleware

# TODO: Apparently not good to use neo4j IDs; need to generate our own
# https://stackoverflow.com/questions/31535036/neo4j-cypher-return-id-as-property

def get_friends_of(tx, name):
    friends = []
    result = tx.run("MATCH (a:Person)-[:KNOWS]->(f:Person) "
                         "WHERE a.name = $name "
                         "RETURN DISTINCT {id: id(f), name: f.name, surname: f.surname} AS friend ", name=name) # .name
    for record in result:
        friends.append(record["friend"])
    return friends

def get_subgraph_json(tx, seeds, max_level: int = 1):
    subgraphs = []
    result = tx.run("CALL apoc.path.subgraphAll($seeds, {maxLevel:$maxLevel}) YIELD nodes, relationships "
        "WITH [node in nodes | node {.*, label:labels(node)[0], id: toString(id(node))}] as nodes, " 
            "[rel in relationships | rel {.*, source:toString(id(startNode(rel))), target:toString(id(endNode(rel))), label:type(rel)}] as edges "
        "WITH { nodes: nodes, edges: edges, numNodes: size(nodes), numEdges:size(edges) } as graph "
        "RETURN apoc.convert.toJson(graph) AS subgraph", seeds=seeds, maxLevel=max_level)
    
    sg, *rest = result
    assert len(rest) == 0, f'Expected 1 subgraph but got {len(rest)+1}.'
    return json.loads(sg['subgraph'])

def get_all(tx):
    population = []
    results = tx.run("MATCH (p:Person) RETURN {id: id(p), name: p.name, surname: p.surname, value: p.name + ' ' + p.surname} AS individual")
    for result in results:
        population.append(result["individual"])
    return population

# def runFullTextIdx(tx):
#     tx.run("call db.labels() yield label with collect(label) as labels "
#             "CALL db.index.fulltext.createNodeIndex('full_name', labels,['name', 'surname']) return labels")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = InferringRouter()

class NodeList(BaseModel):
    node_ids: List[int] = []

@cbv(router)
class App:
    def __init__(self, uri: str = None):
        uri = os.getenv('NEO4J_URI', "neo4j://localhost:7687")
        auth = tuple(os.getenv('NEO4J_AUTH', 'neo4j/ReadThread').split('/'))
        self.driver = GraphDatabase.driver(uri, auth=auth)
        self.session = self.driver.session()
        # runFullTextIdx()

    @router.get('/friends/{person}')
    def get_friends(self, person: str):
        friends = self.session.read_transaction(get_friends_of, person)
        return friends

    @router.get('/allpeople')
    def get_all_people(self):
        people = self.session.read_transaction(get_all)
        return people
    
    # seeds should be of form string "431 1198 828 59 1206" for [431, 1198, 828, 59, 1206]
    # @router.get('/subgraph/{seeds}')
    # def subgraph(self, seeds: str): 
    #     intList = list(map(int, seeds.split(" ")))
    #     return self.session.read_transaction(get_subgraph_json, intList)

    # @router.post('/subgraph/{seeds}')
    # def subgraph(self, seeds: str): 
    #     intList = list(map(int, seeds.split(" ")))
    #     return self.session.read_transaction(get_subgraph_json, intList)

    @router.post("/subgraph")
    async def subgraph(self, seeds: NodeList):
        graph = self.session.read_transaction(get_subgraph_json, seeds.node_ids)
        print(graph)
        return graph

app.include_router(router)

# run with uvicorn app:app