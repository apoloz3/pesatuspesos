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
 * Inicializa el gráfico del balance principal con Chart.js
 */
function inicializarGraficos() {
    const ctx = document.getElementById('graficoBalancePrincipal');
    if (!ctx) return;

    const registros = JSON.parse(localStorage.getItem('registros_financieros')) || [];
    const opcionesConceptoIngreso = ["Sueldo", "Venta", "Inversión", "Regalo", "Otro"];

    // Ordenar los registros por fecha
    const regsSorted = registros
        .filter(r => r.fecha)
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    let dataPoints = [];
    let labels = [];
    let balanceActual = 0;

    if (regsSorted.length === 0) {
        // Fallback visual si no hay datos
        dataPoints = [0, 0];
        labels = ["Sin mes", "Sin mes"];
    } else {
        regsSorted.forEach(reg => {
            const monto = parseFloat(reg.monto) || 0;
            const esIngreso = opcionesConceptoIngreso.includes(reg.concepto) || reg.tipo === 'ingreso';
            const esEgreso = ["Vivienda", "Alimentación", "Transporte", "Servicios", "Entretenimiento", "Salud", "Otro"].includes(reg.concepto) || reg.tipo === 'egreso';
            
            if (esIngreso) {
                balanceActual += monto; // Subida
            } else if (esEgreso) {
                balanceActual -= monto; // Bajada
            }
            dataPoints.push(balanceActual);

            // Obtener el mes y día
            const fechaObj = new Date(reg.fecha + 'T00:00:00');
            const mesStr = fechaObj.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
            labels.push(mesStr);
        });
    }

    let chartGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 180);
    chartGradient.addColorStop(0, 'rgba(255, 204, 0, 0.15)');
    chartGradient.addColorStop(1, 'rgba(255, 204, 0, 0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Balance Total',
                data: dataPoints,
                borderColor: '#ffcc00', // Dorado
                borderWidth: 2,
                backgroundColor: chartGradient,
                fill: true,
                tension: 0, // Líneas rectas
                pointBackgroundColor: '#001a2d',
                pointBorderColor: '#ffcc00',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: { left: -5, bottom: -5 }
            },
            scales: {
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false,
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.4)',
                        font: { family: "'Inter', sans-serif", size: 11 },
                        callback: function(value) {
                            if (Math.abs(value) >= 1000) {
                                return (value / 1000).toFixed(0) + 'k';
                            }
                            return value;
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        display: true, // Ahora mostramos los meses abajo
                        color: 'rgba(255, 255, 255, 0.5)',
                        font: { family: "'Inter', sans-serif", size: 10 },
                        maxRotation: 45,
                        minRotation: 0
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 10, 18, 0.9)',
                    titleColor: '#fedc00',
                    bodyColor: '#ffffff',
                    borderColor: '#cfb53c',
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return '$ ' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
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
