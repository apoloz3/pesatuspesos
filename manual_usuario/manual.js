const btnGirarPagina = document.querySelectorAll('.btn-sig-ant');

btnGirarPagina.forEach((el, index) => {
    el.onclick = () => {

        const idGirarPagina = el.getAttribute('data-page');
        const girarPagina = document.getElementById(idGirarPagina);

        if (girarPagina.classList.contains('giro')) {
            girarPagina.classList.remove('giro');

            setTimeout(() => {
                girarPagina.style.zIndex = 20 - index;
            }, 500);

        } else {
            girarPagina.classList.add('giro');

            setTimeout(() => {
                girarPagina.style.zIndex = 20 + index;
            }, 500);
        }
    }
});


// Botón contáctame al hacer clic
const paginas = document.querySelectorAll('.pagina-libro.pagina-der');
const btnContactame = document.querySelector('.boton.contactame');

btnContactame.onclick = () => {
    paginas.forEach((pagina, index) => {
        setTimeout(() => {

            pagina.classList.add('giro');
            setTimeout(() => {
                pagina.style.zIndex = 20 + index;
            }, 500);
        }, (index + 1) * 200 + 100)
    });
}


// Botón volver al perfil al hacer clic
const btnVolverPerfil = document.querySelector('.volver-perfil');

btnVolverPerfil.onclick = () => {
    paginas.forEach((_, index) => {
        setTimeout(() => {
            let idx = paginas.length - 1 - index;
            paginas[idx].classList.remove('giro');

            setTimeout(() => {
                paginas[idx].style.zIndex = 10 + index;
            }, 500)
        }, (index + 1) * 200 + 100)

    })
}


// Animación de apertura
const cubiertaDer = document.querySelector('.cubierta.cubierta-der');
const paginaIzq = document.querySelector('.pagina-libro.pagina-izq');


// Animación de apertura (cubierta derecha)
setTimeout(() => {
    cubiertaDer.classList.add('giro');
}, 2100);

setTimeout(() => {
    cubiertaDer.style.zIndex = -1;
}, 2800);


paginas.forEach((_, index) => {
    setTimeout(() => {
        let idx = paginas.length - 1 - index;
        paginas[idx].classList.remove('giro');

        setTimeout(() => {
            paginas[idx].style.zIndex = 10 + index;
        }, 500)
    }, (index + 1) * 200 + 2100)

}) 