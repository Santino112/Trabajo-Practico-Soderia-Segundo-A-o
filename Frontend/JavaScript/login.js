document.getElementById("formularioValidacion").addEventListener("submit", async (e) => {
    e.preventDefault();
    const usuario = document.getElementById("usuario").value;
    const contraseña = document.getElementById("password").value;

    try {
        const res = await fetch("http://localhost:4000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ usuario, contraseña: contraseña }),
        });

        if (res.ok) {
            alert("Inicio de sesión exitoso");
            window.location.href = "/Frontend/HTML/aplicacionAdministrador.html";
        } else {
            alert("Usuario o contraseña incorrectos.");
        }
    } catch (error) {
        console.error("Error durante el inicio de sesión:", error);
        alert("Ocurrió un error. Intente nuevamente.");
    }
});

(() => {
    'use strict'

    const forms = document.querySelectorAll('.needs-validation')
  
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
})()
