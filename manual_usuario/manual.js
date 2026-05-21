const paginas = document.querySelectorAll('.pagina-libro.pagina-der');
const btnGirarPagina = document.querySelectorAll('.btn-sig-ant');

btnGirarPagina.forEach((el, index) => {
    el.onclick = () => {
        const idGirarPagina = el.getAttribute('data-page');
        const girarPagina = document.getElementById(idGirarPagina);
        const leafIndex = Array.from(paginas).indexOf(girarPagina);
        const total = paginas.length;

        if (girarPagina.classList.contains('giro')) { // Está en la izquierda, vuelve a la derecha
            girarPagina.classList.remove('giro');
            girarPagina.style.zIndex = 50 + leafIndex; // Mantener arriba durante animación
            
            setTimeout(() => {
                girarPagina.style.zIndex = total - leafIndex; // Reposo en la pila derecha
            }, 500);

        } else { // Está en la derecha, va a la izquierda
            girarPagina.classList.add('giro');
            girarPagina.style.zIndex = 50 + leafIndex; // Mantener arriba durante animación
            
            setTimeout(() => {
                girarPagina.style.zIndex = total + leafIndex; // Reposo en la pila izquierda
            }, 500);
        }
    }
});


// Botón contáctame al hacer clic
const btnContactame = document.querySelector('.boton.contactame');

if (btnContactame) {
    btnContactame.onclick = () => {
        paginas.forEach((pagina, leafIndex) => {
            setTimeout(() => {
                if (!pagina.classList.contains('giro')) {
                    pagina.classList.add('giro');
                    pagina.style.zIndex = 50 + leafIndex;
                    setTimeout(() => {
                        pagina.style.zIndex = paginas.length + leafIndex;
                    }, 500);
                }
            }, (leafIndex + 1) * 200 + 100)
        });
    }
}


// Botón volver al perfil al hacer clic
const btnVolverPerfil = document.querySelector('.volver-perfil');

if (btnVolverPerfil) {
    btnVolverPerfil.onclick = () => {
        paginas.forEach((_, index) => {
            setTimeout(() => {
                let idx = paginas.length - 1 - index;
                if (paginas[idx].classList.contains('giro')) {
                    paginas[idx].classList.remove('giro');
                    paginas[idx].style.zIndex = 50 + idx;
                    setTimeout(() => {
                        paginas[idx].style.zIndex = paginas.length - idx;
                    }, 500)
                }
            }, (index + 1) * 200 + 100)
        })
    }
}


// Animación de apertura
const cubiertaDer = document.querySelector('.cubierta.cubierta-der');
const paginaIzq = document.querySelector('.pagina-libro.pagina-izq');


// Animación de apertura (cubierta derecha)
setTimeout(() => {
    if (cubiertaDer) cubiertaDer.classList.add('giro');
}, 2100);

setTimeout(() => {
    if (cubiertaDer) cubiertaDer.style.zIndex = -1;
}, 2800);


paginas.forEach((_, index) => {
    setTimeout(() => {
        let idx = paginas.length - 1 - index;
        paginas[idx].classList.remove('giro');

        paginas[idx].style.zIndex = 50 + idx; // Elevado durante animación

        setTimeout(() => {
            paginas[idx].style.zIndex = paginas.length - idx; // Reposo en derecha
        }, 500)
    }, (index + 1) * 200 + 2100)
})

