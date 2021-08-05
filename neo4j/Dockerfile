ARG NEO4J_VERSION=4.2.0
FROM neo4j:${NEO4J_VERSION}


ARG NEO4J_AUTH=neo4j/letmein \
    NEO4JLABS_PLUGINS='["apoc", "graph-data-science"]' \
    APOC_VERSION=4.2.0.2 \
    GRAPHQL_VERSION=3.5.21.5

ENV NEO4J_AUTH=${NEO4J_AUTH} \
    NEO4J_dbms_allow_upgrade=true \
    NEO4JLABS_PLUGINS=${NEO4JLABS_PLUGINS}

ADD --chown=neo4j:neo4j https://raw.githubusercontent.com/neo4j-graph-examples/pole/main/data/pole-40.dump .
COPY ./entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 7474 7473 7687


ENTRYPOINT ["./entrypoint.sh"]
CMD ["neo4j"]
