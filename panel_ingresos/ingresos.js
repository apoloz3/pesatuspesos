// Configuración de Estados
let fechaActual = new Date();
let registros = JSON.parse(localStorage.getItem('registros_financieros')) || [];

// Meses en Español
const nombresMeses = [
    "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", 
    "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
];

// Opciones para Selects
const opcionesMetodo = ["Efectivo", "Banco", "Tarjeta", "Transferencia"];
const opcionesConceptoIngreso = ["Sueldo", "Venta", "Inversión", "Regalo", "Otro"];
// Combinados para el select concepto simple, solo ingresos para este panel
const opcionesConcepto = [...opcionesConceptoIngreso];

// Variables de paginación
let paginaActual = 1;
const registrosPorPagina = 5;

// Elementos del DOM
const nombreMesEl = document.getElementById('nombreMes');
const cuerpoTabla = document.getElementById('cuerpoTabla');
const btnAgregar = document.getElementById('btnAgregar');
const btnGuardar = document.getElementById('btnGuardar');
const pickerCalendario = document.getElementById('pickerCalendario');
const abrirPicker = document.getElementById('abrirPicker');
const gridMeses = document.getElementById('gridMeses');
const listaAnios = document.getElementById('listaAnios');
const btnAplicarFiltro = document.getElementById('btnAplicarFiltro');
const btnLimpiarFiltro = document.getElementById('btnLimpiarFiltro');
const anioArriba = document.getElementById('anioArriba');
const anioAbajo = document.getElementById('anioAbajo');
const inputAnioManual = document.getElementById('inputAnioManual');
const errorAnio = document.getElementById('errorAnio');
const listaAniosDropdown = document.getElementById('listaAniosDropdown');
const modalAviso = document.getElementById('modalAviso');
const mensajeAviso = document.getElementById('mensajeAviso');
const btnCerrarAviso = document.getElementById('btnCerrarAviso');
const modalConfirmacion = document.getElementById('modalConfirmacion');
const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');
const btnCancelarEliminar = document.getElementById('btnCancelarEliminar');

// Estado temporal del picker
let idAEliminar = null;
let anioEnEdicion = fechaActual.getFullYear();
let mesEnEdicion = fechaActual.getMonth();
const mesesAbreviados = ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic."];

const resumenIngresosEl = document.getElementById('resumenIngresos');
const resumenGastosEl = document.getElementById('resumenGastos');
const resumenSaldoEl = document.getElementById('resumenSaldo');

const analisisIngresosEl = document.getElementById('analisisIngresos');
const analisisSaldoEl = document.getElementById('analisisSaldo');

// Controles paginación
const btnPrevPag = document.getElementById('btnPrevPag');
const btnNextPag = document.getElementById('btnNextPag');
const infoPaginacion = document.getElementById('infoPaginacion');

