#!/bin/bash
cd /home/kavia/workspace/code-generation/quickcalc-107631-43fc5bad/quickcalc
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

