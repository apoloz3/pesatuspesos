document.addEventListener("DOMContentLoaded", function () {

  /* ─── FRASE MOTIVADORA ─────────────────────────────────────── */
  const frases = [
    "¡En la vida y en las finanzas, el riesgo es inevitable!",
    "¡El ahorro de hoy es la libertad de mañana!",
    "¡No gastes lo que no tienes para impresionar a quien no importa!",
    "¡Invertir en conocimiento es la mejor inversión!",
    "¡Controlar tus finanzas es controlar tu futuro!",
  ];
  const elementoFrase = document.getElementById("frase_motivadora");
  if (elementoFrase) {
    elementoFrase.textContent = frases[Math.floor(Math.random() * frases.length)];
  }

  /* ─── NOMBRE USUARIO ───────────────────────────────────────── */
  const elementoNombre = document.getElementById("nombre_usuario");
  const elementoNombreHeader = document.getElementById("nombreUsuarioHeader");
  const nombreGuardado = localStorage.getItem("nombre_usuario") || "Usuario";
  if (elementoNombre) elementoNombre.textContent = nombreGuardado;
  if (elementoNombreHeader) elementoNombreHeader.textContent = nombreGuardado;

  /* ─── BOTÓN CONFIGURACIÓN ──────────────────────────────────── */
  const botonConfiguracion = document.getElementById("botonConfiguracion");
  const contenedorFlotante = document.querySelector(".contenedor-flotante");
  const botonesOpciones    = document.querySelectorAll(".boton-opcion");

  if (botonConfiguracion) {
    botonConfiguracion.addEventListener("click", (e) => {
      e.stopPropagation();
      contenedorFlotante.classList.toggle("active");
    });
  }
  botonesOpciones.forEach(b => b.addEventListener("click", () => contenedorFlotante.classList.remove("active")));
  document.addEventListener("click", (e) => {
    if (contenedorFlotante && !contenedorFlotante.contains(e.target))
      contenedorFlotante.classList.remove("active");
  });

  /* ─── PANEL USUARIO ────────────────────────────────────────── */
  const cerrarPanelBtn = document.getElementById("cerrarPanel");
  if (cerrarPanelBtn) {
    cerrarPanelBtn.addEventListener("click", () => {
      document.getElementById("panelUsuario").classList.remove("activo");
    });
  }
  const botonCerrar = document.querySelector(".boton-cerrar");
  if (botonCerrar) {
    botonCerrar.addEventListener("click", () => {
      window.location.href = "../Inicio/inicio.html";
    });
  }

  /* ═══════════════════════════════════════════════════════════════
                      ESTADO GLOBAL DEL DASHBOARD
   ═══════════════════════════════════════════════════════════════ */
  let deudas  = [];
  let pagos   = [];

  let paginaDeudas   = 1;
  let paginaPagos    = 1;
  const REG_POR_PAG  = 4;

  /* Referencias a instancias de Chart.js para poder actualizarlas */
  let chartEvolucionInst  = null;
  let chartPagosMesInst   = null;
  let chartMetodoPagoInst = null;

  /* ─── INICIALIZAR ───────────────────────────────────────────── */
  inicializarDashboard();

  function inicializarDashboard() {
    renderTablaDeudas(1);
    renderHistorialPagos(1);
    actualizarKPIs();
    initCharts();
    poblarListaVencimientos();
    configurarEventosModalDeuda();
    configurarEventosModalPago();
  }

  /* ═══════════════════════════════════════════════════════════════
                            KPIs
   ═══════════════════════════════════════════════════════════════ */
  function actualizarKPIs() {
    const total   = deudas.reduce((s, d) => s + parseMoney(d.actual), 0);
    const abonado = pagos.reduce((s, p) => s + parseMoney(p.monto), 0);

    const mesActual = new Date().getMonth();
    const anoActual = new Date().getFullYear();
    const pagosMes  = pagos
      .filter(p => {
        const f = new Date(p.fecha);
        return f.getMonth() === mesActual && f.getFullYear() === anoActual;
      })
      .reduce((s, p) => s + parseMoney(p.monto), 0);

    setEl("valDeudaTotal",    formatCurrency(total));
    setEl("valSaldoPendiente", formatCurrency(total));
    setEl("valPagosMes",       formatCurrency(pagosMes));
    setEl("valTotalAbonado",   formatCurrency(abonado));

    // Próximo vencimiento
    const hoy = new Date();
    const proximas = deudas
      .filter(d => d.venc)
      .map(d => ({ ...d, diff: Math.ceil((new Date(d.venc) - hoy) / 86400000) }))
      .filter(d => d.diff >= 0)
      .sort((a, b) => a.diff - b.diff);

    if (proximas.length > 0) {
      setEl("valProxVenc", `${proximas[0].diff} días`);
      document.querySelectorAll('.status-date').forEach(el => {
        el.textContent = formatFecha(proximas[0].venc);
      });
    }
  }

  /* ═══════════════════════════════════════════════════════════════
                      TABLA DEUDAS (con paginación)
   ═══════════════════════════════════════════════════════════════ */
  function renderTablaDeudas(pagina) {
    const body = document.getElementById('tablaDeudasBody');
    if (!body) return;
    paginaDeudas = pagina;
    const inicio = (pagina - 1) * REG_POR_PAG;
    const slice  = deudas.slice(inicio, inicio + REG_POR_PAG);

    if (slice.length === 0) {
      body.innerHTML = `<tr><td colspan="8" class="td-empty">Sin deudas registradas</td></tr>`;
    } else {
      body.innerHTML = slice.map((d, i) => {
        const gi = inicio + i;
        return `
          <tr>
            <td><b>${d.acreedor}</b></td>
            <td><span style="color:var(--dash-blue)">${d.tipo}</span></td>
            <td>${d.inicial}</td>
            <td><b>${d.actual}</b></td>
            <td>${d.tasa}</td>
            <td style="color:var(--status-bad)">${formatFecha(d.venc)}</td>
            <td><span class="badge ${d.badge}">${d.estado}</span></td>
            <td class="acciones-cell">
              <button class="btn-edit" title="Editar" onclick="abrirModalDeuda(${gi})">
                <i class="fa-solid fa-pencil"></i>
              </button>
              <button class="btn-delete" title="Eliminar" onclick="eliminarDeuda(${gi})">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>`;
      }).join('');
    }

    renderPaginacion('paginacionDeudas', deudas.length, paginaDeudas, 'cambiarPaginaDeudas');
  }

  window.cambiarPaginaDeudas = (n) => renderTablaDeudas(n);

  window.eliminarDeuda = function(index) {
    if (confirm('¿Seguro que deseas eliminar esta deuda?')) {
      deudas.splice(index, 1);
      const total = Math.ceil(deudas.length / REG_POR_PAG);
      if (paginaDeudas > total && total > 0) paginaDeudas = total;
      renderTablaDeudas(paginaDeudas);
      actualizarKPIs();
      actualizarGraficas();
    }
  };

  /* ═══════════════════════════════════════════════════════════════
               HISTORIAL DE PAGOS (CRUD + paginación)
   ═══════════════════════════════════════════════════════════════ */
  function renderHistorialPagos(pagina) {
    const body = document.getElementById('tablaHistorialPagosBody');
    if (!body) return;
    paginaPagos = pagina;
    const inicio = (pagina - 1) * REG_POR_PAG;
    const slice  = pagos.slice(inicio, inicio + REG_POR_PAG);

    if (slice.length === 0) {
      body.innerHTML = `<tr><td colspan="5" class="td-empty">No hay pagos registrados</td></tr>`;
    } else {
      body.innerHTML = slice.map((p, i) => {
        const gi = inicio + i;
        const notaIcon = p.notas
          ? `<div class="nota-wrapper">
               <button class="btn-nota" data-nota="${escapeHtml(p.notas)}" title="${escapeHtml(p.notas)}">
                 <i class="fa-solid fa-bell nota-icon"></i>
               </button>
               <div class="nota-popover">${escapeHtml(p.notas)}</div>
             </div>`
          : `<span class="sin-nota">—</span>`;
        return `
          <tr>
            <td>${formatFecha(p.fecha)}</td>
            <td><b>${p.monto}</b></td>
            <td><span class="badge metodo-badge">${p.metodo}</span></td>
            <td>${notaIcon}</td>
            <td class="acciones-cell">
              <button class="btn-edit" title="Editar" onclick="abrirModalPago(${gi})">
                <i class="fa-solid fa-pencil"></i>
              </button>
              <button class="btn-delete" title="Eliminar" onclick="eliminarPago(${gi})">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>`;
      }).join('');
    }

    renderPaginacion('paginacionPagos', pagos.length, paginaPagos, 'cambiarPaginaPagos');
    bindNotaPopovers();
  }

  window.cambiarPaginaPagos = (n) => renderHistorialPagos(n);

  window.eliminarPago = function(index) {
    if (confirm('¿Seguro que deseas eliminar este pago?')) {
      pagos.splice(index, 1);
      const total = Math.ceil(pagos.length / REG_POR_PAG);
      if (paginaPagos > total && total > 0) paginaPagos = total;
      renderHistorialPagos(paginaPagos);
      actualizarKPIs();
      actualizarGraficas();
    }
  };

  /* ─── Popover de notas ──────────────────────────────────────── */
  function bindNotaPopovers() {
    document.querySelectorAll('.btn-nota').forEach(btn => {
      const wrapper = btn.closest('.nota-wrapper');
      const popover = wrapper.querySelector('.nota-popover');

      btn.addEventListener('mouseenter', () => popover.classList.add('visible'));
      btn.addEventListener('mouseleave', () => popover.classList.remove('visible'));
      btn.addEventListener('click', () => popover.classList.toggle('visible'));
    });
  }

  /* ─── Helpers de paginación ─────────────────────────────────── */
  function renderPaginacion(containerId, total, actual, fnName) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const totalPags = Math.max(Math.ceil(total / REG_POR_PAG), 1);
    let html = `<button class="btn-page" ${actual === 1 ? 'disabled' : ''} onclick="${fnName}(${actual - 1})">
                  <i class="fa-solid fa-chevron-left"></i></button>`;
    for (let i = 1; i <= totalPags; i++) {
      html += `<button class="btn-page ${i === actual ? 'active' : ''}" onclick="${fnName}(${i})">${i}</button>`;
    }
    html += `<button class="btn-page" ${actual === totalPags ? 'disabled' : ''} onclick="${fnName}(${actual + 1})">
               <i class="fa-solid fa-chevron-right"></i></button>`;
    container.innerHTML = html;
  }

  /* ═══════════════════════════════════════════════════════════════
                      MODAL DEUDA
   ═══════════════════════════════════════════════════════════════ */
  function configurarEventosModalDeuda() {
    const modal     = document.getElementById('modalDeuda');
    const btnAbrir  = document.getElementById('btnAbrirModalDeuda');
    const btnCerrar = document.getElementById('btnCerrarModalDeuda');
    const btnCancel = document.getElementById('btnCancelarDeuda');
    const form      = document.getElementById('formDeuda');

    if (btnAbrir)  btnAbrir.onclick  = () => abrirModalDeuda();
    if (btnCerrar) btnCerrar.onclick = cerrarModalDeuda;
    if (btnCancel) btnCancel.onclick = cerrarModalDeuda;
    if (form)      form.onsubmit     = (e) => { e.preventDefault(); guardarDeuda(); };

    window.addEventListener('click', (e) => { if (e.target === modal) cerrarModalDeuda(); });
  }

  window.abrirModalDeuda = function(index = null) {
    const modal  = document.getElementById('modalDeuda');
    const titulo = document.getElementById('modalDeudaTitulo');
    document.getElementById('formDeuda').reset();
    document.getElementById('deudaIndex').value = index !== null ? index : '';

    if (index !== null) {
      titulo.textContent = 'Editar Deuda';
      const d = deudas[index];
      document.getElementById('acreedor').value    = d.acreedor;
      document.getElementById('tipo').value         = d.tipo;
      document.getElementById('saldoInicial').value = parseMoney(d.inicial);
      document.getElementById('saldoActual').value  = parseMoney(d.actual);
      document.getElementById('tasa').value         = parseMoney(d.tasa);
      document.getElementById('vencimiento').value  = d.venc;
      document.getElementById('estado').value       = d.estado;
    } else {
      titulo.textContent = 'Nueva Deuda';
    }
    modal.classList.add('activo');
  };

  function cerrarModalDeuda() {
    document.getElementById('modalDeuda').classList.remove('activo');
  }

  function guardarDeuda() {
    const index   = document.getElementById('deudaIndex').value;
    const acreedor = document.getElementById('acreedor').value;
    const tipo     = document.getElementById('tipo').value;
    const inicial  = parseFloat(document.getElementById('saldoInicial').value);
    const actual   = parseFloat(document.getElementById('saldoActual').value);
    const tasa     = parseFloat(document.getElementById('tasa').value);
    const venc     = document.getElementById('vencimiento').value;
    const estado   = document.getElementById('estado').value;
    const badge    = estado === 'Al día' ? 'success' : (estado === 'Próximo' ? 'warning' : 'danger');

    const nuevaDeuda = {
      acreedor, tipo,
      inicial: `$${inicial.toLocaleString('es-CO')}`,
      actual:  `$${actual.toLocaleString('es-CO')}`,
      tasa:    `${tasa}%`,
      venc, estado, badge
    };

    if (index !== '') {
      deudas[parseInt(index)] = nuevaDeuda;
    } else {
      deudas.push(nuevaDeuda);
      paginaDeudas = Math.ceil(deudas.length / REG_POR_PAG);
    }

    renderTablaDeudas(paginaDeudas);
    actualizarKPIs();
    actualizarGraficas();
    cerrarModalDeuda();
  }

  /* ═══════════════════════════════════════════════════════════════
                      MODAL PAGO
   ═══════════════════════════════════════════════════════════════ */
  function configurarEventosModalPago() {
    const modal     = document.getElementById('modalPago');
    const btnAbrir  = document.getElementById('btnAbrirModalPago');
    const btnCerrar = document.getElementById('btnCerrarModalPago');
    const btnCancel = document.getElementById('btnCancelarPago');
    const form      = document.getElementById('formPago');

    if (btnAbrir)  btnAbrir.onclick  = () => abrirModalPago();
    if (btnCerrar) btnCerrar.onclick = cerrarModalPago;
    if (btnCancel) btnCancel.onclick = cerrarModalPago;
    if (form)      form.onsubmit     = (e) => { e.preventDefault(); guardarPago(); };

    window.addEventListener('click', (e) => { if (e.target === modal) cerrarModalPago(); });
  }

  window.abrirModalPago = function(index = null) {
    const modal  = document.getElementById('modalPago');
    const titulo = document.getElementById('modalPagoTitulo');
    document.getElementById('formPago').reset();
    document.getElementById('pagoIndex').value = index !== null ? index : '';

    if (index !== null) {
      titulo.textContent = 'Editar Pago';
      const p = pagos[index];
      document.getElementById('fechaPago').value   = p.fecha;
      document.getElementById('montoPago').value   = parseMoney(p.monto);
      document.getElementById('metodoPago').value  = p.metodo;
      document.getElementById('notasPago').value   = p.notas || '';
    } else {
      titulo.textContent = 'Nuevo Pago';
      // Prefill fecha de hoy
      document.getElementById('fechaPago').value = new Date().toISOString().split('T')[0];
    }
    modal.classList.add('activo');
  };

  function cerrarModalPago() {
    document.getElementById('modalPago').classList.remove('activo');
  }

  function guardarPago() {
    const index  = document.getElementById('pagoIndex').value;
    const fecha  = document.getElementById('fechaPago').value;
    const monto  = parseFloat(document.getElementById('montoPago').value);
    const metodo = document.getElementById('metodoPago').value;
    const notas  = document.getElementById('notasPago').value.trim();

    const nuevoPago = {
      fecha,
      monto: `$${monto.toLocaleString('es-CO')}`,
      metodo,
      notas
    };

    if (index !== '') {
      pagos[parseInt(index)] = nuevoPago;
    } else {
      pagos.push(nuevoPago);
      paginaPagos = Math.ceil(pagos.length / REG_POR_PAG);
    }

    renderHistorialPagos(paginaPagos);
    actualizarKPIs();
    actualizarGraficas();
    cerrarModalPago();
  }

  /* ═══════════════════════════════════════════════════════════════
                         GRÁFICAS
   ═══════════════════════════════════════════════════════════════ */
  function initCharts() {
    initChartEvolucion();
    initChartPagosMes();
    initChartMetodoPago();
  }

  function actualizarGraficas() {
    actualizarChartPagosMes();
    actualizarChartMetodoPago();
    actualizarChartEvolucion();
  }

  /* --- Evolución de la Deuda (barras + línea) --- */
  function initChartEvolucion() {
    const ctx = document.getElementById('chartEvolucion');
    if (!ctx) return;
    chartEvolucionInst = new Chart(ctx, {
      type: 'bar',
      data: buildDatosEvolucion(12),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'top',
            labels: { color: '#1e293b', font: { size: 12 } } }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: '#e2e8f0' },
               ticks: { callback: v => `$${v.toLocaleString('es-CO')}` } },
          x: { grid: { display: false } }
        }
      }
    });

    const sel = document.getElementById('selectEvolucion');
    if (sel) sel.addEventListener('change', () => {
      const meses = parseInt(sel.value);
      const data  = buildDatosEvolucion(meses);
      chartEvolucionInst.data = data;
      chartEvolucionInst.update();
    });
  }

  function buildDatosEvolucion(n) {
    const mesesNombres = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const ahora = new Date();
    const labels = [], dataDeuda = [], dataPagos = [];

    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
      labels.push(mesesNombres[d.getMonth()]);

      const pagosMes = pagos
        .filter(p => {
          const f = new Date(p.fecha);
          return f.getMonth() === d.getMonth() && f.getFullYear() === d.getFullYear();
        })
        .reduce((s, p) => s + parseMoney(p.monto), 0);

      const deudaMes = deudas.reduce((s, dd) => s + parseMoney(dd.actual), 0);
      dataDeuda.push(deudaMes);
      dataPagos.push(pagosMes);
    }
    return {
      labels,
      datasets: [
        {
          label: 'Saldo Deuda',
          type: 'line',
          data: dataDeuda,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37,99,235,0.08)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#2563eb'
        },
        {
          label: 'Pagos realizados',
          data: dataPagos,
          backgroundColor: 'rgba(16,185,129,0.8)',
          borderRadius: 6
        }
      ]
    };
  }

  function actualizarChartEvolucion() {
    if (!chartEvolucionInst) return;
    const sel = document.getElementById('selectEvolucion');
    const n   = sel ? parseInt(sel.value) : 12;
    chartEvolucionInst.data = buildDatosEvolucion(n);
    chartEvolucionInst.update();
  }

  /* --- Pagos por Mes (barras) --- */
  function initChartPagosMes() {
    const ctx = document.getElementById('chartPagosMes');
    if (!ctx) return;
    chartPagosMesInst = new Chart(ctx, {
      type: 'bar',
      data: buildDatosPagosMes(),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#e2e8f0' },
               ticks: { callback: v => `$${v.toLocaleString('es-CO')}` } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  function buildDatosPagosMes() {
    const mesesNombres = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const ahora = new Date();
    const labels = [], data = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
      labels.push(mesesNombres[d.getMonth()]);
      const suma = pagos
        .filter(p => {
          const f = new Date(p.fecha);
          return f.getMonth() === d.getMonth() && f.getFullYear() === d.getFullYear();
        })
        .reduce((s, p) => s + parseMoney(p.monto), 0);
      data.push(suma);
    }
    return {
      labels,
      datasets: [{
        label: 'Monto abonado',
        data,
        backgroundColor: data.map((_, i) =>
          `hsla(${160 + i * 15}, 70%, 50%, 0.85)`),
        borderRadius: 8,
        borderSkipped: false
      }]
    };
  }

  function actualizarChartPagosMes() {
    if (!chartPagosMesInst) return;
    chartPagosMesInst.data = buildDatosPagosMes();
    chartPagosMesInst.update();
  }

  /* --- Método de Pago (doughnut) --- */
  function initChartMetodoPago() {
    const ctx = document.getElementById('chartMetodoPago');
    if (!ctx) return;
    const { labels, data, colors } = buildDatosMetodo();
    chartMetodoPagoInst = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{ data, backgroundColor: colors, borderWidth: 0 }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: { legend: { display: false } }
      }
    });
    renderLeyendaMetodo(labels, data, colors);
  }

  function buildDatosMetodo() {
    const palette = ['#2563eb','#10b981','#f59e0b','#ec4899','#8b5cf6','#94a3b8'];
    const conteo  = {};
    pagos.forEach(p => { conteo[p.metodo] = (conteo[p.metodo] || 0) + parseMoney(p.monto); });
    const labels = Object.keys(conteo);
    const data   = Object.values(conteo);
    const colors = labels.map((_, i) => palette[i % palette.length]);
    if (labels.length === 0) {
      return { labels: ['Sin datos'], data: [1], colors: ['#e2e8f0'] };
    }
    return { labels, data, colors };
  }

  function actualizarChartMetodoPago() {
    if (!chartMetodoPagoInst) return;
    const { labels, data, colors } = buildDatosMetodo();
    chartMetodoPagoInst.data.labels = labels;
    chartMetodoPagoInst.data.datasets[0].data = data;
    chartMetodoPagoInst.data.datasets[0].backgroundColor = colors;
    chartMetodoPagoInst.update();
    renderLeyendaMetodo(labels, data, colors);
  }

  function renderLeyendaMetodo(labels, data, colors) {
    const legend = document.getElementById('metodoPagoLegend');
    if (!legend) return;
    const total = data.reduce((a, b) => a + b, 0);
    if (total === 0 || labels[0] === 'Sin datos') {
      legend.innerHTML = `<p style="color:#64748b;font-size:0.85rem;text-align:center;">Sin datos disponibles</p>`;
      return;
    }
    legend.innerHTML = labels.map((label, i) => {
      const per = ((data[i] / total) * 100).toFixed(1);
      return `<div class="legend-item">
        <div class="legend-label">
          <span class="legend-dot" style="background:${colors[i]}"></span>${label}
        </div>
        <div class="legend-value">$${data[i].toLocaleString('es-CO')} <span style="color:#64748b;font-weight:400;margin-left:6px">${per}%</span></div>
      </div>`;
    }).join('');
  }

  /* ─── Lista Próximos Vencimientos ───────────────────────────── */
  function poblarListaVencimientos() {
    const container = document.getElementById('listaVencimientos');
    if (!container) return;
    const hoy     = new Date();
    const proximas = deudas
      .filter(d => d.venc)
      .map(d => {
        const f = new Date(d.venc);
        return {
          ...d,
          diff: Math.ceil((f - hoy) / 86400000),
          dia: f.getDate(),
          mes: ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'][f.getMonth()]
        };
      })
      .filter(d => d.diff >= 0)
      .sort((a, b) => a.diff - b.diff)
      .slice(0, 5);

    if (proximas.length === 0) {
      container.innerHTML = `<p style="color:#64748b;font-size:0.9rem;text-align:center;">Sin vencimientos próximos</p>`;
      return;
    }

    container.innerHTML = proximas.map(item => `
      <div class="list-item">
        <div class="date-box">
          <span class="date-day">${item.dia}</span>
          <span class="date-month">${item.mes}</span>
        </div>
        <div class="item-info">
          <span class="item-title">${item.acreedor}</span>
          <span class="item-sub">${item.tipo}</span>
        </div>
        <div class="item-amount">
          <span class="amount-val">${item.actual}</span>
          <span class="due-in">en ${item.diff} días</span>
        </div>
      </div>`).join('');
  }

  /* ═══════════════════════════════════════════════════════════════
                      FILTROS / EXPORTAR
   ═══════════════════════════════════════════════════════════════ */
  const btnApp = document.getElementById('btnAplicarFiltros');
  const btnCle = document.getElementById('btnLimpiarFiltros');
  const btnPdf = document.getElementById('btnDescargarPDF');
  const btnExc = document.getElementById('btnExportarExcel');

  if (btnApp) btnApp.addEventListener('click', () => mostrarAviso('Filtros aplicados correctamente.'));
  if (btnCle) btnCle.addEventListener('click', () => mostrarAviso('Filtros restablecidos.'));
  if (btnPdf) btnPdf.addEventListener('click', () => {
    if (deudas.length === 0 && pagos.length === 0) {
      mostrarAviso("No hay datos suficientes para generar un reporte.");
      return;
    }
    window.print();
  });

  if (btnExc) btnExc.addEventListener('click', () => {
    if (deudas.length === 0 && pagos.length === 0) {
      mostrarAviso("No hay datos para exportar.");
      return;
    }

    // Encabezados combinados
    let csv = "--- RESUMEN DE DEUDAS ---\n";
    csv += "Acreedor,Tipo,Saldo Inicial,Saldo Actual,Tasa,Vencimiento,Estado\n";
    deudas.forEach(d => {
      csv += `"${d.acreedor}",${d.tipo},"${d.inicial}","${d.actual}",${d.tasa},${d.venc},${d.estado}\n`;
    });

    csv += "\n--- HISTORIAL DE PAGOS ---\n";
    csv += "Fecha Pago,Monto Abonado,Método de Pago,Notas\n";
    pagos.forEach(p => {
      csv += `${p.fecha},"${p.monto}",${p.metodo},"${(p.notas || '').replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Reporte_Deuda_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  /* ═══════════════════════════════════════════════════════════════
                        UTILIDADES
   ═══════════════════════════════════════════════════════════════ */
  function parseMoney(str) {
    if (typeof str === 'number') return str;
    if (!str) return 0;
    return parseFloat(String(str).replace(/[^0-9.-]+/g, '')) || 0;
  }

  function formatCurrency(n) {
    return `$${n.toLocaleString('es-CO')}`;
  }

  function formatFecha(str) {
    if (!str) return '---';
    const p = str.split('-');
    if (p.length !== 3) return str;
    return `${p[2]}/${p[1]}/${p[0]}`;
  }

  function setEl(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

}); // DOMContentLoaded

/* ─── Desplegar panel de usuario (fuera de DOMContentLoaded) ─── */
const botonPerfil  = document.getElementById("botonPerfil");
const panelUsuario = document.getElementById("panelUsuario");
if (botonPerfil) {
  botonPerfil.addEventListener("click", () => panelUsuario.classList.toggle("activo"));
}
