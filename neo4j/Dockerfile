ARG NEO4J_VERSION=4.2.0
FROM neo4j:${NEO4J_VERSION}

ARG NEO4J_AUTH=neo4j/letmein \
    APOC_VERSION=4.2.0.0

ADD --chown=neo4j:neo4j https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/${APOC_VERSION}/apoc-${APOC_VERSION}-all.jar ./plugins
ADD --chown=neo4j:neo4j https://raw.githubusercontent.com/neo4j-graph-examples/pole/main/data/pole-40.dump .

ENV NEO4J_AUTH=${NEO4J_AUTH} \
    NEO4J_dbms_allow_upgrade=true

COPY ./entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 7474 7473 7687


ENTRYPOINT ["./entrypoint.sh"]
CMD ["neo4j"]
