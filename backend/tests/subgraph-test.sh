#!/usr/bin/env bash

curl -X POST -H "Content-Type: application/json" -d '{"node_ids": [431, 1198, 828, 59, 1206]}' localhost:8000/graph/pole/subgraph; echo