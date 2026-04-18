// Base de datos estática simulada con persistencia en localStorage
const DATOS_INICIALES_USUARIOS = [
    { id: 1, nombre: "Ana García", email: "ana.garcia@mail.com", rol: "Usuario", activo: true, fecha: "12/03/2024" },
    { id: 2, nombre: "Luis Pérez", email: "luis.perez@mail.com", rol: "Admin", activo: true, fecha: "01/02/2024" },
    { id: 3, nombre: "María Rodríguez", email: "maria.rodriguez@mail.com", rol: "Usuario", activo: false, fecha: "25/04/2024" },
    { id: 4, nombre: "Carlos López", email: "carlos.lopez@mail.com", rol: "Editor", activo: true, fecha: "05/01/2024" },
    { id: 5, nombre: "Sofía Martínez", email: "sofia.martinez@mail.com", rol: "Moderador", activo: true, fecha: "15/03/2024" }
];

const DATOS_INICIALES_ROLES = [
    { id: 1, nombre: "Admin", desc: "Control total del sistema", permisos: 50, activo: true },
    { id: 2, nombre: "Editor", desc: "Creación de contenido", permisos: 25, activo: true },
    { id: 3, nombre: "Moderador", desc: "Gestión de comunidad", permisos: 15, activo: true },
    { id: 4, nombre: "Visor", desc: "Acceso de solo lectura", permisos: 5, activo: false },
    { id: 5, nombre: "Usuario-Custom", desc: "Conjunto de permisos personalizado", permisos: 30, activo: true },
    { id: 6, nombre: "Usuario", desc: "Permisos básicos", permisos: 1, activo: true }
];

// Cargar datos de localStorage o usar iniciales
let usuarios = JSON.parse(localStorage.getItem('ptp_usuarios')) || DATOS_INICIALES_USUARIOS;
let roles = JSON.parse(localStorage.getItem('ptp_roles')) || DATOS_INICIALES_ROLES;
let alertasGlobales = JSON.parse(localStorage.getItem('ptp_alertas')) || [
    { texto: "Sistema iniciado correctamente por Administrador", tipo: "info" }
];

// Estado de paginación para usuarios
let paginaActualUsuarios = 1;
const usuariosPorPagina = 5;

function guardarEnStorage() {
    localStorage.setItem('ptp_usuarios', JSON.stringify(usuarios));
    localStorage.setItem('ptp_roles', JSON.stringify(roles));
    localStorage.setItem('ptp_alertas', JSON.stringify(alertasGlobales));
}

// Instancias globales de gráficos
let miGraficoBarras = null, miGraficoLineas = null, miGraficoLineasReporte = null, miGraficoPastelReporte = null;

// Esperar a que el DOM esté cargado
window.addEventListener('DOMContentLoaded', () => {
    try {
        console.log("Iniciando Inicialización del Panel...");
        inicializarNavegacion();
        inicializarGraficos();
        inicializarTablas();
        inicializarModales();
        inicializarNotificacionesBotones();
        inicializarBarraSuperior();
        inicializarCentroControl();
        inicializarConfiguracion();
        inicializarMenuMovil();
        actualizarEstadisticasDashboard();
        renderizarAlertas();
    } catch (error) {
        console.error("ERROR FATAL: ", error);
        mostrarNotificacion("ERROR FATAL: " + error.message, "error");
    }
});

// --- NAVEGACIÓN ---
function inicializarNavegacion() {
    const elementosNav = document.querySelectorAll('.item-navegacion[data-target]');
    const pathActual = window.location.pathname;
    const paginaActual = pathActual.split('/').pop() || 'resumen.html';

    elementosNav.forEach(nav => {
        const target = nav.getAttribute('data-target');
        const href = `${target}.html`;
        nav.setAttribute('href', href);

        // Marcar como activo si coincide con la página actual
        if (paginaActual === href || (paginaActual === 'index.html' && target === 'resumen') || (paginaActual === '' && target === 'resumen')) {
            nav.classList.add('activo');
        } else {
            nav.classList.remove('activo');
        }
    });

    const botonCerrarSesion = document.getElementById('boton-cerrar-sesion');
    if (botonCerrarSesion) {
        botonCerrarSesion.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarNotificacion('Cerrando sesión... Redirigiendo...', 'info');
            setTimeout(() => window.location.href = 'resumen.html', 1500); // Simulación
        });
    }
}

