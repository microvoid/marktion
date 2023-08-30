#!/bin/bash
set -e

pnpm run build

cd examples/docs 

pnpm run build
pnpm exec gh-pages -d dist
