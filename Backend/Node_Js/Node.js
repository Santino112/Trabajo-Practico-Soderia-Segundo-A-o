const express = require("express");
const morgan = require("morgan");
const database = require("./database");
const cors = require("cors");

//Configuración inicial
const app = express();
app.use(express.json());
app.set("port", 4000);
app.listen(app.get("port"));
console.log(`Escuchando comunicacion con el puerto ${app.get("port")}`);

//Middlewares
app.use(cors({
    origin: ["http://127.0.0.1:5500"]
}));
app.use(morgan("dev"));

//Rutas
app.get('/Cliente', async (req, res) => {
    const connection = await database.getConnection();
    const resultado = await connection.query("SELECT * FROM tpsoderia.cliente;");
    res.json(resultado);
});

app.post('/Cliente', async (req, res) => {
    const { nombre, apellido, telefono, direccion, numeroDocumento, localidad, barrio } = req.body;

    try {
        const connection = await database.getConnection();
        const query = 'INSERT INTO tpsoderia.cliente (nombre, apellido, telefono, direccion, numeroDocumento, id_Localidad, id_Barrio) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const result = await connection.query(query, [nombre, apellido, telefono, direccion, numeroDocumento, localidad, barrio]);

        res.status(200).json({ message: 'Cliente agregado con éxito', result });
    } catch (error) {
        console.error('Error al insertar el cliente:', error);
        res.status(500).json({ error: 'Error al agregar el cliente' });
    }
});

app.delete('/Cliente/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await database.getConnection();
        const query = 'DELETE FROM Cliente WHERE id_Cliente = ?';
        
        const result = await connection.query(query, [id]);

        if (result.affectedRows > 0) {
            res.status(200).json({ success: true, message: 'Cliente eliminado con éxito' });
        } else {
            res.status(404).json({ success: false, message: 'Cliente no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el cliente:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar el cliente' });
    }
});

///////////////////////////////////

app.get('/Pedido', async (req, res) => {
    const connection = await database.getConnection();
    const resultado = await connection.query("SELECT * FROM tpsoderia.pedido;");
    res.json(resultado);
});

app.get('/Proveedor', async (req, res) => {
    const connection = await database.getConnection();
    const resultado = await connection.query("SELECT * FROM tpsoderia.proveedor;");
    res.json(resultado);
});

app.get('/Producto', async (req, res) => {
    const connection = await database.getConnection();
    const resultado = await connection.query("SELECT * FROM tpsoderia.producto;");
    res.json(resultado);
});

app.get('/Recorrido', async (req, res) => {
    const connection = await database.getConnection();
    const resultado = await connection.query("SELECT * FROM tpsoderia.recorrido;");
    res.json(resultado);
});

