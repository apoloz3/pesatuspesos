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
            if (botonRegresarPerfil) botonRegresarPerfil.style.display = 'flex';
        });
    }

    if (botonRegresarPerfil && panelInformacion && panelSeguridad) {
        botonRegresarPerfil.addEventListener('click', () => {
            panelSeguridad.style.display = 'none';
            panelInformacion.style.display = 'grid';
            if (tituloEstado) tituloEstado.textContent = 'Configuración de Perfil';
            if (botonVolverHeader) botonVolverHeader.style.display = 'flex';
            if (botonRegresarPerfil) botonRegresarPerfil.style.display = 'none';
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
                icono.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icono.classList.replace('fa-eye-slash', 'fa-eye');
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
            window.location.href = '../Home/index.html';
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

            // Sincronizar foto de perfil
            if (imgPerfil) {
                localStorage.setItem('pesa-tus-pesos-avatar', imgPerfil.src);
            }

            setTimeout(() => {
                mostrarToast('¡Cambios guardados con éxito! ✓');
                btn.textContent = originalText;

                // Redirigir al inicio después de un breve momento para que vean el mensaje
                setTimeout(() => {
                    window.location.href = '../Home/index.html';
                }, 1500);

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
    const fotoPorDefecto = 'img/hucha.png';

    // Cargar avatar sincronizado si existe
    const avatarGuardado = localStorage.getItem('pesa-tus-pesos-avatar');
    if (avatarGuardado && imgPerfil) {
        imgPerfil.src = avatarGuardado;
    }

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

    const modalEliminarFoto = document.getElementById('modal-eliminar-foto');
    const modalConfirmarEliminar = document.getElementById('modal-confirmar-eliminar');
    const modalCancelarEliminar = document.getElementById('modal-cancelar-eliminar');

    if (btnEliminarFoto && imgPerfil && modalEliminarFoto) {
        btnEliminarFoto.addEventListener('click', (e) => {
            e.preventDefault();
            modalEliminarFoto.classList.add('visible');
        });

        if (modalConfirmarEliminar) {
            modalConfirmarEliminar.addEventListener('click', () => {
                imgPerfil.src = fotoPorDefecto;
                modalEliminarFoto.classList.remove('visible');
                mostrarToast('Foto de perfil eliminada ✓');
            });
        }

        if (modalCancelarEliminar) {
            modalCancelarEliminar.addEventListener('click', () => {
                modalEliminarFoto.classList.remove('visible');
            });
        }
    }
});
