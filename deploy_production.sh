 #!/bin/bash

echo CLEANING
gulp clean
echo BUILDING
gulp build
echo COPYING
scp -r build/ chris@45.55.23.74:codesnap
scp -r server/ chris@45.55.23.74:codesnap
echo TUNNELING
ssh chris@45.55.23.74 <<'ENDSSH'
export NODE_ENV=production
pm2 restart server
ENDSSH
echo COMPLETED
