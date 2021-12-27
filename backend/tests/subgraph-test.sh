#!/usr/bin/env bash

curl -X POST -H "Content-Type: application/json" -d @SubgraphQuery.json localhost:8000/graph/pole/subgraph; echo