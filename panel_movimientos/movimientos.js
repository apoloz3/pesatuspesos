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

  const indice = Math.floor(Math.random() * frases.length);

  elementoFrase.textContent = frases[indice];

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
  const opcionesAvatar = document.querySelectorAll(".opcion-avatar");
  const contenedorAvatar = document.getElementById("contenedorAvatar");
  const panelEdicion = document.getElementById("panelEdicion");
  const inputNombre = document.getElementById("inputNombre");

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

  const pieAnio = document.getElementById("pieAnio");
  if (pieAnio) pieAnio.textContent = String(new Date().getFullYear());

  /* --- LÓGICA ESPECÍFICA DEL TABLERO --- */
  inicializarGraficos();
  aplicarEfectosEntrada();
  sincronizarTotales();
  actualizarMovimientosRecientes();

  // Redirección a Panel Ingresos
  const btnIngresos = document.getElementById('btnIngresos');
  if (btnIngresos) {
      btnIngresos.addEventListener('click', () => {
          window.location.href = '../panel_ingresos/ingresos.html';
      });
  }
});

/**
 * Inicializa el gráfico del balance principal.
 * - Línea VERDE con área rellena para Ingresos acumulados
 * - Línea ROJA  con área rellena para Egresos acumulados
 * Estilo oscuro inspirado en dashboards de criptomonedas.
 */
