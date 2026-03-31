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

  /* cambiar avatar */
  opcionesAvatar.forEach(function (opcion) {
    opcion.addEventListener("click", function () {
      const nuevaImagen = opcion.getAttribute("src");
      avatarPrincipal.src = nuevaImagen;
      localStorage.setItem("avatar_usuario", nuevaImagen);
    });
  });

  /* cargar avatar guardado */
  const avatarGuardado = localStorage.getItem("avatar_usuario");
  if (avatarGuardado && avatarPrincipal) {
    avatarPrincipal.src = avatarGuardado;
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

async function cargarVideos() {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=educacion financiera colombia&maxResults=12&type=video&key=${API_KEY}`;

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

function iniciarCarrusel() {
  const track = document.getElementById("carruselTrack");
  const puntos = document.querySelectorAll(".punto");
  const items = document.querySelectorAll(".carrusel-item");
  let actual = 0;
  const porPagina = window.innerWidth <= 768 ? 1 : 4;

  function irA(index) {
    const ancho = (items[0].offsetWidth + 20) * porPagina;
    track.style.transform = `translateX(-${index * ancho}px)`;
    puntos.forEach(p => p.classList.remove("activo"));
    if (puntos[index]) puntos[index].classList.add("activo");
    actual = index;
  }

  puntos.forEach(punto => {
    punto.addEventListener("click", () => {
      irA(parseInt(punto.dataset.index));
    });
  });

  // AUTO-PASAR cada 5 segundos
  setInterval(() => {
    const siguiente = (actual + 1) % 3; // 2 páginas
    irA(siguiente);
  }, 30000);
}
cargarVideos();

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
