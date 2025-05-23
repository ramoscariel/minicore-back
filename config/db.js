const mysql = require('mysql2');
require('dotenv').config(); // load .env into process.env

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

module.exports = db.promise(); // make the object available to other modules with require