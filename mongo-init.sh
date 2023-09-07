#!/bin/bash
# get .env variables
# set -a
# # source .env
# set +a
set -o allexport; source .env; set +o allexport


mongo <<EOF
use $MONGO_DATABASE

db.createUser({
    user: '$MONGO_USERNAME',
    pwd: '$MONGO_PASS',
    roles: [
        {
            role: "readWrite",
            db: '$MONGO_DATABASE'
        }
    ]
});

db.createCollection("users");
db.users.insertOne({
    'username': 'john doe'
});

db.createCollection("settings");
db.createCollection("codes");
EOF


