export const borrarContenidoInputs = () => {
    const cerrarBtn = document.querySelectorAll("#cerrar");
    cerrarBtn.forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".input").forEach(inputs => {
                inputs.value = "";
            });
            document.querySelectorAll(".form-select").forEach(select => {
                select.selectedIndex = 0;
            });
        })
    });
};

export const tablas = (nombreColumnas, datos = []) => {
    const cajaTabla = document.querySelectorAll('.cajaTabla');

    let tabla = `  
        <table class="table tabla table-striped table-dark table-borderless table-hover shadow-lg p-3">
            <thead>
                <tr>
    `;

    nombreColumnas.forEach(nombreColumna => {
        tabla += `<th>${nombreColumna}</th>`;
    });

    tabla += `<th>Acciones</th></tr></thead><tbody>`; // Corrige la etiqueta <tbody>

    datos.forEach(fila => {
        console.log(fila); // Agregado para verificar datos
        tabla += `<tr data-id="${fila.id}">`; // Asegúrate de que fila.id existe
        Object.values(fila).forEach(valor => {
            tabla += `<td>${valor}</td>`;
        });
        tabla += `
            <td>
                <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#actualizarCliente">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button type="button" class="btn btn-danger btnBorrar" data-id="${fila.id}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>`;
    });

    tabla += `</tbody></table>`;

    cajaTabla.forEach(cajaTabla => {
        cajaTabla.innerHTML = tabla;
    });

    const botonesBorrar = document.querySelectorAll('.btnBorrar');
    botonesBorrar.forEach(boton => {
        boton.addEventListener('click', function () {
            const idRegistro = this.getAttribute('data-id'); // Obtener el ID del registro
            console.log(idRegistro); // Agregado para verificar ID
            const seccionActual = cajaTabla[0].getAttribute('data-section'); // Obtener la sección actual (Clientes, Pedidos, etc.)

            // Confirmar la eliminación
            if (confirm(`¿Estás seguro de que deseas eliminar el registro con ID ${idRegistro}?`)) {
                // Aquí haces el fetch al backend, adaptando la URL según la sección actual
                fetch(`/${seccionActual}/${idRegistro}`, {  // Se envía a la ruta de la sección actual
                    method: 'DELETE'
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Eliminar la fila de la tabla si fue exitoso
                        const fila = document.querySelector(`tr[data-id="${idRegistro}"]`);
                        if (fila) fila.remove();
                        alert(`${seccionActual} eliminado con éxito.`);
                    } else {
                        alert(`Error al eliminar el ${seccionActual}.`);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        });
    });
};




