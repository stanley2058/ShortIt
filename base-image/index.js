#!/usr/bin/env node
const fs = require("fs");

const serverPackage = "../server/package.json";
const webPackage = "../web/package.json";
const package = "package.json";

const serverJson = JSON.parse(fs.readFileSync(serverPackage).toString());
const webJson = JSON.parse(fs.readFileSync(webPackage).toString());
const json = JSON.parse(fs.readFileSync(package).toString());

json.dependencies = {
    ...serverJson.dependencies,
    ...webJson.dependencies,
};
json.devDependencies = {
    ...serverJson.devDependencies,
    ...webJson.devDependencies,
};

fs.writeFileSync(package, JSON.stringify(json, null, 2));
