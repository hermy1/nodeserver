//mongo init script
DB = db.getSiblingDB(process.env.MONGO_DATABASE);
DB.createUser({
    user: process.env.MONGO_USERNAME,
    pwd: process.env.MONGO_PASS,
    roles: [
        {
            role: "readWrite",
            db: process.env.MONGO_DATABASE
        }
    ]
});


DB.createCollection("users");
DB.users.insertOne({
    'username': 'john doe',
});

DB.createCollection("settings");


DB.createCollection("codes");