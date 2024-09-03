#!/usr/bin/env bash

docker-compose exec shortit pnpm run db:migrate
docker-compose exec shortit pnpm run db:push
