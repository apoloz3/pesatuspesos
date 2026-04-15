document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Renderizar el Calendario (Hardcoded para coincidir exactamente con el diseño)
    const calendarGrid = document.getElementById('calendar-grid');
    
    const daysHeader = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    const daysData = [
        { type: 'prev', num: 30 }, { type: 'curr', num: 1 }, { type: 'curr', num: 2 }, { type: 'curr', num: 3, check: true }, { type: 'curr', num: 4 }, { type: 'curr', num: 5 }, { type: 'curr', num: 6 },
        { type: 'curr', num: 7, check: true }, { type: 'curr', num: 8 }, { type: 'curr', num: 9 }, { type: 'curr', num: 10 }, { type: 'curr', num: 11, check: true }, { type: 'curr', num: 12 }, { type: 'curr', num: 13 },
        { type: 'curr', num: 14, check: true }, { type: 'curr', num: 15, selected: true }, { type: 'curr', num: 16 }, { type: 'curr', num: 17 }, { type: 'curr', num: 18 }, { type: 'curr', num: 19, check: true }, { type: 'curr', num: 20 },
        { type: 'curr', num: 21 }, { type: 'curr', num: 22 }, { type: 'curr', num: 23 }, { type: 'curr', num: 24 }, { type: 'curr', num: 25 }, { type: 'curr', num: 26, check: true }, { type: 'curr', num: 27 },
        { type: 'curr', num: 28 }, { type: 'curr', num: 29 }, { type: 'curr', num: 30 }, { type: 'curr', num: 31 }, { type: 'next', num: 1 }, { type: 'next', num: 2 }, { type: 'next', num: 3 }
    ];

    // Render Headers
    daysHeader.forEach(day => {
        const span = document.createElement('span');
        span.className = 'calendar-grid-header';
        span.textContent = day;
        calendarGrid.appendChild(span);
    });

    // Render Days
    daysData.forEach(dayInfo => {
        const cell = document.createElement('div');
        
        if (dayInfo.type === 'prev' || dayInfo.type === 'next') {
            cell.className = 'cal-day-muted';
            cell.textContent = dayInfo.num;
        } else {
            let innerHTML = `<span class="cal-num">${dayInfo.num}</span>`;
            
            if (dayInfo.selected) {
                cell.classList.add('cal-selected');
            }
            
            if (dayInfo.check) {
                cell.classList.add('cal-has-aporte');
                innerHTML += `<i class="far fa-check-circle cal-check-icon"></i>`;
            }

            cell.innerHTML = innerHTML;

            // Hacerlo cliqueable para demostración
            cell.addEventListener('click', () => {
                // Remover selected anterior
                document.querySelectorAll('.cal-selected').forEach(el => el.classList.remove('cal-selected'));
                cell.classList.add('cal-selected');
                
                // Actualizar texto del día
                document.querySelector('.cal-icon-day').textContent = dayInfo.num;
                document.querySelector('.date-text').textContent = `${dayInfo.num} de Diciembre`;
            });
        }
        
        calendarGrid.appendChild(cell);
    });


    // 2. Interactividad Input y Botones de Aporte
    const inputAporte = document.getElementById('aporte-input');
    const updateAmountButtons = document.querySelectorAll('.quick-amount-btn');
    const btnAportar = document.getElementById('btn-aportar');

    // Parsear el string del input "150.00" -> 150
    const parseMonto = (val) => parseFloat(val) || 0;
    
    // Formatear al estilo "150.00"
    const formatMonto = (num) => num.toFixed(2);

    updateAmountButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const amountToAdd = e.target.getAttribute('data-amount');
            if (amountToAdd) {
                const currentVal = parseMonto(inputAporte.value);
                const newVal = currentVal + parseFloat(amountToAdd);
                inputAporte.value = formatMonto(newVal);
                updateMainButton(newVal);
            } else {
                // Boton "Otro": poner focus en el input
                inputAporte.focus();
            }
        });
    });

    // Validar y actualizar el boton principal cuando el usuario escribe
    inputAporte.addEventListener('input', (e) => {
        // Solo permitir numeros y un punto
        let val = e.target.value.replace(/[^0-9.]/g, '');
        
        // Evitar multiples puntos
        const parts = val.split('.');
        if (parts.length > 2) {
            val = parts[0] + '.' + parts.slice(1).join('');
        }
        
        e.target.value = val;
        
        const numVal = parseMonto(val);
        // Actualizar el texto del botón grande, pero manteniendo el formato HTML interno
        updateMainButton(numVal);
    });

    // Formatear al salir del input si esta vacio o crudo
    inputAporte.addEventListener('blur', (e) => {
        const num = parseMonto(e.target.value);
        e.target.value = formatMonto(num);
        updateMainButton(num);
    });

    function updateMainButton(monto) {
        btnAportar.innerHTML = `<i class="fas fa-coins" style="margin-right: 8px;"></i> APORTAR €${formatMonto(monto)}`;
    }

    // 3. Animación circular chart
    const circle = document.querySelector('.circle');
    if (circle) {
        // Animate from 0 to 65% on load for a nice effect
        circle.style.strokeDasharray = "0, 100";
        setTimeout(() => {
            circle.style.transition = "stroke-dasharray 1.5s ease-out";
            circle.style.strokeDasharray = "65, 100";
        }, 300);
    }
});
