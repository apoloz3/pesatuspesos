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
const opcionesConceptoGasto = ["Renta", "Comida", "Transporte", "Servicios", "Ocio", "Salud"];
// Combinados para el select concepto simple
const opcionesConcepto = [...opcionesConceptoIngreso, ...opcionesConceptoGasto];

// Elementos del DOM
const nombreMesEl = document.getElementById('nombreMes');
const cuerpoTabla = document.getElementById('cuerpoTabla');
const btnAgregar = document.getElementById('btnAgregar');
const btnGuardar = document.getElementById('btnGuardar');

const resumenIngresosEl = document.getElementById('resumenIngresos');
const resumenGastosEl = document.getElementById('resumenGastos');
const resumenSaldoEl = document.getElementById('resumenSaldo');

const analisisIngresosEl = document.getElementById('analisisIngresos');
const analisisGastosEl = document.getElementById('analisisGastos');
const analisisSaldoEl = document.getElementById('analisisSaldo');

// Gráficos
let graficoBarras, graficoCircular;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    actualizarInterfaz();
    
    document.getElementById('mesPrevio').addEventListener('click', () => cambiarMes(-1));
    document.getElementById('mesSiguiente').addEventListener('click', () => cambiarMes(1));
    btnAgregar.addEventListener('click', agregarFilaVacia);
    btnGuardar.addEventListener('click', guardarCambios);
});

// Funciones de Meses
function cambiarMes(direccion) {
    fechaActual.setMonth(fechaActual.getMonth() + direccion);
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
    
    registrosMes.forEach((reg, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="date" value="${reg.fecha}" data-index="${reg.id}" class="input-fecha"></td>
            <td><input type="text" value="${reg.descripcion}" data-index="${reg.id}" class="input-desc"></td>
            <td>
                <select data-index="${reg.id}" class="input-metodo">
                    ${opcionesMetodo.map(opt => `<option value="${opt}" ${opt === reg.metodo ? 'selected' : ''}>${opt}</option>`).join('')}
                </select>
            </td>
            <td>
                <select data-index="${reg.id}" class="input-concepto">
                    ${opcionesConcepto.map(opt => `<option value="${opt}" ${opt === reg.concepto ? 'selected' : ''}>${opt}</option>`).join('')}
                </select>
            </td>
            <td><input type="number" value="${reg.monto}" data-index="${reg.id}" class="input-monto"></td>
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
        return fechaReg.getMonth() === mes && fechaReg.getFullYear() === anio;
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
        descripcion: "Nuevo Registro",
        metodo: "Efectivo",
        concepto: "Otro",
        monto: 0
    };
    
    registros.push(nuevoReg);
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
            registros[index].monto = parseFloat(fila.querySelector('.input-monto').value) || 0;
        }
    });
    
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
    
    let totalIngresos = 0;
    let totalGastos = 0;
    
    registrosMes.forEach(reg => {
        // Para este dashboard, asumimos que ciertos conceptos son ingresos y otros gastos
        if (opcionesConceptoIngreso.includes(reg.concepto)) {
            totalIngresos += reg.monto;
        } else {
            totalGastos += reg.monto;
        }
    });
    
    const saldo = totalIngresos - totalGastos;
    
    resumenIngresosEl.textContent = formatCurrency(totalIngresos);
    resumenGastosEl.textContent = formatCurrency(totalGastos);
    resumenSaldoEl.textContent = formatCurrency(saldo);
    
    analisisIngresosEl.textContent = formatCurrency(totalIngresos);
    analisisGastosEl.textContent = formatCurrency(totalGastos);
    analisisSaldoEl.textContent = formatCurrency(saldo);
    
    // Color según saldo
    analisisSaldoEl.style.color = saldo >= 0 ? 'var(--growth-green)' : 'var(--danger)';
    resumenSaldoEl.style.color = saldo >= 0 ? 'var(--text-on-dark)' : 'var(--danger)';
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
    const registrosMes = obtenerRegistrosMesActual();
    
    // Datos para circular (Distribución de conceptos)
    const conceptosContador = {};
    registrosMes.forEach(reg => {
        conceptosContador[reg.concepto] = (conceptosContador[reg.concepto] || 0) + reg.monto;
    });
    
    const labelsCircular = Object.keys(conceptosContador);
    const dataCircular = Object.values(conceptosContador);
    
    // Datos para barras (Resumen Total)
    let totalIng = 0, totalGas = 0;
    registrosMes.forEach(reg => {
        if (opcionesConceptoIngreso.includes(reg.concepto)) totalIng += reg.monto;
        else totalGas += reg.monto;
    });

    // Gráfico de Barras
    if (graficoBarras) graficoBarras.destroy();
    const ctxBarras = document.getElementById('graficoBarras').getContext('2d');
    graficoBarras = new Chart(ctxBarras, {
        type: 'bar',
        data: {
            labels: ['Presupuesto (Estimado)', 'Real'],
            datasets: [{
                label: 'Ingresos',
                data: [totalIng * 0.9, totalIng], // Mock presupuesto
                backgroundColor: 'rgba(207, 181, 60, 0.8)',
                borderColor: '#cfb53c',
                borderWidth: 1
            }, {
                label: 'Gastos',
                data: [totalGas * 1.1, totalGas], // Mock presupuesto
                backgroundColor: 'rgba(0, 21, 36, 0.8)',
                borderColor: '#001524',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#666' } },
                x: { ticks: { color: '#666' } }
            },
            plugins: { legend: { labels: { color: '#fff' } } }
        }
    });

    // Gráfico Circular
    if (graficoCircular) graficoCircular.destroy();
    const ctxCircular = document.getElementById('graficoCircular').getContext('2d');
    graficoCircular = new Chart(ctxCircular, {
        type: 'doughnut',
        data: {
            labels: labelsCircular,
            datasets: [{
                data: dataCircular,
                backgroundColor: [
                    '#cfb53c', '#f3d989', '#ffcc00', '#b38b00', '#fedc00', '#fff8dc'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#fff', boxWidth: 12 } }
            },
            cutout: '70%'
        }
    });
}
