document.addEventListener("DOMContentLoaded", function () {
  /* FRASE*/

  const frases = [
    "¡En la vida y en las finanzas, el riesgo es inevitable!",
    "¡El ahorro de hoy es la libertad de mañana!",
    "¡No gastes lo que no tienes para impresionar a quien no importa!",
    "¡Invertir en conocimiento es la mejor inversión!",
    "¡Controlar tus finanzas es controlar tu futuro!",
  ];

  const elementoFrase = document.getElementById("frase_motivadora");

  if (elementoFrase) {
    const indice = Math.floor(Math.random() * frases.length);
    elementoFrase.textContent = frases[indice];
  }

  /* ===============================
       MOSTRAR NOMBRE DEL USUARIO
    =============================== */

  const elementoNombre = document.getElementById("nombre_usuario");
  const nombreGuardado = localStorage.getItem("nombre_usuario");

  if (elementoNombre && nombreGuardado) {
    elementoNombre.textContent = nombreGuardado;
  }

  /* ===============================
       BOTÓN CONFIGURACIÓN ⚙️
    =============================== */

  const botonConfiguracion = document.getElementById("botonConfiguracion");
  const contenedorFlotante = document.querySelector(".contenedor-flotante");
  const botonesOpciones = document.querySelectorAll(".boton-opcion");

  if (botonConfiguracion) {
    botonConfiguracion.addEventListener("click", function (evento) {
      evento.stopPropagation();
      contenedorFlotante.classList.toggle("active");
    });
  }

  botonesOpciones.forEach(function (boton) {
    boton.addEventListener("click", function () {
      contenedorFlotante.classList.remove("active");
    });
  });

  document.addEventListener("click", function (evento) {
    if (contenedorFlotante && !contenedorFlotante.contains(evento.target)) {
      contenedorFlotante.classList.remove("active");
    }
  });

  const avatarPrincipal = document.getElementById("avatarPrincipal");
  const panelEdicion = document.getElementById("panelEdicion");
  const inputNombre = document.getElementById("inputNombre");
  const contenedorAvatar = document.getElementById("contenedorAvatar");

  /* Toggle panel de edición al clickear el avatar */
  if (contenedorAvatar) {
    contenedorAvatar.addEventListener("click", function () {
      panelEdicion.classList.toggle("activo");
      if (panelEdicion.classList.contains("activo")) {
        inputNombre.value = elementoNombre.textContent;
        inputNombre.focus();
      }
    });
  }

  /* Cambiar nombre en tiempo real */
  if (inputNombre) {
    inputNombre.addEventListener("input", function () {
      const nuevoNombre = inputNombre.value || "Usuario";
      elementoNombre.textContent = nuevoNombre;
      localStorage.setItem("nombre_usuario", nuevoNombre);
    });
  }

  /*X para cerrar panel de usuario */
  const cerrarPanelBtn = document.getElementById("cerrarPanel");
  if (cerrarPanelBtn) {
    cerrarPanelBtn.addEventListener("click", function () {
      document.getElementById("panelUsuario").classList.remove("activo");
      if (panelEdicion) panelEdicion.classList.remove("activo");
    });
  }

  /* ===============================
       BOTÓN CERRAR SESIÓN
    =============================== */

  const botonCerrar = document.querySelector(".boton-cerrar");

  if (botonCerrar) {
    botonCerrar.addEventListener("click", function () {
      window.location.href = "../Inicio/inicio.html";
    });
  }

  /* ===============================
       INICIALIZACIÓN DASHBOARD
    =============================== */
  
  // Estado Global del Dashboard
  let deudas = [];
  
  let paginaActual = 1;
  const registrosPorPagina = 4;

  inicializarDashboard();

  function inicializarDashboard() {
    actualizarKPIs();

    // Inicializar Gráficos (solo si existen los lienzos)
    if (document.getElementById('chartEvolucion')) initChartEvolucion();
    if (document.getElementById('chartTipoDeuda')) initChartTipoDeuda();
    if (document.getElementById('chartUtilizado')) initChartUtilizado(0); // Inicia en 0%
    if (document.getElementById('chartPresupuesto')) initChartPresupuesto();
    
    // Poblar Tablas y Listas
    if (document.getElementById('listaVencimientos')) poblarListaVencimientos();
    
    // Render Inicial de Tabla con Paginación
    renderTablaDeudas(1);
    
    // Configurar Eventos de Modal
    configurarEventosModal();
  }

  function actualizarKPIs() {
    // Cálculo simple basado en el array
    const total = deudas.reduce((sum, d) => sum + parseFloat(d.actual.replace(/[^0-9.-]+/g,"")), 0);
    const inicial = deudas.reduce((sum, d) => sum + parseFloat(d.inicial.replace(/[^0-9.-]+/g,"")), 0);
    
    const elDT = document.getElementById("valDeudaTotal");
    const elSP = document.getElementById("valSaldoPendiente");
    
    if (elDT) elDT.textContent = `$${total.toLocaleString()}`;
    if (elSP) elSP.textContent = `$${total.toLocaleString()}`; // Simplificado
  }

  function renderTablaDeudas(pagina) {
    const body = document.getElementById('tablaDeudasBody');
    if (!body) return;

    paginaActual = pagina;
    const inicio = (pagina - 1) * registrosPorPagina;
    const fin = inicio + registrosPorPagina;
    const deudasPaginadas = deudas.slice(inicio, fin);

    body.innerHTML = deudasPaginadas.map((d, index) => {
      const globalIndex = inicio + index;
      return `
        <tr>
          <td><b>${d.acreedor}</b></td>
          <td><span style="color:var(--dash-blue)">${d.tipo}</span></td>
          <td>${d.inicial}</td>
          <td><b>${d.actual}</b></td>
          <td>${d.tasa}</td>
          <td style="color:var(--status-bad)">${formatFecha(d.venc)}</td>
          <td><span class="badge ${d.badge}">${d.estado}</span></td>
          <td>
            <button class="btn-edit" onclick="abrirModalDeuda(${globalIndex})">
              <i class="fa-solid fa-pencil"></i>
            </button>
            <button class="btn-delete" onclick="eliminarDeuda(${globalIndex})">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    setupPagination();
  }

  function setupPagination() {
    const container = document.getElementById('paginacionDeudas');
    if (!container) return;

    const totalPaginas = Math.ceil(deudas.length / registrosPorPagina);
    let html = `
      <button class="btn-page" ${paginaActual === 1 ? 'disabled' : ''} onclick="cambiarPagina(${paginaActual - 1})">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
    `;

    for (let i = 1; i <= totalPaginas; i++) {
      html += `
        <button class="btn-page ${i === paginaActual ? 'active' : ''}" onclick="cambiarPagina(${i})">
          ${i}
        </button>
      `;
    }

    html += `
      <button class="btn-page" ${paginaActual === totalPaginas ? 'disabled' : ''} onclick="cambiarPagina(${paginaActual + 1})">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    `;

    container.innerHTML = html;
  }

  window.cambiarPagina = function(num) {
    renderTablaDeudas(num);
  };

  window.eliminarDeuda = function(index) {
    if (confirm('¿Estás seguro de que deseas eliminar esta deuda?')) {
      deudas.splice(index, 1);
      // Si la página se queda vacía, retroceder
      const totalPaginas = Math.ceil(deudas.length / registrosPorPagina);
      if (paginaActual > totalPaginas && totalPaginas > 0) paginaActual = totalPaginas;
      renderTablaDeudas(paginaActual);
      actualizarKPIs();
    }
  };

  function configurarEventosModal() {
    const modal = document.getElementById('modalDeuda');
    const btnAbrir = document.getElementById('btnAbrirModalDeuda');
    const btnCerrar = document.getElementById('btnCerrarModalDeuda');
    const btnCancelar = document.getElementById('btnCancelarDeuda');
    const form = document.getElementById('formDeuda');

    if (btnAbrir) btnAbrir.onclick = () => abrirModalDeuda();
    if (btnCerrar) btnCerrar.onclick = cerrarModalDeuda;
    if (btnCancelar) btnCancelar.onclick = cerrarModalDeuda;

    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        guardarDeuda();
      };
    }

    // Cerrar clickeando fuera
    window.onclick = (event) => {
      if (event.target === modal) cerrarModalDeuda();
    };
  }

  window.abrirModalDeuda = function(index = null) {
    const modal = document.getElementById('modalDeuda');
    const titulo = document.getElementById('modalDeudaTitulo');
    const form = document.getElementById('formDeuda');
    
    form.reset();
    document.getElementById('deudaIndex').value = index !== null ? index : '';
    
    if (index !== null) {
      titulo.textContent = 'Editar Deuda';
      const d = deudas[index];
      document.getElementById('acreedor').value = d.acreedor;
      document.getElementById('tipo').value = d.tipo;
      document.getElementById('saldoInicial').value = parseFloat(d.inicial.replace(/[^0-9.-]+/g,""));
      document.getElementById('saldoActual').value = parseFloat(d.actual.replace(/[^0-9.-]+/g,""));
      document.getElementById('tasa').value = parseFloat(d.tasa.replace(/[^0-9.-]+/g,""));
      document.getElementById('vencimiento').value = d.venc;
      document.getElementById('estado').value = d.estado;
    } else {
      titulo.textContent = 'Nueva Deuda';
    }

    modal.classList.add('activo');
  };

  function cerrarModalDeuda() {
    const modal = document.getElementById('modalDeuda');
    modal.classList.remove('activo');
  }

  function guardarDeuda() {
    const index = document.getElementById('deudaIndex').value;
    const acreedor = document.getElementById('acreedor').value;
    const tipo = document.getElementById('tipo').value;
    const inicial = parseFloat(document.getElementById('saldoInicial').value);
    const actual = parseFloat(document.getElementById('saldoActual').value);
    const tasa = parseFloat(document.getElementById('tasa').value);
    const venc = document.getElementById('vencimiento').value;
    const estado = document.getElementById('estado').value;

    const badge = estado === 'Al día' ? 'success' : (estado === 'Próximo' ? 'warning' : 'danger');

    const nuevaDeuda = {
      acreedor,
      tipo,
      inicial: `$${inicial.toLocaleString()}`,
      actual: `$${actual.toLocaleString()}`,
      tasa: `${tasa}%`,
      venc,
      estado,
      badge
    };

    if (index !== '') {
      deudas[index] = nuevaDeuda;
    } else {
      deudas.push(nuevaDeuda);
      paginaActual = Math.ceil(deudas.length / registrosPorPagina);
    }

    renderTablaDeudas(paginaActual);
    actualizarKPIs();
    cerrarModalDeuda();
  }

  function formatFecha(str) {
    if (!str) return '---';
    const partes = str.split('-');
    if (partes.length !== 3) return str;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  // --- Gráficos Originales ---
  
  function initChartEvolucion() {
    const ctx = document.getElementById('chartEvolucion').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
          {
            label: 'Saldo Total',
            type: 'line',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Pagos',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: '#10b981',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#e2e8f0' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  function initChartTipoDeuda() {
    const ctx = document.getElementById('chartTipoDeuda').getContext('2d');
    const data = {
      labels: ['Bancaria', 'Tarjeta Crédito', 'Préstamos', 'Proveedores', 'Otros'],
      datasets: [{
        data: [0, 0, 0, 0, 0],
        backgroundColor: ['#2563eb', '#ec4899', '#10b981', '#f59e0b', '#94a3b8'],
        borderWidth: 0
      }]
    };

    new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        cutout: '70%',
        plugins: { legend: { display: false } }
      }
    });

    const legend = document.getElementById('tipoDeudaLegend');
    if (legend) {
      legend.innerHTML = '';
      const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
      
      if (total > 0) {
        data.labels.forEach((label, i) => {
          const val = data.datasets[0].data[i];
          const per = ((val / total) * 100).toFixed(1);
          legend.innerHTML += `
            <div class="legend-item">
              <div class="legend-label">
                <span class="legend-dot" style="background:${data.datasets[0].backgroundColor[i]}"></span>
                ${label}
              </div>
              <div class="legend-value">$${val}M <span style="color:#64748b; font-weight:400; margin-left:8px">${per}%</span></div>
            </div>
          `;
        });
      } else {
        legend.innerHTML = '<p style="color:#64748b; font-size:0.9rem; text-align:center; width:100%;">Sin datos disponibles</p>';
      }
    }
  }

  function initChartUtilizado(valor) {
    const ctx = document.getElementById('chartUtilizado').getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [valor, 100 - valor],
          backgroundColor: ['#2563eb', '#e2e8f0'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '80%',
        plugins: { tooltip: { enabled: false }, legend: { display: false } }
      }
    });
  }

  function initChartPresupuesto() {
    const ctx = document.getElementById('chartPresupuesto').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
          {
            label: 'Real',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: '#2563eb',
            borderRadius: 4
          },
          {
            label: 'Acumulado',
            type: 'line',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            borderColor: '#10b981',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: '#e2e8f0' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  function poblarListaVencimientos() {
    const items = [];

    const container = document.getElementById('listaVencimientos');
    if (container) {
      container.innerHTML = items.map(item => `
        <div class="list-item">
          <div class="date-box">
            <span class="date-day">${item.dia}</span>
            <span class="date-month">${item.mes}</span>
          </div>
          <div class="item-info">
            <span class="item-title">${item.titulo}</span>
            <span class="item-sub">${item.sub}</span>
          </div>
          <div class="item-amount">
            <span class="amount-val">${item.monto}</span>
            <span class="due-in">${item.falta}</span>
          </div>
        </div>
      `).join('');
    }
  }

  // --- Otros ---

  const btnApp = document.getElementById('btnAplicarFiltros');
  const btnCle = document.getElementById('btnLimpiarFiltros');
  const btnPdf = document.getElementById('btnDescargarPDF');
  const btnExc = document.getElementById('btnExportarExcel');

  if (btnApp) btnApp.addEventListener('click', () => alert('Filtros aplicados correctamente.'));
  if (btnCle) btnCle.addEventListener('click', () => alert('Filtros restablecidos.'));
  if (btnPdf) btnPdf.addEventListener('click', () => alert('Generando reporte PDF...'));
  if (btnExc) btnExc.addEventListener('click', () => alert('Exportando a Excel...'));

  const pieAnio = document.getElementById("pie-anio");
  if (pieAnio) pieAnio.textContent = String(new Date().getFullYear());
});

// Desplegar panel de usuario

const botonPerfil = document.getElementById("botonPerfil");
const panelUsuario = document.getElementById("panelUsuario");

if (botonPerfil) {
  botonPerfil.addEventListener("click", function () {
    panelUsuario.classList.toggle("activo");
  });
}
