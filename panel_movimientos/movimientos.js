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

  // Redirección a Panel Ingresos
  const btnIngresos = document.getElementById('btnIngresos');
  if (btnIngresos) {
      btnIngresos.addEventListener('click', () => {
          window.location.href = '../panel_ingresos/ingresos.html';
      });
  }
});

/**
 * Anima el gráfico SVG del balance principal
 */
function inicializarGraficos() {
    const trayectoGrafico = document.querySelector(".grafico-svg path");
    const puntoFinal = document.querySelector(".grafico-svg circle");

    if (trayectoGrafico) {
        const longitud = trayectoGrafico.getTotalLength();
        trayectoGrafico.style.strokeDasharray = longitud;
        trayectoGrafico.style.strokeDashoffset = longitud;
        trayectoGrafico.getBoundingClientRect(); 
        trayectoGrafico.style.transition = "stroke-dashoffset 2s ease-in-out";
        trayectoGrafico.style.strokeDashoffset = "0";
    }

    if (puntoFinal) {
        puntoFinal.style.opacity = "0";
        puntoFinal.style.transform = "scale(0)";
        puntoFinal.style.transition = "opacity 0.5s ease 1.8s, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 1.8s";
        setTimeout(() => {
            puntoFinal.style.opacity = "1";
            puntoFinal.style.transform = "scale(1)";
        }, 100);
    }
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
    
    let totalIngresos = 0;
    let totalGastos = 0;

    registros.forEach(reg => {
        const monto = parseFloat(reg.monto) || 0;
        if (opcionesConceptoIngreso.includes(reg.concepto)) {
            totalIngresos += monto;
        } else {
            totalGastos += monto;
        }
    });

    const balance = totalIngresos - totalGastos;

    // Actualizar elementos en el DOM
    const elIngresos = document.querySelector('#btnIngresos .monto-small');
    const elBalance = document.querySelector('.tarjeta-balance-principal .monto-balance');
    
    if (elIngresos) elIngresos.textContent = formatCurrency(totalIngresos);
    if (elBalance) elBalance.textContent = formatCurrency(balance);
}

function formatCurrency(valor) {
    return new Intl.NumberFormat('es-CO', { 
        style: 'currency', 
        currency: 'COP', 
        minimumFractionDigits: 0 
    }).format(valor).replace('COP', '$');
}