function inicializarGraficos() {
    const canvas = document.getElementById('graficoBalancePrincipal');
    if (!canvas) return;

    const registros = JSON.parse(localStorage.getItem('registros_financieros')) || [];
    const opcionesConceptoIngreso = ["Sueldo", "Venta", "Inversión", "Regalo", "Otro"];
    const opcionesConceptoEgreso  = ["Vivienda", "Alimentación", "Transporte", "Servicios", "Entretenimiento", "Salud", "Otro"];

    // Ordenar registros por fecha
    const regsSorted = registros
        .filter(r => r.fecha)
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    let puntosIngresos = [];
    let puntosEgresos  = [];
    let labels         = [];
    let acumIngreso    = 0;
    let acumEgreso     = 0;

    if (regsSorted.length === 0) {
        // Fallback visual cuando no hay datos
        puntosIngresos = [100, 200, 250, 300, 320, 400, 460, 500, 560, 620, 700];
        puntosEgresos  = [80,  150, 170, 210, 260, 290, 310, 350, 370, 400, 430];
        labels = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov'];
    } else {
        regsSorted.forEach(reg => {
            const monto     = parseFloat(reg.monto) || 0;
            const esIngreso = opcionesConceptoIngreso.includes(reg.concepto) || reg.tipo === 'ingreso';
            const esEgreso  = opcionesConceptoEgreso.includes(reg.concepto)  || reg.tipo === 'egreso';

            if (esIngreso)     acumIngreso += monto;
            else if (esEgreso) acumEgreso  += monto;

            puntosIngresos.push(acumIngreso);
            puntosEgresos.push(acumEgreso);

            const fechaObj = new Date(reg.fecha + 'T00:00:00');
            labels.push(fechaObj.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }));
        });
    }

    const ctx2d = canvas.getContext('2d');
    const h = canvas.parentElement ? canvas.parentElement.offsetHeight || 180 : 180;

    // Gradiente VERDE (ingresos)
    const gradVerde = ctx2d.createLinearGradient(0, 0, 0, h);
    gradVerde.addColorStop(0,   'rgba(34, 197, 94, 0.45)');
    gradVerde.addColorStop(0.6, 'rgba(34, 197, 94, 0.10)');
    gradVerde.addColorStop(1,   'rgba(34, 197, 94, 0.00)');

    // Gradiente ROJO (egresos)
    const gradRojo = ctx2d.createLinearGradient(0, 0, 0, h);
    gradRojo.addColorStop(0,   'rgba(255, 60, 60, 0.45)');
    gradRojo.addColorStop(0.6, 'rgba(255, 60, 60, 0.10)');
    gradRojo.addColorStop(1,   'rgba(255, 60, 60, 0.00)');

    // Plugin: punto activo con halo de color
    const pluginPuntoHalo = {
        id: 'puntoHalo',
        afterDatasetsDraw(chart) {
            const { ctx, tooltip } = chart;
            if (!tooltip || !tooltip._active || tooltip._active.length === 0) return;
            tooltip._active.forEach(punto => {
                const x     = punto.element.x;
                const y     = punto.element.y;
                const color = punto.datasetIndex === 0 ? '#22c55e' : '#ff3c3c';
                ctx.save();
                // Halo exterior
                ctx.beginPath();
                ctx.arc(x, y, 10, 0, Math.PI * 2);
                ctx.fillStyle = color.replace(')', ', 0.25)').replace('rgb', 'rgba');
                ctx.fill();
                // Punto central
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = color;
                ctx.shadowBlur  = 10;
                ctx.fill();
                ctx.restore();
            });
        }
    };

    new Chart(canvas, {
        type: 'line',
        plugins: [pluginPuntoHalo],
        data: {
            labels: labels,
            datasets: [
                {
                    // ── INGRESOS ──
                    label: 'Ingresos',
                    data: puntosIngresos,
                    borderColor: '#22c55e',
                    borderWidth: 2.5,
                    backgroundColor: gradVerde,
                    fill: true,
                    tension: 0.45,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                },
                {
                    // ── EGRESOS ──
                    label: 'Egresos',
                    data: puntosEgresos,
                    borderColor: '#ff3c3c',
                    borderWidth: 2.5,
                    backgroundColor: gradRojo,
                    fill: true,
                    tension: 0.45,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 900, easing: 'easeInOutQuart' },
            layout: { padding: { left: 0, right: 4, top: 8, bottom: 0 } },
            scales: {
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.04)',
                        drawBorder: false,
                    },
                    border: { display: false },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.35)',
                        font: { size: 10 },
                        maxTicksLimit: 5,
                        callback(value) {
                            if (Math.abs(value) >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M';
                            if (Math.abs(value) >= 1_000)     return (value / 1_000).toFixed(0) + 'k';
                            return value;
                        }
                    }
                },
                x: {
                    grid: { display: false },
                    border: { display: false },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.35)',
                        font: { size: 10 },
                        maxRotation: 0,
                        maxTicksLimit: 6,
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: 'rgba(255,255,255,0.6)',
                        font: { size: 11 },
                        boxWidth: 12,
                        boxHeight: 3,
                        borderRadius: 2,
                        padding: 14,
                        usePointStyle: true,
                        pointStyle: 'line',
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 10, 18, 0.92)',
                    titleColor: 'rgba(255,255,255,0.5)',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(255,255,255,0.08)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    boxWidth: 8,
                    boxHeight: 8,
                    callbacks: {
                        title(items) {
                            return items[0]?.label || '';
                        },
                        label(context) {
                            const simbolo = context.datasetIndex === 0 ? '▲ Ingresos' : '▼ Egresos';
                            return `  ${simbolo}: $ ${context.parsed.y.toLocaleString('es-CO')}`;
                        }
                    }
                }
            },
            interaction: { intersect: false, mode: 'index' },
        }
    });
}

/**
 * Añade animaciones de entrada a las tarjetas de forma secuencial
 */
function aplicarEfectosEntrada() {
    const tarjetas = document.querySelectorAll(".tarjeta-panel");
    tarjetas.forEach((tarjeta, indice) => {
        tarjeta.style.opacity = "0";
        tarjeta.style.transform = "translateY(20px)";
        tarjeta.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        setTimeout(() => {
            tarjeta.style.opacity = "1";
            tarjeta.style.transform = "translateY(0)";
        }, 150 * (indice + 1));
    });
}

// Desplegar panel de usuario

const botonPerfil = document.getElementById("botonPerfil");
const panelUsuario = document.getElementById("panelUsuario");

if (botonPerfil) {
  botonPerfil.addEventListener("click", function () {
    panelUsuario.classList.toggle("activo");
  });
}

/**
 * Lee los datos de registros_financieros y actualiza los montos en el tablero principal
 */
