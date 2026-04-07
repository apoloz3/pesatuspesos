/* JS del Perfil - Pesa tus pesos */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Alternar entre Paneles (Información <-> Seguridad)
    const panelInformacion = document.getElementById('panel-informacion');
    const panelSeguridad = document.getElementById('panel-seguridad');
    const botonIrASeguridad = document.getElementById('ir-a-seguridad');
    const botonRegresarPerfil = document.getElementById('regresar-a-informacion');
    const tituloEstado = document.getElementById('titulo-estado');
    const botonVolverHeader = document.getElementById('boton-volver');

    if (botonIrASeguridad && panelInformacion && panelSeguridad) {
        botonIrASeguridad.addEventListener('click', () => {
            panelInformacion.style.display = 'none';
            panelSeguridad.style.display = 'grid';
            panelSeguridad.style.opacity = '1';
            panelSeguridad.style.transform = 'translateY(0)';
            if (tituloEstado) tituloEstado.textContent = 'Seguridad de la Cuenta';
            if (botonVolverHeader) botonVolverHeader.style.display = 'none'; 
        });
    }

    if (botonRegresarPerfil && panelInformacion && panelSeguridad) {
        botonRegresarPerfil.addEventListener('click', () => {
            panelSeguridad.style.display = 'none';
            panelInformacion.style.display = 'grid';
            if (tituloEstado) tituloEstado.textContent = 'Configuración de Perfil';
            if (botonVolverHeader) botonVolverHeader.style.display = 'flex';
        });
    }

    // 2. Mostrar/Ocultar Contraseña (El Ojito)
    const botonesTogglePassword = document.querySelectorAll('.toggle-password');

    botonesTogglePassword.forEach(boton => {
        boton.addEventListener('click', () => {
            const input = boton.parentElement.querySelector('input');
            const icono = boton.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text'; 
                icono.classList.replace('ph-eye', 'ph-eye-slash');
            } else {
                input.type = 'password'; 
                icono.classList.replace('ph-eye-slash', 'ph-eye');
            }
        });
    });

    // 3. Notificaciones y Modales
    const modalCancelar = document.getElementById('modal-cancelar');
    const modalConfirmarSalir = document.getElementById('modal-confirmar-salir');
    const modalQuedarse = document.getElementById('modal-quedarse');
    const toastElement = document.getElementById('toast');

    // Función toast
    function mostrarToast(mensaje, tipo = 'exito') {
        if (!toastElement) return;
        toastElement.textContent = mensaje;
        toastElement.className = `toast ${tipo === 'error' ? 'error' : ''} visible`;
        setTimeout(() => {
            toastElement.classList.remove('visible');
        }, 3000);
    }

    const abrirModalCancelar = () => {
        if (modalCancelar) modalCancelar.classList.add('visible');
    };

    if (modalConfirmarSalir) {
        modalConfirmarSalir.addEventListener('click', () => {
            window.location.href = '../pagina_maestra/index.html';
        });
    }

    if (modalQuedarse) {
        modalQuedarse.addEventListener('click', () => {
            modalCancelar.classList.remove('visible');
        });
    }

    // 4. Botones de Acción (Guardar / Cancelar) - Múltiples instancias
    const botonesGuardar = document.querySelectorAll('.btn-guardar-global');
    const botonesCancelar = document.querySelectorAll('.btn-cancelar-global');

    botonesGuardar.forEach(btn => {
        btn.addEventListener('click', () => {
            const originalText = btn.textContent;
            btn.textContent = 'Guardando...';
            btn.disabled = true;

            setTimeout(() => {
                mostrarToast('¡Cambios guardados con éxito! ✓');
                btn.textContent = originalText;
                btn.disabled = false;

                // Si estamos en seguridad, volver a información tras guardar
                if (panelSeguridad && panelSeguridad.style.display !== 'none') {
                    botonRegresarPerfil.click();
                }
            }, 800);
        });
    });

    botonesCancelar.forEach(btn => {
        btn.addEventListener('click', abrirModalCancelar);
    });

    if (botonVolverHeader) {
        botonVolverHeader.addEventListener('click', abrirModalCancelar);
    }

    // 5. Gestión de Foto de Perfil
    const btnCambiarFoto = document.getElementById('btn-cambiar-foto');
    const btnEliminarFoto = document.getElementById('btn-eliminar-foto');
    const inputFoto = document.getElementById('input-foto');
    const imgPerfil = document.getElementById('foto-perfil');
    const fotoPorDefecto = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

    if (btnCambiarFoto && inputFoto) {
        btnCambiarFoto.addEventListener('click', () => {
            inputFoto.click();
        });

        inputFoto.addEventListener('change', (e) => {
            const archivo = e.target.files[0];
            if (archivo) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    imgPerfil.src = event.target.result;
                };
                reader.readAsDataURL(archivo);
            }
        });
    }

    if (btnEliminarFoto && imgPerfil) {
        btnEliminarFoto.addEventListener('click', () => {
            abrirModalCancelar(); // Podríamos usar otro modal, pero por ahora simplificamos confirmación
        });
        
        // Re-implementando eliminación simple por ahora
        btnEliminarFoto.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            if (confirm('¿Eliminar foto de perfil?')) {
                imgPerfil.src = fotoPorDefecto;
            }
        });
    }
});
