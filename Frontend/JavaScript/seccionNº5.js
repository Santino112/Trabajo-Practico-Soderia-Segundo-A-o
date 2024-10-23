import { borrarContenidoInputs} from "./funciones.js";
import { getRutaEntrega } from "./Services/rutasDeEntregaServices.js";

const columnas = ['ID', 'Estado', 'Pedido'];

document.getElementById('rutasEntrega').addEventListener("click", async () => {
    contenedorPrincipal.innerHTML = `
        <div class="contenedorTitulo container-fluid">
            <div>
                <h1 class="titulo">Rutas de entrega</h1>
            </div>
            <div class="me-3 contenedorAgregarCosas">
                <span class="d-inline-block" tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-content="Disabled popover" data-bs-placement="bottom">
                    <button class="btn btn-secondary" type="button">
                        <i class="fa-solid fa-clock"></i>
                    </button>
                </span>
                <a class="btn btn-secondary agregarRutaEntrega" type="button" data-bs-toggle="modal" data-bs-target="#agregarRutaEntrega">
                    <i class="fa-solid fa-route"></i>
                    <i class="fa-solid fa-plus"></i>
                </a>
            </div>
        </div>
        <div class="contenedor-flex">
            <div class="primeraCaja shadow-lg p-3 container">
                <h2 class="h2 text-center">Rutas de entrega</h2>
                <div class="cajaTabla container table-responsive table-responsive-vertical"></div>
            </div>
        </div>
        <div class="modal" data-bs-theme="dark" id="agregarRutaEntrega" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content modal2">
                    <div class="modal-header">
                        <h5 class="modal-title">Agregar nueva ruta de entrega</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form>
                        <div class="modal-body">
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control input" placeholder="Nombre">
                                <label for="floatingInput">Recorrido</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="date" class="form-control input" placeholder="Apellido">
                                <label for="floatingPassword">Fecha diaria del recorrido</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="number" class="form-control input" placeholder="D.N.I.">
                                <label for="floatingPassword">Tiempo estimado</label>
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
        <div class="modal" id="quitarRutaEntrega" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content modal1">
                    <div class="modal-header">
                        <h5 class="modal-title">Quitar ruta de entrega</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ¿Estás seguro de quitar esta ruta de entrega?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-primary">Aceptar</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="map-container">
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13185.007139523024!2d-63.2401!3d-32.4075!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95cd621db21fc8d1%3A0x47c2a8ed143c17ac!2sVilla%20Mar%C3%ADa%2C%20C%C3%B3rdoba%2C%20Argentina!5e0!3m2!1ses-419!2s!4v1692800252677!5m2!1ses-419!2s"
                allowfullscreen=""
                loading="lazy">
            </iframe>
        </div>
    `;
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

    try {
        const datosRutas = await getRutaEntrega();
        const rutasFiltrados = Array.isArray(datosRutas) ? datosRutas[0] : datosRutas;
    } catch (error) {
        console.error('Error al obtener los datos de clientes:', error);
    }
    borrarContenidoInputs();
});
