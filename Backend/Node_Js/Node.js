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

app.post("/login", async (req, res) => {
    try {
        const { usuario, contraseña } = req.body;
        const connection = await database.getConnection();
        console.log("Datos recibidos:", { usuario, contraseña });

        // Buscar el usuario en la base de datos
        const [results] = await connection.query("SELECT * FROM tpsoderia.usuario WHERE usuario = ?", [usuario]);
        const user = results[0]; // Extraer el primer usuario encontrado

        if (user) {
            // Comparar directamente las contraseñas
            if (contraseña === user.contraseña) {
                res.status(200).send("Inicio de sesión exitoso.");
            } else {
                res.status(401).send("Usuario o contraseña incorrectos.");
            }
        } else {
            res.status(401).send("Usuario o contraseña incorrectos.");
        }
    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        res.status(500).send("Error en el inicio de sesión.");
    }
});

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
    const { nombre, apellido, telefono, direccion, numeroDocumento, localidad, barrio, estado } = req.body;

    try {
        const connection = await database.getConnection();
        const query = 'INSERT INTO tpsoderia.cliente (nombre, apellido, telefono, direccion, numeroDocumento, id_Localidad, id_Barrio, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const result = await connection.query(query, [nombre, apellido, telefono, direccion, numeroDocumento, localidad, barrio, estado]);

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
app.put('/Cliente/:id_Cliente', async (req, res) => {
    const clienteId = req.params.id_Cliente;
    const { nombre, apellido, telefono, direccion, numeroDocumento, localidad, barrio, estado } = req.body;

    const sqlQuery = `
        UPDATE tpsoderia.cliente
        SET nombre = ?, apellido = ?, telefono = ?, direccion = ?,
        numeroDocumento = ?, id_Localidad = ?, id_Barrio = ?, estado = ?
        WHERE id_Cliente = ?`;

    try {
        const connection = await database.getConnection();
        const result = await connection.query(sqlQuery, [nombre, apellido, telefono, direccion, numeroDocumento, localidad, barrio, estado, clienteId]);

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

app.get("/cliente/contador", async (req, res) => {
    try {
        const connection = await database.getConnection();
        const result = await connection.query(`
            SELECT COUNT(*) AS total_clientes FROM tpsoderia.cliente;
        `);
        res.json(result);
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).send('Error en la consulta');
    }
});

//////////////////////////////////////////////////////////////////////////////////

app.get('/Pedido', async (req, res) => {
    const connection = await database.getConnection();
    const resultado = await connection.query("SELECT * FROM tpsoderia.pedido;");
    res.json(resultado);
});

app.get('/Pedido/:id_Pedido', async (req, res) => {
    const { id_Pedido } = req.params;

    try {
        const connection = await database.getConnection();
        const query = 'SELECT * FROM tpsoderia.pedido WHERE id_Pedido = ?';
        const [resultado] = await connection.query(query, [id_Pedido]);

        if (resultado.length > 0) {
            res.json(resultado[0]); 
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el pedido:', error);
        res.status(500).json({ error: 'Error al obtener el pedido' });
    }
});

//Inserta un nuevo registro de cliente en la tabla cliente
app.post('/Pedido', async (req, res) => {
    console.log('Datos recibidos:', req.body);
    const { cliente, detallePedido, fechaCreacion, fechaEntrega, direccion, recorrido, transporte, estado } = req.body;

    try {
        const connection = await database.getConnection();
        const query = 'INSERT INTO tpsoderia.pedido (cliente, detallePedido, fechaCreacion, fechaEntrega, direccion, id_Recorrido, id_Transporte, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const result = await connection.query(query, [ cliente, detallePedido, fechaCreacion, fechaEntrega, direccion, recorrido, transporte, estado]);

        res.status(200).json({ message: 'Pedido agregado con éxito', result });
    } catch (error) {
        console.error('Error al insertar el pedido:', error);
        res.status(500).json({ error: 'Error al agregar el pedido' });
    }
});

//Borra un registro de cliente en la tabla cliente
app.delete('/Pedido/:id_Pedido', async (req, res) => {
    const { id_Pedido } = req.params; 

    try {
        const connection = await database.getConnection();
        const query = 'DELETE FROM tpsoderia.pedido WHERE id_Pedido = ?';
        
        const [result] = await connection.query(query, [id_Pedido]);

        if (result.affectedRows > 0) {
            res.status(200).json({ success: true, message: 'Pedido eliminado con éxito' });
        } else {
            res.status(404).json({ success: false, message: 'Pedido no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el pedido:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar el pedido' });
    }
});

//Actualiza el registro de un cliente dependiendo de su ID
app.put('/Pedido/:id', async (req, res) => {
    const pedidoId = req.params.id;
    const { cliente, detallePedido, fechaCreacion, fechaEntrega, direccion, recorrido, transporte } = req.body;

    const sqlQuery = `
        UPDATE tpsoderia.pedido
        SET cliente = ?, detallePedido = ?, fechaCreacion = ?, fechaEntrega = ?, direccion = ?, id_Recorrido = ?, id_Transporte = ?
        WHERE id_Pedido = ?`;
    try {
        const connection = await database.getConnection();
        const [result] = await connection.query(sqlQuery, [cliente, detallePedido, formattedFechaCreacion, formattedFechaEntrega, direccion, recorrido, transporte, pedidoId]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'Pedido actualizado con éxito' });
        } else {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        console.error('Pedido actualizado con exito:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

//////////////////////////////////////////////////////////////////////////////////

//Tomamos los datos de la tabla BARRIO a partir de una relacion con la tabla CLIENTE

app.get('/Barrio', async (req, res) => {
    const connection = await database.getConnection();
    const resultado = await connection.query('SELECT * FROM tpsoderia.barrio;')
    res.json(resultado);
});

app.get('/Barrio/Cliente', async (req, res) => {
    const connection = await database.getConnection();
    const resultado = await connection.query(`
        SELECT b.id_Barrio, b.nombreBarrio, COUNT(c.id_Cliente) AS cantidadDeClientes
        FROM Barrio b
        INNER JOIN Cliente c ON b.id_Barrio = c.id_Barrio
        GROUP BY b.id_Barrio, b.nombreBarrio`);
    res.json(resultado);
});



