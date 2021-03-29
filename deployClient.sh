#!/bin/bash
cd client && ng build --prod && cd ..
scp -r -P 23 dist/ worker@ricardochaves.pt:/home/worker/starter_project/client/dist/
