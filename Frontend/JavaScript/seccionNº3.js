import { borrarContenidoInputs } from "./funciones.js";
import { getProveedor } from "./Services/proveedoresServices.js";

const columnas = ['ID', 'Nombre', 'Teléfono', 'Cantidad Solicitada'];

document.getElementById('proveedores').addEventListener("click", async () => {
    contenedorPrincipal.innerHTML = `
        <div class="contenedorTitulo container-fluid">
            <div>
                <h1 class="titulo">Proveedores</h1>
            </div>
            <div class="me-3 contenedorAgregarCosas">
                <span class="d-inline-block" tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-content="Disabled popover" data-bs-placement="bottom">
                    <button class="btn btn-secondary" type="button">
                        <i class="fa-solid fa-clock"></i>
                    </button>
                </span>
                <a class="btn btn-secondary agregarPedido" type="button" data-bs-toggle="modal" data-bs-target="#agregarProveedor">
                    <i class="fa-solid fa-truck"></i>
                    <i class="fa-solid fa-plus"></i>
                </a>
            </div>
        </div>
        <div class="contenedor-flex">
            <div class="primeraCaja shadow-lg p-3 container">
                <h2 class="h2 text-center">Proveedores</h2>
                <div class="cajaTabla container table-responsive table-responsive-vertical"></div>
            </div>
        </div>
        <div class="modal" data-bs-theme="dark" id="agregarProveedor" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content modal2">
                    <div class="modal-header">
                        <h5 class="modal-title">Agregar nuevo proveedor</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form>
                        <div class="modal-body">
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control input" placeholder="Nombre">
                                <label for="floatingInput">Nombre del proveedor</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="number" class="form-control input" placeholder="Apellido">
                                <label for="floatingPassword">Teléfono</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="number" class="form-control input" placeholder="D.N.I.">
                                <label for="floatingPassword">Dirección</label>
                            </div>
                            <div class="form-floating mb-3">
                                <select class="form-select" aria-label="Default select example" id="select">
                                    <option selected></option>
                                    <option value="1">Villa María</option>
                                    <option value="2">Villa Nueva</option>
                                </select>
                                <label for="floatingSelect">Seleccione la localidad</label>
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
        <div class="modal" data-bs-theme="dark" id="actualizarProveedor" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content modal2">
                    <form>
                        <div class="modal-header">
                            <h5 class="modal-title">Actualizar datos del proveedor</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control input" placeholder="Nombre">
                                <label for="floatingInput">Nombre del proveedor</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="number" class="form-control input" placeholder="Apellido">
                                <label for="floatingPassword">Teléfono</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="number" class="form-control input" placeholder="D.N.I.">
                                <label for="floatingPassword">Dirección</label>
                            </div>
                            <div class="form-floating mb-3">
                                <select class="form-select" aria-label="Default select example" id="select">
                                    <option selected></option>
                                    <option value="1">Villa María</option>
                                    <option value="2">Villa Nueva</option>
                                </select>
                                <label for="floatingSelect">Seleccione la localidad</label>
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
`;
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

    try {
        const datosProveedores = await getProveedor();
        const proveedoresFiltrados = Array.isArray(datosProveedores) ? datosProveedores[0] : datosProveedores;
    } catch (error) {
        console.error('Error al obtener los datos de clientes:', error);
    }
    borrarContenidoInputs();
});
