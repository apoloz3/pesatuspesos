document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Datos iniciales y Meta Seleccionada
    const goalTitleEl = document.querySelector('.goal-title');
    const goalImageEl = document.querySelector('.goal-image');
    
    let metaTitulo = localStorage.getItem("metaSeleccionadaTitulo") || "Mi Meta";

    // 2. Renderizar el Calendario Real
    const calendarGrid = document.getElementById('calendar-grid');
    const monthTitle = document.querySelector('.cal-month-title');
    const navBtns = document.querySelectorAll('.cal-nav-btn');
    const calIconDay = document.querySelector('.cal-icon-day');
    const dateText = document.querySelector('.date-text');
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedDayInfo = { day: currentDate.getDate(), month: currentMonth, year: currentYear };
 
    const monthNames = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
    const monthNamesCapitalized = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const daysHeader = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

    function renderCalendar(month, year) {
        calendarGrid.innerHTML = '';
        
        // Cargar historial de aportes para esta meta
        const historyKey = `historial_meta_${metaTitulo}`;
        const savedHistory = JSON.parse(localStorage.getItem(historyKey)) || [];

        // Render Headers
        daysHeader.forEach(day => {
            const span = document.createElement('span');
            span.className = 'calendar-grid-header';
            span.textContent = day;
            calendarGrid.appendChild(span);
        });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevMonthDays = new Date(year, month, 0).getDate();
        
        monthTitle.textContent = `${monthNames[month]} ${year}`;

        // Fillers del mes anterior
        for(let i = firstDay - 1; i >= 0; i--) {
            const cell = document.createElement('div');
            cell.className = 'cal-day-muted';
            cell.textContent = prevMonthDays - i;
            calendarGrid.appendChild(cell);
        }

        // Dias del mes en curso
        for(let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement('div');
            
            // Construir ID de fecha para verificar en el historial: "D-M-Y"
            const dateID = `${day}-${month}-${year}`;
            const hasAporte = savedHistory.includes(dateID);
            
            let innerHTML = `<span class="cal-num">${day}</span>`;
            if(hasAporte) {
                cell.classList.add('cal-has-aporte');
                innerHTML += `<i class="far fa-check-circle cal-check-icon"></i>`;
            }

            if(day === selectedDayInfo.day && month === selectedDayInfo.month && year === selectedDayInfo.year) {
                cell.classList.add('cal-selected');
                updateSelectionText(day, month);
            }

            cell.innerHTML = innerHTML;

            // Selección Visual
            cell.addEventListener('click', () => {
                selectedDayInfo = { day, month, year };
                document.querySelectorAll('.cal-selected').forEach(el => el.classList.remove('cal-selected'));
                cell.classList.add('cal-selected');
                updateSelectionText(day, month);
            });

            calendarGrid.appendChild(cell);
        }

        // Fillers del siguiente mes
        const totalFilled = firstDay + daysInMonth;
        const remainingSlots = 42 - totalFilled;
        for(let i = 1; i <= remainingSlots; i++) {
             const cell = document.createElement('div');
             cell.className = 'cal-day-muted';
             cell.textContent = i;
             calendarGrid.appendChild(cell);
        }
    }

    function updateSelectionText(day, month) {
        if(calIconDay) calIconDay.textContent = day;
        if(dateText) dateText.textContent = `${day} de ${monthNamesCapitalized[month]}`;
    }

    if(navBtns.length >= 2) {
        navBtns[0].addEventListener('click', () => { 
            currentMonth--;
            if(currentMonth < 0) { currentMonth = 11; currentYear--; }
            renderCalendar(currentMonth, currentYear);
        });
        navBtns[1].addEventListener('click', () => { 
            currentMonth++;
            if(currentMonth > 11) { currentMonth = 0; currentYear++; }
            renderCalendar(currentMonth, currentYear);
        });
    }

    renderCalendar(currentMonth, currentYear);

    // 3. Interactividad de Input y Montos
    const inputAporte = document.getElementById('aporte-input');
    const updateAmountButtons = document.querySelectorAll('.quick-amount-btn');
    const btnAportar = document.getElementById('btn-aportar');
    const btnCancelar = document.querySelector('.btn-secondary');

    const parseMonto = (val) => parseFloat(val) || 0;
    const formatMonto = (num) => num.toFixed(2);

    function updateMainButton(monto) {
        if(btnAportar) btnAportar.innerHTML = `<i class="fas fa-coins" style="margin-right: 8px;"></i> APORTAR $${formatMonto(monto)}`;
    }

    updateAmountButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const amountToAdd = e.target.getAttribute('data-amount');
            if (amountToAdd) {
                const currentVal = parseMonto(inputAporte.value);
                const newVal = currentVal + parseFloat(amountToAdd);
                inputAporte.value = formatMonto(newVal);
                updateMainButton(newVal);
            } else {
                inputAporte.focus();
            }
        });
    });

    if (inputAporte) {
        inputAporte.addEventListener('input', (e) => {
            let val = e.target.value.replace(/[^0-9.]/g, '');
            const parts = val.split('.');
            if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');
            e.target.value = val;
            updateMainButton(parseMonto(val));
        });

        inputAporte.addEventListener('blur', (e) => {
            const num = parseMonto(e.target.value);
            e.target.value = formatMonto(num);
            updateMainButton(num);
        });
    }

    // 4. Lógica Financiera y UI
    const statActualEl = document.querySelector('.stat-row:nth-child(1) .stat-value');
    const statTotalEl = document.querySelector('.stat-row:nth-child(2) .stat-value');
    const statProgresoEl = document.querySelector('.stat-row:nth-child(3) .stat-value');
    const percentageEl = document.querySelector('.percentage');
    const circleEl = document.querySelector('.circle');

    let metaActual = 0;
    let metaTotal = 0;

    function updateFinancialUI(actual, total) {
        const porcentaje = total > 0 ? Math.min(Math.round((actual / total) * 100), 100) : 0;
        if (statActualEl) statActualEl.textContent = `$${actual.toLocaleString("es-ES")}`;
        if (statTotalEl) statTotalEl.textContent = `$${total.toLocaleString("es-ES")}`;
        if (statProgresoEl) statProgresoEl.textContent = `${porcentaje}%`;
        if (percentageEl) percentageEl.textContent = `${porcentaje}%`;
        if (circleEl) {
            circleEl.style.transition = "stroke-dasharray 1.5s ease-out";
            circleEl.style.strokeDasharray = `${porcentaje}, 100`;
        }
    }

    if (goalTitleEl && goalImageEl) {
        goalTitleEl.textContent = metaTitulo;
        const storedImageUrl = localStorage.getItem("metaSeleccionadaImagen");
        const baseActual = parseFloat(localStorage.getItem("metaSeleccionadaActual")) || 0;
        const baseTotal = parseFloat(localStorage.getItem("metaSeleccionadaTotal")) || 0;

        const progressKey = `progreso_meta_${metaTitulo}`;
        const savedProgress = localStorage.getItem(progressKey);
        
        metaActual = savedProgress !== null ? parseFloat(savedProgress) : baseActual;
        metaTotal = baseTotal;

        updateFinancialUI(metaActual, metaTotal);

        if (storedImageUrl && storedImageUrl !== "none") {
            const cleanUrl = storedImageUrl.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
            goalImageEl.src = cleanUrl.startsWith('img/') ? "../" + cleanUrl : cleanUrl;
        }
    }

    // 5. Botón APORTAR: Guardar Dinero y Día
    if (btnAportar) {
        btnAportar.addEventListener('click', () => {
            const amount = parseMonto(inputAporte ? inputAporte.value : 0);
            if (amount > 0) {
               // 5.1 Guardar Dinero
               metaActual += amount;
               localStorage.setItem(`progreso_meta_${metaTitulo}`, metaActual);
               updateFinancialUI(metaActual, metaTotal);

               // 5.2 Guardar Día en Historial
               const historyKey = `historial_meta_${metaTitulo}`;
               const savedHistory = JSON.parse(localStorage.getItem(historyKey)) || [];
               const dateID = `${selectedDayInfo.day}-${selectedDayInfo.month}-${selectedDayInfo.year}`;
               
               if(!savedHistory.includes(dateID)) {
                   savedHistory.push(dateID);
                   localStorage.setItem(historyKey, JSON.stringify(savedHistory));
               }

               // 5.3 Refrescar Calendario para mostrar chulito
               renderCalendar(currentMonth, currentYear);
               
               alert(`¡Aporte de $${formatMonto(amount)} realizado exitosamente! saldo: $${metaActual.toLocaleString("es-ES")}.`);
               
               setTimeout(() => { window.location.href = '../ahorros.html'; }, 800);
            } else {
               alert(`Ingresa un monto válido mayor a 0.`);
            }
        });
    }

    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => { window.location.href = '../ahorros.html'; });
    }
});
