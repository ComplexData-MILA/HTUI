#!/bin/bash

# Imports pole example
# See:
# https://community.neo4j.com/t/copy-dump-file-to-docker-container-and-load-it-on-startup/36816
# https://github.com/model-graph-tools/analyzer/blob/main/src/main/docker/neo4j/mgt-entrypoint.sh

# Log the info with the same format as NEO4J outputs
log_info() {
  # https://www.howtogeek.com/410442/how-to-display-the-date-and-time-in-the-linux-terminal-and-use-it-in-bash-scripts/
  printf '%s %s\n' "$(date -u +"%Y-%m-%d %H:%M:%S:%3N%z") INFO  DATA-IMPORT: $1"
  return
}

# turn on bash's job control
# https://stackoverflow.com/questions/11821378/what-does-bashno-job-control-in-this-shell-mean/46829294#46829294
set -m

log_info "Import database dump"
neo4j-admin load --from=./pole-40.dump --database=neo4j --force
log_info "DONE"

/docker-entrypoint.sh neo4j