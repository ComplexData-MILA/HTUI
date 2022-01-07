import os
import ray
from ray import serve

from neo4j import GraphDatabase
from neo4j.exceptions import ClientError

from ..app import app
from ..queries import text_search, get_subgraph_json
from ..models import Subgraph


def await_idx(tx, name: str):
    tx.run("CALL db.awaitIndex($name)", name=name)

class GraphDB:
    _index_name: str = None

    def __init__(self):
        uri = os.getenv('NEO4J_URI', "neo4j://localhost:7687")
        auth = tuple(os.getenv('NEO4J_AUTH', 'neo4j/neo4j').split('/'))

        self.driver = GraphDatabase.driver(uri, auth=auth)
        self.session = self.driver.session()

        self._build_index()

    def read(self, *args, **kwargs):
        print(args, kwargs)
        return self.session.read_transaction(*args, **kwargs)

    def _build_index(self):
        if not self._index_name:
            return

        try:
            self.read(await_idx, name=self._index_name)
        except ClientError as e:
            if e.code == 'Neo.ClientError.Schema.IndexNotFound':
                print('Building index.')
                return self.build_index()
            # if e.message == f"No such index '{self._index_name}'":
            #     pass
        
        print('Index ready.')


    def build_index(self):
        raise NotImplementedError()

def runFullTextIdx(tx):
    tx.run("""
    CALL db.labels() yield label with collect(label) as labels
    WHERE NOT apoc.schema.node.indexExists('full_name', ['name', 'surname'])
    CALL db.index.fulltext.createNodeIndex('full_name', labels, ['name', 'surname']) return labels
    """)

@serve.deployment(name="graph.pole", route_prefix="/graph/pole", ray_actor_options={"num_cpus": 0.1})
@serve.ingress(app)
class POLEGraph(GraphDB):
    _index_name = 'full_name'

    def build_index(self):
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
