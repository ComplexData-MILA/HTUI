#!/usr/bin/env bash


curl -X POST -H "Content-Type: application/json" -d '{"k": 10, "state": {"node_ids": [431, 1198, 828, 59, 1206]}, "maxIterations": 20}' localhost:8000/provider/pagerank/; echo