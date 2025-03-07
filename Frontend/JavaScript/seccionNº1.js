import { getClientes } from "./Services/clientesServices.js";

document.querySelectorAll('.btnBorrar').forEach(boton => {
    boton.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm(`¿Estás seguro de que deseas eliminar el cliente con ID: ${id}?`)) {
            try {
                const response = await fetch(`http://127.0.0.1:4000/Cliente/${id}`, {
                    method: 'DELETE',
                });
                const result = await response.json();

                if (result.success) {
                    alert('Cliente eliminado con éxito');
                    await cargarClientes();
                } else {
                    alert('Error al eliminar el cliente');
                }
            } catch (error) {
                console.error('Error al eliminar el cliente:', error);
            }
        }
    });
});

// Función que se ejecuta al cargar la página para obtener todos los clientes


// Llamada a la función getClientes e inserción de datos en la tabla
document.addEventListener("DOMContentLoaded", function () {
    // Obtener los elementos de filtro
    const filtroNombre = document.getElementById("filtroNombre");
    const filtroEstado = document.getElementById("filtroEstado");

    // Función para obtener clientes filtrados
    async function obtenerClientesFiltrados() {
        const nombre = filtroNombre.value.trim();  // Obtener el valor del filtro de nombre
        const estado = filtroEstado.value;         // Obtener el valor del filtro de estado

        // Solo agregar el parámetro de estado si el select tiene un valor diferente a "Estado"
        const url = new URL("/Cliente", "http://localhost:4000");

        const params = new URLSearchParams();

        // Si el nombre no está vacío, agregarlo como filtro
        if (nombre) {
            params.append("nombre", nombre);
        }

        // Si el estado es "Activo" o "Inactivo", agregarlo como filtro
        if (estado && estado !== "Estado") {
            params.append("estado", estado);
        }

        // Asignar los parámetros a la URL
        url.search = params.toString();

        console.log("URL solicitada: ", url.toString()); // Verifica la URL completa

        try {
            // Obtener los datos filtrados desde el servidor
            const response = await fetch(url);
            if (!response.ok) {
                console.error("Error al obtener datos:", response.statusText);
                return;
            }

            const clientes = await response.json();  // Convertir la respuesta en JSON
            console.log("Clientes obtenidos:", clientes);

            // Mostrar los clientes en la tabla
            mostrarClientes(clientes);
        } catch (error) {
            console.error("Error al obtener los clientes:", error);
        }
    }

    // Función para mostrar los clientes en la tabla
    async function mostrarClientes(clientes) {
        const tablaClientesBody = document.querySelector('#tablaClientes tbody');
        tablaClientesBody.innerHTML = '';  // Limpiar cualquier contenido previo en la tabla

        clientes.forEach(cliente => {
            const row = document.createElement('tr'); // Crear una fila para cada cliente

            // Usar plantillas literales para crear las celdas de manera más limpia
            row.innerHTML = `
                <td>${cliente.id_Cliente}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.apellido}</td>
                <td>${cliente.telefono}</td>
                <td>${cliente.direccion}</td>
                <td>${cliente.numeroDocumento}</td>
                <td>${cliente.nombreLocalidad}</td>
                <td>${cliente.nombreBarrio}</td>
                <td>${cliente.estado}</td>
                <td>
                    <button type="button" class="btn btn-success btnActualizar" data-bs-toggle="modal" data-bs-target="#actualizarCliente" data-id="${cliente.id_Cliente}">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                     <button type="button" class="btn btn-danger btnDarBaja" data-bs-toggle="modal" data-bs-target="#darDeBajaCliente" data-id="${cliente.id_Cliente}">
                        <i class="fa-solid fa-user-slash"></i>
                    </button>
                </td>
            `;

            // Añadir la fila al cuerpo de la tabla
            tablaClientesBody.appendChild(row);
        });
    }

    // Escuchar cambios en los filtros
    filtroNombre.addEventListener('input', obtenerClientesFiltrados);
    filtroEstado.addEventListener('change', obtenerClientesFiltrados);

    // Llamar a obtenerClientesFiltrados cuando la página cargue por primera vez
    window.addEventListener('load', obtenerClientesFiltrados);
});

