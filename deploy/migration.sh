#!/usr/bin/env bash

docker-compose exec shortit npm run db:migrate
docker-compose exec shortit npm run db:push
