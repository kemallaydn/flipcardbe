#!/bin/sh
set -ex

MONGO_USER="root"
MONGO_PASS="supersecretpass1234!"

# create user
docker exec -it flip-card-mongo-master mongosh -u $MONGO_USER -p $MONGO_PASS --eval "db = db.getSiblingDB(\"flip-card\"); db.createUser({ user: \"${MONGO_USER}\", pwd: \"${MONGO_PASS}\", roles: [\"dbOwner\"] });"

# restore dumps
docker exec -it flip-card-mongo-master mongorestore --username=$MONGO_USER --password=$MONGO_PASS --dir=/dump