import { borrarContenidoInputs} from "./funciones.js";
import { getProductos } from "./Services/inventario.Services.js";

const columnas = ['ID', 'Nombre', 'Stock', 'Descripción', 'Capacidad', 'Precio', 'Maquina'];

document.getElementById('inventario').addEventListener("click", async () => {
    contenedorPrincipal.innerHTML = `
        <div class="contenedorTitulo container-fluid">
            <div>
                <h1 class="titulo">Inventario</h1>
            </div>
            <div class="me-3 contenedorAgregarCosas">
                <span class="d-inline-block" tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-content="Disabled popover" data-bs-placement="bottom">
                    <button class="btn btn-secondary" type="button">
                        <i class="fa-solid fa-clock"></i>
                    </button>
                </span>
                <a class="btn btn-secondary agregarProducto" type="button" data-bs-toggle="modal" data-bs-target="#agregarProducto">
                    <i class="fa-solid fa-box"></i>
                    <i class="fa-solid fa-plus"></i>
                </a>
            </div>
        </div>
        <div class="contenedor-flex">
            <div class="primeraCaja shadow-lg p-3 container">
                <h2 class="h2 text-center">Productos</h2>
                <div class="cajaTabla container table-responsive table-responsive-vertical"></div>
            </div>
        </div>
        <div class="modal" data-bs-theme="dark" id="agregarProducto" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content modal2">
                    <div class="modal-header">
                        <h5 class="modal-title">Agregar nuevo producto</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form>
                        <div class="modal-body">
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control input" placeholder="Cliente">
                                <label for="floatingInput">Nombre del producto</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control input" placeholder="Detalle del pedido">
                                <label for="floatingInput1">Descripción</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="number" class="form-control input" placeholder="Fecha de creación">
                                <label for="floatingInput2">Stock</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="number" class="form-control input" placeholder="Fecha de entrega">
                                <label for="floatingInput3">Precio unitario</label>
                            </div>
                            <div class="form-floating mb-3">
                                <select class="form-select" aria-label="Default select example" id="select">
                                    <option selected></option>
                                    <option value="1">Habilitada</option>
                                    <option value="2">Deshabilitada</option>
                                </select>
                                <label for="select">Maquinaria</label>
                            </div>
                            <div class="form-floating mb-3">
                                <select class="form-select" aria-label="Default select example" id="select">
                                    <option selected></option>
                                    <option value="1">Habilitados</option>
                                    <option value="2">Deshabilitados</option>
                                </select>
                                <label for="select">Insumos</label>
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
        <div class="modal" data-bs-theme="dark" id="actualizarProductos" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content modal2">
                    <form>
                        <div class="modal-header">
                            <h5 class="modal-title">Actualizar datos del producto</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                              <div class="form-floating mb-3">
                                <input type="text" class="form-control input" placeholder="Cliente">
                                <label for="floatingInput">Nombre del producto</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control input" placeholder="Detalle del pedido">
                                <label for="floatingInput1">Descripción</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="number" class="form-control input" placeholder="Fecha de creación">
                                <label for="floatingInput2">Stock</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="number" class="form-control input" placeholder="Fecha de entrega">
                                <label for="floatingInput3">Precio unitario</label>
                            </div>
                            <div class="form-floating mb-3">
                                <select class="form-select" aria-label="Default select example" id="select">
                                    <option selected></option>
                                    <option value="1">Habilitada</option>
                                    <option value="2">Deshabilitada</option>
                                </select>
                                <label for="select">Maquinaria</label>
                            </div>
                            <div class="form-floating mb-3">
                                <select class="form-select" aria-label="Default select example" id="select">
                                    <option selected></option>
                                    <option value="1">Habilitados</option>
                                    <option value="2">Deshabilitados</option>
                                </select>
                                <label for="select">Insumos</label>
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
        <div class="modal" id="quitarProducto" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content modal1">
                    <div class="modal-header">
                        <h5 class="modal-title">Quitar producto</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ¿Estás seguro de quitar este producto?
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
        const datosProductos = await getProductos();
        const productosFiltrados = Array.isArray(datosProductos) ? datosProductos[0] : datosProductos;
    } catch (error) {
        console.error('Error al obtener los datos de clientes:', error);
    }
    borrarContenidoInputs();
});