// Llamada para agregar un cliente
document.getElementById('formAgregarCliente').addEventListener('submit', async function (event) {
    event.preventDefault();  // Prevenir el comportamiento por defecto del formulario

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value;
    const numeroDocumento = document.getElementById('numeroDocumento').value;
    const localidad = document.getElementById('localidad').value;
    const barrio = document.getElementById('barrio').value;
    const estado = document.getElementById('estado').value;

    const nuevoCliente = {
        nombre: nombre,
        apellido: apellido,
        telefono: telefono,
        direccion: direccion,
        numeroDocumento: numeroDocumento,
        localidad: localidad,
        barrio: barrio,
        estado: estado
    };

    try {
        const response = await fetch('http://localhost:4000/Cliente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoCliente)
        });

        if (response.ok) {
            const myModal = new bootstrap.Modal(document.getElementById('clienteAgregadoModal'));
            myModal.show();
            // Actualizar la tabla después de agregar el cliente
            mostrarClientes();
        } else {
            const myModal = new bootstrap.Modal(document.getElementById('faltaDatos'));
            myModal.show();
        }
    } catch (error) {
        console.error('Error:', error);
    }
});


document.getElementById('formAgregarCliente').addEventListener('submit', function (event) {
    event.preventDefault();

    let form = this;
    let isValid = true;

    // Validar cada campo del formulario
    document.querySelectorAll('#formAgregarCliente input, #formAgregarCliente select').forEach(function (input) {
        if (!input.checkValidity()) {
            input.classList.add('is-invalid'); // Si no es válido, marca el campo como inválido
            isValid = false;
        } else {
            input.classList.remove('is-invalid'); // Si es válido, lo marca como válido
            input.classList.add('is-valid');
        }
    });

    // Si todos los campos son válidos, proceder a enviar el formulario y limpiar
    if (isValid) {
        console.log("Formulario válido, listo para enviar.");

        // Aquí puedes agregar la lógica para enviar el formulario, como enviar los datos al backend.

        // Limpiar el formulario después de enviar
        form.reset(); // Esto reseteará todos los campos a sus valores iniciales

        // Si usas `select` y tienes opciones como `disabled` en la primera opción, puedes resetearlo explícitamente:
        document.getElementById('estado').selectedIndex = 0;
        document.getElementById('localidad').selectedIndex = 0;
        document.getElementById('barrio').selectedIndex = 0;

        // Limpiar la clase de validación
        document.querySelectorAll('#formAgregarCliente input, #formAgregarCliente select').forEach(function (input) {
            input.classList.remove('is-valid', 'is-invalid');
        });

        // Aquí puedes agregar una notificación o mostrar un modal de "Pedido agregado con éxito"
    } else {
        console.log("Formulario contiene errores.");
    }
});

/* document.querySelectorAll('.btnActualizar').forEach(boton => {
    boton.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-id'); // Obtener el ID del cliente
        console.log("ID Cliente al hacer clic:", id); // Verifica que no sea null o vacío

        if (id === null || id === "") {
            console.error("No se pudo obtener el ID del cliente.");
            return; // Si el ID es nulo o vacío, no continuar
        }

        // Obtener los datos del cliente para mostrar en el modal de actualización
        try {
            const response = await fetch(`http://127.0.0.1:4000/Cliente/${id}`);
            const cliente = await response.json();

            console.log("Cliente obtenido:", cliente); // Verifica que el cliente tenga los valores correctos

            // Llenar los campos del modal con los datos del cliente
            document.getElementById('nombreActualizar').value = cliente.nombre;
            document.getElementById('apellidoActualizar').value = cliente.apellido;
            document.getElementById('telefonoActualizar').value = cliente.telefono;
            document.getElementById('direccionActualizar').value = cliente.direccion;
            document.getElementById('numeroDocumentoActualizar').value = cliente.numeroDocumento;
            document.getElementById('localidadActualizar').value = cliente.id_Localidad;
            document.getElementById('barrioActualizar').value = cliente.id_Barrio;
            document.getElementById('estadoActualizar').value = cliente.estado;

            // Guardar el ID del cliente para usarlo al modificar
            document.getElementById('formActualizarCliente').setAttribute('data-id', id); // Asegurarse de que el ID esté en el formulario

        } catch (error) {
            console.error('Error al obtener los datos del cliente:', error);
        }
    });
});


// Paso 2: Enviar los datos actualizados al backend y actualizar la fila en la tabla
document.getElementById('formActualizarCliente').addEventListener('submit', async function (event) {
    event.preventDefault();

    const id_Cliente = document.getElementById('formActualizarCliente').getAttribute('data-id'); // Obtener el ID del cliente desde el formulario
    console.log("ID del cliente a actualizar:", id_Cliente);  // Verifica que el ID se obtenga correctamente

    if (id_Cliente === null || id_Cliente === "") {
        console.error("El ID del cliente es nulo o vacío.");
        return; // Si el ID no está disponible, no enviar la solicitud
    }

    const nombre = document.getElementById('nombreActualizar').value;
    const apellido = document.getElementById('apellidoActualizar').value;
    const telefono = document.getElementById('telefonoActualizar').value;
    const direccion = document.getElementById('direccionActualizar').value;
    const numeroDocumento = document.getElementById('numeroDocumentoActualizar').value;
    const localidad = document.getElementById('localidadActualizar').value;
    const barrio = document.getElementById('barrioActualizar').value;
    const estado = document.getElementById('estadoActualizar').value;

    const clienteActualizado = {
        nombre: nombre,
        apellido: apellido,
        telefono: telefono,
        direccion: direccion,
        numeroDocumento: numeroDocumento,
        localidad: localidad,
        barrio: barrio,
        estado: estado
    };

    console.log("ID Cliente a enviar:", id_Cliente);

    try {
        const response = await fetch(`http://127.0.0.1:4000/Cliente/${id_Cliente}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(clienteActualizado),
        });

        const result = await response.json();

        if (result.success) {
            mostrarClientes();  // Actualiza la tabla después de la actualización
        } else {
            alert('Error al actualizar el cliente');
        }
    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
    }
}); */

