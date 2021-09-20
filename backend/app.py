from neo4j import GraphDatabase
import json

uri = "neo4j://localhost:7687"
driver = GraphDatabase.driver(uri, auth=("neo4j", "RedThread"))

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

with driver.session() as session:
    friends = session.read_transaction(get_friends_of, "Alice")
    print("friends: ")
    for friend in friends:
        print(friend)
    
    print("subgraph json: ")
    subgraph = session.read_transaction(get_subgraph_json, [431, 1198, 828, 59, 1206])
    print(subgraph[0])

driver.close()