// Gráficos
let graficoBarras, graficoCircular;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    actualizarInterfaz();
    document.getElementById('mesPrevio').addEventListener('click', () => cambiarMes(-1));
    document.getElementById('mesSiguiente').addEventListener('click', () => cambiarMes(1));
    btnAgregar.addEventListener('click', agregarFilaVacia);
    btnGuardar.addEventListener('click', guardarCambios);
    
    if (btnPrevPag) btnPrevPag.addEventListener('click', () => cambiarPagina(-1));
    if (btnNextPag) btnNextPag.addEventListener('click', () => cambiarPagina(1));

    // Lógica selector premium
    if (abrirPicker) {
        abrirPicker.addEventListener('click', (e) => {
            e.stopPropagation();
            pickerCalendario.classList.toggle('activo');
            if (pickerCalendario.classList.contains('activo')) {
                anioEnEdicion = fechaActual.getFullYear();
                mesEnEdicion = fechaActual.getMonth();
                renderizarPicker();
            }
        });
    }

    // Cerrar al hacer clic fuera del picker
    document.addEventListener('click', (e) => {
        if (pickerCalendario && !pickerCalendario.contains(e.target) && abrirPicker && !abrirPicker.contains(e.target)) {
            pickerCalendario.classList.remove('activo');
        }
    });

    // Cerrar modales al hacer clic en el backdrop (el área fuera del contenido)
    if (modalAviso) {
        modalAviso.addEventListener('click', (e) => {
            if (e.target === modalAviso) {
                modalAviso.classList.remove('activo');
            }
        });
    }

    if (modalConfirmacion) {
        modalConfirmacion.addEventListener('click', (e) => {
            if (e.target === modalConfirmacion) {
                modalConfirmacion.classList.remove('activo');
                idAEliminar = null;
            }
        });
    }

    // Lógica selector premium (Flechas de años removidas por simplificación)

    btnAplicarFiltro.addEventListener('click', () => {
        fechaActual.setFullYear(anioEnEdicion);
        fechaActual.setMonth(mesEnEdicion);
        paginaActual = 1;
        actualizarInterfaz();
        pickerCalendario.classList.remove('activo');
    });

    // Botones de Exportar
    document.getElementById('btnExportarExcel').addEventListener('click', exportarExcel);
    document.getElementById('btnExportarPDF').addEventListener('click', exportarPDF);

    btnLimpiarFiltro.addEventListener('click', () => {
        fechaActual = new Date(); // Reset a hoy
        anioEnEdicion = fechaActual.getFullYear();
        mesEnEdicion = fechaActual.getMonth();
        paginaActual = 1;
        actualizarInterfaz();
        pickerCalendario.classList.remove('activo');
    });

    if (inputAnioManual) {
        inputAnioManual.addEventListener('focus', () => {
            poblarDropdownAnios();
            listaAniosDropdown.classList.add('activo');
        });

        inputAnioManual.addEventListener('input', (e) => {
            const valStr = e.target.value;
            
            // Validar si solo hay números
            if (valStr !== "" && !/^\d+$/.test(valStr)) {
                inputAnioManual.classList.add('input-error');
                if (errorAnio) errorAnio.textContent = 'Solo se permiten números';
                btnAplicarFiltro.disabled = true;
                poblarDropdownAnios(""); // Mostrar todo si hay error de letras
                return;
            }

            const val = parseInt(valStr);
            const esValido = !isNaN(val) && val >= 1900 && val <= 2100;
            
            if (esValido) {
                anioEnEdicion = val;
                inputAnioManual.classList.remove('input-error');
                if (errorAnio) errorAnio.textContent = '';
                btnAplicarFiltro.disabled = false;
                renderizarPicker();
            } else {
                inputAnioManual.classList.add('input-error');
                if (errorAnio) {
                    if (valStr.length >= 4) {
                        errorAnio.textContent = 'Año inválido (1900-2100)';
                    } else if (valStr.length > 0) {
                        errorAnio.textContent = 'Ingresa un año (1900-2100)';
                    } else {
                        errorAnio.textContent = '';
                    }
                }
                btnAplicarFiltro.disabled = true;
            }
            
            // Filtrar dropdown
            poblarDropdownAnios(valStr);
        });

        // Cerrar al hacer clic fuera del contenedor
        document.addEventListener('click', (e) => {
            if (!inputAnioManual.contains(e.target) && !listaAniosDropdown.contains(e.target)) {
                listaAniosDropdown.classList.remove('activo');
            }
        });
    }

    if (btnCerrarAviso) {
        btnCerrarAviso.addEventListener('click', () => {
            modalAviso.classList.remove('activo');
        });
    }

    if (btnCancelarEliminar) {
        btnCancelarEliminar.addEventListener('click', () => {
            modalConfirmacion.classList.remove('activo');
            idAEliminar = null;
        });
    }

    if (btnConfirmarEliminar) {
        btnConfirmarEliminar.addEventListener('click', () => {
            if (idAEliminar) {
                registros = registros.filter(r => r.id !== idAEliminar);
                localStorage.setItem('registros_financieros', JSON.stringify(registros));
                actualizarInterfaz();
                modalConfirmacion.classList.remove('activo');
                idAEliminar = null;
                mostrarAviso("Registro eliminado correctamente");
            }
        });
    }
});


function mostrarAviso(mensaje) {
    if (mensajeAviso && modalAviso) {
        mensajeAviso.textContent = mensaje;
        modalAviso.classList.add('activo');
    } else {
        alert(mensaje); // Fallback
    }
}

function renderizarPicker() {
    // Sincronizar input manual
    if (inputAnioManual) {
        inputAnioManual.value = anioEnEdicion;
    }
    
    // Renderizar meses
    gridMeses.innerHTML = '';
    mesesAbreviados.forEach((nombre, index) => {
        const btn = document.createElement('div');
        btn.className = `mes-btn ${index === mesEnEdicion ? 'seleccionado' : ''}`;
        btn.textContent = nombre;
        btn.onclick = (e) => {
            e.stopPropagation();
            mesEnEdicion = index;
            renderizarPicker();
        };
        gridMeses.appendChild(btn);
    });
}

