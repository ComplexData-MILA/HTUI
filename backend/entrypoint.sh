#!/bin/bash

set -e

ray start --head --dashboard-host 0.0.0.0
serve start --http-host 0.0.0.0 --http-port 8000

# uvicorn app.main:app --host 0.0.0.0 --reload

python -m app.main
sleep infinity
