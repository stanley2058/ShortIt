#!/usr/bin/env bash

REGISTRY="${REGISTRY:=reg.stw.tw}"

docker pull node:lts-alpine

pushd "base-image" || exit 1
./index.js
docker pull "$REGISTRY/short-it-base"
if docker images | grep "$REGISTRY/short-it-base" &>/dev/null; then
    docker build -f Dockerfile . -t "$REGISTRY/short-it-base" --build-arg REPO="${REGISTRY}" || exit 1
else
    docker build -f Dockerfile.bootstrap . -t "$REGISTRY/short-it-base" --build-arg REPO="${REGISTRY}" || exit 1
fi
popd || exit 1
docker push "$REGISTRY/short-it-base"

pushd "web" || exit 1
docker build . -t "$REGISTRY/short-it-web" --build-arg REPO="${REGISTRY}" || exit 1
popd || exit 1
docker push "$REGISTRY/short-it-web"

pushd "server" || exit 1
docker build . -t "$REGISTRY/short-it" --build-arg REPO="${REGISTRY}" || exit 1
popd || exit 1
docker push "$REGISTRY/short-it"