function cambiarPagina(direccion) {
    const registrosMes = obtenerRegistrosMesActual();
    const totalPaginas = Math.ceil(registrosMes.length / registrosPorPagina) || 1;
    let nuevaPagina = paginaActual + direccion;
    
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
        paginaActual = nuevaPagina;
        renderizarTabla();
    }
}

// Funciones de Meses
function cambiarMes(direccion) {
    fechaActual.setMonth(fechaActual.getMonth() + direccion);
    paginaActual = 1; // reset page on month change
    actualizarInterfaz();
}

function actualizarInterfaz() {
    const mesIdx = fechaActual.getMonth();
    const anio = fechaActual.getFullYear();
    nombreMesEl.textContent = `${nombresMeses[mesIdx]} ${anio}`;
    
    renderizarTabla();
    actualizarResumen();
    actualizarGraficos();
}

// Funciones CRUD
function renderizarTabla() {
    cuerpoTabla.innerHTML = '';
    const registrosMes = obtenerRegistrosMesActual();
    
    const totalPaginas = Math.ceil(registrosMes.length / registrosPorPagina) || 1;
    if (paginaActual > totalPaginas) paginaActual = totalPaginas;
    
    // Actualizar controles
    if (infoPaginacion) infoPaginacion.textContent = `${paginaActual} / ${totalPaginas}`;
    if (btnPrevPag) btnPrevPag.disabled = paginaActual === 1;
    if (btnNextPag) btnNextPag.disabled = paginaActual === totalPaginas;
    
    const indexInicio = (paginaActual - 1) * registrosPorPagina;
    const registrosPagina = registrosMes.slice(indexInicio, indexInicio + registrosPorPagina);
    
    registrosPagina.forEach((reg, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="date" value="${reg.fecha}" data-index="${reg.id}" class="input-fecha" onfocus="this.placeholder=''" placeholder="Fecha"></td>
            <td><input type="text" value="${reg.descripcion}" data-index="${reg.id}" class="input-desc" placeholder="Descripción" onfocus="this.placeholder=''"></td>
            <td>
                <select data-index="${reg.id}" class="input-metodo">
                    <option value="" disabled ${!reg.metodo ? 'selected' : ''}>Método</option>
                    ${opcionesMetodo.map(opt => `<option value="${opt}" ${opt === reg.metodo ? 'selected' : ''}>${opt}</option>`).join('')}
                </select>
            </td>
            <td>
                <select data-index="${reg.id}" class="input-concepto">
                    <option value="" disabled ${!reg.concepto ? 'selected' : ''}>Concepto</option>
                    ${opcionesConcepto.map(opt => `<option value="${opt}" ${opt === reg.concepto ? 'selected' : ''}>${opt}</option>`).join('')}
                </select>
            </td>
            <td><input type="number" value="${reg.monto !== '' ? reg.monto : ''}" data-index="${reg.id}" class="input-monto" placeholder="Monto" onfocus="this.placeholder=''"></td>
            <td class="acciones">
                <button class="btn-accion" onclick="enfocarFila(this)">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-accion btn-eliminar" onclick="eliminarRegistro('${reg.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        cuerpoTabla.appendChild(tr);
    });
}

function obtenerRegistrosMesActual() {
    const mes = fechaActual.getMonth();
    const anio = fechaActual.getFullYear();
    
    return registros.filter(reg => {
        const fechaReg = new Date(reg.fecha);
        const esMismoMes = fechaReg.getMonth() === mes && fechaReg.getFullYear() === anio;
        
        // Mostrar si es un ingreso conocido, o si es una fila nueva sin guardar creada en este panel
        const esIngreso = opcionesConceptoIngreso.includes(reg.concepto) || (!reg.concepto && reg.tipo === 'ingreso');
        
        return esMismoMes && esIngreso;
    });
}

function agregarFilaVacia() {
    // Validar si ya hay un registro en proceso en el mes actual
    let registrosMes = obtenerRegistrosMesActual();
    const tieneIncompleto = registrosMes.some(reg => !reg.descripcion.trim() || reg.monto === "" || parseFloat(reg.monto) === 0);
    
    if (tieneIncompleto) {
        mostrarAviso("Debes terminar de completar o guardar el registro actual antes de crear uno nuevo.");
        return;
    }

    const hoy = new Date();
    // Ajustar a la fecha actual del selector si es posible
    const mesAct = fechaActual.getMonth() + 1;
    const anioAct = fechaActual.getFullYear();
    const diaAct = String(hoy.getDate()).padStart(2, '0');
    const fechaStr = `${anioAct}-${String(mesAct).padStart(2, '0')}-${diaAct}`;

    const nuevoReg = {
        id: Date.now().toString(),
        fecha: fechaStr,
        descripcion: "",
        metodo: "",
        concepto: "",
        monto: "",
        tipo: 'ingreso'
    };
    
    registros.push(nuevoReg);
    
    // Ir a la última página al agregar si es necesario
    registrosMes = obtenerRegistrosMesActual();
    paginaActual = Math.ceil(registrosMes.length / registrosPorPagina) || 1;
    
    renderizarTabla();
}

function guardarCambios() {
    const filas = cuerpoTabla.querySelectorAll('tr');
    
    filas.forEach(fila => {
        const id = fila.querySelector('.input-fecha').dataset.index;
        const index = registros.findIndex(r => r.id === id);
        
        if (index !== -1) {
            registros[index].fecha = fila.querySelector('.input-fecha').value;
            registros[index].descripcion = fila.querySelector('.input-desc').value;
            registros[index].metodo = fila.querySelector('.input-metodo').value;
            registros[index].concepto = fila.querySelector('.input-concepto').value;
            registros[index].monto = fila.querySelector('.input-monto').value === '' ? 0 : parseFloat(fila.querySelector('.input-monto').value);
        }
    });
    
    // Filtrar los que estén vacíos completamente o sin monto si es necesario 
    // pero mantendremos la lógica original de guardado

    
    localStorage.setItem('registros_financieros', JSON.stringify(registros));
    actualizarInterfaz();
    mostrarAviso("Datos guardados correctamente");
}

function eliminarRegistro(id) {
    idAEliminar = id;
    if (modalConfirmacion) {
        modalConfirmacion.classList.add('activo');
    } else {
        // Fallback si por alguna razón no carga el modal
        if (confirm("¿Estás seguro de eliminar este registro?")) {
            registros = registros.filter(r => r.id !== id);
            localStorage.setItem('registros_financieros', JSON.stringify(registros));
            actualizarInterfaz();
        }
    }
}

function enfocarFila(boton) {
    const fila = boton.closest('tr');
    const primerInput = fila.querySelector('input');
    if (primerInput) primerInput.focus();
}

// Lógica de Negocio
function actualizarResumen() {
    const registrosMes = obtenerRegistrosMesActual();
    
    let totalIngresos = 0;
    let totalGastos = 0;
    
    registrosMes.forEach(reg => {
        if (opcionesConceptoIngreso.includes(reg.concepto)) {
            totalIngresos += parseFloat(reg.monto) || 0;
        }
    });
    
    const saldo = totalIngresos; // Ya no hay gastos en este panel
    
    if (resumenIngresosEl) resumenIngresosEl.textContent = formatCurrency(totalIngresos);
    if (resumenSaldoEl) resumenSaldoEl.textContent = formatCurrency(saldo);
    
    if (analisisIngresosEl) analisisIngresosEl.textContent = formatCurrency(totalIngresos);
    if (analisisSaldoEl) analisisSaldoEl.textContent = formatCurrency(saldo);
    
    // Color según saldo
    if (analisisSaldoEl) analisisSaldoEl.style.color = saldo >= 0 ? 'var(--growth-green)' : 'var(--danger)';
    if (resumenSaldoEl) resumenSaldoEl.style.color = saldo >= 0 ? 'var(--text-on-dark)' : 'var(--danger)';
}

function formatCurrency(valor) {
    return new Intl.NumberFormat('es-CO', { 
        style: 'currency', 
        currency: 'COP', 
        minimumFractionDigits: 0 
    }).format(valor).replace('COP', '$');
}

// Visualización de Datos
function actualizarGraficos() {
    const anioAct = fechaActual.getFullYear();
    const mesAct = fechaActual.getMonth();
    const anioPasado = mesAct === 0 ? anioAct - 1 : anioAct;
    const mesPas = mesAct === 0 ? 11 : mesAct - 1;

    let totalIngActual = 0;
    let totalIngPasado = 0;
    const conceptosContador = {};

    registros.forEach(reg => {
        if (!reg.fecha) return;
        const fechaReg = new Date(reg.fecha + 'T00:00:00');
        const mesReg = fechaReg.getMonth();
        const anioReg = fechaReg.getFullYear();
        const monto = parseFloat(reg.monto) || 0;

        if (opcionesConceptoIngreso.includes(reg.concepto)) {
            if (mesReg === mesAct && anioReg === anioAct) {
                totalIngActual += monto;
                // Doughnut chart uses current month data
                conceptosContador[reg.concepto] = (conceptosContador[reg.concepto] || 0) + monto;
            } else if (mesReg === mesPas && anioReg === anioPasado) {
                totalIngPasado += monto;
            }
        }
    });

    const labelsCircular = Object.keys(conceptosContador);
    const dataCircular = Object.values(conceptosContador);

    // Gráfico de Barras con gradientes diferenciados (diseño pro)
    if (graficoBarras) graficoBarras.destroy();
    const ctxBarras = document.getElementById('graficoBarras').getContext('2d');
    
    // Gradiente sutil y apagado para el mes pasado (Crema/Plata)
    let gradientePasado = ctxBarras.createLinearGradient(0, 0, 0, 300);
    gradientePasado.addColorStop(0, 'rgba(255, 248, 220, 0.4)'); 
    gradientePasado.addColorStop(1, 'rgba(255, 248, 220, 0.0)');

    // Gradiente brillante y vibrante para el mes actual (Verde de crecimiento)
    let gradienteActual = ctxBarras.createLinearGradient(0, 0, 0, 300);
    gradienteActual.addColorStop(0, 'rgba(22, 163, 74, 0.9)'); 
    gradienteActual.addColorStop(1, 'rgba(22, 163, 74, 0.1)');

    graficoBarras = new Chart(ctxBarras, {
        type: 'bar',
        data: {
            labels: ['Mes Pasado', 'Mes Actual'],
            datasets: [{
                label: 'Ingresos',
                data: [totalIngPasado, totalIngActual],
                backgroundColor: [gradientePasado, gradienteActual],
                borderColor: ['#fff8dc', '#16a34a'],
                borderWidth: 2,
                borderRadius: 6,
                hoverBackgroundColor: ['rgba(255, 248, 220, 0.6)', '#4ade80'],
                barPercentage: 0.55
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: { bottom: 10 }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            },
            scales: {
                y: { 
                    beginAtZero: true, 
                    grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false }, 
                    ticks: { 
                        color: 'rgba(255, 255, 255, 0.5)', 
                        padding: 10, 
                        font: { family: "'Inter', sans-serif", size: 11 },
                        callback: function(value) {
                            if (value >= 1000) return (value / 1000).toFixed(0) + 'k';
                            return value;
                        }
                    } 
                },
                x: { 
                    grid: { display: false },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)', padding: 10, font: { family: "'Inter', sans-serif", weight: 'bold' } } 
                }
            },
            plugins: { 
                legend: { display: false }, // Ocultar leyenda redundante
                tooltip: { 
                    backgroundColor: 'rgba(0, 10, 18, 0.9)', 
                    titleColor: '#fff', 
                    bodyColor: '#4ade80',
                    borderColor: '#16a34a', 
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) { return '$ ' + context.parsed.y.toLocaleString(); }
                    }
                }
            }
        }
    });

    // Gráfico Circular futurista mezclando paleta (Oro, Verde, Crema)
    if (graficoCircular) graficoCircular.destroy();
    const ctxCircular = document.getElementById('graficoCircular').getContext('2d');
    
    graficoCircular = new Chart(ctxCircular, {
        type: 'doughnut',
        data: {
            labels: labelsCircular,
            datasets: [{
                data: dataCircular,
                backgroundColor: [
                    '#16a34a', // Growth green
                    '#fedc00', // Gold glow
                    '#fff8dc', // Cream
                    '#cfb53c', // Matte gold
                    '#4ade80', // Light green
                    '#b38b00'  // Dark gold
                ],
                borderWidth: 3,
                borderColor: '#000c17', // Color de fondo profundo para separar tajos
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: { 
                padding: { top: 10, bottom: 20, left: 20, right: 20 } 
            },
            animation: {
                animateScale: true,
                animateRotate: true,
                duration: 2000,
                easing: 'easeOutExpo'
            },
            plugins: {
                legend: { 
                    position: 'bottom', 
                    labels: { 
                        color: 'rgba(255, 255, 255, 0.8)', 
                        padding: 15, 
                        usePointStyle: true, 
                        pointStyle: 'circle',
                        font: { family: "'Inter', sans-serif", size: 11 }
                    } 
                },
                tooltip: { 
                    backgroundColor: 'rgba(0, 10, 18, 0.9)', 
                    titleColor: '#fff', 
                    borderColor: 'rgba(255,255,255,0.1)', 
                    borderWidth: 1,
                    padding: 10,
                    callbacks: {
                        label: function(context) { return ' $ ' + context.parsed.toLocaleString(); }
                    }
                }
            },
            cutout: '65%',
            radius: '90%'
        }
    });
}

function poblarDropdownAnios(filtro = "") {
    if (!listaAniosDropdown) return;
    
    const anioActual = new Date().getFullYear();
    listaAniosDropdown.innerHTML = '';
    
    // Rango de años (1900 hasta actual + 1)
    const anios = [];
    for (let i = anioActual + 1; i >= 1900; i--) {
        if (i.toString().includes(filtro)) {
            anios.push(i);
        }
    }

    if (anios.length === 0) {
        const div = document.createElement('div');
        div.className = 'opcion-anio-premium';
        div.style.opacity = '0.5';
        div.style.cursor = 'default';
        div.textContent = 'Sin resultados';
        listaAniosDropdown.appendChild(div);
        return;
    }

    anios.forEach(anio => {
        const div = document.createElement('div');
        div.className = 'opcion-anio-premium';
        div.textContent = anio;
        div.onclick = () => {
            anioEnEdicion = anio;
            inputAnioManual.value = anio;
            inputAnioManual.classList.remove('input-error');
            if (errorAnio) errorAnio.textContent = '';
            btnAplicarFiltro.disabled = false;
            renderizarPicker();
            listaAniosDropdown.classList.remove('activo');
        };
        listaAniosDropdown.appendChild(div);
    });
}

// Funciones de Exportación
function exportarExcel() {
    const registrosMes = obtenerRegistrosMesActual();
    if (registrosMes.length === 0) {
        mostrarAviso("No hay datos para exportar en este mes.");
        return;
    }

    const mesStr = nombresMeses[fechaActual.getMonth()];
    const anioStr = fechaActual.getFullYear();
    const titulo = `Ingresos_${mesStr}_${anioStr}`;

    // Encabezados
    let csv = "Fecha,Descripción,Método,Concepto,Monto\n";

    // Datos
    registrosMes.forEach(reg => {
        const monto = reg.monto || 0;
        csv += `${reg.fecha},"${reg.descripcion.replace(/"/g, '""')}",${reg.metodo},${reg.concepto},${monto}\n`;
    });

    // Descarga
    const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${titulo}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportarPDF() {
    const registrosMes = obtenerRegistrosMesActual();
    if (registrosMes.length === 0) {
        mostrarAviso("No hay datos para exportar en este mes.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const mesStr = nombresMeses[fechaActual.getMonth()];
    const anioStr = fechaActual.getFullYear();
    const titulo = `Ingresos - ${mesStr} ${anioStr}`;
    const nombreArchivo = `Ingresos_${mesStr}_${anioStr}.pdf`;

    // Encabezado
    doc.setFillColor(0, 12, 23);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(243, 217, 137); // gold-light
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('PesatusPesos', 14, 13);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(titulo, 14, 23);

    // Fecha de generación
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text(`Generado: ${new Date().toLocaleDateString('es-CO')}`, 160, 23);

    // Tabla
    const columnas = ['Fecha', 'Descripción', 'Método', 'Concepto', 'Monto'];
    const filas = registrosMes.map(reg => [
        reg.fecha,
        reg.descripcion || '',
        reg.metodo || '',
        reg.concepto || '',
        formatCurrency(parseFloat(reg.monto) || 0)
    ]);

    doc.autoTable({
        head: [columnas],
        body: filas,
        startY: 35,
        theme: 'grid',
        headStyles: {
            fillColor: [207, 181, 60],
            textColor: [0, 12, 23],
            fontStyle: 'bold',
            fontSize: 9
        },
        bodyStyles: {
            textColor: [30, 30, 30],
            fontSize: 9
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        },
        foot: [['', '', '', 'TOTAL', formatCurrency(registrosMes.reduce((s, r) => s + (parseFloat(r.monto) || 0), 0))]],
        footStyles: {
            fillColor: [22, 163, 74],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        }
    });

    doc.save(nombreArchivo);
}
