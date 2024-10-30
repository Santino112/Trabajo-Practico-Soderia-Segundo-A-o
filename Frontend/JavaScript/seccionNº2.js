import { getPedidos } from "./Services/pedidosServices.js";
import { borrarContenidoInputs, formatDate} from "./funciones.js";

const columnas = ['ID', 'Cliente', 'Detalles', 'Creación', 'Entrega', 'Dirección', 'Recorrido', 'Vehiculo'];

const tablaPedido = (pedidoColumnas, datos = []) => {
    const cajaTabla = document.querySelector('.cajaTabla');

    let tabla = `  
        <table class="table tabla table-striped table-dark table-borderless table-hover shadow-lg p-3">
            <thead>
                <tr>
    `;

    pedidoColumnas.forEach(pedidoColumnas => {
        tabla += `<th>${pedidoColumnas}</th>`;
    });

    tabla += `<th>Acciones</th></tr></thead><tbody>`; 

   
    datos.forEach(fila => {
        const formattedFechaCreacion = formatDate(fila.fechaCreacion);
        const formattedFechaEntrega = formatDate(fila.fechaEntrega);
        tabla += `
            <tr>
                <td>${fila.id_Pedido}</td>
                <td>${fila.cliente}</td>
                <td>${fila.detallePedido}</td>
                <td>${formattedFechaCreacion}</td>
                <td>${formattedFechaEntrega}</td>
                <td>${fila.direccion}</td>
                <td>${fila.id_Recorrido}</td>
                <td>${fila.id_Transporte}</td>
                <td>
                    <button type="button" class="btn btn-success btnActualizar" data-bs-toggle="modal" data-bs-target="#actualizarPedido" data-id="${fila.id_Pedido}">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button type="button" class="btn btn-danger btnBorrar" data-id="${fila.id_Pedido}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    tabla += `</tbody></table>`;

    cajaTabla.innerHTML = tabla;

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
                document.getElementById('clienteActualizar').value = pedido.cliente;
                document.getElementById('detalleActualizar').value = pedido.detallePedido;
                document.getElementById('fechaCreacionActualizar').value = pedido.fechaCreacion;
                document.getElementById('fechaEntregaActualizar').value = pedido.fechaEntrega;
                document.getElementById('direccionActualizar').value = pedido.direccion;
                document.getElementById('recorridoActualizar').value = pedido.id_Recorrido;
                document.getElementById('transporteActualizar').value = pedido.id_Transporte;
    
                // Guardar el ID del pedido para usarlo al modificar
                document.getElementById('actualizarPedido').setAttribute('data-id', id);
    
            } catch (error) {
                console.error('Error al obtener los datos del Pedido:', error);
            }
        });
    });
};

document.getElementById('pedidos').addEventListener("click", async () => {
    contenedorPrincipal.innerHTML = `  
        <div class="contenedorTitulo container-fluid">
            <div>
                <h1 class="titulo">Pedidos</h1>
            </div>
            <div class="me-3 contenedorAgregarCosas">
                <span class="d-inline-block" tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-content="Disabled popover" data-bs-placement="bottom">
                    <button class="btn btn-secondary" type="button">
                        <i class="fa-solid fa-clock"></i>
                    </button>
                </span>
                <a class="btn btn-secondary agregarPedido" type="button" data-bs-toggle="modal" data-bs-target="#agregarPedido">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <i class="fa-solid fa-plus"></i>
                </a>
            </div>
        </div>
        <div class="contenedor-flex">
                <div class="primeraCaja shadow-lg p-3 container">
                    <h2 class="h2 text-center">Pedidos</h2>
                    <div class="cajaTabla container table-responsive table-responsive-vertical"></div>
                </div>
        </div>
        <div class="modal" data-bs-theme="dark" id="agregarPedido" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content modal2">
                        <div class="modal-header">
                            <h5 class="modal-title">Agregar nuevo pedido</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form id="formAgregarPedido">
                            <div class="modal-body">
                                <div class="form-floating mb-3">
                                    <input type="text" id="cliente" class="form-control input" placeholder="Cliente">
                                    <label for="floatingInput">Cliente</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="text" id="detalle" class="form-control input" placeholder="Detalle del pedido">
                                    <label for="floatingInput1">Detalle del pedido</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="date" id="fechaCreacion" class="form-control input" placeholder="Fecha de creación">
                                    <label for="floatingInput2">Fecha de creación</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="date" id="fechaEntrega" class="form-control input" placeholder="Fecha de entrega">
                                    <label for="floatingInput3">Fecha de entrega</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="text" id="direccion" class="form-control input" placeholder="Dirección">
                                    <label for="floatingInput4">Dirección</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <select class="form-select" aria-label="Default select example" id="recorrido">
                                        <option selected></option>
                                        <option value="1">San Juan Bautista</option>
                                        <option value="2">San Justo</option>
                                    </select>
                                    <label for="select">Seleccione el recorrido</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <select class="form-select" aria-label="Default select example" id="transporte">
                                        <option selected></option>
                                        <option value="1">Hilux</option>
                                        <option value="2">Trafic</option>
                                    </select>
                                    <label for="select">Seleccione el transporte</label>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" id="cerrar" data-bs-dismiss="modal">Cancelar</button>
                                <button type="submit" class="btn btn-primary">Agregar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="modal" data-bs-theme="dark" id="actualizarPedido" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content modal2">
                        <form>
                            <div class="modal-header">
                                <h5 class="modal-title">Actualizar datos del pedido</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="form-floating mb-3">
                                    <input type="text" id="clienteActualizar" class="form-control input" placeholder="Cliente">
                                    <label for="clienteActualizar">Cliente</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="text" id="detalleActualizar" class="form-control input" placeholder="Detalle del pedido">
                                    <label for="detalleActualizar">Detalle del pedido</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="date" id="fechaCreacionActualizar" class="form-control input" placeholder="Fecha de creación">
                                    <label for="fechaCreacionActualizar">Fecha de creación</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="date" id="fechaEntregaActualizar" class="form-control input" placeholder="Fecha de entrega">
                                    <label for="fechaEntregaActualizar">Fecha de entrega</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="text" id="direccionActualizar" class="form-control input" placeholder="Dirección">
                                    <label for="direccionActualizar">Dirección</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <select class="form-select" aria-label="Default select example" id="recorridoActualizar">
                                        <option selected></option>
                                        <option value="1">San Juan Bautista</option>
                                        <option value="2">San Justo</option>
                                    </select>
                                    <label for="select">Seleccione el recorrido</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <select class="form-select" aria-label="Default select example" id="transporteActualizar">
                                        <option selected></option>
                                        <option value="1">Hilux</option>
                                        <option value="2">Trafic</option>
                                    </select>
                                    <label for="transporteActualizar">Seleccione el transporte</label>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" id="cerrar" data-bs-dismiss="modal">Cancelar</button>
                                <button type="submit" class="btn btn-success">Actualizar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="modal" id="cancelarPedido" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content modal1">
                        <div class="modal-header">
                            <h5 class="modal-title">Cancelar pedido</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            ¿Estás seguro de cancelar este pedido?
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-primary">Aceptar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

    try {
        const datosPedidos = await getPedidos();
        const pedidosFiltrados = Array.isArray(datosPedidos) ? datosPedidos[0] : datosPedidos;
        tablaPedido(columnas, pedidosFiltrados);
    } catch (error) {
        console.error('Error al obtener los datos del pedido:', error);
    }

    document.getElementById('formAgregarPedido').addEventListener('submit', async function (event) {
        event.preventDefault();
    
            const modal = new bootstrap.Modal(document.getElementById('agregarPedido'));
            const cliente = document.getElementById('cliente').value; 
            const detallePedido = document.getElementById('detalle').value;
            const fechaCreacion = document.getElementById('fechaCreacion').value; 
            const fechaEntrega = document.getElementById('fechaEntrega').value; 
            const direccion = document.getElementById('direccion').value; 
            const recorrido = document.getElementById('recorrido').value;
            const transporte = document.getElementById('transporte').value; 

            const nuevoPedido = {
                cliente: cliente,
                detallePedido: detallePedido,
                fechaCreacion: formatDate(fechaCreacion),
                fechaEntrega: formatDate(fechaEntrega),
                direccion: direccion,
                recorrido: recorrido,
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
                    alert('Pedido agregado con éxito');
                    await getPedidos();
                    tablaPedido(columnas,);
                } else {
                    alert('Hubo un error al agregar el pedido');
                }
            } catch (error) {
                console.error('Error:', error);
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

        borrarContenidoInputs();
    });
    
