import express from 'express';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import database from './database.js'; // Asegúrate de que la extensión .js esté present
import cors from 'cors';

// Configuración inicial
const app = express();
app.use(express.json());
app.set("port", 4000);
app.listen(app.get("port"));
console.log(`Escuchando comunicacion con el puerto ${app.get("port")}`);

app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:4000"],
    methods: ['GET', 'POST', 'DELETE', 'PUT']
}));

app.use(morgan("dev"));

// Función para cifrar la contraseña solo una vez
async function createHashedPassword() {
    const password = 'Echeverria451';  // La contraseña original
    const hashedPassword = await bcrypt.hash(password, 10);  // Cifra la contraseña
    console.log("Contraseña cifrada:", hashedPassword);
    // Ahora puedes insertar este `hashedPassword` en tu base de datos
}

// Ejecutar la función para cifrar la contraseña (solo una vez)
createHashedPassword();

// Endpoint de login
app.post("/login", async (req, res) => {
    console.log("Solicitud POST recibida en /login");
    try {
        const { usuario, contraseña } = req.body;
        const connection = await database.getConnection();
        console.log("Datos recibidos:", { usuario, contraseña });

        // Buscar el usuario en la base de datos
        const [results] = await connection.query("SELECT * FROM tpsoderia.Usuario WHERE usuario = ?", [usuario]);
        const user = results[0]; // Extraer el primer usuario encontrado

        if (user) {
            // Comparar las contraseñas usando bcrypt
            const passwordMatch = await bcrypt.compare(contraseña, user.contraseña);

            if (passwordMatch) {
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
        const { nombre, estado } = req.query;  // Obtener los parámetros de consulta


        // Comenzamos la consulta base con los JOIN para obtener el nombre del barrio y transporte
        let sqlQuery = `
            SELECT 
                cliente.id_Cliente,
                cliente.nombre,
                cliente.apellido,
                cliente.telefono,
                cliente.direccion,
                cliente.numeroDocumento,
                cliente.estado,
                barrio.nombreBarrio,
                localidad.nombreLocalidad
            FROM 
                tpsoderia.cliente
            LEFT JOIN 
                tpsoderia.barrio ON cliente.id_Barrio = barrio.id_Barrio
            LEFT JOIN 
                tpsoderia.localidad ON cliente.id_Localidad = localidad.id_Localidad
            WHERE 1=1
        `;

        // Si se proporciona un nombre, agregamos un filtro por nombre
        if (nombre) {
            sqlQuery += ` AND cliente.nombre LIKE ?`;
        }

        // Si se proporciona un estado, agregamos un filtro por estado
        if (estado) {
            sqlQuery += ` AND cliente.estado = ?`;
        }

        const connection = await database.getConnection();

        // Ejecutar la consulta filtrada con los parámetros correspondientes
        const [resultado] = await connection.query(sqlQuery, [
            ...(nombre ? [`%${nombre}%`] : []),
            ...(estado ? [estado] : [])
        ]);

        res.json(resultado);  // Devolver los resultados de los clientes con los datos relacionados

    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({ error: 'Error al obtener los clientes' });
    }
});


//Toma todos los registros de clientes de la tabla cliente dependiendo de una ID especifica
app.get('/Cliente/:id_Cliente', async (req, res) => {
    const clienteId = req.params.id_Cliente;

    const sqlQuery = `
        SELECT 
            cliente.id_Cliente,
            cliente.nombre,
            cliente.apellido,
            cliente.telefono,
            cliente.direccion,
            cliente.numeroDocumento,
            cliente.estado,
            barrio.nombreBarrio,
            localidad.nombreLocalidad
        FROM 
            tpsoderia.cliente
        LEFT JOIN 
            tpsoderia.barrio ON cliente.id_Barrio = barrio.id_Barrio
        LEFT JOIN 
            tpsoderia.localidad ON cliente.id_Localidad = localidad.id_Localidad
        WHERE 
            cliente.id_Cliente = ?;
    `;

    try {
        const connection = await database.getConnection();
        const [rows] = await connection.query(sqlQuery, [clienteId]);

        if (rows.length > 0) {
            res.status(200).json(rows[0]); // Devuelve solo el primer cliente encontrado
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el cliente:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// Endpoint para restaurar un cliente
app.post('/restaurarCliente', async (req, res) => {
    const { idCliente } = req.body;

    if (!idCliente) {
        return res.status(400).json({ message: 'Falta el ID del cliente' });
    }

    const sqlQuery = `UPDATE tpsoderia.cliente SET estado = 'Activo' WHERE id_Cliente = ?`;

    try {
        const connection = await database.getConnection();
        const [result] = await connection.query(sqlQuery, [idCliente]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Cliente restaurado exitosamente', id_Cliente: idCliente });
        } else {
            res.status(404).json({ message: 'Cliente no encontrado o ya está activo' });
        }
    } catch (error) {
        console.error('Error al restaurar cliente:', error);
        res.status(500).json({ message: 'Error al restaurar el cliente' });
    }
});



app.post('/darDeBaja', async (req, res) => {
    const { idCliente } = req.body;

    if (!idCliente) {
        return res.status(400).json({ message: 'Falta el ID del cliente' });
    }

    const sqlQuery = `UPDATE tpsoderia.cliente SET estado = 'Inactivo' WHERE id_Cliente = ?`;

    try {
        const connection = await database.getConnection();
        const [result] = await connection.query(sqlQuery, [idCliente]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Cliente dado de baja exitosamente', id_Cliente: idCliente });
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        console.error('Error al dar de baja al cliente:', error);
        res.status(500).json({ message: 'Error al dar de baja al cliente' });
    }
});


app.get('/clientesBaja', async (req, res) => {
    const sqlQuery = `
        SELECT 
            cliente.id_Cliente,
            cliente.nombre,
            cliente.apellido,
            cliente.telefono,
            cliente.direccion,
            cliente.numeroDocumento,
            cliente.estado,
            barrio.nombreBarrio,
            localidad.nombreLocalidad
        FROM 
            tpsoderia.cliente
        LEFT JOIN 
            tpsoderia.barrio ON cliente.id_Barrio = barrio.id_Barrio
        LEFT JOIN 
            tpsoderia.localidad ON cliente.id_Localidad = localidad.id_Localidad
        WHERE 
            cliente.estado = 'inactivo';
    `;
    try {
        const connection = await database.getConnection();
        const [resultado] = await connection.query(sqlQuery);
        res.json(resultado);  // Devuelve los clientes dados de baja
    } catch (error) {
        console.error('Error al obtener clientes dados de baja:', error);
        res.status(500).json({ error: 'Error al obtener los clientes dados de baja' });
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
    try {
        const { fechaDesde, fechaHasta, estado } = req.query;  // Obtener los parámetros de consulta

        let sqlQuery = `
            SELECT 
                p.id_Pedido, 
                c.nombre AS cliente_nombre, 
                c.apellido AS cliente_apellido, 
                p.detallePedido, 
                p.fechaCreacion, 
                p.fechaEntrega, 
                p.direccion, 
                p.estado, 
                b.nombreBarrio AS barrio_nombre, 
                t.marca AS transporte_marca
            FROM 
                tpsoderia.pedido p
            JOIN 
                tpsoderia.cliente c ON p.id_Cliente = c.id_Cliente
            JOIN 
                tpsoderia.barrio b ON p.id_Barrio = b.id_Barrio
            JOIN 
                tpsoderia.transporte t ON p.id_Transporte = t.id_Transporte
            WHERE 1=1
        `;

        // Aplicar filtros
        if (fechaDesde) {
            sqlQuery += ` AND p.fechaCreacion >= ?`;
        }
        if (fechaHasta) {
            sqlQuery += ` AND p.fechaCreacion <= ?`;
        }
        if (estado) {
            sqlQuery += ` AND p.estado = ?`;
        }

        const connection = await database.getConnection();
        const params = [];

        // Agregar los valores a los parámetros para prevenir inyecciones SQL
        if (fechaDesde) params.push(fechaDesde);
        if (fechaHasta) params.push(fechaHasta);
        if (estado) params.push(estado);

        const result = await connection.query(sqlQuery, params);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        res.status(500).json({ error: 'Error al obtener los pedidos' });
    }
});

// Función para obtener un pedido por su ID con los datos del cliente, barrio y transporte
app.get('/pedido/:id', async (req, res) => {
    const { id } = req.params;

    const sqlQuery = `
        SELECT 
                p.id_Pedido, 
                c.nombre AS cliente_nombre, 
                c.apellido AS cliente_apellido, 
                p.detallePedido, 
                p.fechaCreacion, 
                p.fechaEntrega, 
                p.direccion, 
                p.estado, 
                b.nombreBarrio AS barrio_nombre, 
                t.marca AS transporte_marca
            FROM 
                tpsoderia.pedido p
            JOIN 
                tpsoderia.cliente c ON p.id_Cliente = c.id_Cliente
            JOIN 
                tpsoderia.barrio b ON p.id_Barrio = b.id_Barrio
            JOIN 
                tpsoderia.transporte t ON p.id_Transporte = t.id_Transporte
            WHERE p.id_Pedido = ?`;

    try {
        const connection = await database.getConnection();
        const [pedido] = await connection.query(sqlQuery, [id]);

        if (pedido.length > 0) {
            console.log(pedido[0]); // Verifica los datos antes de enviarlos al frontend
            res.status(200).json(pedido[0]);
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el pedido:', error);
        res.status(500).json({ message: 'Error al obtener el pedido' });
    }
});

// Endpoint para dar de baja un pedido
app.post('/darDeBajaPedido', async (req, res) => {
    const { idPedido } = req.body;

    if (!idPedido) {
        return res.status(400).json({ message: 'Falta el ID del pedido' });
    }

    const sqlQuery = `UPDATE tpsoderia.Pedido SET estado = 'Inactivo' WHERE id_Pedido = ?`;

    try {
        const connection = await database.getConnection();
        const [result] = await connection.query(sqlQuery, [idPedido]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Pedido dado de baja exitosamente', id_Pedido: idPedido });
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        console.error('Error al dar de baja el pedido:', error);
        res.status(500).json({ message: 'Error al dar de baja el pedido' });
    }
});

// Ruta para restaurar un pedido
app.post('/restaurarPedido', async (req, res) => {
    const { idPedido } = req.body;

    const sqlQuery = `UPDATE tpsoderia.pedido SET estado = 'Incompleto' WHERE id_Pedido = ?`;

    try {
        const connection = await database.getConnection();
        const [result] = await connection.query(sqlQuery, [idPedido]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Pedido restaurado exitosamente' });
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        console.error('Error al restaurar el pedido:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});


app.get('/pedidosBaja', async (req, res) => {
    const sqlQuery = `SELECT 
                p.id_Pedido, 
                c.nombre AS cliente_nombre, 
                c.apellido AS cliente_apellido, 
                p.detallePedido, 
                p.fechaCreacion, 
                p.fechaEntrega, 
                p.direccion, 
                p.estado, 
                b.nombreBarrio AS barrio_nombre, 
                t.marca AS transporte_marca
            FROM 
                tpsoderia.pedido p
            JOIN 
                tpsoderia.cliente c ON p.id_Cliente = c.id_Cliente
            JOIN 
                tpsoderia.barrio b ON p.id_Barrio = b.id_Barrio
            JOIN 
                tpsoderia.transporte t ON p.id_Transporte = t.id_Transporte
            WHERE p.estado = 'Inactivo'`;

    try {
        const connection = await database.getConnection();
        const [pedidosInactivos] = await connection.query(sqlQuery);

        res.status(200).json(pedidosInactivos);
    } catch (error) {
        console.error('Error al obtener los pedidos inactivos:', error);
        res.status(500).json({ message: 'Error al obtener los pedidos inactivos' });
    }
});



//Inserta un nuevo registro de cliente en la tabla cliente
app.post('/Pedido', async (req, res) => {
    console.log('Datos recibidos:', req.body);
    const { cliente, detallePedido, fechaCreacion, fechaEntrega, direccion, barrio, transporte, estado } = req.body;

    try {
        const connection = await database.getConnection();
        const query = 'INSERT INTO tpsoderia.pedido (id_Cliente, detallePedido, fechaCreacion, fechaEntrega, direccion, id_Barrio, id_Transporte, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const result = await connection.query(query, [cliente, detallePedido, fechaCreacion, fechaEntrega, direccion, barrio, transporte, estado]);

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
    try {
        const connection = await database.getConnection();
        const resultado = await connection.query(`
            SELECT Barrio.id_Barrio, Barrio.nombreBarrio, COUNT(Cliente.id_Cliente) AS cantidadClientes
            FROM Barrio
            LEFT JOIN Cliente ON Cliente.id_Barrio = Barrio.id_Barrio
            GROUP BY Barrio.id_Barrio;
        `);
        res.json(resultado); // Devuelve los barrios con el conteo de clientes
    } catch (error) {
        console.error("Error al obtener barrios:", error);
        res.status(500).json({ error: "Hubo un error al obtener los barrios" });
    }
});

app.get('/TotalClientes', async (req, res) => {
    const connection = await database.getConnection();
    const resultado = await connection.query('SELECT COUNT(*) AS totalClientes FROM Cliente');
    res.json(resultado[0]);
});



