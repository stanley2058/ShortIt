#!/usr/bin/env bash

docker exec -it deploy-shortit-1 npm run db:migrate
docker exec -it deploy-shortit-1 npm run db:push

