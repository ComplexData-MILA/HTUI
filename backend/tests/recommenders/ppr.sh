#!/usr/bin/env bash


curl -X POST -H "Content-Type: application/json" -d '{"k": 10, "state": {"nodeIds": [611]}, "maxIterations": 20}' localhost:8000/provider/pagerank/; echo