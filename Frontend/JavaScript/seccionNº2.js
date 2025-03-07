import { getPedidos } from "./Services/pedidosServices.js";
import { formatDate } from "./funciones.js";

document.addEventListener("DOMContentLoaded", () => {
    cargarClientes();
});

async function cargarClientes() {
    const res = await fetch("http://localhost:4000/Cliente");
    const data = await res.json();
    const select = document.getElementById("cliente");
    data.forEach(cliente => {
        const option = document.createElement("option");
        option.value = cliente.id_Cliente;
        option.textContent = cliente.nombre;
        select.appendChild(option);
    });
}

document.querySelectorAll('.btnBorrar').forEach(boton => {
    boton.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm(`¿Estás seguro de que deseas eliminar el pedido con ID: ${id}?`)) {
            try {
                const response = await fetch(`http://127.0.0.1:4000/Pedido/${id}`, {
                    method: 'DELETE',
                });
                const result = await response.json();

                if (result.success) {
                    alert('Pedido eliminado con éxito');
                    getPedidos();
                } else {
                    alert('Error al eliminar el pedido');
                }
            } catch (error) {
                console.error('Error al eliminar el pedido:', error);
            }
        }
    });
});


document.querySelectorAll('.btnActualizar').forEach(boton => {
    boton.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-id');  // Obtener el ID del pedido

        // Obtener los datos del pedido para mostrar en el modal de actualización
        try {
            const response = await fetch(`http://127.0.0.1:4000/Pedido/${id}`);
            const pedido = await response.json();

            // Llenar los campos del modal con los datos del pedido
            document.getElementById('clienteActualizar').value = pedido.id_Cliente;
            document.getElementById('detalleActualizar').value = pedido.detallePedido;
            document.getElementById('fechaCreacionActualizar').value = pedido.fechaCreacion;
            document.getElementById('fechaEntregaActualizar').value = pedido.fechaEntrega;
            document.getElementById('direccionActualizar').value = pedido.direccion;
            document.getElementById('barrioActualizar').value = pedido.id_Barrio;
            document.getElementById('transporteActualizar').value = pedido.id_Transporte;

            // Guardar el ID del pedido para usarlo al modificar
            document.getElementById('actualizarPedido').setAttribute('data-id', id);

        } catch (error) {
            console.error('Error al obtener los datos del Pedido:', error);
        }
    });
});

async function obtenerPedidosFiltrados() {
    const estado = document.getElementById('filtroEstado').value;

    // Crear la URL base para la consulta
    const url = new URL("/Pedido", "http://localhost:4000");
    console.log("la url es" + url);
    const params = new URLSearchParams();

    // Agregar los filtros a la URL, solo si tienen valor
    if (estado && estado !== "Estado") {
        params.append("estado", estado);
    }

    url.search = params.toString();  // Asignar los parámetros a la URL

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error("Error al obtener los pedidos:", response.statusText);
            return;
        }

        const pedidos = await response.json();  // Convertir la respuesta en JSON
        console.log("Pedidos obtenidos:", pedidos);

        // Mostrar los pedidos en la tabla
        mostrarPedidos(pedidos);
    } catch (error) {
        console.error("Error al obtener los pedidos:", error);
    }
}

document.getElementById('filtroEstado').addEventListener('change', obtenerPedidosFiltrados);

// Mostrar pedidos inicialmente al cargar la página
window.addEventListener('load', obtenerPedidosFiltrados);

async function mostrarPedidos() {
    const pedidos = await getPedidos(); // Obtener los pedidos usando la función importada
    const pedidosData = pedidos[0];  // El primer array contiene los pedidos, el segundo tiene datos basura

    const tablaPedidosBody = document.querySelector('#tablaPedidos tbody');
    tablaPedidosBody.innerHTML = '';  // Limpiar cualquier contenido previo en la tabla

    pedidosData.forEach(pedido => {
        const row = document.createElement('tr'); // Crear una fila para cada pedido

        // Usar plantillas literales para crear las celdas de manera más limpia
        row.innerHTML = `
            <td>${pedido.id_Pedido}</td>
            <td>${pedido.cliente_nombre} ${pedido.cliente_apellido}</td> <!-- Nombre del cliente -->
            <td>${pedido.detallePedido}</td>
            <td>${formatDate(pedido.fechaCreacion)}</td>
            <td>${formatDate(pedido.fechaEntrega)}</td>
            <td>${pedido.direccion}</td>
            <td>${pedido.estado}</td>
            <td>${pedido.barrio_nombre}</td>
            <td>${pedido.transporte_marca}</td>
            <td>
                <button type="button" class="btn btn-success btnActualizar" data-bs-toggle="modal" data-bs-target="#actualizarPedido" data-id="${pedido.id_Pedido}">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button type="button" class="btn btn-danger btnDarBaja" data-id="${pedido.id_Pedido}">
                    <i class="fa-solid fa-parachute-box"></i>
                </button>
            </td>
        `;

        // Añadir la fila al cuerpo de la tabla
        tablaPedidosBody.appendChild(row);
    });
}

