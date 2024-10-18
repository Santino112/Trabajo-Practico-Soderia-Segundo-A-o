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


