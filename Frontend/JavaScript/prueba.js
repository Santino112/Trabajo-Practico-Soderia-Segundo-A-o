import { getClientes } from "./Services/clientesServices.js";
import { borrarContenidoInputs} from "./funciones.js";

const columnas = ['ID', 'Nombre', 'Apellido', 'Telefono', 'Direccion', 'Dni', 'Localidad', 'Barrio', 'Estado'];

const tablaCliente = (clienteColumnas, datos = []) => {
    const cajaTabla = document.querySelector('.contenedorTabla');

    let tabla = `  
        <table class="table tabla table-striped table-dark table-borderless table-hover shadow-lg p-3" id="tablaClientes">
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
                <td>${fila.estado}</td>
                <td>
                    <button type="button" class="btn btn-success btnActualizar" data-bs-toggle="modal" data-bs-target="#actualizarCliente" data-id="${fila.id_Cliente}">
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
                        await cargarClientes();
                    } else {
                        alert('Error al eliminar el cliente');
                    }
                } catch (error) {
                    console.error('Error al eliminar el cliente:', error);
                }
            }
        });
        getClientes();
    });

    document.querySelectorAll('.btnActualizar').forEach(boton => {
        boton.addEventListener('click', async (e) => {
            const id = e.currentTarget.getAttribute('data-id');  // Obtener el ID del cliente
            
            // Obtener los datos del cliente para mostrar en el modal de actualización
            try {
                const response = await fetch(`http://127.0.0.1:4000/Cliente/${id}`);
                const cliente = await response.json();
    
                // Llenar los campos del modal con los datos del cliente
                document.getElementById('nombreActualizar').value = cliente.nombre;
                document.getElementById('apellidoActualizar').value = cliente.apellido;
                document.getElementById('telefonoActualizar').value = cliente.telefono;
                document.getElementById('direccionActualizar').value = cliente.direccion;
                document.getElementById('numeroDocumentoActualizar').value = cliente.numeroDocumento;
                document.getElementById('localidadActualizar').value = cliente.id_Localidad;
                document.getElementById('barrioActualizar').value = cliente.id_Barrio;
    
                // Guardar el ID del cliente para usarlo al modificar
                document.getElementById('actualizarCliente').setAttribute('data-id', id);
    
            } catch (error) {
                console.error('Error al obtener los datos del cliente:', error);
            }
        });
    });
};

document.getElementById('clientes').addEventListener("click", async () => {
    console.log('Botón presionado');
    contenedorPrincipal.innerHTML = `
        <div class="modal" data-bs-theme="dark" id="actualizarCliente" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content modal2">
                    <form>
                        <div class="modal-header">
                            <h5 class="modal-title">Modificar datos del cliente</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="form-floating mb-3">
                                <input type="text" id="nombreActualizar" class="form-control input" placeholder="Nombre">
                                <label for="nombreActualizar">Nombre</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="text" id="apellidoActualizar" class="form-control input" placeholder="Apellido">
                                <label for="apellidoActualizar">Apellido</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="number" id="telefonoActualizar" class="form-control input" placeholder="Teléfono">
                                <label for="telefonoActualizar">Teléfono</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="text" id="direccionActualizar" class="form-control input" placeholder="Dirección">
                                <label for="direccionActualizar">Dirección</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="number" id="numeroDocumentoActualizar" class="form-control input" placeholder="D.N.I.">
                                <label for="numeroDocumentoActualizar">D.N.I.</label>
                            </div>
                            <div class="form-floating mb-3">
                                <select class="form-select" aria-label="Default select example" id="localidadActualizar">
                                    <option selected></option>
                                    <option value="1">Villa María</option>
                                    <option value="2">Villa Nueva</option>
                                </select>
                                <label for="localidadActualizar">Seleccione la localidad</label>
                            </div>
                            <div class="form-floating mb-3">
                                <select class="form-select" aria-label="Default select example" id="barrioActualizar">
                                    <option value="1">Barrio Centro</option>
                                    <option value="2">Barrio Mariano Moreno</option>
                                    <option value="3">Barrio Ameghino</option>
                                    <option value="4">Barrio San Juan Bautista</option>
                                    <option value="5">Barrio Palermo</option>
                                </select>
                                <label for="barrioActualizar">Seleccione el barrio</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="text" id="estadoActualizar" class="form-control input" placeholder="Estado del cliente">
                                <label for="estadoActualizar">Estado del cliente</label>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="cerrar" data-bs-dismiss="modal">Cancelar</button>
                            <button type="submit" class="btn btn-success">Modificar</button>
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
                        ¿Estás seguro que deseas borrar este registro?
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
        tablaCliente(columnas, datosClientes);
    } catch (error) {
        console.error('Error al obtener los datos de clientes:', error);
    }

    document.getElementById('formAgregarCliente').addEventListener('submit', async function (event) {
        event.preventDefault();
    
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
                alert('Cliente agregado con éxito');
                const modalActualizar = bootstrap.Modal.getInstance(document.getElementById('agregarCliente'));
                modalActualizar.hide();
                await getClientes();
            } else {
                alert('Hubo un error al agregar el cliente');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        getClientes();
    });

    document.getElementById('actualizarCliente').addEventListener('submit', async function (event) {
        event.preventDefault();
    
        const id_Cliente = document.getElementById('actualizarCliente').getAttribute('data-id');
        
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
                alert('Cliente actualizado con éxito');
                const modalActualizar = bootstrap.Modal.getInstance(document.getElementById('actualizarCliente'));
                modalActualizar.hide();
                await getClientes();
            } else {
                alert('Error al actualizar el cliente');
            }
        } catch (error) {
            console.error('Error al actualizar el cliente:', error);
        }
    });

    function filtrarTabla() {
        const input = document.getElementById('filtroNombre').value.toLowerCase(); 
        const filtroEstado = document.getElementById('filtroEstado').value.toLowerCase(); 
        const filas = document.querySelectorAll('#tablaClientes tbody tr');
        filas.forEach(fila => {
          const nombre = fila.cells[1].textContent.toLowerCase();
          const estado = fila.cells[8].textContent.toLowerCase();
          const coincideNombre = input === '' || nombre.includes(input);
          const coincideEstado = filtroEstado === 'todos' || estado === filtroEstado;
    
          if (coincideNombre && coincideEstado) {
            fila.style.display = ''; 
          } else {
            fila.style.display = 'none'; 
          }
        });
      }
      
    document.getElementById('filtroNombre').addEventListener('input', filtrarTabla);
    document.getElementById('filtroEstado').addEventListener('change', filtrarTabla);
      
    borrarContenidoInputs();
});