#!/bin/bash

# Manager node (Traefik already constrained by node.role == manager, label optional)
# docker node update --label-add easycron.role=manager easycron-swarm-manager

docker node update --label-add easycron.role=redis easycron-swarm-redis
docker node update --label-add easycron.role=app easycron-swarm-worker-1
# docker node update --label-add easycron.role=app easycron-swarm-worker-2
# docker node update --label-add easycron.role=app easycron-swarm-worker-3
