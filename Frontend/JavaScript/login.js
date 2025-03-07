document.getElementById("formularioValidacion").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("http://127.0.0.1:4000/login", {  // Cambié el puerto a 4000 (backend)
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ usuario: username, contraseña: password }),  // Cambié passwordd por contraseña
        });

        if (res.ok) {
            window.location.href = "/Frontend/HTML/aplicacionAdministrador2.html"; // Redirige a la página de inicio
        }
    } catch (error) {
        console.error("Error durante el inicio de sesión:", error);
        alert("Ocurrió un error. Intentelo nuevamente.");
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const form = document.getElementById("formularioValidacion");

    // Función de validación en tiempo real
    function validarCampo(input) {
        if (input.value.trim() === "") {
            input.classList.remove("is-valid");
            input.classList.add("is-invalid");
        } else {
            input.classList.remove("is-invalid");
            input.classList.add("is-valid");
        }
    }

    // Validación en tiempo real para el campo de username
    usernameInput.addEventListener("input", function() {
        validarCampo(usernameInput);
    });

    // Validación en tiempo real para el campo de password
    passwordInput.addEventListener("input", function() {
        validarCampo(passwordInput);
    });

    // Validación cuando se envía el formulario
    form.addEventListener("submit", function(event) {
        // Prevenir el envío del formulario para validar antes
        event.preventDefault();

        // Validamos los campos al hacer submit
        validarCampo(usernameInput);
        validarCampo(passwordInput);

        // Verificamos si hay algún campo inválido
        if (!usernameInput.classList.contains("is-invalid") && !passwordInput.classList.contains("is-invalid")) {
            const myModal = new bootstrap.Modal(document.getElementById('incioDeSesionExitoso'));
            myModal.show();
        } else {
            // Si hay errores, mostramos un mensaje (esto puede ser personalizado)
            const myModal = new bootstrap.Modal(document.getElementById('faltaDatos'));
            myModal.show();
        }
    });
});