// Función para manejar el clic en el botón de dar de baja
function agregarClienteBaja(cliente) {
    // Verifica si 'cliente' es un objeto
    if (cliente && typeof cliente === 'object') {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cliente.id_Cliente}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.apellido}</td>
            <td>${cliente.telefono}</td>
            <td>${cliente.direccion}</td>
            <td>${cliente.numeroDocumento}</td>
            <td>${cliente.nombreLocalidad}</td>
            <td>${cliente.nombreBarrio}</td>
            <td>${cliente.estado}</td>
            <td>
                <button type="button" class="btn btn-success btnRestaurar" data-id="${cliente.id_Cliente}">
                    <i class="fa-solid fa-user-check"></i>
                </button>
            </td>
        `;
        // Agregar a la tabla
        const tablaClientesBajaBody = document.querySelector('#tablaClientesBaja tbody');
        tablaClientesBajaBody.appendChild(row);
    } else {
        console.error("Error: Cliente no válido", cliente);
    }
}

async function darDeBajaCliente(idCliente) {
    try {
        const response = await fetch('http://localhost:4000/darDeBaja', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idCliente: idCliente }),
        });

        if (!response.ok) {
            throw new Error('Error al dar de baja el cliente');
        }

        const data = await response.json(); // Intenta parsear la respuesta JSON

        if (data.message === 'Cliente dado de baja exitosamente') {
            alert(data.message); // Muestra el mensaje de éxito

            // Eliminar la fila de la tabla de clientes en alta
            const row = document.querySelector(`button[data-id="${idCliente}"]`).closest('tr');
            row.remove();

            // Obtener los datos del cliente dado de baja y agregarlo a la tabla de "clientes dados de baja"
            const cliente = await obtenerClientePorId(idCliente);
            agregarClienteBaja(cliente);

            // Después de agregar el cliente, actualizamos la lista de clientes dados de baja
            obtenerClientesDeBaja();  // Actualiza la tabla con los datos más recientes
        } else {
            throw new Error('No se pudo dar de baja al cliente');
        }
    } catch (error) {
        console.error('Error al dar de baja al cliente:', error);
        alert('Hubo un error al dar de baja al cliente.');
    }
}

async function obtenerClientePorId(idCliente) {
    try {
        const response = await fetch(`http://localhost:4000/Cliente/${idCliente}`);
        const cliente = await response.json();
        return cliente;
    } catch (error) {
        console.error('Error al obtener los datos del cliente:', error);
        return null;
    }
}

async function obtenerClientesDeBaja() {
    try {
        const response = await fetch('http://localhost:4000/clientesBaja');  // Endpoint correcto
        const clientesBaja = await response.json();

        // Llamar a la función para mostrar los clientes dados de baja
        mostrarClientesBaja(clientesBaja);
    } catch (error) {
        console.error('Error al obtener los clientes dados de baja:', error);
    }
}

