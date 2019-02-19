#!/usr/bin/env bash

if [[ "$NODE_ENV" = "production" ]]
then
    echo "Running build..."
    npm run tsc > /dev/null 2>&1
fi