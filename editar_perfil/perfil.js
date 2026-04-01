/* JS del Perfil - Pesa tus pesos */

document.addEventListener('DOMContentLoaded', () => {
    // Elementos
    const btnCambiarFoto = document.getElementById('btn-cambiar-foto');
    const btnEliminarFoto = document.getElementById('btn-eliminar-foto');
    const entradaFoto = document.getElementById('entrada-foto');
    const vistaPreviaFoto = document.getElementById('vista-previa-foto');
    
    const formularioPersonal = document.getElementById('formulario-info-personal');
    const formularioContrasena = document.getElementById('formulario-contrasena');

    // Avatar por defecto
    const AVATAR_POR_DEFECTO = 'img/hucha.png';

    // --- Acciones de la Foto ---
    
    // Asegurar que la vista previa use el avatar por defecto al iniciar si no hay otra
    if (!vistaPreviaFoto.src || vistaPreviaFoto.src.includes('placeholder')) {
        vistaPreviaFoto.src = AVATAR_POR_DEFECTO;
    }

    btnCambiarFoto.addEventListener('click', () => {
        entradaFoto.click();
    });

    entradaFoto.addEventListener('change', (evento) => {
        const archivo = evento.target.files[0];
        if (archivo) {
            const lector = new FileReader();
            lector.onload = (e) => {
                vistaPreviaFoto.src = e.target.result;
            };
            lector.readAsDataURL(archivo);
        }
    });

    btnEliminarFoto.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas eliminar tu foto de perfil?')) {
            vistaPreviaFoto.src = AVATAR_POR_DEFECTO;
            entradaFoto.value = ''; // Limpiar entrada
        }
    });

    // --- Visibilidad de Contraseña ---
    
    const botonesAlternar = document.querySelectorAll('.btn-alternar-contrasena');
    botonesAlternar.forEach(boton => {
        boton.addEventListener('click', () => {
            const idObjetivo = boton.getAttribute('data-objetivo');
            const entrada = document.getElementById(idObjetivo);
            const icono = boton.querySelector('img');

            if (entrada.type === 'password') {
                entrada.type = 'text';
                icono.src = 'https://api.iconify.design/lucide:eye-off.svg';
                icono.alt = 'Ocultar';
            } else {
                entrada.type = 'password';
                icono.src = 'https://api.iconify.design/lucide:eye.svg';
                icono.alt = 'Mostrar';
            }
        });
    });

    // --- Envíos de Formulario ---

    formularioPersonal.addEventListener('submit', (evento) => {
        evento.preventDefault();
        
        // Simulando operación de guardado
        const botonGuardar = formularioPersonal.querySelector('.boton-guardar');
        const textoOriginal = botonGuardar.innerText;
        
        botonGuardar.disabled = true;
        botonGuardar.innerText = 'Guardando...';

        setTimeout(() => {
            alert('¡Información personal actualizada con éxito!');
            botonGuardar.disabled = false;
            botonGuardar.innerText = textoOriginal;
        }, 1000);
    });

    formularioContrasena.addEventListener('submit', (evento) => {
        evento.preventDefault();
        
        const passNueva = document.getElementById('pass-nueva').value;
        const passConfirmar = document.getElementById('pass-confirmar').value;

        if (passNueva !== passConfirmar) {
            alert('Las contraseñas no coinciden. Por favor, verifica de nuevo.');
            return;
        }

        if (passNueva.length < 8 && passNueva.length > 0) {
            alert('La nueva contraseña debe tener al menos 8 caracteres.');
            return;
        }

        // Simulando actualización de contraseña
        const botonActualizar = formularioContrasena.querySelector('.boton-principal');
        const textoOriginal = botonActualizar.innerText;
        
        botonActualizar.disabled = true;
        botonActualizar.innerText = 'Actualizando...';

        setTimeout(() => {
            alert('¡Contraseña actualizada con éxito!');
            formularioContrasena.reset();
            // Resetear iconos a "ojo"
            botonesAlternar.forEach(b => {
                const objetivo = document.getElementById(b.getAttribute('data-objetivo'));
                objetivo.type = 'password';
                b.querySelector('img').src = 'https://api.iconify.design/lucide:eye.svg';
            });
            botonActualizar.disabled = false;
            botonActualizar.innerText = textoOriginal;
        }, 1200);
    });
});
