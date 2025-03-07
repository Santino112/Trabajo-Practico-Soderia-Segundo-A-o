document.addEventListener("DOMContentLoaded", () => {
    cargarBarrios();  // Llamamos a la función para cargar los barrios
    // Llamamos a la función para actualizar los resultados según el filtro
    document.getElementById("filtroBarrio").addEventListener("change", filtrarBarrios);
    // Llamamos a la función para cargar el total de clientes
    cargarTotalClientes();
});

async function cargarBarrios() {
    const res = await fetch("http://localhost:4000/Barrio");
    const data = await res.json();
    const barrios = data[0];  // Aseguramos que estamos accediendo al array correcto

    // Obtener el select y agregar los barrios
    const select = document.getElementById("filtroBarrio");
    select.innerHTML = '<option value="">Seleccione un barrio</option>'; // Limpiar el select antes de agregar

    barrios.forEach(barrio => {
        const option = document.createElement("option");
        option.value = barrio.id_Barrio;
        option.textContent = barrio.nombreBarrio;
        select.appendChild(option);
    });

    // Mostrar los barrios inicialmente en la tabla
    mostrarBarrios(barrios);
}

async function filtrarBarrios() {
    const barrioSeleccionado = document.getElementById("filtroBarrio").value;  // Obtener el barrio seleccionado
    const res = await fetch("http://localhost:4000/Barrio");
    const data = await res.json();
    const barrios = data[0];  // Asegúrate de que estás accediendo al array correcto

    let barriosFiltrados;

    if (barrioSeleccionado) {
        // Filtrar barrios si se seleccionó un barrio
        barriosFiltrados = barrios.filter(barrio => barrio.id_Barrio == barrioSeleccionado);
    } else {
        // Si no se seleccionó ningún barrio, mostramos todos los barrios
        barriosFiltrados = barrios;
    }

    // Mostrar los barrios filtrados en la tabla
    mostrarBarrios(barriosFiltrados);
}

function mostrarBarrios(barrios) {
    const tablaBarrioBody = document.querySelector('#tablaBarrio tbody');
    tablaBarrioBody.innerHTML = '';  // Limpiar la tabla antes de agregar los datos

    barrios.forEach(barrio => {
        const row = document.createElement('tr');
        
        // Crear las celdas para cada barrio
        row.innerHTML = `
            <td>${barrio.id_Barrio}</td>
            <td>${barrio.nombreBarrio}</td>
            <td>${barrio.cantidadClientes}</td> <!-- Muestra la cantidad de clientes -->
        `;

        tablaBarrioBody.appendChild(row);  // Añadir la fila a la tabla
    });
}

// Nueva función para cargar el total de clientes
async function cargarTotalClientes() {
    const res = await fetch("http://localhost:4000/TotalClientes");
    const data = await res.json();
    const totalClientes = data[0].totalClientes;  // Obtener el total de clientes

    // Actualizar el texto del colapse con la cantidad total de clientes
    const colapseText = document.querySelector('#collapseText');
    colapseText.textContent = `La cantidad total de clientes es: ${totalClientes}`;
}



