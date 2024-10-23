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

app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    methods: ['GET', 'POST', 'DELETE', 'PUT']
}));

app.use(morgan("dev"));

//Rutas
//Toma todos los registros de clientes de la tabla cliente
app.get('/Cliente', async (req, res) => {
    try {
        const connection = await database.getConnection();
        const [resultado] = await connection.query("SELECT * FROM tpsoderia.cliente;");
        res.json(resultado);
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({ error: 'Error al obtener los clientes' });
    }
});

//Toma todos los registros de clientes de la tabla cliente dependiendo de una ID especifica
app.get('/Cliente/:id_Cliente', async (req, res) => {
    const { id_Cliente } = req.params;

    try {
        const connection = await database.getConnection();
        const query = 'SELECT * FROM tpsoderia.cliente WHERE id_Cliente = ?';
        const [resultado] = await connection.query(query, [id_Cliente]);

        if (resultado.length > 0) {
            res.json(resultado[0]); 
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el cliente:', error);
        res.status(500).json({ error: 'Error al obtener el cliente' });
    }
});

//Inserta un nuevo registro de cliente en la tabla cliente
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

//Borra un registro de cliente en la tabla cliente
app.delete('/Cliente/:id_Cliente', async (req, res) => {
    const { id_Cliente } = req.params; 
    console.log(id_Cliente); 

    try {
        const connection = await database.getConnection();
        const query = 'DELETE FROM tpsoderia.cliente WHERE id_Cliente = ?';
        
        const [result] = await connection.query(query, [id_Cliente]);

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

//Actualiza el registro de un cliente dependiendo de su ID
app.put('/Cliente/:id', async (req, res) => {
    const clienteId = req.params.id;
    const { nombre, apellido, telefono, direccion, numeroDocumento, localidad, barrio } = req.body;

    const sqlQuery = `
        UPDATE tpsoderia.cliente
        SET nombre = ?, apellido = ?, telefono = ?, direccion = ?, numeroDocumento = ?, id_Localidad = ?, id_Barrio = ?
        WHERE id_Cliente = ?`;

    try {
        const connection = await database.getConnection();
        const result = await connection.query(sqlQuery, [nombre, apellido, telefono, direccion, numeroDocumento, localidad, barrio, clienteId]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Cliente actualizado con éxito' });
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

//////////////////////////////////////////////////////////////////////////////////

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

