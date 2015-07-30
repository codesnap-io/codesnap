 #!/bin/bash

echo CLEANING!
gulp clean
echo BUILDING!
gulp build
echo COPYING
scp -r build/ chris@45.55.211.202:codesnap
scp -r server/ chris@45.55.211.202:codesnap
echo TUNNELING!
ssh chris@45.55.211.202 <<'ENDSSH'
export NODE_ENV=staging
pm2 restart server
ENDSSH
echo COMPLETED
