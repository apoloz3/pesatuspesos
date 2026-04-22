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

  /* ===============================
       SINCRONIZAR AVATAR DE USUARIO
    =============================== */
  const avatarPrincipal = document.getElementById("avatarPrincipal");
  const botonPerfilImg = document.querySelector("#botonPerfil img");
  const avatarGuardado = localStorage.getItem("pesa-tus-pesos-avatar");

  if (avatarPrincipal) {
    if (avatarGuardado) {
      avatarPrincipal.src = avatarGuardado;
    } else {
      avatarPrincipal.src = generarAvatarLetra(nombreCapitalizado);
    }
  }

  if (botonPerfilImg) {
    if (avatarGuardado) {
      botonPerfilImg.src = avatarGuardado;
    } else {
      botonPerfilImg.src = generarAvatarLetra(nombreCapitalizado);
    }
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

  /* ===============================
       REDIRECCIÓN A AYUDA GESTOR
    =============================== */
  const botonAtencion = document.querySelector(".boton-atencion");
  if (botonAtencion) {
    botonAtencion.addEventListener("click", function () {
      window.location.href = "../pag_ayuda/ayuda.html";
    });
  }

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
       REDIRECCIÓN A PERFIL (LÁPIZ)
    =============================== */
  const avatarLapiz = document.querySelector(".avatar-lapiz");
  if (avatarLapiz) {
    avatarLapiz.addEventListener("click", function () {
      window.location.href = "../editar_perfil/perfil.html";
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
/* ===============================
   CARGAR VIDEOS DE YOUTUBE
=============================== */

// API KEY
const API_KEY = "AIzaSyCp9N8x2N-DACzWIn-Dbe4U6IAPOJcAQrY";

// contenedores de videos
const contenedores = [
  document.getElementById("video1"),
  document.getElementById("video2"),
  document.getElementById("video3"),
  document.getElementById("video4"),
  document.getElementById("video5"),
  document.getElementById("video6"),
  document.getElementById("video7"),
  document.getElementById("video8"),
  document.getElementById("video9"),
  document.getElementById("video10"),
  document.getElementById("video11"),
  document.getElementById("video12"),
];

async function cargarVideos(query = 'educacion financiera colombia') {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=12&type=video&key=${API_KEY}`;

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    if (!datos.items || datos.items.length === 0) {
      console.error("API YouTube sin resultados:", datos.error?.message || datos);
      return;
    }

    datos.items.forEach((video, i) => {
      if (contenedores[i]) {
        const idVideo = video.id.videoId;
        contenedores[i].innerHTML = `
          <iframe
            src="https://www.youtube.com/embed/${idVideo}"
            allowfullscreen>
          </iframe>
        `;
      }
    });

    iniciarCarrusel();

  } catch (error) {
    console.error("Error cargando videos:", error);
  }
}

let intervaloCarrusel = null;

function iniciarCarrusel() {
  const track = document.getElementById("carruselTrack");
  const puntosContainer = document.getElementById("carruselPuntos");
  const items = Array.from(document.querySelectorAll(".carrusel-item"));
  if (!track || items.length === 0) return;

  let actual = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  let isDragging = false;
  let dragOffset = 0;

  // ── Responsive config ─────────────────────────────────────
  function getPorPagina() {
    const w = window.innerWidth;
    if (w <= 768) return 1;
    if (w <= 1024) return 3;
    return 4;
  }

  function getNumPaginas() {
    return Math.ceil(items.length / getPorPagina());
  }

  // ── Dot indicators ────────────────────────────────────────
  function generarPuntos() {
    const n = getNumPaginas();
    puntosContainer.innerHTML = "";
    for (let i = 0; i < n; i++) {
      const dot = document.createElement("span");
      dot.classList.add("punto");
      if (i === 0) dot.classList.add("activo");
      dot.dataset.index = i;
      dot.addEventListener("click", () => irA(i));
      puntosContainer.appendChild(dot);
    }
  }

  // ── Mark active cards ─────────────────────────────────────
  function actualizarActivos() {
    const pp = getPorPagina();
    items.forEach((item, i) => {
      item.classList.toggle("activo", i >= actual * pp && i < (actual + 1) * pp);
    });
  }

  // ── Navigate to page index ────────────────────────────────
  function irA(index) {
    const pp = getPorPagina();
    actual = Math.max(0, Math.min(index, getNumPaginas() - 1));
    const itemWidth = items[0].offsetWidth;
    const offset = actual * pp * (itemWidth + 20);
    track.style.transition = "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)";
    track.style.transform = `translateX(-${offset}px)`;
    puntosContainer.querySelectorAll(".punto").forEach((d, i) => {
      d.classList.toggle("activo", i === actual);
    });
    actualizarActivos();
  }

  // ── Touch: press ─────────────────────────────────────────
  track.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
    isDragging = true;
    dragOffset = 0;
    track.style.transition = "none";
  }, { passive: true });

  // ── Touch: drag (live feedback) ───────────────────────────
  track.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dy) > Math.abs(dx) + 10) { isDragging = false; return; }
    dragOffset = dx;
    const pp = getPorPagina();
    const base = actual * pp * (items[0].offsetWidth + 20);
    const atEdge = (actual === 0 && dx > 0) || (actual === getNumPaginas() - 1 && dx < 0);
    track.style.transform = `translateX(-${base - dragOffset * (atEdge ? 0.2 : 1)}px)`;
  }, { passive: true });

  // ── Touch: release → snap ──────────────────────────────────
  track.addEventListener("touchend", () => {
    if (!isDragging) return;
    isDragging = false;
    if (dragOffset < -50) irA(actual + 1);
    else if (dragOffset > 50) irA(actual - 1);
    else irA(actual);
    dragOffset = 0;
  }, { passive: true });

  // ── Resize ────────────────────────────────────────────────
  window.addEventListener("resize", () => {
    generarPuntos();
    actual = 0;
    irA(0);
  });

  // ── Auto-advance every 30s ─────────────────────────────────
  if (intervaloCarrusel) clearInterval(intervaloCarrusel);
  intervaloCarrusel = setInterval(() => irA((actual + 1) % getNumPaginas()), 30000);

  // ── Init ─────────────────────────────────────────────────
  generarPuntos();
  actualizarActivos();
}
cargarVideos();

const inputBuscarVideo = document.getElementById("inputBuscarVideo");
const btnBuscarVideo = document.getElementById("btnBuscarVideo");

// Diccionario de categorías prohibidas evidentes para rechazo inmediato
const categoriasProhibidas = [
  "futbol", "musica", "deporte", "juego", "gameplay", "pelicula", "free fire", 
  "minecraft", "roblox", "porno", "sexo", "apuesta", "chiste", "broma", "novela", 
  "serie", "cancion", "cantante", "farandula", "chisme"
];

// Diccionario de términos financieros permitidos para validación positiva
const terminosFinancieros = [
  "finanza", "financier", "dinero", "plata", "ahorro", "ahorrar", "inversion", "invertir", 
  "banco", "bancar", "economia", "economico", "deuda", "credito", "prestamo", "presupuesto", 
  "ingreso", "gasto", "cripto", "bitcoin", "dolar", "peso", "accion", "bolsa", "trading",
  "capital", "negocio", "emprend", "empresa", "sueldo", "salario", "interes", "riqueza", 
  "rico", "pobre", "millonario", "billetera", "tarjeta", "pagar", "comprar", "venta",
  "vender", "rentabilidad", "ganancia", "impuesto", "inflacion", "deflacion", "trm", 
  "cobrar", "factura", "educacion", "educar", "libertad", "inmueble", "independiza",
  "bienes raices", "fondo", "cesantias", "pension", "jubilacion", "seguro", "impuestos", "dian",
  "crecer", "casa", "carro", "moto", "vehiculo", "comprar", "ahorrador", "meta", "ingresos"
];

function validarBusquedaFinanzas(query) {
  if (!query) return false;
  // Convertimos a minúsculas y quitamos tildes para una comparación justa
  const qStr = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // 1. Verificamos si contiene categorías prohibidas abiertamente
  const esProhibida = categoriasProhibidas.some(cat => qStr.includes(cat));
  if (esProhibida) return false;

  // 2. Verificamos si al menos menciona un elemento del diccionario de finanzas
  const esValida = terminosFinancieros.some(termino => qStr.includes(termino));
  return esValida;
}

const alertModalBusqueda = document.getElementById("alertModalBusqueda");
const btnCerrarAlertaBusqueda = document.getElementById("btnCerrarAlertaBusqueda");

function manejarBusquedaVideo() {
  const query = inputBuscarVideo.value.trim();
  if (!query) return;

  if (validarBusquedaFinanzas(query)) {
    // Añadimos contexto financiero fuerte al final de la búsqueda
    cargarVideos(query + " educacion financiera");
  } else {
    // Mostramos el modal personalizado en lugar del alert nativo
    if (alertModalBusqueda) alertModalBusqueda.classList.add("activo");
    inputBuscarVideo.value = "";
  }
}

if (btnCerrarAlertaBusqueda && alertModalBusqueda) {
  btnCerrarAlertaBusqueda.addEventListener("click", () => {
    alertModalBusqueda.classList.remove("activo");
  });

  // Cerrar modal si hacen clic fuera del contenido
  window.addEventListener("click", (e) => {
    if (e.target === alertModalBusqueda) {
      alertModalBusqueda.classList.remove("activo");
    }
  });
}

if (btnBuscarVideo && inputBuscarVideo) {
  btnBuscarVideo.addEventListener("click", manejarBusquedaVideo);

  inputBuscarVideo.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      manejarBusquedaVideo();
    }
  });
}

/** Serie sintética que converge al valor real (TRM / último punto = API) */
function serieConvergente(valorFinal, cantidad) {
  if (cantidad < 2) return [valorFinal];
  const base = valorFinal * 0.93;
  const salida = [];
  const denom = cantidad - 1;
  for (let i = 0; i < cantidad; i++) {
    const t = i / denom;
    const onda = Math.sin(i * 0.65) * valorFinal * 0.0015;
    const v = base + (valorFinal - base) * Math.pow(t, 0.88) + onda;
    salida.push(Math.max(0, v));
  }
  salida[cantidad - 1] = valorFinal;
  return salida;
}

const chartGrid = {
  color: "rgba(255, 255, 255, 0.07)",
  drawBorder: false,
};

/**
 * Gráfica de línea: cuarto argumento `temaVerde` = true solo para dólar (verde);
 * Bitcoin usa ámbar (false o omitido).
 */
function graficaLineaDashboard(canvas, valores, formatoTooltip, temaVerde) {
  if (typeof Chart === "undefined") {
    console.error(
      "Chart.js no está cargado. Usa chart.umd.min.js desde el CDN.",
    );
    return null;
  }
  if (!valores || valores.length === 0) return null;

  const previo = Chart.getChart(canvas);
  if (previo) previo.destroy();

  const ctx2d = canvas.getContext("2d");
  if (!ctx2d) return null;

  const linea = temaVerde ? "#34d399" : "#fbbf24";
  const tituloTip = temaVerde ? "#34d399" : "#fbbf24";

  const etiquetas = valores.map((_, i) => i);
  const altura = Math.max(
    canvas.parentElement?.clientHeight || 0,
    canvas.height || 0,
    130,
  );
  const gradiente = ctx2d.createLinearGradient(0, 0, 0, altura);
  if (temaVerde) {
    gradiente.addColorStop(0, "rgba(52, 211, 153, 0.3)");
    gradiente.addColorStop(1, "rgba(52, 211, 153, 0)");
  } else {
    gradiente.addColorStop(0, "rgba(251, 191, 36, 0.28)");
    gradiente.addColorStop(1, "rgba(251, 191, 36, 0)");
  }
  const mostrarPuntos = valores.length <= 48;

  try {
    return new Chart(canvas, {
      type: "line",
      data: {
        labels: etiquetas,
        datasets: [
          {
            data: valores,
            borderColor: linea,
            backgroundColor: gradiente,
            fill: true,
            borderWidth: 2.5,
            tension: 0.35,
            pointRadius: mostrarPuntos ? 2.5 : 0,
            pointHoverRadius: 5,
            pointBackgroundColor: linea,
            pointBorderColor: "#0e1016",
            pointBorderWidth: 1.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: "index" },
        animation: { duration: 700 },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(15, 16, 22, 0.95)",
            titleColor: tituloTip,
            bodyColor: "rgba(255,255,255,0.9)",
            borderColor: "rgba(255,255,255,0.1)",
            borderWidth: 1,
            callbacks: {
              label(ctx) {
                const v = ctx.parsed.y;
                return formatoTooltip(v);
              },
            },
          },
        },
        scales: {
          x: {
            grid: chartGrid,
            ticks: { display: false },
            border: { display: false },
          },
          y: {
            grid: chartGrid,
            ticks: {
              color: "rgba(255, 255, 255, 0.35)",
              font: { size: 9 },
              maxTicksLimit: 4,
              callback: (v) =>
                typeof v === "number" && v >= 1000 ? v / 1000 + "k" : v,
            },
            border: { display: false },
          },
        },
      },
    });
  } catch (e) {
    console.error("Error creando gráfica Chart.js:", e);
    return null;
  }
}

// DOLAR — open.er-api.com (la que ya usabas) + diseño de línea como Bitcoin
async function cargarDolar() {
  const elValor = document.getElementById("dolar");
  const canvas = document.getElementById("graficaDolar");
  if (!canvas) return;

  try {
    const respuesta = await fetch("https://open.er-api.com/v6/latest/USD");
    const datos = await respuesta.json();
    if (datos.result === "error" || !datos.rates || datos.rates.COP == null) {
      throw new Error("Respuesta sin COP");
    }
    const dolarCOP = Number(datos.rates.COP);
    if (Number.isNaN(dolarCOP)) throw new Error("COP inválido");

    elValor.textContent =
      "$" + dolarCOP.toLocaleString(undefined, { maximumFractionDigits: 0 });

    const puntos = serieConvergente(dolarCOP, 40);
    graficaLineaDashboard(
      canvas,
      puntos,
      (v) =>
        v != null
          ? "COP " + v.toLocaleString(undefined, { maximumFractionDigits: 2 })
          : "",
      true,
    );
  } catch (error) {
    console.error("Error cargando dólar:", error);
    if (elValor) elValor.textContent = "—";
  }
}

cargarDolar();

// BITCOIN — línea ámbar con puntos (precios reales de la API, muestreados)
async function cargarBitcoin() {
  const elValor = document.getElementById("bitcoin");
  const canvas = document.getElementById("graficaBitcoin");
  if (!canvas) return;

  try {
    const respuesta = await fetch(
      "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1",
    );
    const datos = await respuesta.json();
    const precios = datos.prices;
    if (!Array.isArray(precios) || precios.length === 0) {
      throw new Error("Respuesta Bitcoin sin series de precios");
    }
    const valores = precios.map((p) => p[1]);

    const precioActual = valores[valores.length - 1];
    elValor.textContent =
      "$" +
      precioActual.toLocaleString(undefined, { maximumFractionDigits: 0 });

    const maxPuntos = 40;
    const paso = Math.max(1, Math.ceil(valores.length / maxPuntos));
    const muestra = [];
    for (let i = 0; i < valores.length; i += paso) muestra.push(valores[i]);
    if (muestra[muestra.length - 1] !== precioActual)
      muestra.push(precioActual);

    graficaLineaDashboard(
      canvas,
      muestra,
      (v) =>
        v != null
          ? "USD " + v.toLocaleString(undefined, { maximumFractionDigits: 0 })
          : "",
      false,
    );
  } catch (error) {
    console.error("Error cargando Bitcoin:", error);
    if (elValor) elValor.textContent = "—";
  }
}

cargarBitcoin();

/* ===============================
   MODAL DE CARDS
=============================== */

const modalInfo = document.getElementById("infoModal");
const closeModalBtn = document.querySelector(".close-modal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");

document.querySelectorAll(".ver-mas").forEach((btn) => {
  btn.addEventListener("click", () => {
    modalTitle.textContent = btn.getAttribute("data-title");
    modalText.textContent = btn.getAttribute("data-text");
    modalImg.src = btn.getAttribute("data-img") || "img/dinero.png";
    modalInfo.classList.add("activo");
  });
});

if (closeModalBtn && modalInfo) {
  closeModalBtn.addEventListener("click", () => {
    modalInfo.classList.remove("activo");
  });

  window.addEventListener("click", (e) => {
    if (e.target === modalInfo) {
      modalInfo.classList.remove("activo");
    }
  });
}
