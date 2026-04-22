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
  const elementoNombreHeader = document.getElementById("nombreUsuarioHeader");

  const nombreGuardado = localStorage.getItem("nombre_usuario") || "Usuario";

  if (elementoNombre) {
    elementoNombre.textContent = nombreGuardado;
  }
  if (elementoNombreHeader) {
    elementoNombreHeader.textContent = nombreGuardado;
  }

  /* ===============================
       SINCRONIZAR AVATAR DE USUARIO
     =============================== */
  const avatarPrincipal = document.getElementById("avatarPrincipal");
  const avatarGuardado = localStorage.getItem("pesa-tus-pesos-avatar");

  if (avatarGuardado && avatarPrincipal) {
    avatarPrincipal.src = avatarGuardado;
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
   FAQ MODAL JAVASCRIPT
=============================== */
const faqItems = document.querySelectorAll(".faq-item");
const faqModal = document.getElementById("faqModal");
const closeFaqModal = document.getElementById("closeFaqModal");
const faqModalTitle = document.getElementById("faqModalTitle");
const faqModalText = document.getElementById("faqModalText");

if (faqModal && faqItems.length > 0) {
  faqItems.forEach(item => {
    item.addEventListener("click", () => {
      // Set modal content by extracting from data attributes
      if (faqModalTitle) faqModalTitle.textContent = item.getAttribute("data-question");
      if (faqModalText) faqModalText.textContent = item.getAttribute("data-answer");

      // Add 'activo' class to render the modal visible
      faqModal.classList.add("activo");
    });
  });

  // Handle modal close behavior on the X btn
  if (closeFaqModal) {
    closeFaqModal.addEventListener("click", () => {
      faqModal.classList.remove("activo");
    });
  }

  // Handle modal close behavior upon clicking away directly to the modal overlay
  window.addEventListener("click", (e) => {
    if (e.target === faqModal) {
      faqModal.classList.remove("activo");
    }
  });
}

/* ===============================
   BOTON DE NAVEGACIÓN A INICIO
=============================== */
const btnInicio = document.getElementById("btn-inicio");
if (btnInicio) {
  btnInicio.addEventListener("click", function () {
    window.location.href = "../Home/index.html";
  });
}

/* ===============================
   CHATBOT MODAL JAVASCRIPT
=============================== */
const openChatBtn = document.getElementById("openChatBtn");
const chatModal = document.getElementById("chatModal");
const closeChatModal = document.getElementById("closeChatModal");
const chatMessages = document.getElementById("chatMessages");
const chatInputField = document.getElementById("chatInputField");
const sendChatBtn = document.getElementById("sendChatBtn");

const webhookUrl = "https://apoloz3.app.n8n.cloud/webhook/eaf97b8f-668b-49ae-b1b9-c051f6f0114d/chat";

if (openChatBtn && chatModal) {
  openChatBtn.addEventListener("click", () => {
    chatModal.classList.add("activo");
    if (chatInputField) chatInputField.focus();
  });

  if (closeChatModal) {
    closeChatModal.addEventListener("click", () => {
      chatModal.classList.remove("activo");
    });
  }

  // Handle modal close behavior upon clicking away directly to the modal overlay
  window.addEventListener("click", (e) => {
    if (e.target === chatModal) {
      chatModal.classList.remove("activo");
    }
  });

  // Sending messages handling
  const sendMessage = async () => {
    const userText = chatInputField.value.trim();
    if (!userText) return;

    // Remove text from input
    chatInputField.value = "";

    // Append user message bubble to view
    const userMsgHTML = `<div class="chat-bubble chat-user">${userText}</div>`;
    chatMessages.insertAdjacentHTML('beforeend', userMsgHTML);
    scrollToBottom();

    // Show typing indicator
    const typingHTML = `
      <div class="chat-bubble chat-typing" id="typingIndicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    chatMessages.insertAdjacentHTML('beforeend', typingHTML);
    scrollToBottom();

    try {
      // El nodo "Chat Trigger" de n8n requiere normalmente esta estructura:
      const bodyPayload = {
        action: "sendMessage",
        sessionId: "sesion-" + Date.now(),
        route: "chat",
        text: userText, // Usado por Chat Trigger
        chatInput: userText, // Usado por Webhooks genéricos
        message: userText
      };

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyPayload)
      });

      const responseText = await response.text();
      let botResponse = "Recibido. Hubo una respuesta del servidor pero no pude entender el formato.";

      try {
        const jsonData = JSON.parse(responseText);
        // By default n8n chat output usually stores text in `.output`
        botResponse = jsonData.output || jsonData.response || jsonData.text || jsonData.message || responseText;
      } catch (parseError) {
        // Fallback for raw text responses
        botResponse = responseText;
      }

      // Remove typing indicator
      const typingInd = document.getElementById("typingIndicator");
      if (typingInd) typingInd.remove();

      // Append Bot message bubble
      const botMsgHTML = `<div class="chat-bubble chat-bot">${botResponse}</div>`;
      chatMessages.insertAdjacentHTML('beforeend', botMsgHTML);
      scrollToBottom();

    } catch (error) {
      console.error("Error connecting to chat webhook:", error);

      // Remove typing indicator
      const typingInd = document.getElementById("typingIndicator");
      if (typingInd) typingInd.remove();

      const errorMsgHTML = `<div class="chat-bubble chat-bot" style="color:var(--danger)">Error de conexión con el Asistente. Intenta de nuevo.</div>`;
      chatMessages.insertAdjacentHTML('beforeend', errorMsgHTML);
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  if (sendChatBtn) {
    sendChatBtn.addEventListener("click", sendMessage);
  }

  if (chatInputField) {
    chatInputField.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  }
}

