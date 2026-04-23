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

  const generarAvatarLetra = (nombre) => {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    const colores = ['#cfb53b', '#b38b00', '#001524', '#2c3e50', '#8e44ad', '#2980b9', '#16a34a'];
    let hash = 0;
    const nombreLimpio = (nombre || "Usuario").trim();
    for (let i = 0; i < nombreLimpio.length; i++) {
        hash = nombreLimpio.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorFondo = colores[Math.abs(hash) % colores.length];
    // Dibujar fondo circular
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
    ctx.fillStyle = colorFondo;
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    if (colorFondo === '#cfb53b') ctx.fillStyle = '#000000';
    ctx.font = 'bold 100px Montserrat, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const inicial = nombreLimpio.charAt(0).toUpperCase();
    ctx.fillText(inicial, canvas.width / 2, canvas.height / 2);
    return canvas.toDataURL('image/png');
  };

  const elementoNombre = document.getElementById("nombre_usuario");
  const elementoNombreHeader = document.getElementById("nombreUsuarioHeader");
  const nombreGuardado = localStorage.getItem("nombre_usuario") || "Usuario";
  const nombreCapitalizado = nombreGuardado.charAt(0).toUpperCase() + nombreGuardado.slice(1);

  if (elementoNombre) elementoNombre.textContent = nombreCapitalizado;
  if (elementoNombreHeader) elementoNombreHeader.textContent = nombreCapitalizado;

  const avatarPrincipal = document.getElementById("avatarPrincipal");
  const avatarGuardado = localStorage.getItem("pesa-tus-pesos-avatar");
  if (avatarPrincipal) {
    avatarPrincipal.src = avatarGuardado ? avatarGuardado : generarAvatarLetra(nombreCapitalizado);
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
      if (elementoNombre) elementoNombre.textContent = nuevoNombre;
      if (elementoNombreHeader) elementoNombreHeader.textContent = nuevoNombre;
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

  /* --- LÓGICA DE FILTRADO MENSUAL --- */
  let fechaActual = new Date();
  
  const nombresMeses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];

  function actualizarInterfazDashboard() {
      const mes = fechaActual.getMonth();
      const anio = fechaActual.getFullYear();
      
      const nombreMesEl = document.getElementById('nombreMes');
      if (nombreMesEl) nombreMesEl.textContent = `${nombresMeses[mes]} ${anio}`;

      // Recargar todos los componentes
      inicializarGraficos(fechaActual);
      sincronizarTotales(fechaActual);
      actualizarMovimientosRecientes('Hoy'); // Podemos dejarlo como 'Recientes' pero limitado al mes si se desea
      actualizarHistorialMes(document.querySelector('.punto-pag.activo')?.dataset.page || 0, fechaActual);
  }

  // Navegación de Meses
  document.getElementById('mesPrevio')?.addEventListener('click', () => {
      fechaActual.setMonth(fechaActual.getMonth() - 1);
      actualizarInterfazDashboard();
  });

  document.getElementById('mesSiguiente')?.addEventListener('click', () => {
      fechaActual.setMonth(fechaActual.getMonth() + 1);
      actualizarInterfazDashboard();
  });

  // Lógica de Picker (Calendario)
  const abrirPickerBtn = document.getElementById('abrirPicker');
  const pickerModal = document.getElementById('pickerCalendario');
  const gridMeses = document.getElementById('gridMeses');
  const inputAnio = document.getElementById('inputAnioManual');
  const listaAniosDropdown = document.getElementById('listaAniosDropdown');
  const aplicarBtn = document.getElementById('aplicarPicker');
  const limpiarBtn = document.getElementById('limpiarPicker');

  if (abrirPickerBtn && pickerModal) {
      abrirPickerBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const esActivo = pickerModal.classList.contains('activo');
          
          if (!esActivo) {
              pickerModal.classList.add('activo');
              if (inputAnio) inputAnio.value = fechaActual.getFullYear();
              renderizarMesesPicker();
              ocultarDropdownAnios();
          } else {
              pickerModal.classList.remove('activo');
          }
      });
  }

  function renderizarMesesPicker() {
      gridMeses.innerHTML = '';
      const mesesCortos = ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic."];
      
      mesesCortos.forEach((nombre, index) => {
          const btn = document.createElement('button');
          btn.className = `mes-btn ${index === fechaActual.getMonth() ? 'seleccionado' : ''}`;
          btn.textContent = nombre;
          btn.onclick = () => {
              document.querySelectorAll('.mes-btn').forEach(b => b.classList.remove('seleccionado'));
              btn.classList.add('seleccionado');
              btn.dataset.mes = index;
          };
          if (index === fechaActual.getMonth()) btn.dataset.mes = index;
          gridMeses.appendChild(btn);
      });
  }

  // Lógica de dropdown de años
  if (inputAnio) {
      inputAnio.addEventListener('focus', mostrarDropdownAnios);
      
      inputAnio.addEventListener('input', () => {
          const valor = inputAnio.value;
          
          if (valor.length === 0) {
              mostrarError('Campo requerido');
          } else {
              limpiarError();
          }
      });
  }

  function mostrarError(msg) {
      const errorAnio = document.getElementById('errorAnio');
      if (errorAnio) {
          errorAnio.textContent = msg;
          errorAnio.style.display = 'block';
      }
      if (inputAnio) {
          inputAnio.style.borderColor = '#ff6060';
          inputAnio.style.boxShadow = '0 0 8px rgba(255, 96, 96, 0.2)';
      }
  }

  function limpiarError() {
      const errorAnio = document.getElementById('errorAnio');
      if (errorAnio) {
          errorAnio.textContent = '';
          errorAnio.style.display = 'none';
      }
      if (inputAnio) {
          inputAnio.style.borderColor = '';
          inputAnio.style.boxShadow = '';
      }
  }

  function mostrarDropdownAnios() {
      listaAniosDropdown.classList.add('activo');
      renderizarAniosDropdown();
  }

  function ocultarDropdownAnios() {
      listaAniosDropdown.classList.remove('activo');
  }

  function renderizarAniosDropdown() {
      listaAniosDropdown.innerHTML = '';
      const anioMin = 1900;
      const anioMax = 2080;
      
      for (let i = anioMin; i <= anioMax; i++) {
          const item = document.createElement('div');
          item.className = 'anio-item';
          item.textContent = i;
          item.onclick = (e) => {
              e.stopPropagation();
              inputAnio.value = i;
              ocultarDropdownAnios();
          };
          listaAniosDropdown.appendChild(item);
      }
      
      // Hacer scroll hasta el año actual o el seleccionado
      const anioActual = parseInt(inputAnio.value) || new Date().getFullYear();
      const index = anioActual - anioMin;
      if (index >= 0) {
          const itemHeight = 32; // Aproximado
          listaAniosDropdown.scrollTop = index * itemHeight - 50;
      }
  }

  aplicarBtn?.addEventListener('click', () => {
      const mesSeleccionado = document.querySelector('.mes-btn.seleccionado')?.dataset.mes;
      const anioSeleccionado = parseInt(inputAnio.value);

      // Validar año final
      if (isNaN(anioSeleccionado) || anioSeleccionado < 1900 || anioSeleccionado > 2080) {
          mostrarError('Año inválido');
          return;
      }

      // Validar mes
      if (mesSeleccionado === undefined) {
          alert('Por favor, selecciona un mes.');
          return;
      }

      // Si todo es válido
      fechaActual.setMonth(parseInt(mesSeleccionado));
      fechaActual.setFullYear(anioSeleccionado);
      actualizarInterfazDashboard();
      
      // Cerrar modal
      pickerModal.classList.remove('activo');
      ocultarDropdownAnios();
      limpiarError();
  });

  limpiarBtn?.addEventListener('click', () => {
      fechaActual = new Date();
      actualizarInterfazDashboard();
      pickerModal.classList.remove('activo');
      ocultarDropdownAnios();
  });

  // Cerrar picker al clickear fuera
  document.addEventListener('click', (e) => {
      if (pickerModal?.classList.contains('activo') && !pickerModal.contains(e.target) && !abrirPickerBtn.contains(e.target)) {
          pickerModal.classList.remove('activo');
          ocultarDropdownAnios();
      }
      if (listaAniosDropdown?.classList.contains('activo') && !inputAnio.contains(e.target) && !listaAniosDropdown.contains(e.target)) {
          ocultarDropdownAnios();
      }
  });

  /* --- INICIALIZACIÓN --- */
  aplicarEfectosEntrada();
  actualizarInterfazDashboard();

  // Configurar botones de filtro de movimientos (Recientes)
  const botonesFiltro = document.querySelectorAll('.btn-filtro');
  botonesFiltro.forEach(btn => {
      btn.addEventListener('click', () => {
          botonesFiltro.forEach(b => b.classList.remove('activo'));
          btn.classList.add('activo');
          const filtro = btn.textContent.trim();
          actualizarMovimientosRecientes(filtro);
      });
  });

  // Redirección a Paneles
  const btnIngresos = document.getElementById('btnIngresos');
  if (btnIngresos) {
      btnIngresos.addEventListener('click', () => {
          window.location.href = '../panel_ingresos/ingresos.html';
      });
  }

  const btnEgresos = document.getElementById('btnEgresos');
  if (btnEgresos) {
      btnEgresos.addEventListener('click', () => {
          window.location.href = '../panel_egresos/egresos.html';
      });
  }

  // Configurar paginación del historial
  const puntosPag = document.querySelectorAll('.punto-pag');
  puntosPag.forEach(punto => {
      punto.addEventListener('click', () => {
          const pagina = parseInt(punto.dataset.page);
          puntosPag.forEach(p => p.classList.remove('activo'));
          punto.classList.add('activo');
          actualizarHistorialMes(pagina, fechaActual);
      });
  });
});

