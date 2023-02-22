#!/usr/bin/env bash

pushd "base-image" || exit 1
./index.js
docker pull reg.stw.tw/short-it-base
if docker images | grep reg.stw.tw/short-it-base &> /dev/null; then
    docker build -f Dockerfile . -t reg.stw.tw/short-it-base || exit 1
else
    docker build -f Dockerfile.bootstrap . -t reg.stw.tw/short-it-base || exit 1
fi
popd || exit 1

pushd "web" || exit 1
docker build . -t reg.stw.tw/short-it-web || exit 1
popd || exit 1

pushd "server" || exit 1
docker build . -t reg.stw.tw/short-it || exit 1
popd || exit 1

docker push reg.stw.tw/short-it-base
docker push reg.stw.tw/short-it-web
docker push reg.stw.tw/short-it