// Mostrar los clientes dados de baja en la tabla de clientes dados de baja
function mostrarClientesBaja(clientes) {
    const tablaClientesBajaBody = document.querySelector('#tablaClientesBaja tbody');
    tablaClientesBajaBody.innerHTML = '';  // Limpiar la tabla

    // Verifica si 'clientes' es un array
    if (Array.isArray(clientes)) {
        clientes.forEach(cliente => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cliente.id_Cliente}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.apellido}</td>
                <td>${cliente.telefono}</td>
                <td>${cliente.direccion}</td>
                <td>${cliente.numeroDocumento}</td>
                <td>${cliente.nombreLocalidad}</td>
                <td>${cliente.nombreBarrio}</td>
                <td>${cliente.estado}</td>
                <td>
                    <button type="button" class="btn btn-success btnRestaurar" data-id="${cliente.id_Cliente}">
                        <i class="fa-solid fa-user-check"></i>
                    </button>
                </td>
            `;
            tablaClientesBajaBody.appendChild(row);
        });
    } else {
        console.error("Los datos de clientes no son un array:", clientes);
    }
}


// Llamar esta función cuando sea necesario, por ejemplo después de dar de baja un cliente
obtenerClientesDeBaja();

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('btnDarBaja')) {
        const idCliente = event.target.getAttribute('data-id');
        darDeBajaCliente(idCliente);
    }
});

// Listener para el botón de restaurar cliente
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('btnRestaurar')) {
        const idCliente = event.target.getAttribute('data-id');
        restaurarCliente(idCliente);
    }
});

// Función para restaurar el cliente
async function restaurarCliente(idCliente) {
    try {
        const response = await fetch('http://localhost:4000/restaurarCliente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idCliente: idCliente }),
        });

        if (!response.ok) {
            throw new Error('Error al restaurar el cliente');
        }

        const data = await response.json();
        if (data.message === 'Cliente restaurado exitosamente') {
            alert(data.message); // Muestra el mensaje de éxito

            // Eliminar la fila de la tabla de clientes dados de baja
            const row = document.querySelector(`button[data-id="${idCliente}"]`).closest('tr');
            row.remove();

            // Obtener los datos del cliente restaurado y agregarlo a la tabla de "clientes en alta"
            const cliente = await obtenerClientePorId(idCliente);
            agregarClienteAlta(cliente);

            // Actualiza la tabla de clientes activos
            obtenerClientesActivos();  // Esto actualizará la lista de clientes activos
        } else {
            throw new Error('No se pudo restaurar al cliente');
        }
    } catch (error) {
        console.error('Error al restaurar al cliente:', error);
        alert('Hubo un error al restaurar al cliente.');
    }
}

// Función para agregar el cliente restaurado a la tabla de "clientes en alta"
function agregarClienteAlta(cliente) {
    // Verifica si el estado del cliente es activo
    if (cliente.estado === 'activo') {
        const tablaClientesAltaBody = document.querySelector('#tablaClientes tbody');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cliente.id_Cliente}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.apellido}</td>
            <td>${cliente.telefono}</td>
            <td>${cliente.direccion}</td>
            <td>${cliente.numeroDocumento}</td>
            <td>${cliente.nombreLocalidad}</td>
            <td>${cliente.nombreBarrio}</td>
            <td>${cliente.estado}</td>
            <td>
                <button type="button" class="btn btn-success btnActualizar" data-bs-toggle="modal" data-bs-target="#actualizarCliente" data-id="${cliente.id_Cliente}">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button type="button" class="btn btn-danger btnDarBaja" data-id="${cliente.id_Cliente}">
                    <i class="fa-solid fa-user-slash"></i>
                </button>
            </td>
        `;
        tablaClientesAltaBody.appendChild(row);
    }
}

function limpiarTablaClientesActivos() {
    const tablaClientesAltaBody = document.querySelector('#tablaClientes tbody');
    tablaClientesAltaBody.innerHTML = '';  // Limpia la tabla de clientes activos
}

async function obtenerClientesActivos() {
    limpiarTablaClientesActivos();  // Limpia la tabla antes de agregar los nuevos clientes

    try {
        const response = await fetch('http://localhost:4000/clientesActivos');  // Endpoint para obtener clientes activos
        const clientesActivos = await response.json();

        // Llamar a la función para mostrar los clientes activos
        clientesActivos.forEach(cliente => {
            agregarClienteAlta(cliente);
        });
    } catch (error) {
        console.error('Error al obtener los clientes activos:', error);
    }
}

obtenerClientesActivos();

function validateInput(input) {
    if (input.tagName.toLowerCase() === 'select') {
        if (input.value === "" || input.selectedIndex === 0) {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        }
    } else if (input.type === 'number' && input.id === 'numeroDocumento') {
        if (input.value === "" || input.checkValidity()) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
        }
    } else {
        if (input.checkValidity()) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
        }
    }
}

// Validación en tiempo real
document.querySelectorAll('input, select').forEach(function (input) {
    input.addEventListener('input', function () {
        validateInput(input);
    });
    input.addEventListener('change', function () {
        validateInput(input);
    });
});

