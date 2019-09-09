#!/bin/bash
echo "Installing Visual Studio Code Support"
mkdir -v -p "../.vscode"
cp -v "build/vscode-settings.json" "../.vscode/launch.json"