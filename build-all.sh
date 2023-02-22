#!/usr/bin/env bash

REGISTRY="${REGISTRY:=reg.stw.tw}"

pushd "base-image" || exit 1
./index.js
docker pull "$REGISTRY/short-it-base"
if docker images | grep "$REGISTRY/short-it-base" &> /dev/null; then
    docker build -f Dockerfile . -t "$REGISTRY/short-it-base" || exit 1
else
    docker build -f Dockerfile.bootstrap . -t "$REGISTRY/short-it-base" || exit 1
fi
popd || exit 1
docker push "$REGISTRY/short-it-base"

pushd "web" || exit 1
docker build . -t "$REGISTRY/short-it-web" || exit 1
popd || exit 1
docker push "$REGISTRY/short-it-web"

pushd "server" || exit 1
docker build . -t "$REGISTRY/short-it" || exit 1
popd || exit 1
docker push "$REGISTRY/short-it"
