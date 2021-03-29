#!/bin/bash
cd client
rm -rf dist/
ng build --prod
scp -r -P 23 dist/client/* worker@ricardochaves.pt:/var/www/starter_project/
cd -
