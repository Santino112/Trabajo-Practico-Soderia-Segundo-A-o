import { getBarrio } from "./Services/proveedoresServices.js";

const columnas = ['ID', 'Nombre','Número de clientes'];

async function countClients(filtrado) {
    try {
        const res = await fetch("http://localhost:4000/cliente/contador");
        filtrado = await res.json();
        const count = document.getElementById("client-count");
        filtrado.forEach(cliente => {
            count.innerText = cliente.total_clientes;
        });
    } catch (error) {
        console.error("Error al obtener el número de clientes:", error);
    }
}

const tablaBarrio = (barrioColumnas, datos = []) => {
    const cajaTabla = document.querySelector('.cajaTabla');

    let tabla = `  
        <table class="table tabla table-striped table-dark table-borderless table-hover shadow-lg p-3" id="tablaBarrios">
            <thead>
                <tr>
    `;

    barrioColumnas.forEach(barrioColumnas => {
        tabla += `<th>${barrioColumnas}</th>`;
    });

    tabla += `</tr></thead><tbody>`; 

    datos.forEach(fila => {
        tabla += `
            <tr>
                <td>${fila.id_Barrio}</td>
                <td>${fila.nombreBarrio}</td>
                <td>${fila.cantClientes}</td>
            </tr>
        `;
    });

    tabla += `</tbody></table>`;

    cajaTabla.innerHTML = tabla;
};

document.getElementById('barrios').addEventListener("click", async () => {

    contenedorPrincipal.innerHTML = `
    <div class="contenedorTitulo container-fluid">
        <div>
            <h1 class="titulo">Barrios</h1>
        </div>
        <div class="me-3 contenedorAgregarCosas">
            <span class="d-inline-block" tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-content="Disabled popover" data-bs-placement="bottom">
                <button class="btn btn-secondary" type="button">
                    <i class="fa-solid fa-clock"></i>
                </button>
            </span>
        </div>
    </div>
        <div class="contenedor-flex">
            <div class="primeraCaja shadow-lg p-3 container">
                <div class="contenedorEncabezado">
                    <h2 class="h2">Listado de Barrios</h2>
                    <div class="input-group">
                        <span class="input-group-text" id="inputGroup-sizing-default">
                            <i class="bi bi-database-fill"></i>
                        </span>
                        <input type="text" class="form-control" id="filtrarBarrio" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" placeholder="Buscar por barrio">
                    </div>
                    <div class="input-group">
                        <span class="input-group-text" id="inputGroup-sizing-default">
                            <i class="bi bi-clock"></i>
                        </span>
                        <span class="input-group-text" id="inputGroup-sizing-default">
                            Cantidad de clientes:
                            <p id="client-count"><p>
                        </span>
                    </div>
                </div>
            <div class="b-example-divider"></div>
            <div class="cajaTabla container table-responsive-sm table-responsive-vertical"></div>
        </div>
    </div>
`;
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

    try {
        const datosBarrio = await getBarrio();
        const datosConteo = await countClients();
        const barriosFiltrados = Array.isArray(datosBarrio) ? datosBarrio[0] : datosBarrio;
        const conteoFiltrado = Array.isArray(datosConteo) ? datosConteo[0] : datosConteo;
        countClients(conteoFiltrado);
        tablaBarrio(columnas, barriosFiltrados);
    } catch (error) {
        console.error('Error al obtener los datos del pedido:', error);
    }

    document.getElementById('filtrarBarrio').addEventListener('input', function () {
        const input = this.value.toLowerCase();
        const filas = document.querySelectorAll('#tablaBarrios tbody tr');
      
        filas.forEach(fila => {
          const nombre = fila.cells[1].textContent.toLowerCase();
          if (nombre.includes(input)) {
            fila.style.display = '';
          } else {
            fila.style.display = 'none';
          }
        });
    });

});