/**
 * Inicializa el gráfico del balance principal.
 * - Línea VERDE con área rellena para Ingresos acumulados
 * - Línea ROJA  con área rellena para Egresos acumulados
 * Estilo oscuro inspirado en dashboards de criptomonedas.
 */
function inicializarGraficos(fechaContexto = new Date()) {
    const canvas = document.getElementById('graficoBalancePrincipal');
    if (!canvas) return;

    // Destruir gráfico anterior si existe
    const chartExistente = Chart.getChart(canvas);
    if (chartExistente) chartExistente.destroy();

    const registros = JSON.parse(localStorage.getItem('registros_financieros')) || [];
    const opcionesConceptoIngreso = ["Sueldo", "Venta", "Inversión", "Regalo", "Otro"];
    const opcionesConceptoEgreso  = ["Vivienda", "Alimentación", "Transporte", "Servicios", "Entretenimiento", "Salud", "Otro"];

    const mesAct = fechaContexto.getMonth();
    const anioAct = fechaContexto.getFullYear();

    // Obtener días del mes para el eje X
    const diasEnMes = new Date(anioAct, mesAct + 1, 0).getDate();
    const labels = Array.from({length: diasEnMes}, (_, i) => i + 1);
    
    let puntosIngresos = new Array(diasEnMes).fill(0);
    let puntosEgresos  = new Array(diasEnMes).fill(0);

    // Filtrar registros del mes y agrupar por día
    registros.forEach(reg => {
        if (!reg.fecha) return;
        const f = new Date(reg.fecha + 'T00:00:00');
        if (f.getMonth() === mesAct && f.getFullYear() === anioAct) {
            const dia = f.getDate();
            const monto = parseFloat(reg.monto) || 0;
            const esIngreso = opcionesConceptoIngreso.includes(reg.concepto) || reg.tipo === 'ingreso';
            
            if (esIngreso) {
                puntosIngresos[dia-1] += monto;
            } else {
                puntosEgresos[dia-1] += monto;
            }
        }
    });

    // Convertir a acumulado diario si se prefiere, o dejar como barras diarias. 
    // Para línea usualmente es mejor acumulado o suavizado. 
    // El usuario pidió "Análisis de flujo de caja", usaremos acumulado para ver tendencia.
    let acumI = 0;
    let acumE = 0;
    const puntosIngAcum = puntosIngresos.map(v => acumI += v);
    const puntosEgAcum = puntosEgresos.map(v => acumE += v);

    const ctx2d = canvas.getContext('2d');
    const h = 180;

    const gradVerde = ctx2d.createLinearGradient(0, 0, 0, h);
    gradVerde.addColorStop(0, 'rgba(34, 197, 94, 0.4)');
    gradVerde.addColorStop(1, 'rgba(34, 197, 94, 0)');

    const gradRojo = ctx2d.createLinearGradient(0, 0, 0, h);
    gradRojo.addColorStop(0, 'rgba(255, 60, 60, 0.4)');
    gradRojo.addColorStop(1, 'rgba(255, 60, 60, 0)');

    new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Ingresos',
                    data: puntosIngAcum,
                    borderColor: '#22c55e',
                    backgroundColor: gradVerde,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Egresos',
                    data: puntosEgAcum,
                    borderColor: '#ff3c3c',
                    backgroundColor: gradRojo,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { 
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10 } }
                },
                x: { 
                    grid: { display: false },
                    ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10 } }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            }
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
function sincronizarTotales(fechaContexto = new Date()) {
    const registros = JSON.parse(localStorage.getItem('registros_financieros')) || [];
    const opcionesConceptoIngreso = ["Sueldo", "Venta", "Inversión", "Regalo", "Otro"];
    const opcionesConceptoEgreso = ["Vivienda", "Alimentación", "Transporte", "Servicios", "Entretenimiento", "Salud", "Otro"];
    
    const mesAct = fechaContexto.getMonth();
    const anioAct = fechaContexto.getFullYear();

    let totalIngresos = 0;
    let totalGastos = 0;

    registros.forEach(reg => {
        if (!reg.fecha) return;
        const f = new Date(reg.fecha + 'T00:00:00');
        if (f.getMonth() === mesAct && f.getFullYear() === anioAct) {
            const monto = parseFloat(reg.monto) || 0;
            if (opcionesConceptoIngreso.includes(reg.concepto) || reg.tipo === 'ingreso') {
                totalIngresos += monto;
            } else {
                totalGastos += monto;
            }
        }
    });

    const balance = totalIngresos - totalGastos;

    // Actualizar elementos en el DOM
    const elIngresos = document.querySelector('#btnIngresos .monto-resumen');
    const elEgresos = document.querySelector('#btnEgresos .monto-resumen');
    const elBalance = document.querySelector('.tarjeta-resumen-header .monto-balance');
    
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
function actualizarMovimientosRecientes(filtro = 'Hoy') {
    const contenedor = document.getElementById('listaMovimientosRecientes');
    if (!contenedor) return;

    let registros = JSON.parse(localStorage.getItem('registros_financieros')) || [];
    
    // Lógica de filtrado por fechas
    const ahora = new Date();
    ahora.setHours(23, 59, 59, 999); // Final del día de hoy

    const hoy = new Date();
    const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;

    if (filtro === 'Hoy') {
        registros = registros.filter(r => r.fecha === hoyStr);
    } else if (filtro === 'Esta semana') {
        const haceUnaSemana = new Date();
        haceUnaSemana.setDate(ahora.getDate() - 7);
        haceUnaSemana.setHours(0, 0, 0, 0); 

        registros = registros.filter(r => {
            const fechaReg = new Date(r.fecha + 'T00:00:00');
            return fechaReg >= haceUnaSemana && fechaReg <= ahora;
        });
    } else if (filtro === 'Mes pasado') {
        const fechaMesPasado = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
        const mesPasado = fechaMesPasado.getMonth();
        const anioPasado = fechaMesPasado.getFullYear();
        registros = registros.filter(r => {
            const fechaReg = new Date(r.fecha + 'T00:00:00');
            return fechaReg.getMonth() === mesPasado && fechaReg.getFullYear() === anioPasado;
        });
    }

    // Sort by date descending
    const registrosOrdenados = [...registros].sort((a, b) => {
        const da = new Date(a.fecha).getTime() || 0;
        const db = new Date(b.fecha).getTime() || 0;
        return db - da;
    });

    // Get the most recent 4
    const recientes = registrosOrdenados.slice(0, 4);

    contenedor.innerHTML = '';

    if (recientes.length === 0) {
        contenedor.innerHTML = '<p style="color: rgba(255,255,255,0.3); padding: 1rem; text-align: center;">No hay movimientos recientes.</p>';
        return;
    }

    const opcionesConceptoIngreso = ["Sueldo", "Venta", "Inversión", "Regalo", "Otro"];

    // Mapeo de conceptos a iconos de font-awesome
    const iconoMapa = {
        "Alimentación": "fa-utensils",
        "Transporte": "fa-car",
        "Vivienda": "fa-house",
        "Servicios": "fa-bolt",
        "Entretenimiento": "fa-clapperboard",
        "Salud": "fa-heart-pulse",
        "Sueldo": "fa-building-columns",
        "Venta": "fa-cart-shopping",
        "Inversión": "fa-chart-line",
        "Regalo": "fa-gift",
        "Otro": "fa-ellipsis"
    };

    recientes.forEach(reg => {
        const esIngreso = opcionesConceptoIngreso.includes(reg.concepto) || reg.tipo === 'ingreso';
        const tipoClase = esIngreso ? 'ingreso' : 'egreso';
        const iconoName = iconoMapa[reg.concepto] || (esIngreso ? 'fa-plus' : 'fa-minus');
        const montoStr = formatCurrency(parseFloat(reg.monto) || 0);
        const montoClase = esIngreso ? 'positivo' : 'negativo';
        const signo = esIngreso ? '+' : '-';
        const etiquetaTipo = esIngreso ? 'Ingreso' : 'Egreso';
        const fechaFormat = formatoFechaRelativa(reg.fecha);

        const htmlStr = `
          <div class="fila-movimiento">
            <div class="item-izquierda">
              <div class="circulo-icono ${tipoClase}">
                <i class="fa-solid ${iconoName}"></i>
              </div>
              <div class="detalles-mov">
                <span class="nombre-mov">${reg.descripcion || reg.concepto || 'Sin descripción'}</span>
                <span class="tipo-mov">${etiquetaTipo}</span>
              </div>
            </div>
            <div class="item-derecha" style="text-align: right;">
              <div class="monto-mov ${montoClase}">${signo}${montoStr}</div>
              <div class="fecha-mov">${fechaFormat}</div>
            </div>
          </div>
        `;
        contenedor.insertAdjacentHTML('beforeend', htmlStr);
    });
}

/**
 * Calcula el consumo de presupuesto por categoría y actualiza la UI
 */
/**
 * Renderiza el historial del mes con vista dividida y barras de progreso
 * @param {number} pagina - 0 para Ingresos, 1 para Egresos
 */
function actualizarHistorialMes(pagina = 0, fechaContexto = new Date()) {
    const contenedor = document.getElementById('listaHistorialMes');
    if (!contenedor) return;

    const registros = JSON.parse(localStorage.getItem('registros_financieros')) || [];
    const mesActual = fechaContexto.getMonth();
    const anioActual = fechaContexto.getFullYear();

    // Configuración de presupuestos y objetivos
    const limitesGastosDefecto = {
        "Alimentación": 1200000, "Transporte": 500000, "Vivienda": 2000000,
        "Servicios": 600000, "Entretenimiento": 400000, "Salud": 300000, "Otro": 300000
    };
    const objetivosIngresosDefecto = {
        "Sueldo": 2500000, "Venta": 1000000, "Inversión": 500000, "Regalo": 100000, "Otro": 200000
    };

    const configGastos = JSON.parse(localStorage.getItem('config_presupuestos')) || limitesGastosDefecto;
    const configIngresos = JSON.parse(localStorage.getItem('config_objetivos_ingresos')) || objetivosIngresosDefecto;
    
    if (!localStorage.getItem('config_objetivos_ingresos')) {
        localStorage.setItem('config_objetivos_ingresos', JSON.stringify(objetivosIngresosDefecto));
    }

    // Agrupar datos del mes actual
    const categoriasMes = {};

    registros.forEach(reg => {
        if (!reg.fecha) return;
        const fechaReg = new Date(reg.fecha + 'T00:00:00');
        if (fechaReg.getMonth() === mesActual && fechaReg.getFullYear() === anioActual) {
            const monto = parseFloat(reg.monto) || 0;
            categoriasMes[reg.concepto] = (categoriasMes[reg.concepto] || 0) + monto;
        }
    });

    contenedor.innerHTML = '';
    let scoreTotal = 0;
    let counts = 0;

    if (pagina === 0) {
        // VISTA DE INGRESOS
        const catsIngreso = Object.keys(configIngresos);
        catsIngreso.slice(0, 4).forEach(cat => {
            const monto = categoriasMes[cat] || 0;
            const meta = configIngresos[cat] || 1;
            const pct = Math.min(Math.round((monto / meta) * 100), 100);
            
            scoreTotal += pct;
            counts++;

            const htmlBarra = `
                <div class="item-presupuesto">
                    <div class="label-presupuesto">
                        <span>${cat}</span>
                        <span class="pct-presupuesto bajo">${pct}%</span>
                    </div>
                    <div class="barra-fondo">
                        <div class="barra-progreso ingreso" style="width: ${pct}%"></div>
                    </div>
                </div>
            `;
            contenedor.insertAdjacentHTML('beforeend', htmlBarra);
        });
        actualizarSaludFinanciera(scoreTotal / (counts || 1), "Cumplimiento de Metas", 'ingreso');
    } else {
        // VISTA DE EGRESOS
        const catsEgreso = ["Alimentación", "Transporte", "Vivienda", "Entretenimiento"];
        catsEgreso.forEach(cat => {
            const monto = categoriasMes[cat] || 0;
            const limite = configGastos[cat] || 1;
            const pct = Math.min(Math.round((monto / limite) * 100), 100);
            
            // Salud de gasto es inversa al uso
            scoreTotal += (100 - pct);
            counts++;

            let nivel = 'bajo';
            if (pct >= 90) nivel = 'alto';
            else if (pct >= 70) nivel = 'medio';

            const htmlBarra = `
                <div class="item-presupuesto">
                    <div class="label-presupuesto">
                        <span>${cat}</span>
                        <span class="pct-presupuesto ${nivel}">${pct}%</span>
                    </div>
                    <div class="barra-fondo">
                        <div class="barra-progreso ${nivel}" style="width: ${pct}%"></div>
                    </div>
                </div>
            `;
            contenedor.insertAdjacentHTML('beforeend', htmlBarra);
        });
        actualizarSaludFinanciera(scoreTotal / (counts || 1), "Salud de Gastos", 'egreso');
    }
}

function obtenerTotalMes(tipo, offset = 0) {
    const registros = JSON.parse(localStorage.getItem('registros_financieros')) || [];
    const ahora = new Date();
    const target = new Date(ahora.getFullYear(), ahora.getMonth() + offset, 1);
    const mes = target.getMonth();
    const anio = target.getFullYear();

    const opcionesIngreso = ["Sueldo", "Venta", "Inversión", "Regalo", "Otro"];
    
    return registros.reduce((acc, reg) => {
        const f = new Date(reg.fecha + 'T00:00:00');
        if (f.getMonth() === mes && f.getFullYear() === anio) {
            const esIng = opcionesIngreso.includes(reg.concepto) || reg.tipo === 'ingreso';
            if (tipo === 'ingreso' && esIng) acc += (parseFloat(reg.monto) || 0);
            if (tipo === 'egreso' && !esIng) acc += (parseFloat(reg.monto) || 0);
        }
        return acc;
    }, 0);
}

function actualizarSaludFinanciera(score, etiqueta = "Salud financiera", tipo = 'egreso') {
    const elScore = document.getElementById('valorSalud');
    const elEstado = document.getElementById('estadoSalud');
    const elGrafico = document.getElementById('graficoSalud');
    const elEtiqueta = document.querySelector('.etiqueta-salud');
    const elVariacion = document.querySelector('.variacion-salud');

    if (elScore) elScore.textContent = Math.round(score);
    if (elEtiqueta) elEtiqueta.textContent = etiqueta;
    
    if (elGrafico) {
        elGrafico.style.setProperty('--porcentaje', Math.round(score));
        const color = (tipo === 'ingreso') ? '#10b981' : '#ef4444'; // Verde Esmeralda vs Rojo Alerta
        elGrafico.style.setProperty('--color-indicador', color);
    }

    if (elEstado) {
        if (tipo === 'ingreso') {
            if (score >= 80) elEstado.textContent = 'Excelente flujo este mes';
            else if (score >= 50) elEstado.textContent = 'Buen ritmo de ingresos';
            else elEstado.textContent = 'Aumenta tus ingresos';
        } else {
            if (score >= 80) elEstado.textContent = 'Gastos bajo control';
            else if (score >= 50) elEstado.textContent = 'Cuidado con los gastos';
            else elEstado.textContent = 'Gasto elevado';
        }
    }

    if (elVariacion) {
        const totalActual = obtenerTotalMes(tipo, 0);
        const totalPasado = obtenerTotalMes(tipo, -1);
        
        if (totalPasado === 0) {
            elVariacion.textContent = "Primer mes de registro";
            elVariacion.className = "variacion-salud neutra";
        } else {
            const diff = ((totalActual - totalPasado) / totalPasado) * 100;
            const signo = diff >= 0 ? '+' : '';
            const icono = diff >= 0 ? '↗' : '↘';
            elVariacion.textContent = `${icono} ${signo}${Math.round(diff)}% vs mes anterior`;
            
            // Lógica de colores para la variación
            if (tipo === 'ingreso') {
                elVariacion.className = diff >= 0 ? "variacion-salud" : "variacion-salud negativa";
            } else {
                elVariacion.className = diff <= 0 ? "variacion-salud" : "variacion-salud negativa";
            }
        }
    }
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
