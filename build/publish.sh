#!/bin/bash

read -p "Version: "  version

node ./build/updatePackageVersions.js "$version"

npm update

git add package.json -v
git add package-lock.json -v

git commit -n -v -m "Published code for version $version"
git tag -a $version -m "Source for published version: $version"
git push --follow-tags

npm publish