#!/usr/bin/env bash

curl -X POST -H "Content-Type: application/json" -d '{"k": 5}' localhost:8000/provider/random/; echo