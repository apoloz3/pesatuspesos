// Base de datos estática simulada
let users = [
    { id: 1, name: "Ana García", email: "ana.garcia@mail.com", role: "Usuario", active: true, date: "12/03/2024" },
    { id: 2, name: "Luis Pérez", email: "luis.perez@mail.com", role: "Admin", active: true, date: "01/02/2024" },
    { id: 3, name: "María Rodríguez", email: "maria.rodriguez@mail.com", role: "Usuario", active: false, date: "25/04/2024" },
    { id: 4, name: "Carlos López", email: "carlos.lopez@mail.com", role: "Editor", active: true, date: "05/01/2024" },
    { id: 5, name: "Sofía Martínez", email: "sofia.martinez@mail.com", role: "Moderador", active: true, date: "15/03/2024" }
];

let roles = [
    { id: 1, name: "Admin", desc: "Full system control", perms: 50, active: true },
    { id: 2, name: "Editor", desc: "Content creation", perms: 25, active: true },
    { id: 3, name: "Moderador", desc: "Community management", perms: 15, active: true },
    { id: 4, name: "Visor", desc: "Read-only access", perms: 5, active: false },
    { id: 5, name: "Custom-User", desc: "Custom permission set", perms: 30, active: true },
    { id: 6, name: "Usuario", desc: "Permisos básicos", perms: 1, active: true } // Agregado Usuario
];

let globalAlerts = [
    { text: "Sistema iniciado correctamente por Admin", type: "info" }
];

// Instancias globales de gráficos (Requisito 6)
let myBarChart = null, myLineChart = null, myReportLineChart = null, myReportPieChart = null;

// Esperar a que el DOM esté cargado (Requisito 1)
window.addEventListener('DOMContentLoaded', () => {
    try {
        console.log("Starting JS Initialization...");
        initNavigation();
        initCharts();
        initTables();
        initModals();
        initToastsForStaticButtons();
        initTopbar();
        initControlCenter();
        initConfig();
        updateDashboardStats(); // Generamos stats
        renderAlerts(); // Renderizar las alertas estaticas inicial
    } catch (err) {
        console.error("FATAL CRASH: ", err);
        showToast("FATAL CRASH: " + err.message, "error");
        document.body.innerHTML = "<h1 style='color:red;'>FATAL ERROR: " + err.message + "</h1>" + document.body.innerHTML;
    }
});

// --- NAVIGATION ---
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-target]');
    const sections = document.querySelectorAll('.page-section');
    const pageTitle = document.getElementById('page-title');

    const titles = {
        'resumen': 'Resumen General',
        'usuarios': 'Gestión de Usuarios',
        'roles': 'Roles y Permisos',
        'configuracion': 'Configuración de Sistema',
        'reportes': 'Configuración - Reportes'
    };

    window.switchTab = function (target) {
        navItems.forEach(nav => nav.classList.remove('active'));
        const activeNav = document.querySelector(`.nav-item[data-target="${target}"]`);
        if (activeNav) activeNav.classList.add('active');

        sections.forEach(sec => sec.style.display = 'none');
        const targetSec = document.getElementById('section-' + target);
        if (targetSec) targetSec.style.display = 'block';
        pageTitle.innerHTML = `Panel de Administración - <span class="text-gold">${titles[target] || 'Panel'}</span>`;
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(item.getAttribute('data-target'));
        });
    });

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Cerrando sesión... Redirigiendo...', 'info');
            setTimeout(() => window.location.href = "../Inicio/index.html", 1500);
        });
    }
}

function initTopbar() {
    const gearIcon = document.querySelector('.topbar-icon');
    const userProfile = document.querySelector('.user-profile');

    if (gearIcon) {
        gearIcon.addEventListener('click', () => {
            window.switchTab('configuracion');
            showToast('Ajustes del sistema abiertos', 'info');
        });
    }

    if (userProfile) {
        userProfile.addEventListener('click', () => {
            showToast('Opciones de perfil de administrador', 'info');
        });
    }
}