window.onload = mostrarPedidos;

document.getElementById('formAgregarPedido').addEventListener('submit', async function (event) {
    event.preventDefault();

    const cliente = document.getElementById('cliente').value;
    const detallePedido = document.getElementById('detalle').value;
    const fechaCreacion = document.getElementById('fechaCreacion').value;
    const fechaEntrega = document.getElementById('fechaEntrega').value;
    const direccion = document.getElementById('direccion').value;
    const estado = document.getElementById('estado').value;
    const barrio = document.getElementById('barrio').value;
    const transporte = document.getElementById('transporte').value;

    const nuevoPedido = {
        cliente: cliente,
        detallePedido: detallePedido,
        fechaCreacion: formatDate(fechaCreacion),
        fechaEntrega: formatDate(fechaEntrega),
        direccion: direccion,
        estado: estado,
        barrio: barrio,
        transporte: transporte
    };

    try {
        const response = await fetch('http://localhost:4000/Pedido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoPedido)
        });
        
        if (response.ok) {
            const myModal = new bootstrap.Modal(document.getElementById('pedidoAgregadoModal'));
            myModal.show();
            mostrarPedidos(); // Llamar a la función que muestra los pedidos
        } else {
            const myModal = new bootstrap.Modal(document.getElementById('faltanDatos'));
            myModal.show();
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Evento de envío del formulario
document.getElementById('formAgregarPedido').addEventListener('submit', function(event) {
    event.preventDefault();

    let form = this;
    let isValid = true;

    // Validar cada campo del formulario
    document.querySelectorAll('#formAgregarPedido input, #formAgregarPedido select, #formAgregarPedido textarea').forEach(function(input) {
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
        document.getElementById('cliente').selectedIndex = 0;
        document.getElementById('estado').selectedIndex = 0;
        document.getElementById('barrio').selectedIndex = 0;
        document.getElementById('transporte').selectedIndex = 0;

        // Limpiar la clase de validación
        document.querySelectorAll('#formAgregarPedido input, #formAgregarPedido select, #formAgregarPedido textarea').forEach(function(input) {
            input.classList.remove('is-valid', 'is-invalid');
        });

        // Aquí puedes agregar una notificación o mostrar un modal de "Pedido agregado con éxito"
    } else {
        console.log("Formulario contiene errores.");
    }
});


document.getElementById('actualizarPedido').addEventListener('submit', async function (event) {
    event.preventDefault();

    const id = document.getElementById('actualizarPedido').getAttribute('data-id');

    const cliente = document.getElementById('clienteActualizar').value;
    const detallePedido = document.getElementById('detalleActualizar').value;
    const fechaCreacion = document.getElementById('fechaCreacionActualizar').value;
    const fechaEntrega = document.getElementById('fechaEntregaActualizar').value;
    const direccion = document.getElementById('direccionActualizar').value;
    const estado = document.getElementById('estadoActualizar').value;
    const recorrido = document.getElementById('recorridoActualizar').value;
    const transporte = document.getElementById('transporteActualizar').value;

    const formattedFechaCreacion = formatDate(fechaCreacion);
    const formattedFechaEntrega = formatDate(fechaEntrega);

    const pedidoActualizado = {
        cliente: cliente,
        detallePedido: detallePedido,
        fechaCreacion: formattedFechaCreacion,
        fechaEntrega: formattedFechaEntrega,
        direccion: direccion,
        estado: estado,
        recorrido: recorrido,
        transporte: transporte
    };

    try {
        const response = await fetch(`http://127.0.0.1:4000/Pedido/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pedidoActualizado),
        });

        const result = await response.json();

        if (result.success) {
            alert('Pedido actualizado con éxito');
            await getPedidos();
            const modalActualizar = bootstrap.Modal.getInstance(document.getElementById('actualizarPedido'));
            modalActualizar.hide();
        } else {
            alert('Error al actualizar el pedido');
        }
    } catch (error) {
        console.error('Error al actualizar el pedido:', error);
    }
});

function agregarPedidoBaja(pedido) {
    // Verifica si 'pedido' es un objeto
    if (pedido && typeof pedido === 'object') {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pedido.id_Pedido}</td>
            <td>${pedido.cliente_nombre}</td> <!-- Nombre del Cliente -->
            <td>${pedido.detallePedido}</td>
            <td>${formatDate(pedido.fechaCreacion)}</td>
            <td>${formatDate(pedido.fechaEntrega)}</td>
            <td>${pedido.direccion}</td>
            <td>${pedido.estado}</td>
            <td>${pedido.barrio_nombre}</td> <!-- Nombre del Barrio -->
            <td>${pedido.transporte_marca}</td> <!-- Nombre del Transporte -->
            <td>
                <button type="button" class="btn btn-success btnRestaurarPedido" data-id="${pedido.id_Pedido}">
                    <i class="fa-solid fa-pen"></i>
                </button>
            </td>
        `;
        // Agregar a la tabla de pedidos dados de baja
        const tablaPedidosBajaBody = document.querySelector('#tablaPedidosBaja tbody');
        tablaPedidosBajaBody.appendChild(row);
    } else {
        console.error("Error: Pedido no válido", pedido);
    }
}


async function darDeBajaPedido(idPedido) {
    try {
        const response = await fetch('http://localhost:4000/darDeBajaPedido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idPedido: idPedido }),
        });

        if (!response.ok) {
            throw new Error('Error al dar de baja el pedido');
        }

        const data = await response.json(); // Intenta parsear la respuesta JSON

        if (data.message === 'Pedido dado de baja exitosamente') {
            alert(data.message); // Muestra el mensaje de éxito

            // Eliminar la fila de la tabla de pedidos activos
            const row = document.querySelector(`button[data-id="${idPedido}"]`).closest('tr');
            row.remove();

            // Obtener los datos del pedido dado de baja y agregarlo a la tabla de "pedidos dados de baja"
            const pedido = await obtenerPedidoPorId(idPedido);
            agregarPedidoBaja(pedido);

            // Después de agregar el pedido, actualizamos la lista de pedidos dados de baja
            obtenerPedidosDeBaja();  // Actualiza la tabla con los datos más recientes
        } else {
            throw new Error('No se pudo dar de baja el pedido');
        }
    } catch (error) {
        console.error('Error al dar de baja el pedido:', error);
        alert('Hubo un error al dar de baja el pedido.');
    }
}

async function obtenerPedidoPorId(idPedido) {
    try {
        const response = await fetch(`http://localhost:4000/pedido/${idPedido}`);
        const pedido = await response.json();
        return pedido;
    } catch (error) {
        console.error('Error al obtener los datos del pedido:', error);
        return null;
    }
}

async function obtenerPedidosDeBaja() {
    try {
        const response = await fetch('http://localhost:4000/pedidosBaja'); // Endpoint que trae los pedidos dados de baja
        const pedidosInactivos = await response.json();

        mostrarPedidosDeBaja(pedidosInactivos);  // Llamamos la función que muestra los pedidos dados de baja en la tabla
    } catch (error) {
        console.error('Error al obtener los pedidos dados de baja:', error);
    }
}

function mostrarPedidosDeBaja(pedidos) {
    const tablaPedidosBajaBody = document.querySelector('#tablaPedidosBaja tbody');
    tablaPedidosBajaBody.innerHTML = '';  // Limpiar la tabla antes de agregar nuevos elementos

    // Recorremos el array de pedidos dados de baja y agregamos las filas a la tabla
    pedidos.forEach(pedido => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pedido.id_Pedido}</td>
                <td>${pedido.cliente_nombre}</td>
                <td>${pedido.detallePedido}</td>
                <td>${formatDate(pedido.fechaCreacion)}</td>
                <td>${formatDate(pedido.fechaEntrega)}</td>
                <td>${pedido.direccion}</td>
                <td>${pedido.estado}</td>
                <td>${pedido.barrio_nombre}</td>
                <td>${pedido.transporte_marca}</td>
            <td>
                <button type="button" class="btn btn-success btnRestaurarPedido" data-id="${pedido.id_Pedido}">
                    <i class="fa-solid fa-people-carry-box"></i>
                </button>
            </td>
        `;
        tablaPedidosBajaBody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    obtenerPedidosDeBaja(); 
});

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('btnDarBaja')) {
        const idPedido = event.target.getAttribute('data-id');
        darDeBajaPedido(idPedido);
    }
});



function validateInput(input) {
    if (input.tagName.toLowerCase() === 'select') {
        if (input.value === "" || input.selectedIndex === 0) {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        }
    } else if (input.tagName.toLowerCase() === 'textarea') {
        // Validación para el textarea, si está vacío, marcarlo como inválido
        if (input.value.trim() === "") {
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
document.querySelectorAll('input, select, textarea').forEach(function(input) {
    input.addEventListener('input', function() {
        validateInput(input);
    });
    input.addEventListener('change', function() {
        validateInput(input);
    });
});