function sincronizarTotales() {
    const registros = JSON.parse(localStorage.getItem('registros_financieros')) || [];
    const opcionesConceptoIngreso = ["Sueldo", "Venta", "Inversión", "Regalo", "Otro"];
    const opcionesConceptoEgreso = ["Vivienda", "Alimentación", "Transporte", "Servicios", "Entretenimiento", "Salud", "Otro"];
    
    let totalIngresos = 0;
    let totalGastos = 0;

    registros.forEach(reg => {
        const monto = parseFloat(reg.monto) || 0;
        if (opcionesConceptoIngreso.includes(reg.concepto) || reg.tipo === 'ingreso') {
            totalIngresos += monto;
        } else if (opcionesConceptoEgreso.includes(reg.concepto) || reg.tipo === 'egreso') {
            totalGastos += monto;
        }
    });

    const balance = totalIngresos - totalGastos;

    // Actualizar elementos en el DOM
    const elIngresos = document.querySelector('#btnIngresos .monto-small');
    const elEgresos = document.querySelector('#btnEgresos .monto-small');
    const elBalance = document.querySelector('.tarjeta-balance-principal .monto-balance');
    
    if (elIngresos) elIngresos.textContent = formatCurrency(totalIngresos);
    if (elEgresos) elEgresos.textContent = formatCurrency(totalGastos);
    if (elBalance) elBalance.textContent = formatCurrency(balance);
}

function formatCurrency(valor) {
    return new Intl.NumberFormat('es-CO', { 
        style: 'currency', 
        currency: 'COP', 
        minimumFractionDigits: 0 
    }).format(valor).replace('COP', '$');
}

/**
 * Lee los datos de registros_financieros y actualiza la tarjeta de Movimientos Recientes
 */
function actualizarMovimientosRecientes() {
    const contenedor = document.getElementById('listaMovimientosRecientes');
    if (!contenedor) return;

    const registros = JSON.parse(localStorage.getItem('registros_financieros')) || [];
    
    // Sort by date descending, gracefully handling empty dates (as Epoch 0)
    registros.sort((a, b) => {
        const da = new Date(a.fecha).getTime() || 0;
        const db = new Date(b.fecha).getTime() || 0;
        return db - da;
    });

    // Get the most recent 4
    const recientes = registros.slice(0, 4);

    contenedor.innerHTML = ''; // Limpiar predeterminados

    if (recientes.length === 0) {
        contenedor.innerHTML = '<p style="color: var(--text-muted); padding: 1rem;">No hay movimientos recientes.</p>';
        return;
    }

    const opcionesConceptoIngreso = ["Sueldo", "Venta", "Inversión", "Regalo", "Otro"];

    recientes.forEach(reg => {
        const esIngreso = opcionesConceptoIngreso.includes(reg.concepto) || reg.tipo === 'ingreso';
        const tipoClase = esIngreso ? 'ingreso' : 'egreso';
        const icono = esIngreso ? 'fa-plus' : 'fa-minus'; // Se puede mejorar mapeando concepto a icono
        const montoStr = formatCurrency(parseFloat(reg.monto) || 0);
        const montoClase = esIngreso ? 'positivo' : 'negativo';
        const signo = esIngreso ? '+' : '-';
        const etiquetaTipo = esIngreso ? 'Ingreso' : 'Egreso';
        const fechaFormat = formatoFechaRelativa(reg.fecha);

        const htmlStr = `
          <div class="fila-movimiento">
            <div class="item-izquierda">
              <div class="circulo-icono ${tipoClase}">
                <i class="fa-solid ${icono}"></i>
              </div>
              <div class="detalles-mov">
                <span class="nombre-mov">${reg.descripcion || reg.concepto}</span>
                <span class="tipo-mov">- ${etiquetaTipo} -</span>
              </div>
            </div>
            <div class="item-derecha">
              <span class="monto-mov ${montoClase}">${signo}${montoStr}</span>
              <span class="fecha-mov">${fechaFormat}</span>
            </div>
          </div>
        `;
        contenedor.insertAdjacentHTML('beforeend', htmlStr);
    });
}

function formatoFechaRelativa(fechaStr) {
    if (!fechaStr) return 'Desconocida';
    const fecha = new Date(fechaStr + 'T00:00:00'); // Evitar problemas de zona horaria
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const diffTime = Math.abs(hoy - fecha);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays <= 7) return `Hace ${diffDays} días`;
    
    // Si es más viejo, mostrar fecha corta
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
}