// --- RENDERING TABLES & DROPDOWNS ---
function initTables() {
    renderUsers();
    renderRoles();

    const searchUser = document.getElementById('search-user');
    if (searchUser) searchUser.addEventListener('input', () => renderUsers());

    const filterStatus = document.getElementById('filter-status');
    if (filterStatus) filterStatus.addEventListener('change', () => renderUsers());

    // Asignación rápida
    const assignBtn = document.getElementById('btn-quick-assign');
    if (assignBtn) {
        assignBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const userId = document.getElementById('quick-assign-user').value;
            const newRole = document.getElementById('quick-assign-role').value;

            if (!userId || !newRole) {
                showToast('Por favor selecciona un usuario y un rol', 'error');
                return;
            }

            const id = parseInt(userId);
            const index = users.findIndex(u => u.id === id);
            if (index !== -1) {
                users[index].role = newRole;
                logAlert(`Rol de ${users[index].name} actualizado a ${newRole}`, 'success');
                renderUsers();
            }
        });
    }
}

function updateDropdowns() {
    const userSelect = document.getElementById('quick-assign-user');
    const roleSelect = document.getElementById('quick-assign-role');

    if (userSelect) {
        userSelect.innerHTML = '<option value="">Selecciona un usuario...</option>';
        users.forEach(u => {
            if (u.active) {
                userSelect.innerHTML += `<option value="${u.id}">${u.name} - ${u.role}</option>`;
            }
        });
    }

    if (roleSelect) {
        roleSelect.innerHTML = '<option value="">Selecciona rol...</option>';
        roles.forEach(r => {
            if (r.active) {
                roleSelect.innerHTML += `<option value="${r.name}">${r.name}</option>`;
            }
        });
    }

    const modalRoleSelect = document.getElementById('item-role');
    if (modalRoleSelect) {
        const currentVal = modalRoleSelect.value;
        modalRoleSelect.innerHTML = '';
        roles.forEach(r => {
            if (r.active) {
                modalRoleSelect.innerHTML += `<option value="${r.name}">${r.name}</option>`;
            }
        });
        if (currentVal) modalRoleSelect.value = currentVal;
    }
}

