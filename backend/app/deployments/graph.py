import os
import ray
from ray import serve

from neo4j import GraphDatabase
from neo4j.exceptions import ClientError

from ..app import app
from ..queries import text_search, get_subgraph_json
from ..models import Subgraph

class GraphDB:
    def __init__(self):
        uri = os.getenv('NEO4J_URI', "neo4j://localhost:7687")
        auth = tuple(os.getenv('NEO4J_AUTH', 'neo4j/neo4j').split('/'))

        self.driver = GraphDatabase.driver(uri, auth=auth)
        self.session = self.driver.session()

        self.build_index()

    def read(self, *args, **kwargs):
        print(args, kwargs)
        return self.session.read_transaction(*args, **kwargs)


    def build_index(self):
        pass

@serve.deployment(name="graph.pole", route_prefix="/graph/pole")
@serve.ingress(app)
class POLEGraph(GraphDB):
    def build_index(self):
        print('Building index.')
        from ..queries import runFullTextIdx

        try:
            self.session.write_transaction(runFullTextIdx)
        except ClientError as e:
            if (
                'Failed to invoke procedure `db.index.fulltext.createNodeIndex`'
                ': Caused by: org.neo4j.kernel.api.exceptions.schema.EquivalentSchemaRuleAlreadyExistsException: An equivalent index already exists'
            ) in e.message:
                print('Index already exists, skipping')
            else:
                raise e

    @app.post("/subgraph")
    async def subgraph(self, seeds: Subgraph):
        return self.read(get_subgraph_json, seeds)

    
    @app.get('/search')
    async def full_text_search(self, q: str = ''):
        if not q:
            print('Got empty query')
            return []
        return self.read(text_search, q)
