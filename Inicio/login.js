const contenedor = document.querySelector('.contenedor-principal');
const linkLogin = document.querySelector('.linkLogin');
const linkRegistro = document.querySelector('.linkRegistro');

// alternar clase activa según el enlace pulsado
linkRegistro.addEventListener('click', (e) => {
    e.preventDefault();
    contenedor.classList.add('active');
});

linkLogin.addEventListener('click', (e) => {
    e.preventDefault();
    contenedor.classList.remove('active');
});

// mostrar / ocultar contraseña
document.querySelectorAll('.ver-contrasena').forEach(icono => {

    icono.addEventListener('click', function () {

        const idObjetivo = this.getAttribute('data-target');
        const input = document.getElementById(idObjetivo);

        if (input.type === 'password') {

            input.type = 'text';
            this.classList.remove('fa-eye');
            this.classList.add('fa-eye-slash');

        } else {

            input.type = 'password';
            this.classList.remove('fa-eye-slash');
            this.classList.add('fa-eye');

        }

    });

});

// botón iniciar sesión → ir a la página principal
document
    .querySelector('.caja-formulario.iniciar-sesion form')
    .addEventListener('submit', (e) => {

        e.preventDefault();

        const usuario = document.getElementById('usuarioLogin').value;
        const contrasena = document.getElementById('contrasenaLogin').value;
        const msgError = document.getElementById('msgLoginError');

        // Simulación de validación (puedes ajustar las credenciales correctas)
        if (usuario === "admin@gmail.com" && contrasena === "admin123") {
            window.location.href = '../Home/index.html';
        } else {
            msgError.innerHTML = "correo electronico incorrecto o contraseña incorrecta";
            msgError.classList.add('visible');
            
            // Opcional: remover el mensaje después de unos segundos
            setTimeout(() => {
                msgError.classList.remove('visible');
            }, 3000);
        }

    });


// MODAL RECUPERAR CONTRASEÑA

let modal = document.getElementById("modal")
let abrirModal = document.getElementById("abrirModal")
let cerrarModal = document.getElementById("cerrar")

let telefonoRecuperacion = document.getElementById("telefonoRecuperacion")
let codigoRecuperacion = document.getElementById("codigoRecuperacion")

let enviarCodigo = document.getElementById("enviarCodigo")
let recuperarCuenta = document.getElementById("recuperarCuenta")

let mensaje = document.getElementById("mensaje")

let codigoGenerado = ""

abrirModal.addEventListener("click", function (e) {

    e.preventDefault()
    modal.style.display = "flex"

})

cerrarModal.onclick = () => {

    modal.style.display = "none"

}

enviarCodigo.onclick = () => {

    if (telefonoRecuperacion.value.length < 10) {

        mensaje.innerHTML = "Ingresa un teléfono válido"
        mensaje.style.color = "red"
        return

    }

    codigoGenerado = Math.floor(1000 + Math.random() * 9000)

    mensaje.innerHTML = "Código enviado: " + codigoGenerado
    mensaje.style.color = "green"

}

// MODAL CAMBIAR CONTRASEÑA
let modalCambio = document.getElementById("modalCambio");
let cerrarCambio = document.getElementById("cerrarCambio");
let guardarContrasena = document.getElementById("guardarContrasena");
let nuevaContrasena = document.getElementById("nuevaContrasena");
let confirmarContrasenaNueva = document.getElementById("confirmarContrasenaNueva");
let mensajeCambio = document.getElementById("mensajeCambio");

// Al hacer clic en "Recuperar" en el primer modal
recuperarCuenta.onclick = () => {
    if (codigoRecuperacion.value == codigoGenerado && codigoGenerado !== "") {
        // Cerrar primer modal y abrir el segundo
        modal.style.display = "none";
        modalCambio.style.display = "flex";
    } else {
        mensaje.innerHTML = "Código incorrecto";
        mensaje.style.color = "red";
    }
}

cerrarCambio.onclick = () => {
    modalCambio.style.display = "none";
}

