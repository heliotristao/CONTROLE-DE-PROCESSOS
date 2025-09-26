#!/usr/bin/env bash
set -euo pipefail

npm ci --include=dev
npm run build --workspace=@cphpm/backend