function renderUsers() {
    const searchVal = document.getElementById('search-user').value.toLowerCase();
    const filterStatus = document.getElementById('filter-status').value;

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchVal) ||
            u.email.toLowerCase().includes(searchVal) ||
            u.id.toString() === searchVal;
        const matchesStatus = filterStatus === 'Todos' ||
            (filterStatus === 'Activo' && u.active) ||
            (filterStatus === 'Inactivo' && !u.active);
        return matchesSearch && matchesStatus;
    });

    const mainTbody = document.querySelector('#main-users-table tbody');
    mainTbody.innerHTML = '';
    filteredUsers.forEach(u => {
        const statusBadge = u.active ? '<span class="badge badge-green">Activo</span>' : '<span class="badge badge-red">Inactivo</span>';
        mainTbody.innerHTML += `
            <tr>
                <td>${u.id}</td><td>${u.name}</td><td>${u.email}</td><td>${u.role}</td>
                <td>${statusBadge}</td><td>${u.date}</td>
                <td class="actions">
                    <button class="btn-icon btn-blue" onclick="editUser(${u.id})"><i class="fa-solid fa-pencil"></i></button>
                    <button class="btn-icon btn-red" onclick="deleteUser(${u.id})"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    });

    const recentTbody = document.querySelector('#dashboard-recent-users tbody');
    recentTbody.innerHTML = '';
    users.slice(-5).reverse().forEach(u => {
        recentTbody.innerHTML += `<tr><td>ID ${u.id}</td><td>${u.name}</td><td>${u.email}</td></tr>`;
    });

    updateDropdowns();
    updateDashboardStats();
}

function renderRoles() {
    const tbody = document.querySelector('#roles-table tbody');
    tbody.innerHTML = '';
    roles.forEach(r => {
        const statusText = r.active ? 'Activo' : 'Inactivo';
        const assignedUsers = users.filter(u => u.role === r.name).length;
        // Impedir que se elimine Admin o Usuario para mantener lógica
        const deleteHTML = (r.name === 'Admin' || r.name === 'Usuario') ?
            '' : `<button class="btn-icon btn-red" onclick="deleteRole(${r.id})"><i class="fa-solid fa-trash"></i></button>`;

        tbody.innerHTML += `
            <tr>
                <td>${r.id}</td><td>${r.name}</td><td>${r.desc}</td><td style="font-weight:bold; color:var(--g-blue);">${assignedUsers}</td><td>${statusText}</td>
                <td class="actions">
                    ${deleteHTML}
                </td>
            </tr>
        `;
    });

    updateDropdowns();
    renderMatrix();
    updateDashboardStats();
}

function renderMatrix() {
    const table = document.getElementById('matrix-table');
    if (!table) return;

    const thead = table.querySelector('thead');
    let headerHTML = '<tr><th>Permisos</th>';
    roles.forEach(r => {
        if (r.active) headerHTML += `<th><i class="fa-solid fa-user"></i> ${r.name}</th>`;
    });
    headerHTML += '</tr>';
    thead.innerHTML = headerHTML;

    const tbody = table.querySelector('tbody');
    const permissions = ['Ver Informes', 'Editar Usuarios', 'Crear Contenido', 'Gestión de Sistema', 'Ajustes Base'];
    let bodyHTML = '';

    permissions.forEach((perm, index) => {
        let row = `<tr><td class="text-left">${perm}</td>`;
        roles.forEach(r => {
            if (r.active) {
                // Generamos estado marcado basado en el nivel de array para simular la visualización.
                const isChecked = r.perms >= (index * 10) ? 'checked' : '';
                row += `<td><input type="checkbox" ${isChecked} onchange="logAlert('Permisos guardados para rol \\'${r.name}\\'', 'success')"></td>`;
            }
        });
        row += `</tr>`;
        bodyHTML += row;
    });
    tbody.innerHTML = bodyHTML;
}

// --- CRUD OPERATIONS & MODALS ---
let currentModalContext = null;

function initModals() {
    const modal = document.getElementById('generic-modal');
    const closeBtn = document.getElementById('close-modal');
    const form = document.getElementById('generic-form');

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.remove('active');
        });
    }

    document.querySelectorAll('.btn-gold:has(.fa-plus)').forEach(btn => {
        if (btn.textContent.includes('Usuario')) {
            btn.addEventListener('click', (e) => { e.preventDefault(); openModal('add-user'); });
        }
    });

    const addUsr = document.getElementById('btn-add-user');
    const addRole = document.getElementById('btn-add-role');
    if (addUsr) addUsr.addEventListener('click', (e) => { e.preventDefault(); openModal('add-user'); });
    if (addRole) addRole.addEventListener('click', (e) => { e.preventDefault(); openModal('add-role'); });

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (currentModalContext === 'add-user' || currentModalContext === 'edit-user') {
                saveUser();
            } else if (currentModalContext === 'add-role') {
                saveRole();
            }

            if (modal) modal.classList.remove('active');
        });
    }
}

function openModal(context, itemData = null) {
    const modal = document.getElementById('generic-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('generic-form');

    currentModalContext = context;
    form.reset();

    document.getElementById('group-email').style.display = 'flex';
    document.getElementById('group-role').style.display = 'flex';

    if (context === 'add-user') {
        title.innerText = 'Añadir Nuevo Usuario';
        document.getElementById('item-id').value = '';
    }
    else if (context === 'edit-user') {
        title.innerText = 'Editar Usuario';
        document.getElementById('item-id').value = itemData.id;
        document.getElementById('item-name').value = itemData.name;
        document.getElementById('item-email').value = itemData.email;
        document.getElementById('item-role').value = itemData.role;
        document.getElementById('item-active').checked = itemData.active;
    }
    else if (context === 'add-role') {
        title.innerText = 'Añadir Nuevo Rol';
        document.getElementById('group-email').style.display = 'none';
        document.getElementById('group-role').style.display = 'none';
    }

    modal.classList.add('active');
}

function saveUser() {
    const idStr = document.getElementById('item-id').value;
    const name = document.getElementById('item-name').value;
    const email = document.getElementById('item-email').value;
    const role = document.getElementById('item-role').value;
    const active = document.getElementById('item-active').checked;

    if (idStr) {
        const id = parseInt(idStr);
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            users[index] = { ...users[index], name, email, role, active };
            logAlert(`Usuario ${name} actualizado con éxito`, 'success');
        }
    } else {
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        const date = new Date().toLocaleDateString('es-ES');
        users.push({ id: newId, name, email, role, active, date });
        logAlert(`Nuevo usuario creado: ${name}`, 'success');
    }
    renderUsers();
}

function saveRole() {
    const name = document.getElementById('item-name').value;
    const active = document.getElementById('item-active').checked;
    const newId = roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1;
    roles.push({ id: newId, name, desc: 'Rol personalizado añadido', perms: 20, active });
    logAlert(`Nuevo rol añadido: ${name}`, 'success');
    renderRoles();
}

window.editUser = function (id) {
    const user = users.find(u => u.id === id);
    if (user) openModal('edit-user', user);
}

window.deleteUser = function (id) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        const userName = users.find(u => u.id === id)?.name || "Usuario";
        users = users.filter(u => u.id !== id);
        logAlert(`${userName} ha sido eliminado`, 'error');
        renderUsers();
        // Al eliminar usuario y renderUsers, actualizamos los stats de roles
        renderRoles();
    }
}

window.deleteRole = function (id) {
    if (confirm("¿Estás seguro de eliminar este Rol? Los perfiles que dependan de este rol volverán a ser 'Usuario'.")) {
        const targetRole = roles.find(r => r.id === id);
        if (!targetRole) return;

        // Limpiar usuarios con este rol
        users.forEach(u => {
            if (u.role === targetRole.name) u.role = 'Usuario';
        });

        roles = roles.filter(r => r.id !== id);
        logAlert(`Rol temporal '${targetRole.name}' ha sido desmantelado`, 'error');
        renderUsers();
        renderRoles();
    }
}

// --- LOGGING & ALERTS ---

function renderAlerts() {
    const resumenContainer = document.getElementById('alertas-resumen');
    const rolesContainer = document.getElementById('alertas-roles');

    let html = '';
    globalAlerts.slice(-4).reverse().forEach(a => {
        let iconColor = 'text-gold';
        if (a.type === 'error') iconColor = 'text-red';
        if (a.type === 'info') iconColor = 'text-blue';

        let iconClass = 'fa-circle-check';
        if (a.type === 'error') iconClass = 'fa-circle-xmark';
        if (a.type === 'info' || a.type === 'gold') iconClass = 'fa-circle-exclamation';

        html += `
            <div class="alert-item">
                <i class="fa-solid ${iconClass} ${iconColor}"></i>
                <div><p>${a.text}</p><small>Hace unos instantes</small></div>
            </div>
        `;
    });

    if (resumenContainer) resumenContainer.innerHTML = html;
    if (rolesContainer) rolesContainer.innerHTML = html;
}

function logAlert(message, type = 'success') {
    let alertType = type;
    if (type === 'success') alertType = 'gold'; // para darle color de la marca

    globalAlerts.push({ text: message, type: alertType });
    renderAlerts();
    showToast(message, type);
}

// --- TOASTS & STATIC ACTIONS ---
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = '<i class="fa-solid fa-circle-check"></i>';
    if (type === 'error') icon = '<i class="fa-solid fa-circle-xmark"></i>';
    if (type === 'info') icon = '<i class="fa-solid fa-circle-info"></i>';

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease-out reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Interceptamos clic estaticos
function initToastsForStaticButtons() {
    document.querySelectorAll('.btn-gold, .link-dark').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.type === 'submit') return;
            if (btn.id === 'btn-quick-assign' || btn.id.startsWith('btn-cc-')) return; // ignora asignacion y tableros

            const text = btn.textContent.trim().toLowerCase();
            if (text.includes('añadir') || btn.classList.contains('nav-item')) return;

            e.preventDefault();

            if (text.includes('guardar cambios')) {
                logAlert('Configuraciones guardadas', 'success');
            } else if (text.includes('generar')) {
                logAlert('Generando reporte... Descarga iniciada', 'success');
            } else if (text.includes('configurar')) {
                showToast('Abriendo configuración avanzada...', 'info');
            } else {
                showToast('Esta función se encuentra en desarrollo', 'info');
            }
        });
    });
}

function initControlCenter() {
    // Control Center de Resumen
    const ccr1 = document.getElementById('btn-cc-res-1');
    const ccr2 = document.getElementById('btn-cc-res-2');
    const ccr3 = document.getElementById('btn-cc-res-3');

    if (ccr1) ccr1.addEventListener('click', () => { window.switchTab('configuracion'); showToast('Ajustes Abiertos', 'info'); });
    if (ccr2) ccr2.addEventListener('click', () => { logAlert('Modo visualización activado en tu cuenta', 'info'); });
    if (ccr3) ccr3.addEventListener('click', () => { logAlert('Emergencia: Operaciones pausadas temporalmente', 'error'); });

    // Control Center de Roles
    const ccl1 = document.getElementById('btn-cc-roles1');
    const ccl2 = document.getElementById('btn-cc-roles2');
    const ccl3 = document.getElementById('btn-cc-roles3');

    if (ccl1) ccl1.addEventListener('click', () => { logAlert('Modo editar matriz activado. Utiliza los checkboxes.', 'info'); });
    if (ccl2) ccl2.addEventListener('click', () => { logAlert('Petición de auditoría generada (PDF)', 'success'); });
    if (ccl3) ccl3.addEventListener('click', () => { logAlert('Todos los permisos han sido revocados por seguridad.', 'error'); });
}

function initConfig() {
    const btnSave = document.getElementById('btn-save-config');
    const appNameInput = document.getElementById('config-app-name');
    const sidebarLogo = document.querySelector('.sidebar-logo');

    // Botones adicionales de configuración
    const btnSsl = document.getElementById('btn-ssl');
    const btnSmtp = document.getElementById('btn-smtp');

    if (btnSsl) btnSsl.addEventListener('click', (e) => { e.preventDefault(); showToast('Redirigiendo a pasarela de SSL...', 'info'); });
    if (btnSmtp) btnSmtp.addEventListener('click', (e) => { e.preventDefault(); showToast('Buscando servidor SMTP local...', 'info'); });

    if (btnSave && appNameInput && sidebarLogo) {
        btnSave.addEventListener('click', (e) => {
            e.preventDefault();

            // Reemplazamos el logo de la barra lateral, preservando el icono si es posible
            const iconHTML = sidebarLogo.querySelector('i') ? sidebarLogo.querySelector('i').outerHTML : '<i class="fa-solid fa-scale-balanced" style="color:#d4b455; margin-right: 10px;"></i>';
            sidebarLogo.innerHTML = iconHTML + ' ' + appNameInput.value;

            logAlert(`Ajustes del sistema guardados. Nuevo nombre: ${appNameInput.value}`, 'success');
        });
    }
}

// --- CHART.JS INIT & DYNAMIC STATS ---

function updateDashboardStats() {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.active).length;
    const totalRoles = roles.length;

    // Inyectar en los recuadros de Resumen Superior
    const elTotal = document.getElementById('stat-total-users');
    const elActive = document.getElementById('stat-active-users');
    const elRoles = document.getElementById('stat-total-roles');
    if (elTotal) elTotal.innerText = totalUsers;
    if (elActive) elActive.innerText = activeUsers;
    if (elRoles) elRoles.innerText = totalRoles;

    updateCharts();
}

function initCharts() {
    // Al cargar llamamos la actualización, lo que inicializará nativamente
    updateCharts();
}

function updateCharts() {
    // 1. Distribución de Roles por Usuario (Pie Chart) -> Reportes
    const rolesLabels = roles.map(r => r.name);
    const rolesData = roles.map(r => users.filter(u => u.role === r.name).length);

    const repPieCtx = document.getElementById('reportPieChart');
    if (repPieCtx) {
        if (myReportPieChart) {
            myReportPieChart.data.labels = rolesLabels;
            myReportPieChart.data.datasets[0].data = rolesData;
            myReportPieChart.update();
        } else {
            myReportPieChart = new Chart(repPieCtx, {
                type: 'pie',
                data: {
                    labels: rolesLabels,
                    datasets: [{
                        data: rolesData,
                        backgroundColor: ['#164863', '#d4b455', '#EAE2CE', '#2e81a3', '#8b1c1c', '#4e9a73']
                    }]
                },
                options: { responsive: true, plugins: { legend: { position: 'top' } } }
            });
        }
    }

    // 2. Registro de Nuevos Usuarios por Mes (Bar Chart) -> Resumen
    const monthCounts = Array(12).fill(0);
    users.forEach(u => {
        if (u.date) {
            const parts = u.date.split('/');
            if (parts.length > 1) {
                const mes = parseInt(parts[1], 10) - 1; // 0 index
                if (mes >= 0 && mes <= 11) monthCounts[mes]++;
            }
        }
    });

    const barCtx = document.getElementById('barChart');
    if (barCtx) {
        if (myBarChart) {
            myBarChart.data.datasets[0].data = monthCounts;
            myBarChart.update();
        } else {
            myBarChart = new Chart(barCtx, {
                type: 'bar',
                data: {
                    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                    datasets: [{ label: 'Nuevos Usuarios', data: monthCounts, backgroundColor: '#d4b455' }]
                },
                options: { responsive: true, plugins: { legend: { display: false } } }
            });
        }
    }

    // 3. Line Chart de Conexiones ficticias proporcionales (Resumen)
    const lineCtx = document.getElementById('lineChart');
    const uTotal = users.length;
    if (lineCtx) {
        const lineData = [uTotal * 0.2, uTotal * 0.8, uTotal, uTotal * 0.5, uTotal * 0.9, uTotal * 0.3, uTotal * 0.1];
        if (myLineChart) {
            myLineChart.data.datasets[0].data = lineData;
            myLineChart.update();
        } else {
            myLineChart = new Chart(lineCtx, {
                type: 'line',
                data: {
                    labels: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
                    datasets: [{ label: 'Conexiones Estimadas', data: lineData, borderColor: '#2e81a3', tension: 0.4, fill: true, backgroundColor: 'rgba(46, 129, 163, 0.1)' }]
                },
                options: { responsive: true, plugins: { legend: { display: false } } }
            });
        }
    }

    // 4. Report Line Chart (Reportes)
    const repLineCtx = document.getElementById('reportLineChart');
    if (repLineCtx) {
        const activeCount = users.filter(u => u.active).length;
        const opsData = [roles.length * 2, roles.length * 3, roles.length * 4, roles.length * 5];
        const activeData = [uTotal * 0.5, uTotal * 0.7, uTotal * 0.9, activeCount];

        if (myReportLineChart) {
            myReportLineChart.data.datasets[0].data = activeData;
            myReportLineChart.data.datasets[1].data = opsData;
            myReportLineChart.update();
        } else {
            myReportLineChart = new Chart(repLineCtx, {
                type: 'line',
                data: {
                    labels: ['1 Sem', '2 Sem', '3 Sem', '4 Sem'],
                    datasets: [
                        { label: 'Usuarios Activos Constantes', data: activeData, borderColor: '#164863', tension: 0.4 },
                        { label: 'Operaciones', data: opsData, borderColor: '#d4b455', tension: 0.4 }
                    ]
                },
                options: { responsive: true }
            });
        }
    }
}