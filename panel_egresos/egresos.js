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
const opcionesConceptoEgreso = ["Vivienda", "Alimentación", "Transporte", "Servicios", "Entretenimiento", "Salud", "Otro"];
// Combinados para el select concepto simple, solo Egresos para este panel
const opcionesConcepto = [...opcionesConceptoEgreso];

// Variables de paginación
let paginaActual = 1;
const registrosPorPagina = 5;

// Elementos del DOM
const nombreMesEl = document.getElementById('nombreMes');
const cuerpoTabla = document.getElementById('cuerpoTabla');
const btnAgregar = document.getElementById('btnAgregar');
const btnGuardar = document.getElementById('btnGuardar');

const resumenEgresosEl = document.getElementById('resumenEgresos');
const resumenGastosEl = document.getElementById('resumenGastos');
const resumenSaldoEl = document.getElementById('resumenSaldo');

const analisisEgresosEl = document.getElementById('analisisEgresos');
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
});

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

        // Mostrar egresos guardados, o filas vacías creadas exclusivamente en el panel de egresos
        const esEgreso = opcionesConceptoEgreso.includes(reg.concepto) || (!reg.concepto && reg.tipo === 'egreso');
        
        return esMismoMes && esEgreso;
    });
}

function agregarFilaVacia() {
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
        tipo: 'egreso'
    };
    
    registros.push(nuevoReg);
    
    // Ir a la última página al agregar si es necesario
    const registrosMes = obtenerRegistrosMesActual();
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
    alert("Datos guardados correctamente");
}

function eliminarRegistro(id) {
    if (confirm("¿Estás seguro de eliminar este registro?")) {
        registros = registros.filter(r => r.id !== id);
        localStorage.setItem('registros_financieros', JSON.stringify(registros));
        actualizarInterfaz();
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
    
    let totalEgresos = 0;
    
    registrosMes.forEach(reg => {
        if (opcionesConceptoEgreso.includes(reg.concepto)) {
            totalEgresos += parseFloat(reg.monto) || 0;
        }
    });
    
    // Saldo Total (Todos los registros globalmente, Ingesos - Egresos)
    let globalIngresos = 0;
    let globalEgresos = 0;
    
    registros.forEach(reg => {
        if (opcionesConceptoEgreso.includes(reg.concepto)) {
            globalEgresos += parseFloat(reg.monto) || 0;
        } else {
            globalIngresos += parseFloat(reg.monto) || 0;
        }
    });

    const saldo = globalIngresos - globalEgresos;
    
    if (resumenEgresosEl) resumenEgresosEl.textContent = formatCurrency(totalEgresos);
    if (resumenSaldoEl) resumenSaldoEl.textContent = formatCurrency(saldo);
    
    if (analisisEgresosEl) analisisEgresosEl.textContent = formatCurrency(totalEgresos);
    if (analisisSaldoEl) analisisSaldoEl.textContent = formatCurrency(saldo);
    
    // Color según saldo
    if (analisisSaldoEl) analisisSaldoEl.style.color = saldo >= 0 ? 'var(--growth-green)' : 'var(--danger)';
    if (resumenSaldoEl) resumenSaldoEl.style.color = saldo >= 0 ? 'var(--growth-green)' : 'var(--danger)';
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

    let totalEgrActual = 0;
    let totalEgrPasado = 0;
    const conceptosContador = {};

    registros.forEach(reg => {
        if (!reg.fecha) return;
        const fechaReg = new Date(reg.fecha + 'T00:00:00');
        const mesReg = fechaReg.getMonth();
        const anioReg = fechaReg.getFullYear();
        const monto = parseFloat(reg.monto) || 0;

        if (opcionesConceptoEgreso.includes(reg.concepto)) {
            if (mesReg === mesAct && anioReg === anioAct) {
                totalEgrActual += monto;
                // Doughnut chart uses current month data
                conceptosContador[reg.concepto] = (conceptosContador[reg.concepto] || 0) + monto;
            } else if (mesReg === mesPas && anioReg === anioPasado) {
                totalEgrPasado += monto;
            }
        }
    });

    const labelsCircular = Object.keys(conceptosContador);
    const dataCircular = Object.values(conceptosContador);

    // Gráfico de Barras con gradientes diferenciados
    if (graficoBarras) graficoBarras.destroy();
    const ctxBarras = document.getElementById('graficoBarras').getContext('2d');
    
    // Gradiente sutil para el mes pasado
    let gradientePasado = ctxBarras.createLinearGradient(0, 0, 0, 300);
    gradientePasado.addColorStop(0, 'rgba(255, 248, 220, 0.4)'); 
    gradientePasado.addColorStop(1, 'rgba(255, 248, 220, 0.0)');

    // Gradiente rojo brillante y vibrante para el mes actual (Alerta/Egresos)
    let gradienteActual = ctxBarras.createLinearGradient(0, 0, 0, 300);
    gradienteActual.addColorStop(0, 'rgba(255, 77, 77, 0.9)'); 
    gradienteActual.addColorStop(1, 'rgba(255, 77, 77, 0.1)');

    graficoBarras = new Chart(ctxBarras, {
        type: 'bar',
        data: {
            labels: ['Mes Pasado', 'Mes Actual'],
            datasets: [{
                label: 'Egresos',
                data: [totalEgrPasado, totalEgrActual],
                backgroundColor: [gradientePasado, gradienteActual],
                borderColor: ['#fff8dc', '#ff4d4f'],
                borderWidth: 2,
                borderRadius: 6,
                hoverBackgroundColor: ['rgba(255, 248, 220, 0.6)', '#ff7875'],
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
                legend: { display: false }, 
                tooltip: { 
                    backgroundColor: 'rgba(0, 10, 18, 0.9)', 
                    titleColor: '#fff', 
                    bodyColor: '#ff4d4f',
                    borderColor: '#ff4d4f', 
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) { return '$ ' + context.parsed.y.toLocaleString(); }
                    }
                }
            }
        }
    });

    // Gráfico Circular futurista mezclando paleta de rojos (Egresos)
    if (graficoCircular) graficoCircular.destroy();
    const ctxCircular = document.getElementById('graficoCircular').getContext('2d');
    
    graficoCircular = new Chart(ctxCircular, {
        type: 'doughnut',
        data: {
            labels: labelsCircular,
            datasets: [{
                data: dataCircular,
                backgroundColor: [
                    '#ff4d4f', // Red danger
                    '#ff7875', // Light red
                    '#ffa39e', // Peach red
                    '#cf1322', // Deep red
                    '#a8071a', // Dark red
                    '#f5222d'  // Primary red
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

