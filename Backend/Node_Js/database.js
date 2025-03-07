// database.js
import mysql from "mysql2/promise"; // Usa 'import' en vez de 'require'
import dotenv from "dotenv"; // Usa 'import' en vez de 'require'

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD
});

connection.then((conn) => {
    console.log('Conectado a la base de datos!');
}).catch((error) => {
    console.log('El error de conexion es: ' + error);
});

const getConnection = async () => await connection;

// Exporta 'getConnection' usando 'export default'
export default {
    getConnection
};
