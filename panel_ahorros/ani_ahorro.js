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
  let prevBtn = document.getElementById('prevBtn');
  let nextBtn = document.getElementById('nextBtn');
  const indicatorsContainer = document.getElementById('carouselIndicators');
  let updateCarouselParams = null;

  function initCarousel() {
    if (!track || !prevBtn || !nextBtn) return;

    indicatorsContainer.innerHTML = "";
    if (updateCarouselParams) {
      window.removeEventListener('resize', updateCarouselParams);
      const prevClone = prevBtn.cloneNode(true);
      const nextClone = nextBtn.cloneNode(true);
      prevBtn.replaceWith(prevClone);
      nextBtn.replaceWith(nextClone);
      prevBtn = prevClone;
      nextBtn = nextClone;
    }

    const cards = Array.from(track.children);
    let currentIndex = 0;

    cards.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      indicatorsContainer.appendChild(dot);
    });

    const dots = Array.from(indicatorsContainer.children);

    function updateCarousel() {
      if (cards.length === 0) return;
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = 30;
      const containerWidth = track.parentElement.getBoundingClientRect().width;
      const totalWidthNeeded = (cards.length * cardWidth) + ((cards.length - 1) * gap);

      prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
      prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';

      nextBtn.style.opacity = (currentIndex >= cards.length - 3 || totalWidthNeeded <= containerWidth + 5) ? '0.3' : '1';
      nextBtn.style.pointerEvents = (currentIndex >= cards.length - 3 || totalWidthNeeded <= containerWidth + 5) ? 'none' : 'auto';

      indicatorsContainer.style.display = cards.length <= 3 ? 'none' : 'flex';

      const offset = currentIndex * (cardWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;

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
      if (currentIndex < cards.length - 1) currentIndex++;
      else currentIndex = 0;
      updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) currentIndex--;
      else currentIndex = cards.length - 1;
      updateCarousel();
    });

    updateCarouselParams = updateCarousel;
    window.addEventListener('resize', updateCarousel);
    updateCarousel();
  }

  initCarousel();

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

    const btnGuardarMeta = document.getElementById("btnGuardarMeta");
    const tituloMetaInput = document.getElementById("tituloMeta");
    const montoTotalInput = document.getElementById("montoTotal");
    const btnSubirFoto = document.getElementById("btnSubirFoto");

    if (btnGuardarMeta) {
      btnGuardarMeta.addEventListener("click", () => {
        const titulo = tituloMetaInput && tituloMetaInput.value.trim() ? tituloMetaInput.value : "Mi Meta";
        const metaMontoStr = montoTotalInput && montoTotalInput.value.trim() ? montoTotalInput.value : "$0";
        
        // Limpiamos el monto total para tener un número puro
        const montoTotalNum = parseFloat(metaMontoStr.replace(/[^0-9]/g, "")) || 0;

        let bgImage = "url('img/textura_oro.png')";
        if (btnSubirFoto && btnSubirFoto.style.backgroundImage && btnSubirFoto.style.backgroundImage !== 'initial' && btnSubirFoto.style.backgroundImage !== 'none') {
          bgImage = btnSubirFoto.style.backgroundImage;
        }

        const newCard = document.createElement("div");
        newCard.className = "meta-card";
        newCard.style.backgroundImage = bgImage;
        // Asignamos metadatos financieros
        newCard.setAttribute("data-actual", "0");
        newCard.setAttribute("data-total", montoTotalNum);

        newCard.innerHTML = `
          <div class="card-overlay">
            <div class="card-header">
              <span class="meta-label">Mi meta:</span>
              <h2 class="meta-titulo">${titulo}</h2>
            </div>
            <div class="card-footer">
              <div class="progreso-info">
                <div class="progreso-texto">Progreso: <span class="monto-dinamico">$0 de ${metaMontoStr}</span></div>
                <div class="progreso-bar">
                  <div class="progreso-fill" style="width: 0%;"></div>
                </div>
              </div>
              <button class="boton-aportar">Aportar</button>
            </div>
          </div>
        `;

        const track = document.getElementById('carouselTrack');
        if (track) {
          track.insertBefore(newCard, cardCrear);
          if (typeof initCarousel === 'function') initCarousel();

          closeModal();
          alert("Meta creada exitosamente");

          if (tituloMetaInput) tituloMetaInput.value = "";
          if (montoTotalInput) montoTotalInput.value = "";
          if (btnSubirFoto) {
            btnSubirFoto.style.background = "";
            const contBoton = document.getElementById("contenidoBotonFoto");
            const txtBoton = document.getElementById("textoSubirFoto");
            if (contBoton) contBoton.style.display = "flex";
            if (txtBoton) txtBoton.innerHTML = "SUBIR<br>FOTO";
          }
        }
      });
    }
  }

  /* ===============================
       BOTONES APORTAR REDIRECCIÓN Y DATOS
     =============================== */
  // Usamos delegación de eventos para manejar botones actuales y futuros
  document.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("boton-aportar")) {
      const card = e.target.closest(".meta-card");
      if (card) {
        const titulo = card.querySelector(".meta-titulo") ? card.querySelector(".meta-titulo").textContent : "Mi Meta";
        const actual = card.getAttribute("data-actual") || "0";
        const total = card.getAttribute("data-total") || "0";
        
        // Extraer la URL de la imagen de fondo
        let bgUrl = card.style.backgroundImage;
        if (!bgUrl) {
           bgUrl = window.getComputedStyle(card).backgroundImage;
        }
        
        // Guardar en localStorage para la página de aporte
        localStorage.setItem("metaSeleccionadaTitulo", titulo);
        localStorage.setItem("metaSeleccionadaImagen", bgUrl);
        localStorage.setItem("metaSeleccionadaActual", actual);
        localStorage.setItem("metaSeleccionadaTotal", total);
        
        window.location.href = "panel_aporte/aporte.html";
      }
    }
  });

  /* ===============================
       BOTON SUBIR FOTO META
     =============================== */
  const btnSubirFoto = document.getElementById("btnSubirFoto");
  const inputFotoMeta = document.getElementById("inputFotoMeta");
  const contenidoBotonFoto = document.getElementById("contenidoBotonFoto");
  const textoSubirFoto = document.getElementById("textoSubirFoto");

  if (btnSubirFoto && inputFotoMeta) {
    btnSubirFoto.addEventListener("click", () => {
      inputFotoMeta.click();
    });

    inputFotoMeta.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (evento) {
          btnSubirFoto.style.background = `url('${evento.target.result}') center/cover no-repeat`;
          if (contenidoBotonFoto) contenidoBotonFoto.style.display = "none";
        };
        reader.readAsDataURL(file);
      } else {
        btnSubirFoto.style.background = "";
        if (contenidoBotonFoto) contenidoBotonFoto.style.display = "flex";
        if (textoSubirFoto) textoSubirFoto.innerHTML = "SUBIR<br>FOTO";
      }
    });
  }

  /* ===============================
       LÓGICA DE CALCULADORA DE METAS
     =============================== */
  const montoTotal = document.getElementById("montoTotal");
  const duracionMeses = document.getElementById("duracionMeses");
  const duracionText = document.getElementById("duracionText");
  const inicioMes = document.getElementById("inicioMes");
  const inicioAno = document.getElementById("inicioAno");
  const metaMes = document.getElementById("metaMes");
  const metaAno = document.getElementById("metaAno");
  const frecuenciaAporte = document.getElementById("frecuenciaAporte");
  const montoAporte = document.getElementById("montoAporte");

  const mesesArray = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  if (montoTotal && duracionMeses && inicioMes && metaMes) {
    const currentDate = new Date();
    const curYear = currentDate.getFullYear();
    const curMonth = currentDate.getMonth();

    // Populate Months
    [inicioMes, metaMes].forEach(select => {
      select.innerHTML = "";
      mesesArray.forEach((m, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = m;
        select.appendChild(option);
      });
    });

    // Populate Years
    [inicioAno, metaAno].forEach(select => {
      select.innerHTML = "";
      for (let i = 0; i <= 10; i++) {
        const option = document.createElement("option");
        option.value = curYear + i;
        option.textContent = curYear + i;
        select.appendChild(option);
      }
    });

    // Set Initials
    inicioMes.value = curMonth;
    inicioAno.value = curYear;

    function formatCurrency(val) {
      val = val.replace(/\D/g, "");
      if (val === "") return "";
      return "$" + parseInt(val, 10).toLocaleString("es-ES");
    }

    function calculateAporte() {
      let total = parseFloat(montoTotal.value.replace(/\D/g, "")) || 0;
      let months = parseInt(duracionMeses.value, 10) || 1;
      let freq = parseInt(frecuenciaAporte.value, 10) || 3;

      let pagos = months;
      if (freq === 1) pagos = months * 4; // SEMANAL
      else if (freq === 2) pagos = months * 2; // QUINCENAL
      else if (freq === 3) pagos = months * 1; // MENSUAL

      let aporte = total / (pagos || 1);
      montoAporte.value = total === 0 ? "$0" : "$" + Math.ceil(aporte).toLocaleString("es-ES");
    }

    function updateMetaDateFromSlider() {
      let monthsToAdd = parseInt(duracionMeses.value, 10);
      let startM = parseInt(inicioMes.value, 10);
      let startY = parseInt(inicioAno.value, 10);

      let endM = (startM + monthsToAdd) % 12;
      let endY = startY + Math.floor((startM + monthsToAdd) / 12);

      if (endY > curYear + 10) {
        endY = curYear + 10;
        endM = 11;
      }

      metaMes.value = endM;
      metaAno.value = endY;

      duracionText.textContent = `${monthsToAdd} M`;
      calculateAporte();
    }

    function updateSliderFromMetaDate() {
      let startM = parseInt(inicioMes.value, 10);
      let startY = parseInt(inicioAno.value, 10);
      let endM = parseInt(metaMes.value, 10);
      let endY = parseInt(metaAno.value, 10);

      let diffMonths = (endY - startY) * 12 + (endM - startM);
      if (diffMonths < 1) {
        diffMonths = 1;
        endM = (startM + 1) % 12;
        endY = startY + Math.floor((startM + 1) / 12);
        metaMes.value = endM;
        metaAno.value = endY;
      }
      if (diffMonths > 120) diffMonths = 120;

      duracionMeses.value = diffMonths;
      duracionText.textContent = `${diffMonths} M`;
      calculateAporte();
    }

    montoTotal.addEventListener("input", (e) => {
      let rawVal = e.target.value.replace(/\D/g, "");
      e.target.value = formatCurrency(rawVal);
      calculateAporte();
    });

    duracionMeses.addEventListener("input", updateMetaDateFromSlider);
    inicioMes.addEventListener("change", updateSliderFromMetaDate);
    inicioAno.addEventListener("change", updateSliderFromMetaDate);
    metaMes.addEventListener("change", updateSliderFromMetaDate);
    metaAno.addEventListener("change", updateSliderFromMetaDate);
    frecuenciaAporte.addEventListener("input", calculateAporte);

    updateMetaDateFromSlider();
  }

});

