import { getClientes } from "./Services/clientesServices.js";
import { borrarContenidoInputs} from "./funciones.js";
const contenedorPrincipal = document.getElementById('contenedorPrincipal');

const tablaCliente = (clienteColumnas, datos = []) => {
    const cajaTabla = document.querySelector('.cajaTabla');

    let tabla = `  
        <table class="table tabla table-striped table-dark table-borderless table-hover shadow-lg p-3">
            <thead>
                <tr>
    `;

    clienteColumnas.forEach(clienteColumnas => {
        tabla += `<th>${clienteColumnas}</th>`;
    });

    tabla += `<th>Acciones</th></tr></thead><tbody>`; 

    datos.forEach(fila => {
        tabla += `
            <tr>
                <td>${fila.id_Cliente}</td>
                <td>${fila.nombre}</td>
                <td>${fila.apellido}</td>
                <td>${fila.telefono}</td>
                <td>${fila.direccion}</td>
                <td>${fila.numeroDocumento}</td>
                <td>${fila.id_Localidad}</td>
                <td>${fila.id_Barrio}</td>
                <td>
                    <button type="button" class="btn btn-success btnActualizar" data-bs-toggle="modal" data-bs-target="#actualizarCliente">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button type="button" class="btn btn-danger btnBorrar" data-id="${fila.id_Cliente}">
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
            if (confirm(`¿Estás seguro de que deseas eliminar el cliente con ID: ${id}?`)) {
                try {
                    const response = await fetch(`http://127.0.0.1:4000/Cliente/${id}`, {
                        method: 'DELETE',
                    });
                    const result = await response.json();
                    
                    if (result.success) {
                        alert('Cliente eliminado con éxito');
                        // e.currentTarget.closest('tr').remove();
                    } else {
                        alert('Error al eliminar el cliente');
                    }
                } catch (error) {
                    console.error('Error al eliminar el cliente:', error);
                }
            }
        });
    });
};

const columnas = ['ID', 'Nombre', 'Apellido', 'Telefono', 'Direccion', 'Dni', 'Localidad', 'Barrio'];

document.getElementById('clientes').addEventListener("click", async () => {
    console.log('Botón presionado');
    contenedorPrincipal.innerHTML = `
        <div class="contenedorTitulo container-fluid">
            <div>
                <h1 class="titulo">Clientes</h1>
            </div>
            <div class="me-3 contenedorAgregarCosas">
                <span class="d-inline-block" tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-content="Disabled popover" data-bs-placement="bottom">
                    <button class="btn btn-secondary" type="button">
                        <i class="fa-solid fa-clock"></i>
                    </button>
                </span>
                <a class="btn btn-secondary agregarCliente" type="button" data-bs-toggle="modal" data-bs-target="#agregarCliente">
                    <i class="fa-solid fa-user"></i>
                    <i class="fa-solid fa-plus"></i>
                </a>
            </div>
        </div>
        <div class="contenedor-flex">
            <div class="primeraCaja shadow-lg p-3 container">
                <h2 class="h2 text-center">Clientes</h2>
                <div class="cajaTabla container table-responsive-sm table-responsive-vertical"></div>
            </div>
            <div class="segundaCaja shadow-lg p-3 container">
                <h2 class="h2 text-center h2Derecha">Clientes dados de baja</h2>
                <div class="cajaTabla container table-responsive-sm table-responsive-vertical"></div>
            </div>
        </div>
        <div class="modal" data-bs-theme="dark" id="agregarCliente" tabindex="-1">
            <div class="modal-md modal-dialog modal-dialog-centered">
                <div class="modal-content modal2">
                    <div class="modal-header">
                        <h5 class="modal-title">Agregar nuevo cliente</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form id="formAgregarCliente">
                        <div class="modal-body">
                            <div class="form-floating mb-3">
                                <input type="text" id="nombre" class="form-control input" placeholder="Nombre">
                                <label for="nombre">Nombre</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="text" id="apellido" class="form-control input" placeholder="Apellido">
                                <label for="apellido">Apellido</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="number" id="telefono" class="form-control input" placeholder="Teléfono">
                                <label for="telefono">Teléfono</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="text" id="direccion" class="form-control input" placeholder="Dirección">
                                <label for="direccion">Dirección</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="number" id="numeroDocumento" class="form-control input" placeholder="D.N.I.">
                                <label for="numeroDocumento">D.N.I.</label>
                            </div>
                            <div class="form-floating mb-3">
                                <select class="form-select" aria-label="Default select example" id="localidad">
                                    <option selected></option>
                                    <option value="1">Villa María</option>
                                    <option value="2">Villa Nueva</option>
                                </select>
                                <label for="localidad">Seleccione la localidad</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="text" id="barrio" class="form-control input" placeholder="Barrio">
                                <label for="barrio">Barrio</label>
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
        <div class="modal" data-bs-theme="dark" id="actualizarCliente" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content modal2">
                    <form>
                        <div class="modal-header">
                            <h5 class="modal-title">Actualizar datos del cliente</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="form-floating mb-3">
                                <input type="text" id="nombre" class="form-control input" placeholder="Nombre">
                                <label for="nombre">Nombre</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="text" id="apellido" class="form-control input" placeholder="Apellido">
                                <label for="apellido">Apellido</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="number" id="telefono" class="form-control input" placeholder="Teléfono">
                                <label for="telefono">Teléfono</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="text" id="direccion" class="form-control input" placeholder="Dirección">
                                <label for="direccion">Dirección</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="number" id="numeroDocumento" class="form-control input" placeholder="D.N.I.">
                                <label for="numeroDocumento">D.N.I.</label>
                            </div>
                            <div class="form-floating mb-3">
                                <select class="form-select" aria-label="Default select example" id="localidad">
                                    <option selected></option>
                                    <option value="1">Villa María</option>
                                    <option value="2">Villa Nueva</option>
                                </select>
                                <label for="localidad">Seleccione la localidad</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="text" id="barrio" class="form-control input" placeholder="Barrio">
                                <label for="barrio">Barrio</label>
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
        <div class="modal" id="darDeBajaACliente" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content modal1">
                    <div class="modal-header">
                        <h5 class="modal-title">Deshabilitar cliente</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ¿Estás seguro que deseas deshabilitar a este cliente?
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
        const datosClientes = await getClientes();
        console.log(datosClientes);
        const clientesFiltrados = Array.isArray(datosClientes) ? datosClientes[0] : datosClientes;
        tablaCliente(columnas, clientesFiltrados);
    } catch (error) {
        console.error('Error al obtener los datos de clientes:', error);
    }
    borrarContenidoInputs();

    document.getElementById('formAgregarCliente').addEventListener('submit', async function (event) {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const telefono = document.getElementById('telefono').value;
        const direccion = document.getElementById('direccion').value;
        const numeroDocumento = document.getElementById('numeroDocumento').value;
        const localidad = document.getElementById('localidad').value;
        const barrio = document.getElementById('barrio').value;
    
        const nuevoCliente = {
            nombre: nombre,
            apellido: apellido,
            telefono: telefono,
            direccion: direccion,
            numeroDocumento: numeroDocumento,
            localidad: localidad,
            barrio: barrio,
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
                alert('Cliente agregado con éxito');
            } else {
                alert('Hubo un error al agregar el cliente');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
