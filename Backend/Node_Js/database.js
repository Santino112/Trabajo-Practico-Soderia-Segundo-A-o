const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

const getConnection = async () => {
    const connection = await mysql.createConnection({
        host: process.env.HOST,
        database: process.env.DATABASE,
        user: process.env.USER,
        password: process.env.PASSWORD
    });
    return connection;
};

module.exports = {
    getConnection
};