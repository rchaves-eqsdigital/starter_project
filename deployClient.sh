#!/bin/bash
ng build --prod
scp -r -P 23 dist/ worker@ricardochaves.pt:/home/worker/starter_project/client/dist/