function inicializarMenuMovil() {
    const botonMenu = document.getElementById('boton-menu-movil');
    const barraLateral = document.querySelector('.barra-lateral');
    const contenidoPrincipal = document.querySelector('.contenido-principal');

    if (botonMenu && barraLateral) {
        botonMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            barraLateral.classList.toggle('abierta');
        });

        if (contenidoPrincipal) {
            contenidoPrincipal.addEventListener('click', () => {
                if (barraLateral.classList.contains('abierta')) {
                    barraLateral.classList.remove('abierta');
                }
            });
        }
    }
}

function inicializarBarraSuperior() {
    const iconoAjustes = document.querySelector('.icono-barra-superior');
    const perfilUsuario = document.querySelector('.perfil-usuario');

    if (iconoAjustes) {
        iconoAjustes.addEventListener('click', () => {
            window.location.href = 'configuracion.html';
        });
    }

    if (perfilUsuario) {
        perfilUsuario.addEventListener('click', () => {
            mostrarNotificacion('Opciones de perfil cargadas', 'info');
        });
    }
}

// --- RENDERIZADO DE TABLAS ---
function inicializarTablas() {
    if (document.getElementById('tabla-usuarios-principal') || document.getElementById('tabla-usuarios-recientes')) {
        renderizarUsuarios();
    }
    
    if (document.getElementById('tabla-roles')) {
        renderizarRoles();
    }

    const buscadorUsuario = document.getElementById('buscar-usuario');
    if (buscadorUsuario) {
        buscadorUsuario.addEventListener('input', () => {
            paginaActualUsuarios = 1;
            renderizarUsuarios();
        });
    }

    const filtroEstado = document.getElementById('filtrar-estado');
    if (filtroEstado) {
        filtroEstado.addEventListener('change', () => {
            paginaActualUsuarios = 1;
            renderizarUsuarios();
        });
    }

    const botonAsignar = document.getElementById('boton-asignacion-rapida');
    if (botonAsignar) {
        botonAsignar.addEventListener('click', (e) => {
            e.preventDefault();
            const idUsuario = document.getElementById('asignacion-rapida-usuario').value;
            const nuevoRol = document.getElementById('asignacion-rapida-rol').value;

            if (!idUsuario || !nuevoRol) {
                mostrarNotificacion('Selecciona un usuario y un rol', 'error');
                return;
            }

            const id = parseInt(idUsuario);
            const indice = usuarios.findIndex(u => u.id === id);
            if (indice !== -1) {
                usuarios[indice].rol = nuevoRol;
                registrarAlerta(`Rol de ${usuarios[indice].nombre} actualizado a ${nuevoRol}`, 'success');
                guardarEnStorage();
                renderizarUsuarios();
            }
        });
    }
}

function actualizarDropdowns() {
    const selectUsuario = document.getElementById('asignacion-rapida-usuario');
    const selectRol = document.getElementById('asignacion-rapida-rol');

    if (selectUsuario) {
        selectUsuario.innerHTML = '<option value="">Selecciona un usuario...</option>';
        usuarios.forEach(u => {
            if (u.activo) {
                selectUsuario.innerHTML += `<option value="${u.id}">${u.nombre} - ${u.rol}</option>`;
            }
        });
    }

    if (selectRol) {
        selectRol.innerHTML = '<option value="">Selecciona rol...</option>';
        roles.forEach(r => {
            if (r.activo) {
                selectRol.innerHTML += `<option value="${r.nombre}">${r.nombre}</option>`;
            }
        });
    }

    const selectRolModal = document.getElementById('rol-elemento');
    if (selectRolModal) {
        const valorActual = selectRolModal.value;
        selectRolModal.innerHTML = '';
        roles.forEach(r => {
            if (r.activo) {
                selectRolModal.innerHTML += `<option value="${r.nombre}">${r.nombre}</option>`;
            }
        });
        if (valorActual) selectRolModal.value = valorActual;
    }
}

