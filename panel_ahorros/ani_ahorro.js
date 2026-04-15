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

  const pieAnio = document.getElementById("pie-anio");
  if (pieAnio) pieAnio.textContent = String(new Date().getFullYear());

  /* ===============================
       LÓGICA DEL CARRUSEL DE METAS
     =============================== */
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const indicatorsContainer = document.getElementById('carouselIndicators');
  
  if (track && prevBtn && nextBtn) {
    const cards = Array.from(track.children);
    let currentIndex = 0;

    // Crear indicadores
    cards.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      indicatorsContainer.appendChild(dot);
    });

    const dots = Array.from(indicatorsContainer.children);

    function updateCarousel() {
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = 30; // Coincide con el gap en CSS
      const containerWidth = track.parentElement.getBoundingClientRect().width;
      const totalWidthNeeded = (cards.length * cardWidth) + ((cards.length - 1) * gap);

      // Siempre mostrar navegación si el usuario lo desea, 
      // pero desactivar visualmente si no hay hacia donde ir
      prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
      prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
      
      nextBtn.style.opacity = (currentIndex >= cards.length - 3 || totalWidthNeeded <= containerWidth + 5) ? '0.3' : '1';
      nextBtn.style.pointerEvents = (currentIndex >= cards.length - 3 || totalWidthNeeded <= containerWidth + 5) ? 'none' : 'auto';

      // Ocultar indicadores solo si hay menos de 4 tarjetas
      indicatorsContainer.style.display = cards.length <= 3 ? 'none' : 'flex';

      const offset = currentIndex * (cardWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;

      // Actualizar dots
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    function goToSlide(index) {
      if (index < 0 || index >= cards.length) return;
      currentIndex = index;
      updateCarousel();
    }

    nextBtn.addEventListener('click', () => {
      if (currentIndex < cards.length - 1) {
        currentIndex++;
      } else {
        currentIndex = 0; // Loop al inicio
      }
      updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = cards.length - 1; // Loop al final
      }
      updateCarousel();
    });

    // Soporte para redimensión de ventana
    window.addEventListener('resize', updateCarousel);
    
    // Inicializar estado de botones
    updateCarousel();
  }

  /* ===============================
       PANEL DE USUARIO
     =============================== */
  const botonPerfil = document.getElementById("botonPerfil");
  const panelUsuario = document.getElementById("panelUsuario");

  if (botonPerfil) {
    botonPerfil.addEventListener("click", function () {
      panelUsuario.classList.toggle("activo");
    });
  }
  /* ===============================
       MODAL CREAR META
     =============================== */
  const cardCrear = document.querySelector(".card-crear");
  const modalCrearMeta = document.getElementById("modalCrearMeta");
  const cerrarModalCrear = document.getElementById("cerrarModalCrear");
  const btnCancelarCrear = document.getElementById("btnCancelarCrear");

  if (cardCrear && modalCrearMeta) {
    cardCrear.addEventListener("click", () => {
      modalCrearMeta.classList.add("activo");
    });
    
    const closeModal = () => modalCrearMeta.classList.remove("activo");
    
    if (cerrarModalCrear) cerrarModalCrear.addEventListener("click", closeModal);
    if (btnCancelarCrear) btnCancelarCrear.addEventListener("click", closeModal);
    
    modalCrearMeta.addEventListener("click", (e) => {
      if (e.target === modalCrearMeta) closeModal();
    });
  }

  /* ===============================
       BOTONES APORTAR REDIRECCIÓN
     =============================== */
  const botonesAportar = document.querySelectorAll(".boton-aportar");
  botonesAportar.forEach(boton => {
    boton.addEventListener("click", () => {
      window.location.href = "panel_aporte/aporte.html";
    });
  });

});

