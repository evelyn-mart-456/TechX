require("dotenv").config();
const mysql = require("mysql2");

console.log("Loaded DB_USER =", process.env.DB_USER);

const db = mysql.createConnection({
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

module.exports = db;
};

module.exports = dbConfig;
