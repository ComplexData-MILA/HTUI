import os
import ray
from ray import serve

from neo4j import GraphDatabase
from neo4j.exceptions import ClientError

class GraphDB:
    def __init__(self):
        uri = os.getenv('NEO4J_URI', "neo4j://localhost:7687")
        auth = tuple(os.getenv('NEO4J_AUTH', 'neo4j/neo4j').split('/'))

        self.driver = GraphDatabase.driver(uri, auth=auth)
        self.session = self.driver.session()

    def read(self, *args, **kwargs):
        print(args, kwargs)
        return self.session.read_transaction(*args, **kwargs)

    def build_index(self):
        raise NotImplementedError()

@serve.deployment # (name="graph", route_prefix="/graph")
class POLEGraph(GraphDB):
    def build_index(self):
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


    # def write(self, *args):
    #     return self.session.write_transaction(*args)