from neo4j import GraphDatabase
import json
import uvicorn
from fastapi import FastAPI

# CORS stuff
from fastapi.middleware.cors import CORSMiddleware

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

# origins = [
#     "http://localhost",
#     "http://localhost:8080",
#     "http://127.0.0.1:8000",
#     "http://127.0.0.1",
# ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], #origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/friends/{person}')
def get_friends(person: str):
    output = {
        "person": person,
    }
    return json.dumps(output)

# run with uvicorn app:app