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
       MODAL DE AVISO Y CIERRE GLOBAL
    =============================== */
  const modalAviso = document.getElementById("modalAviso");
  const mensajeAviso = document.getElementById("mensajeAviso");
  const btnAceptarAviso = document.getElementById("btnAceptarAviso");
  const modalCrearMeta = document.getElementById("modalCrearMeta");

  function mostrarAlerta(mensaje) {
    if (mensajeAviso && modalAviso) {
      mensajeAviso.textContent = mensaje;
      modalAviso.classList.add("activo");
    } else {
      alert(mensaje);
    }
  }

  if (btnAceptarAviso && modalAviso) {
    btnAceptarAviso.addEventListener("click", () => {
      modalAviso.classList.remove("activo");
    });
  }

  // Cierre de modales al hacer clic fuera del contenido
  document.addEventListener("click", (e) => {
    // Si el clic fue directamente en el overlay oscuro del modal de crear
    if (modalCrearMeta && e.target === modalCrearMeta) {
      modalCrearMeta.classList.remove("activo");
    }
    // Si el clic fue directamente en el overlay oscuro del modal de aviso
    if (modalAviso && e.target === modalAviso) {
      modalAviso.classList.remove("activo");
    }
  });

  /* ===============================
       MOSTRAR NOMBRE DEL USUARIO
    =============================== */

  const elementoNombre = document.getElementById("nombre_usuario");
  const elementoNombreHeader = document.getElementById("nombreUsuarioHeader");

  const nombreGuardado = localStorage.getItem("nombre_usuario") || "Usuario";

  if (elementoNombre) {
    elementoNombre.textContent = nombreGuardado;
  }
  if (elementoNombreHeader) {
    elementoNombreHeader.textContent = nombreGuardado;
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

    // Create indicator dots
    cards.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      indicatorsContainer.appendChild(dot);
    });

    const dots = Array.from(indicatorsContainer.children);

    // Dynamically determine how many cards fit on screen
    function getVisibleCount() {
      const w = window.innerWidth;
      if (w >= 1024) return 3;
      if (w >= 768) return 2;
      return 1;
    }

    function updateCarousel() {
      if (cards.length === 0) return;

      const visibleCount = getVisibleCount();
      const gap = 30;
      const cardWidth = cards[0].getBoundingClientRect().width;
      const containerWidth = track.parentElement.getBoundingClientRect().width;
      const totalWidthNeeded = (cards.length * cardWidth) + ((cards.length - 1) * gap);

      // Clamp currentIndex so we never scroll past the last visible set
      const maxIndex = Math.max(0, cards.length - visibleCount);
      if (currentIndex > maxIndex) currentIndex = maxIndex;

      // Prev button state
      prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
      prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';

      // Next button state
      const atEnd = currentIndex >= cards.length - visibleCount;
      nextBtn.style.opacity = (atEnd || totalWidthNeeded <= containerWidth + 5) ? '0.3' : '1';
      nextBtn.style.pointerEvents = (atEnd || totalWidthNeeded <= containerWidth + 5) ? 'none' : 'auto';

      // Show dots only when there are more cards than can be shown
      indicatorsContainer.style.display = cards.length <= visibleCount ? 'none' : 'flex';

      // Apply transform
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
      const visibleCount = getVisibleCount();
      const maxIndex = cards.length - visibleCount;
      if (currentIndex < maxIndex) currentIndex++;
      else currentIndex = 0;
      updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
      const visibleCount = getVisibleCount();
      const maxIndex = cards.length - visibleCount;
      if (currentIndex > 0) currentIndex--;
      else currentIndex = maxIndex;
      updateCarousel();
    });

    updateCarouselParams = updateCarousel;
    window.addEventListener('resize', updateCarousel);

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    const trackContainer = track.parentElement;

    trackContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    trackContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        const visibleCount = getVisibleCount();
        const maxIndex = cards.length - visibleCount;
        if (diff > 0) {
          // swiped left → go next
          if (currentIndex < maxIndex) currentIndex++;
          else currentIndex = 0;
        } else {
          // swiped right → go prev
          if (currentIndex > 0) currentIndex--;
          else currentIndex = maxIndex;
        }
        updateCarousel();
      }
    }, { passive: true });

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
  const cerrarModalCrear = document.getElementById("cerrarModalCrear");
  const btnCancelarCrear = document.getElementById("btnCancelarCrear");

  if (cardCrear && modalCrearMeta) {
    cardCrear.addEventListener("click", () => {
      modalCrearMeta.classList.add("activo");
    });

    const closeModal = () => modalCrearMeta.classList.remove("activo");

    if (cerrarModalCrear) cerrarModalCrear.addEventListener("click", closeModal);
    if (btnCancelarCrear) btnCancelarCrear.addEventListener("click", closeModal);

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
          mostrarAlerta("Meta creada exitosamente");

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

  /* ===============================
       SELECTOR DE VISTA (Carrusel / Cards / Lista)
     =============================== */

  const seccionMetas = document.querySelector('.seccion-metas');
  const listaMetas   = document.getElementById('listaMetas');
  const cardGrid     = document.getElementById('cardGrid');
  const viewBtns     = document.querySelectorAll('.view-btn');

  // Paginación
  let currentPage = 1;
  const itemsPerPage = 8;
  const paginationContainer = document.getElementById('paginationContainer');

  // Vista guardada en localStorage (default: carrusel)
  const vistaGuardada = localStorage.getItem('vistaMetas') || 'carrusel';

  /** Renderiza los controles de paginación */
  function renderPagination(totalItems, vista) {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = '';
    
    // Si la vista es carrusel o no hay suficientes items, se oculta
    if (vista === 'carrusel' || totalItems <= itemsPerPage) {
      paginationContainer.style.display = 'none';
      return;
    }
    
    paginationContainer.style.display = 'flex';
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Botón Anterior
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn page-nav';
    prevBtn.innerHTML = '&lt;';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        if (vista === 'lista') buildListaView();
        else if (vista === 'card') buildCardGridView();
      }
    });
    paginationContainer.appendChild(prevBtn);

    // Números de página
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
      pageBtn.textContent = i;
      pageBtn.addEventListener('click', () => {
        currentPage = i;
        if (vista === 'lista') buildListaView();
        else if (vista === 'card') buildCardGridView();
      });
      paginationContainer.appendChild(pageBtn);
    }

    // Botón Siguiente
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn page-nav';
    nextBtn.innerHTML = '&gt;';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        if (vista === 'lista') buildListaView();
        else if (vista === 'card') buildCardGridView();
      }
    });
    paginationContainer.appendChild(nextBtn);
  }

  /** Construye la vista lista a partir de las tarjetas del track */
  function buildListaView() {
    listaMetas.innerHTML = '';
    const allCards = Array.from(document.querySelectorAll('#carouselTrack .meta-card'));
    renderPagination(allCards.length, 'lista');

    const startIndex = (currentPage - 1) * itemsPerPage;
    const cards = allCards.slice(startIndex, startIndex + itemsPerPage);

    cards.forEach(card => {
      const isCrear = card.classList.contains('card-crear');

      if (isCrear) {
        const row = document.createElement('div');
        row.className = 'lista-meta-item lista-crear';
        row.innerHTML = '<div class="lista-crear-inner"><i class="fa-solid fa-plus"></i><span>Crear tu propia meta</span></div>';
        row.addEventListener('click', () => card.click());
        listaMetas.appendChild(row);
        return;
      }

      const titulo = card.querySelector('.meta-titulo') ? card.querySelector('.meta-titulo').textContent : 'Mi Meta';
      const actual = parseFloat(card.getAttribute('data-actual') || '0');
      const total  = parseFloat(card.getAttribute('data-total') || '0');
      const pct    = total > 0 ? Math.min(100, Math.round((actual / total) * 100)) : 0;
      const bgImage = card.style.backgroundImage || '';

      const row = document.createElement('div');
      row.className = 'lista-meta-item';

      // Creamos el thumb por separado para evitar conflicto de comillas en atributos inline
      const thumb = document.createElement('div');
      thumb.className = 'lista-meta-thumb';
      thumb.style.backgroundImage = bgImage || "url('img/textura_oro.png')";

      const info = document.createElement('div');
      info.className = 'lista-meta-info';
      info.innerHTML = `
        <div class="lista-meta-nombre">${titulo}</div>
        <div class="lista-meta-progreso-wrap">
          <div class="lista-meta-texto">
            <span>${pct}% completado</span>
            <span>$${actual.toLocaleString('es-ES')} / $${total.toLocaleString('es-ES')}</span>
          </div>
          <div class="lista-meta-bar">
            <div class="lista-meta-fill" style="width: ${pct}%"></div>
          </div>
        </div>
      `;

      const btn = document.createElement('button');
      btn.className = 'lista-meta-btn';
      btn.textContent = 'Aportar';

      row.appendChild(thumb);
      row.appendChild(info);
      row.appendChild(btn);

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        localStorage.setItem('metaSeleccionadaTitulo', titulo);
        localStorage.setItem('metaSeleccionadaImagen', bgImage);
        localStorage.setItem('metaSeleccionadaActual', String(actual));
        localStorage.setItem('metaSeleccionadaTotal', String(total));
        window.location.href = 'panel_aporte/aporte.html';
      });

      listaMetas.appendChild(row);
    });
  }

  /** Construye la vista card-grid clonando las tarjetas del track */
  function buildCardGridView() {
    cardGrid.innerHTML = '';
    const allCards = Array.from(document.querySelectorAll('#carouselTrack .meta-card'));
    renderPagination(allCards.length, 'card');

    const startIndex = (currentPage - 1) * itemsPerPage;
    const cards = allCards.slice(startIndex, startIndex + itemsPerPage);

    cards.forEach(card => {
      const clone = card.cloneNode(true);

      const btnAportar = clone.querySelector('.boton-aportar');
      if (btnAportar) {
        btnAportar.addEventListener('click', (e) => {
          e.stopPropagation();
          const t  = clone.querySelector('.meta-titulo') ? clone.querySelector('.meta-titulo').textContent : 'Mi Meta';
          const ac = clone.getAttribute('data-actual') || '0';
          const to = clone.getAttribute('data-total') || '0';
          const bg = clone.style.backgroundImage;
          localStorage.setItem('metaSeleccionadaTitulo', t);
          localStorage.setItem('metaSeleccionadaImagen', bg);
          localStorage.setItem('metaSeleccionadaActual', ac);
          localStorage.setItem('metaSeleccionadaTotal', to);
          window.location.href = 'panel_aporte/aporte.html';
        });
      }

      if (clone.classList.contains('card-crear')) {
        clone.addEventListener('click', () => {
          const m = document.getElementById('modalCrearMeta');
          if (m) m.classList.add('activo');
        });
      }

      cardGrid.appendChild(clone);
    });
  }

  /** Activa una vista */
  function setView(vista) {
    const vistaAnterior = localStorage.getItem('vistaMetas');
    if (vistaAnterior !== vista) {
      currentPage = 1; // Reiniciar a página 1 si cambia la vista
    }
    
    localStorage.setItem('vistaMetas', vista);
    seccionMetas.classList.remove('vista-lista', 'vista-card');
    viewBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.view === vista));

    if (vista === 'lista') {
      seccionMetas.classList.add('vista-lista');
      buildListaView();
    } else if (vista === 'card') {
      seccionMetas.classList.add('vista-card');
      buildCardGridView();
    } else if (vista === 'carrusel') {
      if (paginationContainer) paginationContainer.style.display = 'none';
    }
  }

  viewBtns.forEach(btn => btn.addEventListener('click', () => setView(btn.dataset.view)));

  // Aplicar vista guardada al cargar
  setView(vistaGuardada);

});

