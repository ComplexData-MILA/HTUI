import json
from .models import Subgraph
from typing import List



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

def get_subgraph_json(tx, seeds: Subgraph):
    subgraphs = []
    result = tx.run("CALL apoc.path.subgraphAll($seeds, {maxLevel: $k}) YIELD nodes, relationships "
        "WITH [node in nodes | node {.*, label:labels(node)[0], id: toString(id(node))}] as nodes, " 
            "[rel in relationships | rel {.*, from:toString(id(startNode(rel))), to:toString(id(endNode(rel))), label:type(rel)}] as edges "
        "WITH { nodes: nodes, edges: edges, numNodes: size(nodes), numEdges:size(edges) } as graph "
        "RETURN apoc.convert.toJson(graph) AS subgraph", seeds=seeds.node_ids, k=seeds.k)
    
    sg, *rest = result
    assert len(rest) == 0, f'Expected 1 subgraph but got {len(rest)+1}.'
    return json.loads(sg['subgraph'])

def get_all(tx):
    population = []
    results = tx.run("MATCH (p:Person) RETURN {id: id(p), name: p.name, surname: p.surname, value: p.name + ' ' + p.surname} AS individual")
    for result in results:
        population.append(result["individual"])
    return population

# TODO: Set max_results as env var or similar
def text_search(tx, q: str, max_results: int = 25):
    population = []
    results = tx.run("""
    CALL db.index.fulltext.queryNodes("full_name", $q) 
    YIELD node 
    RETURN {id: id(node), name: node.name, surname: node.surname, value: node.name + ' ' + node.surname} AS individual
    LIMIT $n
    """, q=q, n=max_results)
    for result in results:
        population.append(result["individual"])
    return population

def get_info(tx, node_ids: List[int]):
    info = []
    results = tx.run("""UNWIND $node_ids as id
                        MATCH (n) WHERE ID(n) = id
                        RETURN apoc.convert.toJson(n) AS node""", node_ids=node_ids)
    for result in results:
        info.append(json.loads(result["node"]))

    return info