guardarContrasena.onclick = () => {
    if (nuevaContrasena.value === "" || confirmarContrasenaNueva.value === "") {
        mensajeCambio.innerHTML = "Por favor, completa ambos campos";
        mensajeCambio.style.color = "red";
        return;
    }

    if (nuevaContrasena.value === confirmarContrasenaNueva.value) {
        mensajeCambio.innerHTML = "¡Contraseña guardada con éxito!";
        mensajeCambio.style.color = "green";

        // Esperar un momento y volver al login
        setTimeout(() => {
            modalCambio.style.display = "none";
            contenedor.classList.remove('active'); // Volver al formulario de login

            // Limpiar campos
            nuevaContrasena.value = "";
            confirmarContrasenaNueva.value = "";
            mensajeCambio.innerHTML = "";
            telefonoRecuperacion.value = "";
            codigoRecuperacion.value = "";
            mensaje.innerHTML = "";
        }, 2000);

    } else {
        mensajeCambio.innerHTML = "Las contraseñas no coinciden";
        mensajeCambio.style.color = "red";
    }
}

// MODAL TÉRMINOS Y CONDICIONES
let formRegistro = document.getElementById("formRegistro");
let modalTerminos = document.getElementById("modalTerminos");
let cerrarTerminos = document.getElementById("cerrarTerminos");
let irTerminos = document.getElementById("irTerminos");
let aceptarTerminos = document.getElementById("aceptarTerminos");

// Referencias a los campos de contraseña para validación de coincidencia
const inputPass = document.getElementById('contrasenaRegistro');
const inputConfirm = document.getElementById('confirmarContrasena');
const msgConfirmar = document.getElementById('msgConfirmar');

if (formRegistro) {
    formRegistro.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validar que las contraseñas coincidan antes de abrir el modal
        if (inputPass.value !== inputConfirm.value) {
            msgConfirmar.innerHTML = "contraseña incorrecta";
            msgConfirmar.classList.add('visible');
            inputConfirm.classList.add('input-match-error');
            return; // Detener la ejecución
        }

        // Si coinciden, mostrar el modal de términos
        modalTerminos.style.display = "flex";
    });
}

cerrarTerminos.onclick = () => {
    modalTerminos.style.display = "none";
}

irTerminos.onclick = () => {
    window.open('https://drive.google.com/file/d/1LDMwHP17uk0EQeWfHzdFQlBD7sItk1q5/view?usp=drive_link', '_blank');
}

aceptarTerminos.onclick = () => {
    modalTerminos.style.display = "none";
    // Después de aceptar, enviamos al usuario al login
    contenedor.classList.remove('active');

    // Opcional: Limpiar el formulario de registro
    if (formRegistro) formRegistro.reset();
}

// ─── CERRAR MODALES AL HACER CLIC EN EL FONDO (BACKDROP) ───
// El evento se dispara sobre el .modal (fondo oscuro); si el clic es exactamente
// sobre ese elemento (y no sobre el .contenedor-modal interior) se cierra el modal.

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

modalCambio.addEventListener("click", (e) => {
    if (e.target === modalCambio) {
        modalCambio.style.display = "none";
    }
});

modalTerminos.addEventListener("click", (e) => {
    if (e.target === modalTerminos) {
        modalTerminos.style.display = "none";
    }
});

// ----------------------------------------------------
// OAUTH: AUTENTICACIÓN CON GOOGLE IDENTITY SERVICES
// ----------------------------------------------------

function manejarRespuestaGoogle(response) {
    // Cuando el usuario se loguea exitosamente, Google devuelve un JWT (JSON Web Token)
    console.log("Token JWT de Google recibido: ", response.credential);

    // Podemos decodificar la carga útil (payload) del JWT en el frontend para obtener la información básica
    const payloadCentral = response.credential.split('.')[1];
    // Decodifica la información base64
    const datosUsuario = JSON.parse(atob(payloadCentral.replace(/-/g, '+').replace(/_/g, '/')));

    console.log("Datos del usuario extraídos: ", datosUsuario);
    alert(`¡Autenticación Exitosa!\n\nNombre: ${datosUsuario.name}\nCorreo: ${datosUsuario.email}\n\nRevisa la consola (F12) para ver la información técnica.`);

    // A partir de aquí:
    // 1. Podrías redirigir al dashboard: window.location.href = '../Home/index.html';
    // 2. Idealmente, deberías enviar el token JWT (response.credential) a tu Backend 
    //    para validarlo de forma segura antes de crearle la sesión en el servidor.
}