// Lógica para abrir cualquier imagen en un Lightbox Modal
document.addEventListener('DOMContentLoaded', () => {
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCerrar = document.querySelector('.lightbox-cerrar');

    if (lightboxModal && lightboxImg && lightboxCerrar) {
        // Crear el cursor personalizado de lupa
        const customCursor = document.createElement('div');
        customCursor.innerHTML = '<i class="bx bx-search-alt-2"></i>';
        customCursor.style.position = 'fixed';
        customCursor.style.pointerEvents = 'none';
        customCursor.style.zIndex = '9999';
        customCursor.style.fontSize = '2rem'; // Lupa grande (2-3 veces más grande que un cursor normal)
        customCursor.style.color = '#fff';
        customCursor.style.backgroundColor = 'rgba(0, 10, 18, 0.7)';
        customCursor.style.width = '60px';
        customCursor.style.height = '60px';
        customCursor.style.display = 'flex';
        customCursor.style.justifyContent = 'center';
        customCursor.style.alignItems = 'center';
        customCursor.style.borderRadius = '50%';
        customCursor.style.boxShadow = '0 4px 15px rgba(0,0,0,0.5), inset 0 0 10px rgba(207, 181, 59, 0.5)';
        customCursor.style.border = '2px solid #CFB53B'; // Borde dorado de la marca
        customCursor.style.transform = 'translate(-50%, -50%) scale(0)';
        customCursor.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease';
        customCursor.style.opacity = '0';
        document.body.appendChild(customCursor);

        document.querySelectorAll('.caja-img img').forEach(img => {
            img.style.cursor = 'none';

            img.addEventListener('mouseenter', () => {
                customCursor.style.opacity = '1';
                customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
            });

            img.addEventListener('mousemove', (e) => {
                customCursor.style.left = e.clientX + 'px';
                customCursor.style.top = e.clientY + 'px';
            });

            img.addEventListener('mouseleave', () => {
                customCursor.style.opacity = '0';
                customCursor.style.transform = 'translate(-50%, -50%) scale(0)';
            });

            img.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar propagación a otros elementos
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt || 'Imagen ampliada';
                lightboxModal.classList.add('activo');
                customCursor.style.opacity = '0';
                customCursor.style.transform = 'translate(-50%, -50%) scale(0)';
            });
        });

        const cerrarLightbox = () => {
            lightboxModal.classList.remove('activo');
        };

        // Cerrar al hacer clic en el botón de cerrar o en cualquier parte del fondo
        lightboxCerrar.addEventListener('click', cerrarLightbox);
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal || e.target === lightboxCerrar) {
                cerrarLightbox();
            }
        });

        // Cerrar con la tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxModal.classList.contains('activo')) {
                cerrarLightbox();
            }
        });
    }

    // Lógica para descargar el manual en PDF
    const btnDescargar = document.getElementById('btnDescargarManual');
    if (btnDescargar) {
        btnDescargar.addEventListener('click', async (e) => {
            e.preventDefault();

            // Cambiar estado del botón para indicar progreso
            const originalText = btnDescargar.textContent;
            btnDescargar.textContent = 'Generando...';
            btnDescargar.style.pointerEvents = 'none';
            btnDescargar.style.opacity = '0.7';

            try {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF('p', 'mm', 'a4'); // A4: 210 x 297 mm

                // Colores de la marca
                const darkBlue = [0, 10, 18];
                const gold = [207, 181, 59];
                const textDark = [30, 30, 30];
                const textSecondary = [100, 100, 100];

                // Promesa para cargar imágenes
                const loadPdfImage = (src) => {
                    return new Promise((resolve) => {
                        const img = new Image();
                        img.onload = () => resolve(img);
                        img.onerror = () => resolve(null);
                        img.src = src;
                    });
                };

                // Promesa para cargar fuentes TTF en base64
                const loadFont = async (url) => {
                    try {
                        const response = await fetch(url);
                        if (!response.ok) return null;
                        const blob = await response.blob();
                        return new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                const base64 = reader.result.split(',')[1];
                                resolve(base64);
                            };
                            reader.onerror = () => resolve(null);
                            reader.readAsDataURL(blob);
                        });
                    } catch (e) {
                        console.error('Error cargando fuente:', e);
                        return null;
                    }
                };

                // Intentar cargar Poppins (Regular, Bold, Italic)
                const poppinsRegular = await loadFont('https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Regular.ttf');
                const poppinsBold = await loadFont('https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Bold.ttf');
                const poppinsItalic = await loadFont('https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Italic.ttf');

                let fontName = 'Helvetica';
                if (poppinsRegular) {
                    doc.addFileToVFS('Poppins-Regular.ttf', poppinsRegular);
                    doc.addFont('Poppins-Regular.ttf', 'Poppins', 'normal');
                    fontName = 'Poppins';
                }
                if (poppinsBold) {
                    doc.addFileToVFS('Poppins-Bold.ttf', poppinsBold);
                    doc.addFont('Poppins-Bold.ttf', 'Poppins', 'bold');
                }
                if (poppinsItalic) {
                    doc.addFileToVFS('Poppins-Italic.ttf', poppinsItalic);
                    doc.addFont('Poppins-Italic.ttf', 'Poppins', 'italic');
                }

                // Dibujar encabezado en páginas de contenido
                const drawHeader = (pageNum) => {
                    // Fondo del banner (azul oscuro)
                    doc.setFillColor(darkBlue[0], darkBlue[1], darkBlue[2]);
                    doc.rect(0, 0, 210, 25, 'F');

                    // Línea dorada inferior
                    doc.setFillColor(gold[0], gold[1], gold[2]);
                    doc.rect(0, 24, 210, 1, 'F');

                    // Texto
                    doc.setTextColor(gold[0], gold[1], gold[2]);
                    doc.setFont(fontName, 'bold');
                    doc.setFontSize(10);
                    doc.text('PESA TUS PESOS - MANUAL DE USUARIO', 15, 15);

                    doc.setTextColor(255, 255, 255);
                    doc.setFont(fontName, 'normal');
                    doc.text(`Página ${pageNum}`, 195, 15, { align: 'right' });
                };

                // Dibujar pie de página en páginas de contenido
                const drawFooter = () => {
                    doc.setFillColor(gold[0], gold[1], gold[2]);
                    doc.rect(15, 280, 180, 0.5, 'F');

                    doc.setTextColor(textSecondary[0], textSecondary[1], textSecondary[2]);
                    doc.setFont(fontName, 'normal');
                    doc.setFontSize(8);
                    doc.text('© 2026 Pesa Tus Pesos. Todos los derechos reservados.', 15, 286);
                    doc.text('www.pesatuspesos.com', 195, 286, { align: 'right' });
                };

                // Dibujar separador decorativo dorado
                const drawDivider = (y) => {
                    doc.setFillColor(gold[0], gold[1], gold[2]);
                    doc.rect(15, y, 40, 1, 'F');
                };

                // 1. PORTADA
                // Bloque azul oscuro superior
                doc.setFillColor(darkBlue[0], darkBlue[1], darkBlue[2]);
                doc.rect(0, 0, 210, 160, 'F');

                // Línea dorada separadora
                doc.setFillColor(gold[0], gold[1], gold[2]);
                doc.rect(0, 159, 210, 2, 'F');

                // Título y Subtítulo
                doc.setTextColor(gold[0], gold[1], gold[2]);
                doc.setFont(fontName, 'bold');
                doc.setFontSize(32);
                doc.text('Pesa Tus Pesos', 105, 55, { align: 'center' });

                doc.setTextColor(255, 255, 255);
                doc.setFont(fontName, 'normal');
                doc.setFontSize(18);
                doc.text('Manual de Usuario Oficial', 105, 75, { align: 'center' });

                // Imagen de portada
                const coverImg = await loadPdfImage('img/Img pesatuspesos.png');
                if (coverImg) {
                    const imgW = 75;
                    const imgH = 75;
                    const imgX = (210 - imgW) / 2;
                    const imgY = 95;

                    // Borde dorado de la imagen
                    doc.setDrawColor(gold[0], gold[1], gold[2]);
                    doc.setLineWidth(1.5);
                    doc.rect(imgX - 1, imgY - 1, imgW + 2, imgH + 2, 'D');

                    doc.addImage(coverImg, 'PNG', imgX, imgY, imgW, imgH);
                }

                // Texto de introducción en la parte inferior
                doc.setTextColor(textDark[0], textDark[1], textDark[2]);
                doc.setFont(fontName, 'normal');
                doc.setFontSize(11);
                const coverIntro = 'Bienvenido al manual de usuario oficial de Pesa Tus Pesos. Esta guía te orientará en el uso de la aplicación para gestionar de forma óptima tus finanzas personales, registrando ingresos, egresos y controlando tus metas de ahorro de forma eficiente.';
                const splitIntro = doc.splitTextToSize(coverIntro, 170);
                doc.text(splitIntro, 105, 195, { align: 'center' });

                // Información de pie de portada
                doc.setFontSize(9);
                doc.setTextColor(textSecondary[0], textSecondary[1], textSecondary[2]);
                doc.text('Publicado: Mayo 2026', 105, 260, { align: 'center' });
                doc.text('Desarrollado por Software Pro', 105, 266, { align: 'center' });

                // PAGINA 1: Desarrolladores Web
                doc.addPage();
                drawHeader(1);
                doc.setTextColor(darkBlue[0], darkBlue[1], darkBlue[2]);
                doc.setFont(fontName, 'bold');
                doc.setFontSize(20);
                doc.text('Desarrolladores Web', 15, 42);
                drawDivider(45);

                const devElements = document.querySelectorAll('#giro-1 .frente-pagina .contenido-trabajo-educ');
                let devY = 58;
                devElements.forEach((dev) => {
                    const name = dev.querySelector('.anio').textContent.trim();
                    const role = dev.querySelector('h3').textContent.trim();
                    const desc = dev.querySelector('p').textContent.trim();

                    doc.setTextColor(gold[0], gold[1], gold[2]);
                    doc.setFont(fontName, 'bold');
                    doc.setFontSize(12);
                    doc.text(name, 15, devY);

                    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
                    doc.setFont(fontName, 'italic');
                    doc.setFontSize(10.5);
                    doc.text(role, 15, devY + 5);

                    doc.setFont(fontName, 'normal');
                    doc.setFontSize(9.5);
                    const splitDesc = doc.splitTextToSize(desc, 180);
                    doc.text(splitDesc, 15, devY + 10);

                    devY += 28;
                });
                drawFooter();

                // PAGINA 2: Nuestros Servicios
                doc.addPage();
                drawHeader(2);
                doc.setTextColor(darkBlue[0], darkBlue[1], darkBlue[2]);
                doc.setFont(fontName, 'bold');
                doc.setFontSize(20);
                doc.text('Nuestros Servicios', 15, 42);
                drawDivider(45);

                const serviceElements = document.querySelectorAll('#giro-1 .dorso-pagina .contenido-servicios');
                let sY = 58;
                serviceElements.forEach((srv) => {
                    const title = srv.querySelector('h3').textContent.trim();
                    const desc = srv.querySelector('.desc-larga').textContent.trim();

                    doc.setTextColor(gold[0], gold[1], gold[2]);
                    doc.setFont(fontName, 'bold');
                    doc.setFontSize(12);
                    doc.text(`• ${title}`, 15, sY);

                    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
                    doc.setFont(fontName, 'normal');
                    doc.setFontSize(10);
                    const splitSrvDesc = doc.splitTextToSize(desc, 175);
                    doc.text(splitSrvDesc, 20, sY + 5);

                    sY += 22;
                });
                drawFooter();

                // PAGINA 3: Nuestras Habilidades
                doc.addPage();
                drawHeader(3);
                doc.setTextColor(darkBlue[0], darkBlue[1], darkBlue[2]);
                doc.setFont(fontName, 'bold');
                doc.setFontSize(20);
                doc.text('Nuestras Habilidades', 15, 42);
                drawDivider(45);

                const skillCategories = document.querySelectorAll('#giro-2 .frente-pagina .contenido-habilidades');
                let skY = 58;
                skillCategories.forEach((cat) => {
                    const categoryTitle = cat.querySelector('h3').textContent.trim();
                    const skillSpans = cat.querySelectorAll('.contenido span');
                    const skills = Array.from(skillSpans).map(span => span.textContent.trim()).join(', ');

                    doc.setTextColor(gold[0], gold[1], gold[2]);
                    doc.setFont(fontName, 'bold');
                    doc.setFontSize(12);
                    doc.text(categoryTitle, 15, skY);

                    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
                    doc.setFont(fontName, 'normal');
                    doc.setFontSize(10.5);
                    const splitSkills = doc.splitTextToSize(skills, 180);
                    doc.text(splitSkills, 15, skY + 6);

                    skY += 22;
                });
                drawFooter();

                // PAGINA 4: Objetivos del Sistema
                doc.addPage();
                drawHeader(4);
                doc.setTextColor(darkBlue[0], darkBlue[1], darkBlue[2]);
                doc.setFont(fontName, 'bold');
                doc.setFontSize(20);
                doc.text('Objetivos del Sistema', 15, 42);
                drawDivider(45);

                const logoImg = await loadPdfImage('img/Applogo.png');
                if (logoImg) {
                    const imgW = 75;
                    const imgH = 50;
                    const imgX = (210 - imgW) / 2;
                    doc.addImage(logoImg, 'PNG', imgX, 52, imgW, imgH);
                }

                doc.setTextColor(darkBlue[0], darkBlue[1], darkBlue[2]);
                doc.setFont(fontName, 'bold');
                doc.setFontSize(12);
                doc.text('El sistema permitirá al usuario:', 15, 115);

                doc.setTextColor(textDark[0], textDark[1], textDark[2]);
                doc.setFont(fontName, 'normal');
                doc.setFontSize(10.5);

                const objectives = [
                    'Registrar ingresos y gastos.',
                    'Visualizar el estado de sus finanzas de manera interactiva.',
                    'Obtener recomendaciones financieras adaptadas a sus hábitos.',
                    'Realizar un seguimiento exhaustivo y continuo a sus hábitos de consumo.'
                ];

                let objY = 123;
                objectives.forEach((obj) => {
                    doc.text(`✔   ${obj}`, 20, objY);
                    objY += 8;
                });
                drawFooter();

                // PAGINA 5: Requisitos del Sistema
                doc.addPage();
                drawHeader(5);
                doc.setTextColor(darkBlue[0], darkBlue[1], darkBlue[2]);
                doc.setFont(fontName, 'bold');
                doc.setFontSize(20);
                doc.text('Requisitos del Sistema', 15, 42);
                drawDivider(45);

                const reqImg = await loadPdfImage('img/Requisitos.png');
                if (reqImg) {
                    const imgW = 75;
                    const imgH = 50;
                    const imgX = (210 - imgW) / 2;
                    doc.addImage(reqImg, 'PNG', imgX, 52, imgW, imgH);
                }

                doc.setTextColor(darkBlue[0], darkBlue[1], darkBlue[2]);
                doc.setFont(fontName, 'bold');
                doc.setFontSize(12);
                doc.text('Para utilizar la aplicación, el usuario debe contar con:', 15, 115);

                doc.setTextColor(textDark[0], textDark[1], textDark[2]);
                doc.setFont(fontName, 'normal');
                doc.setFontSize(10.5);

                const requirements = [
                    'Navegador web actualizado (Google Chrome, Mozilla Firefox, Microsoft Edge, etc.).',
                    'Conexión a internet estable.',
                    'Dispositivo compatible (Computador, Tablet o Celular con pantalla adaptable).'
                ];

                let reqY = 123;
                requirements.forEach((req) => {
                    doc.text(`✔   ${req}`, 20, reqY);
                    reqY += 8;
                });
                drawFooter();

                // PAGINAS 6 a 13: Pasos detallados con capturas
                const pagesConfig = [
                    { id: 'giro-3', pageKey: 'dorso-pagina', title: 'Acceder al registro', img: 'img/Paso1.png', pageNum: 6 },
                    { id: 'giro-4', pageKey: 'frente-pagina', title: 'Completar el formulario', img: 'img/paso2.png', pageNum: 7 },
                    { id: 'giro-4', pageKey: 'dorso-pagina', title: 'Aceptar términos y condiciones', img: 'img/Paso3.png', pageNum: 8 },
                    { id: 'giro-5', pageKey: 'frente-pagina', title: 'Confirmación de registro exitoso', img: 'img/Paso4.png', pageNum: 9 },
                    { id: 'giro-5', pageKey: 'dorso-pagina', title: 'Iniciar sesión', img: 'img/Paso5.png', pageNum: 10 },
                    { id: 'giro-6', pageKey: 'frente-pagina', title: 'Verificación de seguridad', img: 'img/paso6.png', pageNum: 11 },
                    { id: 'giro-6', pageKey: 'dorso-pagina', title: 'Explorar el panel principal', img: 'img/Paso7.png', pageNum: 12 },
                    { id: 'giro-7', pageKey: 'frente-pagina', title: 'Explorar el panel principal (cont.)', img: 'img/Paso7.1.png', pageNum: 13 }
                ];

                for (const config of pagesConfig) {
                    doc.addPage();
                    drawHeader(config.pageNum);

                    doc.setTextColor(darkBlue[0], darkBlue[1], darkBlue[2]);
                    doc.setFont(fontName, 'bold');
                    doc.setFontSize(20);
                    doc.text(config.title, 15, 42);
                    drawDivider(45);

                    // Obtener texto explicativo dinámicamente
                    const pageEl = document.querySelector(`#${config.id} .${config.pageKey}`);
                    let description = '';
                    if (pageEl) {
                        const descEl = pageEl.querySelector('.caja-info p');
                        if (descEl) {
                            description = descEl.textContent.trim();
                        }
                    }

                    // Cargar imagen del paso
                    const stepImg = await loadPdfImage(config.img);
                    if (stepImg) {
                        const imgW = 140;
                        const imgH = 95;
                        const imgX = (210 - imgW) / 2;
                        const imgY = 52;

                        // Borde para la captura de pantalla
                        doc.setDrawColor(220, 220, 220);
                        doc.setLineWidth(0.5);
                        doc.rect(imgX - 0.5, imgY - 0.5, imgW + 1, imgH + 1, 'D');

                        doc.addImage(stepImg, 'PNG', imgX, imgY, imgW, imgH);
                    }

                    // Renderizar descripción abajo
                    if (description) {
                        doc.setTextColor(darkBlue[0], darkBlue[1], darkBlue[2]);
                        doc.setFont(fontName, 'bold');
                        doc.setFontSize(12);
                        doc.text('Instrucciones:', 15, 160);

                        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
                        doc.setFont(fontName, 'normal');
                        doc.setFontSize(10.5);

                        const splitDescription = doc.splitTextToSize(description, 180);
                        doc.text(splitDescription, 15, 168);
                    }

                    drawFooter();
                }

                // Guardar y descargar el PDF
                doc.save('Manual_Usuario_PesaTusPesos.pdf');

            } catch (error) {
                console.error('Error generating PDF:', error);
                alert('Hubo un error al generar el PDF del manual. Por favor, intenta de nuevo.');
            } finally {
                // Restaurar estado del botón
                btnDescargar.textContent = originalText;
                btnDescargar.style.pointerEvents = 'auto';
                btnDescargar.style.opacity = '1';
            }
        });
    }
}); 