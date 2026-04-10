const esAdmin = true; // cambiar luego

if (!esAdmin) {
    alert("No tienes permisos");
    window.location.href = "../Inicio/index.html";
}