import { getPedidos } from "./Services/pedidosServices.js";
import { borrarContenidoInputs} from "./funciones.js";

const columnas = ['ID', 'Fecha', 'Total', 'Estado', 'Dias', 'frecuencia'];

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
                <div class="segundaCaja shadow-lg p-3 container">
                    <h2 class="h2 text-center h2Derecha">Ventas realizadas</h2>
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
                        <form>
                            <div class="modal-body">
                                <div class="form-floating mb-3">
                                    <input type="text" class="form-control input" placeholder="Cliente">
                                    <label for="floatingInput">Cliente</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="text" class="form-control input" placeholder="Detalle del pedido">
                                    <label for="floatingInput1">Detalle del pedido</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="date" class="form-control input" placeholder="Fecha de creación">
                                    <label for="floatingInput2">Fecha de creación</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="date" class="form-control input" placeholder="Fecha de entrega">
                                    <label for="floatingInput3">Fecha de entrega</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="number" class="form-control input" placeholder="Dirección">
                                    <label for="floatingInput4">Dirección</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="text" class="form-control input"placeholder="Recorrido">
                                    <label for="floatingInput4">Recorrido</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <select class="form-select" aria-label="Default select example" id="select">
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
                                    <input type="text" class="form-control input" placeholder="Cliente">
                                    <label for="floatingInput">Cliente</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="text" class="form-control input" placeholder="Detalle del pedido">
                                    <label for="floatingInput1">Detalle del pedido</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="date" class="form-control input" placeholder="Fecha de creación">
                                    <label for="floatingInput2">Fecha de creación</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="date" class="form-control input" placeholder="Fecha de entrega">
                                    <label for="floatingInput3">Fecha de entrega</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="number" class="form-control input" placeholder="Dirección">
                                    <label for="floatingInput4">Dirección</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="text" class="form-control input" placeholder="Recorrido">
                                    <label for="floatingInput4">Recorrido</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <select class="form-select" aria-label="Default select example" id="select">
                                        <option selected></option>
                                        <option value="1">Hilux</option>
                                        <option value="2">Trafic</option>
                                    </select>
                                    <label for="select">Seleccione el transporte</label>
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
    } catch (error) {
        console.error('Error al obtener los datos de clientes:', error);
    }
    borrarContenidoInputs();
});