function renderizarUsuarios() {
    const buscElement = document.getElementById('buscar-usuario');
    const filtElement = document.getElementById('filtrar-estado');
    
    const valorBusqueda = buscElement ? buscElement.value.toLowerCase() : "";
    const filtroEstado = filtElement ? filtElement.value : "Todos";

    const usuariosFiltrados = usuarios.filter(u => {
        const coincideBusqueda = u.nombre.toLowerCase().includes(valorBusqueda) ||
            u.email.toLowerCase().includes(valorBusqueda) ||
            u.id.toString() === valorBusqueda;
        const coincideEstado = filtroEstado === 'Todos' ||
            (filtroEstado === 'Activo' && u.activo) ||
            (filtroEstado === 'Inactivo' && !u.activo);
        return coincideBusqueda && coincideEstado;
    });

    const cuerpoTablaPrincipal = document.querySelector('#tabla-usuarios-principal tbody');
    if (cuerpoTablaPrincipal) {
        // Lógica de paginación
        const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
        if (paginaActualUsuarios > totalPaginas && totalPaginas > 0) paginaActualUsuarios = totalPaginas;

        const inicio = (paginaActualUsuarios - 1) * usuariosPorPagina;
        const fin = inicio + usuariosPorPagina;
        const usuariosPagina = usuariosFiltrados.slice(inicio, fin);

        cuerpoTablaPrincipal.innerHTML = '';
        usuariosPagina.forEach(u => {
            const etiquetaEstado = u.activo ? '<span class="etiqueta etiqueta-verde">Activo</span>' : '<span class="etiqueta etiqueta-roja">Inactivo</span>';
            cuerpoTablaPrincipal.innerHTML += `
                <tr>
                    <td>${u.id}</td><td>${u.nombre}</td><td>${u.email}</td><td>${u.rol}</td>
                    <td>${etiquetaEstado}</td><td>${u.fecha}</td>
                    <td class="acciones">
                        <button class="boton-icono boton-primario" onclick="editarUsuario(${u.id})"><i class="fa-solid fa-pencil"></i></button>
                        <button class="boton-icono boton-rojo" onclick="eliminarUsuario(${u.id})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
        renderizarPaginacionUsuarios(usuariosFiltrados.length);
    }

    const cuerpoTablaRecientes = document.querySelector('#tabla-usuarios-recientes tbody');
    if (cuerpoTablaRecientes) {
        cuerpoTablaRecientes.innerHTML = '';
        usuarios.slice(-5).reverse().forEach(u => {
            cuerpoTablaRecientes.innerHTML += `<tr><td><strong>ID ${u.id}</strong></td><td>${u.nombre}</td><td>${u.email}</td></tr>`;
        });
    }

    actualizarDropdowns();
    actualizarEstadisticasDashboard();
}

function renderizarPaginacionUsuarios(totalItems) {
    const contenedor = document.getElementById('paginacion-usuarios');
    if (!contenedor) return;

    const totalPaginas = Math.ceil(totalItems / usuariosPorPagina);
    if (totalPaginas <= 1) {
        contenedor.innerHTML = '';
        return;
    }

    let html = `
        <button class="boton-paginacion" ${paginaActualUsuarios === 1 ? 'disabled' : ''} onclick="cambiarPaginaUsuarios(${paginaActualUsuarios - 1})">
            <i class="fa-solid fa-chevron-left"></i>
        </button>
    `;

    for (let i = 1; i <= totalPaginas; i++) {
        html += `
            <button class="boton-paginacion ${i === paginaActualUsuarios ? 'activo' : ''}" onclick="cambiarPaginaUsuarios(${i})">
                ${i}
            </button>
        `;
    }

    html += `
        <button class="boton-paginacion" ${paginaActualUsuarios === totalPaginas ? 'disabled' : ''} onclick="cambiarPaginaUsuarios(${paginaActualUsuarios + 1})">
            <i class="fa-solid fa-chevron-right"></i>
        </button>
    `;

    contenedor.innerHTML = html;
}

window.cambiarPaginaUsuarios = function(nuevaPagina) {
    paginaActualUsuarios = nuevaPagina;
    renderizarUsuarios();
}

function renderizarRoles() {
    const cuerpoTabla = document.querySelector('#tabla-roles tbody');
    if (!cuerpoTabla) return;
    
    cuerpoTabla.innerHTML = '';
    roles.forEach(r => {
        const textoEstado = r.activo ? 'Activo' : 'Inactivo';
        const usuariosAsignados = usuarios.filter(u => u.rol === r.nombre).length;
        
        const htmlEliminar = (r.nombre === 'Admin' || r.nombre === 'Usuario') ?
            '' : `<button class="boton-icono boton-rojo" onclick="eliminarRol(${r.id})"><i class="fa-solid fa-trash"></i></button>`;

        cuerpoTabla.innerHTML += `
            <tr>
                <td>${r.id}</td><td><strong>${r.nombre}</strong></td><td>${r.desc}</td>
                <td style="font-weight:700; color:#1c84ee;">${usuariosAsignados}</td><td>${textoEstado}</td>
                <td class="acciones">
                    ${htmlEliminar}
                </td>
            </tr>
        `;
    });

    actualizarDropdowns();
    renderizarMatriz();
}

function renderizarMatriz() {
    const tabla = document.getElementById('tablas-matriz');
    if (!tabla) return;

    const thead = tabla.querySelector('thead');
    let htmlEncabezado = '<tr><th>Permisos / Módulos</th>';
    roles.forEach(r => {
        if (r.activo) htmlEncabezado += `<th><i class="fa-solid fa-user-shield"></i> ${r.nombre}</th>`;
    });
    htmlEncabezado += '</tr>';
    thead.innerHTML = htmlEncabezado;

    const tbody = tabla.querySelector('tbody');
    const permisos = ['Ver Informes', 'Editar Usuarios', 'Crear Contenido', 'Gestión de Sistema', 'Ajustes Base'];
    let htmlCuerpo = '';

    permisos.forEach((perm, index) => {
        let fila = `<tr><td style="text-align: left; font-weight: 600;">${perm}</td>`;
        roles.forEach(r => {
            if (r.activo) {
                const estaMarcado = r.permisos >= (index * 10) ? 'checked' : '';
                fila += `<td><input type="checkbox" ${estaMarcado} onchange="registrarAlerta('Permisos actualizados para el rol \\'${r.nombre}\\'', 'success')"></td>`;
            }
        });
        fila += `</tr>`;
        htmlCuerpo += fila;
    });
    tbody.innerHTML = htmlCuerpo;
}

// --- OPERACIONES CRUD Y MODALES ---
let contextoModalActual = null;

function inicializarModales() {
    const modal = document.getElementById('modal-generico');
    const botonCerrar = document.getElementById('cerrar-modal-btn');
    const formulario = document.getElementById('formulario-generico');

    if (botonCerrar) {
        botonCerrar.addEventListener('click', () => {
            modal.classList.remove('activo');
        });
    }

    const btnAddResumen = document.getElementById('boton-agregar-usuario-resumen');
    const btnAddMain = document.getElementById('boton-agregar-usuario');
    const btnAddRole = document.getElementById('boton-agregar-rol');

    if (btnAddResumen) btnAddResumen.addEventListener('click', () => abrirModal('agregar-usuario'));
    if (btnAddMain) btnAddMain.addEventListener('click', () => abrirModal('agregar-usuario'));
    if (btnAddRole) btnAddRole.addEventListener('click', () => abrirModal('agregar-rol'));

    if (formulario) {
        formulario.addEventListener('submit', (e) => {
            e.preventDefault();
            if (contextoModalActual === 'agregar-usuario' || contextoModalActual === 'editar-usuario') {
                guardarUsuario();
            } else if (contextoModalActual === 'agregar-rol') {
                guardarRol();
            }
            modal.classList.remove('activo');
        });
    }
}

function abrirModal(contexto, datosItem = null) {
    const modal = document.getElementById('modal-generico');
    const titulo = document.getElementById('titulo-modal');
    const formulario = document.getElementById('formulario-generico');

    if (!modal || !titulo || !formulario) return;

    contextoModalActual = contexto;
    formulario.reset();

    const gEmail = document.getElementById('grupo-email');
    const gRol = document.getElementById('grupo-rol');
    if (gEmail) gEmail.style.display = 'flex';
    if (gRol) gRol.style.display = 'flex';

    if (contexto === 'agregar-usuario') {
        titulo.innerText = 'Registar Nuevo Usuario';
        document.getElementById('id-elemento').value = '';
    }
    else if (contexto === 'editar-usuario') {
        titulo.innerText = 'Editar Información de Usuario';
        document.getElementById('id-elemento').value = datosItem.id;
        document.getElementById('nombre-elemento').value = datosItem.nombre;
        document.getElementById('email-elemento').value = datosItem.email;
        document.getElementById('rol-elemento').value = datosItem.rol;
        document.getElementById('activo-elemento').checked = datosItem.activo;
    }
    else if (contexto === 'agregar-rol') {
        titulo.innerText = 'Configurar Nuevo Rol';
        if (gEmail) gEmail.style.display = 'none';
        if (gRol) gRol.style.display = 'none';
    }

    modal.classList.add('activo');
}

function guardarUsuario() {
    const idSrt = document.getElementById('id-elemento').value;
    const nombre = document.getElementById('nombre-elemento').value;
    const email = document.getElementById('email-elemento').value;
    const rol = document.getElementById('rol-elemento').value;
    const activo = document.getElementById('activo-elemento').checked;

    if (idSrt) {
        const id = parseInt(idSrt);
        const indice = usuarios.findIndex(u => u.id === id);
        if (indice !== -1) {
            usuarios[indice] = { ...usuarios[indice], nombre, email, rol, activo };
            registrarAlerta(`Usuario ${nombre} actualizado correctamente`, 'success');
        }
    } else {
        const nuevoId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
        const fecha = new Date().toLocaleDateString('es-ES');
        usuarios.push({ id: nuevoId, nombre, email, rol, activo, fecha });
        registrarAlerta(`Nuevo usuario registrado: ${nombre}`, 'success');
    }
    guardarEnStorage();
    renderizarUsuarios();
}

function guardarRol() {
    const nombre = document.getElementById('nombre-elemento').value;
    const activo = document.getElementById('activo-elemento').checked;
    const nuevoId = roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1;
    roles.push({ id: nuevoId, nombre: nombre, desc: 'Rol personalizado del sistema', permisos: 20, activo });
    registrarAlerta(`Nuevo rol añadido: ${nombre}`, 'success');
    guardarEnStorage();
    renderizarRoles();
}

window.editarUsuario = function (id) {
    const usuario = usuarios.find(u => u.id === id);
    if (usuario) abrirModal('editar-usuario', usuario);
}

window.eliminarUsuario = function (id) {
    if (confirm('¿Estás seguro de eliminar este usuario permanentemente?')) {
        const nombreUsr = usuarios.find(u => u.id === id)?.nombre || "Usuario";
        usuarios = usuarios.filter(u => u.id !== id);
        registrarAlerta(`${nombreUsr} eliminado del sistema`, 'error');
        guardarEnStorage();
        renderizarUsuarios();
        renderizarRoles();
    }
}

window.eliminarRol = function (id) {
    if (confirm("¿Eliminar este rol? Los usuarios asociados pasarán a ser rol 'Usuario'.")) {
        const rolObjetivo = roles.find(r => r.id === id);
        if (!rolObjetivo) return;

        usuarios.forEach(u => {
            if (u.rol === rolObjetivo.nombre) u.rol = 'Usuario';
        });

        roles = roles.filter(r => r.id !== id);
        registrarAlerta(`Rol '${rolObjetivo.nombre}' deshabilitado`, 'error');
        guardarEnStorage();
        renderizarUsuarios();
        renderizarRoles();
    }
}

// --- LOGS Y ALERTAS ---
function renderizarAlertas() {
    const contenedorResumen = document.getElementById('alertas-resumen');
    const contenedorRoles = document.getElementById('alertas-roles');

    if (!contenedorResumen && !contenedorRoles) return;

    let html = '';
    alertasGlobales.slice(-4).reverse().forEach(a => {
        let colorIcono = 'texto-primario';
        if (a.tipo === 'error') colorIcono = 'texto-peligro';
        if (a.tipo === 'success') colorIcono = 'fondo-verde';

        let classIcono = 'fa-circle-check';
        if (a.tipo === 'error') classIcono = 'fa-circle-xmark';
        if (a.tipo === 'info') classIcono = 'fa-circle-exclamation';

        html += `
            <div class="item-alerta">
                <i class="fa-solid ${classIcono} ${colorIcono}"></i>
                <div><p>${a.texto}</p><small>Hace un momento</small></div>
            </div>
        `;
    });

    if (contenedorResumen) contenedorResumen.innerHTML = html;
    if (contenedorRoles) contenedorRoles.innerHTML = html;
}

function registrarAlerta(mensaje, tipo = 'success') {
    alertasGlobales.push({ texto: mensaje, tipo: tipo });
    guardarEnStorage();
    renderizarAlertas();
    mostrarNotificacion(mensaje, tipo);
}

// --- NOTIFICACIONES TIPO TOAST ---
function mostrarNotificacion(mensaje, tipo = 'success') {
    const contenedor = document.getElementById('contenedor-notificaciones');
    if (!contenedor) return;

    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;

    let icono = '<i class="fa-solid fa-circle-check"></i>';
    if (tipo === 'error') icono = '<i class="fa-solid fa-circle-xmark"></i>';
    if (tipo === 'info') icono = '<i class="fa-solid fa-circle-info"></i>';

    notificacion.innerHTML = `${icono} <span>${mensaje}</span>`;
    contenedor.appendChild(notificacion);

    setTimeout(() => {
        notificacion.style.animation = 'slideIn 0.3s ease-out reverse forwards';
        setTimeout(() => notificacion.remove(), 300);
    }, 3500);
}

function inicializarNotificacionesBotones() {
    document.querySelectorAll('.boton, .enlace-oscuro').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.type === 'submit') return;
            const id = btn.id || "";
            if (id.includes('agregar-usuario') || id.includes('agregar-rol') || id.startsWith('btn-')) return;
            if (btn.classList.contains('item-navegacion')) return;

            const texto = btn.textContent.trim().toLowerCase();
            if (texto.includes('añadir')) return;

            e.preventDefault();

            if (texto.includes('guardar cambios')) {
                registrarAlerta('Ajustes guardados con éxito', 'success');
            } else if (texto.includes('generar')) {
                registrarAlerta('Generando documento PDF...', 'success');
            } else if (texto.includes('configurar')) {
                mostrarNotificacion('Iniciando panel de configuración...', 'info');
            } else {
                mostrarNotificacion('Operación en proceso de despliegue', 'info');
            }
        });
    });
}

function inicializarCentroControl() {
    const ccr1 = document.getElementById('btn-ajustes-res');
    const ccr2 = document.getElementById('btn-visualizacion-res');
    const ccr3 = document.getElementById('btn-emergencia-res');

    if (ccr1) ccr1.addEventListener('click', () => { window.location.href = 'configuracion.html'; });
    if (ccr2) ccr2.addEventListener('click', () => { registrarAlerta('Vista enriquecida activada', 'info'); });
    if (ccr3) ccr3.addEventListener('click', () => { registrarAlerta('EMERGENCIA: Accesos restringidos', 'error'); });

    // Se eliminan los botones específicos de roles.html como se solicitó
}

function inicializarConfiguracion() {
    const btnGuardar = document.getElementById('boton-guardar-config');
    const inputNombreApp = document.getElementById('config-nombre-app');
    const logoSidebar = document.querySelector('.logo-barra-lateral');

    if (btnGuardar && inputNombreApp && logoSidebar) {
        btnGuardar.addEventListener('click', (e) => {
            e.preventDefault();
            const iconoHTML = logoSidebar.querySelector('i') ? logoSidebar.querySelector('i').outerHTML : '<i class="fa-solid fa-scale-balanced"></i>';
            logoSidebar.innerHTML = iconoHTML + ' ' + inputNombreApp.value;
            registrarAlerta(`Ajustes globales actualizados. App: ${inputNombreApp.value}`, 'success');
        });
    }

    const btnSsl = document.getElementById('boton-ssl');
    const btnSmtp = document.getElementById('boton-smtp');

    if (btnSsl) btnSsl.addEventListener('click', (e) => { e.preventDefault(); mostrarNotificacion('Verificando certificados SSL...', 'info'); });
    if (btnSmtp) btnSmtp.addEventListener('click', (e) => { e.preventDefault(); mostrarNotificacion('Probando conexión SMTP...', 'info'); });
}

// --- ACTUALIZACIÓN DE ESTADÍSTICAS Y GRÁFICOS ---
function actualizarEstadisticasDashboard() {
    const totalUsuarios = usuarios.length;
    const usuariosActivos = usuarios.filter(u => u.activo).length;
    const totalRoles = roles.length;

    const elTotal = document.getElementById('est-usuarios-totales');
    const elActivo = document.getElementById('est-usuarios-activos');
    const elRoles = document.getElementById('est-roles-totales');
    
    if (elTotal) elTotal.innerText = totalUsuarios;
    if (elActivo) elActivo.innerText = usuariosActivos;
    if (elRoles) elRoles.innerText = totalRoles;

    actualizarGraficos();
}

function inicializarGraficos() {
    actualizarGraficos();
}

function actualizarGraficos() {
    if (typeof Chart === 'undefined') return;

    const colorPrimario = '#1c84ee';
    const colorVerde = '#10b981';

    // 1. Gráfico de Pastel (Reportes)
    const ctxPastel = document.getElementById('graficoPastelReporte');
    if (ctxPastel) {
        const etiquetasRoles = roles.map(r => r.nombre);
        const datosRoles = roles.map(r => usuarios.filter(u => u.rol === r.nombre).length);
        
        if (miGraficoPastelReporte) {
            miGraficoPastelReporte.data.labels = etiquetasRoles;
            miGraficoPastelReporte.data.datasets[0].data = datosRoles;
            miGraficoPastelReporte.update();
        } else {
            miGraficoPastelReporte = new Chart(ctxPastel, {
                type: 'pie',
                data: {
                    labels: etiquetasRoles,
                    datasets: [{
                        data: datosRoles,
                        backgroundColor: [colorPrimario, '#334155', colorVerde, '#64748b', '#ef4444', '#f1f5f9']
                    }]
                },
                options: { responsive: true }
            });
        }
    }

    // 2. Gráfico de Barras (Resumen)
    const ctxBarras = document.getElementById('graficoBarras');
    if (ctxBarras) {
        const conteoMeses = Array(12).fill(0);
        usuarios.forEach(u => {
            if (u.fecha) {
                const partes = u.fecha.split('/');
                if (partes.length > 1) {
                    const mes = parseInt(partes[1], 10) - 1;
                    if (mes >= 0 && mes <= 11) conteoMeses[mes]++;
                }
            }
        });

        if (miGraficoBarras) {
            miGraficoBarras.data.datasets[0].data = conteoMeses;
            miGraficoBarras.update();
        } else {
            miGraficoBarras = new Chart(ctxBarras, {
                type: 'bar',
                data: {
                    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                    datasets: [{ label: 'Registros', data: conteoMeses, backgroundColor: colorPrimario }]
                },
                options: { responsive: true, plugins: { legend: { display: false } } }
            });
        }
    }

    // 3. Gráfico de Líneas (Resumen)
    const ctxLineas = document.getElementById('graficoLineas');
    if (ctxLineas) {
        const uTotal = usuarios.length;
        const datosConexion = [uTotal * 0.3, uTotal * 0.7, uTotal, uTotal * 0.6, uTotal * 0.8];
        if (miGraficoLineas) {
            miGraficoLineas.data.datasets[0].data = datosConexion;
            miGraficoLineas.update();
        } else {
            miGraficoLineas = new Chart(ctxLineas, {
                type: 'line',
                data: {
                    labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie'],
                    datasets: [{ label: 'Actividad', data: datosConexion, borderColor: colorVerde, tension: 0.4, fill: true, backgroundColor: 'rgba(16, 185, 129, 0.1)' }]
                },
                options: { responsive: true, plugins: { legend: { display: false } } }
            });
        }
    }

    // 4. Gráfico Reporte (Líneas)
    const ctxReporte = document.getElementById('graficoLineasReporte');
    if (ctxReporte) {
        if (!miGraficoLineasReporte) {
            miGraficoLineasReporte = new Chart(ctxReporte, {
                type: 'line',
                data: {
                    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
                    datasets: [
                        { label: 'Usuarios Activos', data: [10, 25, 45, 60], borderColor: colorPrimario, tension: 0.4 },
                        { label: 'Alertas', data: [5, 12, 8, 15], borderColor: '#ef4444', tension: 0.4 }
                    ]
                },
                options: { responsive: true }
            });
        } else {
            miGraficoLineasReporte.update();
        }
    }
}