// Renderizar el botón y conectar credenciales al cargar la página
window.onload = function () {
    // Asegurarnos de que el script de google cargó correctamente en el HTML
    if (typeof google !== 'undefined') {
        // 1. Inicializamos Google Identity Services
        google.accounts.id.initialize({
            // IMPORTANTE: Debes crear un proyecto en Google Cloud Console,
            // sacar el Client ID y pegarlo justo abajo:
            client_id: "974551337428-q7e12ec8pefdugqfacujmderj5ov126u.apps.googleusercontent.com",
            callback: manejarRespuestaGoogle
        });

        // 2. Renderizamos el botón oficial en la vista de Registro
        let divContenedorRegistro = document.getElementById("googleBtnDiv");
        if (divContenedorRegistro) {
            google.accounts.id.renderButton(
                divContenedorRegistro,
                { theme: "filled_black", size: "large", shape: "pill", text: "continue_with", width: 240 }
            );
        }

        // 3. Renderizamos el botón oficial en la vista de Iniciar Sesión (Login)
        let divContenedorLogin = document.getElementById("googleBtnDivLogin");
        if (divContenedorLogin) {
            google.accounts.id.renderButton(
                divContenedorLogin,
                { theme: "filled_black", size: "large", shape: "pill", text: "continue_with", width: 240 }
            );
        }

        // Opcional: Llama a google.accounts.id.prompt() si deseas el menú flotante "One Tap" en la esquina.
        // google.accounts.id.prompt();
    }
};

// ----------------------------------------------------
// VALIDACIÓN DE FORTALEZA DE CONTRASEÑA
// ----------------------------------------------------

const passwordInput = document.getElementById('contrasenaRegistro');
const textoFortaleza = document.getElementById('textoFortaleza');
const progresoFortaleza = document.getElementById('progresoFortaleza');

if (passwordInput && textoFortaleza && progresoFortaleza) {
    passwordInput.addEventListener('input', () => {
        const val = passwordInput.value;
        const iconoPassword = passwordInput.parentElement.querySelector('.ver-contrasena');
        let score = 0;

        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[a-z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;

        // Reset classes
        textoFortaleza.classList.remove('baja', 'media', 'alta');
        progresoFortaleza.classList.remove('bg-baja', 'bg-media', 'bg-alta');
        passwordInput.classList.remove('input-baja', 'input-media', 'input-alta');
        if (iconoPassword) iconoPassword.classList.remove('icon-baja', 'icon-media', 'icon-alta');

        if (val === "") {
            textoFortaleza.innerHTML = "Baja";
            progresoFortaleza.style.width = "0%";
            return;
        }

        if (score <= 2) {
            textoFortaleza.innerHTML = "Baja";
            textoFortaleza.classList.add('baja');
            progresoFortaleza.style.width = "33%";
            progresoFortaleza.classList.add('bg-baja');
            passwordInput.classList.add('input-baja');
            if (iconoPassword) iconoPassword.classList.add('icon-baja');
        } else if (score <= 4) {
            textoFortaleza.innerHTML = "Media";
            textoFortaleza.classList.add('media');
            progresoFortaleza.style.width = "66%";
            progresoFortaleza.classList.add('bg-media');
            passwordInput.classList.add('input-media');
            if (iconoPassword) iconoPassword.classList.add('icon-media');
        } else {
            textoFortaleza.innerHTML = "Segura";
            textoFortaleza.classList.add('alta');
            progresoFortaleza.style.width = "100%";
            progresoFortaleza.classList.add('bg-alta');
            passwordInput.classList.add('input-alta');
            if (iconoPassword) iconoPassword.classList.add('icon-alta');
        }
    });

}

// ----------------------------------------------------
// VALIDACIÓN DE COINCIDENCIA DE CONTRASEÑA
// ----------------------------------------------------

if (inputConfirm) {
    inputConfirm.addEventListener('input', () => {
        if (inputConfirm.value === "") {
            msgConfirmar.innerHTML = "";
            msgConfirmar.classList.remove('visible');
            inputConfirm.classList.remove('input-match-error');
        } else if (inputConfirm.value === inputPass.value) {
            msgConfirmar.innerHTML = "";
            msgConfirmar.classList.remove('visible');
            inputConfirm.classList.remove('input-match-error');
        } else {
            msgConfirmar.innerHTML = "contraseña incorrecta";
            msgConfirmar.classList.add('visible');
            inputConfirm.classList.add('input-match-error');
        }
    });
}