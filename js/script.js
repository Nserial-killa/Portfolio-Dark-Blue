// =====================================================
// 1. AÑO ACTUAL EN EL FOOTER
// Sin esto el <span id="current-year"> queda vacío.
// =====================================================
document.getElementById('current-year').textContent = new Date().getFullYear();


// =====================================================
// 2. MENÚ MÓVIL
// Abre y cierra el menú hamburguesa. También se
// cierra automáticamente al pulsar cualquier enlace.
// =====================================================
const menuToggle = document.getElementById('menu_toggle');
const mobileMenu = document.getElementById('mobile_menu');

// Alternar visibilidad del menú
menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Cerrar el menú al hacer clic en cualquier enlace móvil
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});


// =====================================================
// 3. NAVBAR: EFECTO VIDRIO AL HACER SCROLL
// Añade la clase .scrolled al bajar 50px, que activa
// el fondo semitransparente con blur en el CSS.
// =====================================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});


// =====================================================
// 4. BOTÓN VOLVER ARRIBA
// Se muestra al bajar 400px y desaparece si subes.
// =====================================================
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('show', window.scrollY > 400);
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


// =====================================================
// 5. EFECTO TYPEWRITER
// Escribe y borra automáticamente distintos roles,
// creando la ilusión de que alguien está escribiendo.
// =====================================================
const typewriterEl = document.getElementById('typewriter-text');

// Lista de roles que se mostrarán en bucle
const roles = [
    'Desarrollador Web',
    'Ingeniero Informático',
    'Frontend Developer',
    
];

let roleIndex  = 0;     // Qué rol estamos mostrando ahora
let charIndex  = 0;     // Hasta qué carácter hemos llegado
let isDeleting = false; // Si estamos borrando o escribiendo

function typeWriter() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
        // Modo escritura: añadir un carácter más
        typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentRole.length) {
            // Texto completo: esperar 1.8s y luego empezar a borrar
            setTimeout(() => {
                isDeleting = true;
                typeWriter();
            }, 1800);
            return;
        }
    } else {
        // Modo borrado: quitar un carácter
        typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            // Texto borrado: pasar al siguiente rol
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
    }

    // Velocidad: borrar es más rápido que escribir (más realista)
    const speed = isDeleting ? 55 : 110;
    setTimeout(typeWriter, speed);
}

// Esperar un momento antes de arrancar (da tiempo a que la página cargue)
setTimeout(typeWriter, 900);


// =====================================================
// 6. SISTEMA DE PARTÍCULAS ANIMADAS EN EL HERO
//
// Dibuja puntos (partículas) que se mueven lentamente.
// Conecta con líneas las partículas que están cerca.
// Las partículas se alejan del ratón al acercarse.
// Todo se dibuja en un <canvas> con requestAnimationFrame.
// =====================================================
const canvas = document.getElementById('particles-canvas');
const ctx    = canvas.getContext('2d');

// Configuración del sistema de partículas
const CONFIG = {
    count:           75,   // Número de partículas
    connectionDist: 130,   // Distancia máxima para trazar líneas entre partículas
    mouseRadius:    140,   // Radio de influencia del ratón
};

let particles = [];
let mouse     = { x: null, y: null }; // Posición actual del ratón

// Ajustar el canvas al tamaño real del contenedor
function resizeCanvas() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

resizeCanvas();

// Recalcular tamaño si se cambia el tamaño de la ventana
window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

// Actualizar la posición del ratón en coordenadas del canvas
window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    // Solo guardamos la posición si el hero está visible en pantalla
    if (rect.bottom > 0) {
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    }
});

// Cuando el ratón sale de la ventana, desactivar repulsión
window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Clase que representa una partícula individual
class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x     = Math.random() * canvas.width;      // Posición X inicial aleatoria
        this.y     = Math.random() * canvas.height;     // Posición Y inicial aleatoria
        this.vx    = (Math.random() - 0.5) * 0.55;     // Velocidad horizontal
        this.vy    = (Math.random() - 0.5) * 0.55;     // Velocidad vertical
        this.size  = Math.random() * 2 + 1;             // Radio entre 1 y 3px
        this.alpha = Math.random() * 0.45 + 0.2;        // Opacidad entre 0.2 y 0.65
    }

    update() {
        // Mover la partícula según su velocidad
        this.x += this.vx;
        this.y += this.vy;

        // Rebotar al llegar a los bordes del canvas
        if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;

        // Si el ratón está cerca, empujar la partícula en dirección contraria
        if (mouse.x !== null) {
            const dx   = this.x - mouse.x;
            const dy   = this.y - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < CONFIG.mouseRadius && dist > 0) {
                const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
                this.x += (dx / dist) * force * 2.2;
                this.y += (dy / dist) * force * 2.2;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(129, 140, 248, ${this.alpha})`;
        ctx.fill();
    }
}

// Crear todas las partículas
function initParticles() {
    particles = [];
    for (let i = 0; i < CONFIG.count; i++) {
        particles.push(new Particle());
    }
}

// Trazar líneas entre partículas que están suficientemente cerca
function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx   = particles[i].x - particles[j].x;
            const dy   = particles[i].y - particles[j].y;
            const dist = Math.hypot(dx, dy);

            if (dist < CONFIG.connectionDist) {
                // Opacidad inversamente proporcional a la distancia
                const alpha = (1 - dist / CONFIG.connectionDist) * 0.35;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(79, 70, 229, ${alpha})`;
                ctx.lineWidth   = 0.7;
                ctx.stroke();
            }
        }
    }
}

// Bucle principal: limpiar → mover → dibujar → repetir
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();


// =====================================================
// 7. REVEAL AL HACER SCROLL (ANIMACIONES DE ENTRADA)
//
// Usa IntersectionObserver, que es más eficiente que
// escuchar el evento scroll manualmente.
// Cuando un elemento con clase .reveal entra en
// pantalla, se le añade .revealed para que el CSS
// lo muestre con una transición suave.
// =====================================================
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Dejar de observar tras animar (optimización de memoria)
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 } // Se activa cuando el 12% del elemento es visible
);

// Registrar todos los elementos que deben aparecer al hacer scroll
document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
});


// =====================================================
// 8. ANIMACIÓN DE BARRAS DE HABILIDADES
//
// Las barras de progreso tienen width: 0% en CSS.
// Cuando entran en pantalla, JS lee el atributo
// data-width y actualiza el style para animarlas.
// =====================================================
const skillObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                // Pequeño retraso para que se vea la barra antes de llenarse
                setTimeout(() => {
                    bar.style.width = bar.getAttribute('data-width') + '%';
                }, 250);
                skillObserver.unobserve(bar);
            }
        });
    },
    { threshold: 0.4 }
);

document.querySelectorAll('.progress').forEach(bar => {
    skillObserver.observe(bar);
});


// =====================================================
// 9. FORMULARIO DE CONTACTO CON FORMSPREE
//
// Envía el formulario con fetch (sin recargar la
// página) y muestra feedback al usuario.
// Para activarlo: reemplaza el action del <form>
// con tu endpoint de formspree.io
// =====================================================
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const btnText   = document.getElementById('form-btn-text');
        const statusMsg = document.getElementById('form-status');

        // Mostrar estado de carga
        btnText.textContent  = 'Enviando...';
        submitBtn.disabled   = true;

        try {
            const response = await fetch(contactForm.action, {
                method:  'POST',
                body:    new FormData(contactForm),
                headers: { 'Accept': 'application/json' },
            });

            if (response.ok) {
                // Éxito: limpiar el formulario y mostrar confirmación
                statusMsg.textContent = '¡Mensaje enviado con éxito! Te responderé pronto.';
                statusMsg.className   = 'text-center text-sm text-green-400 mt-2';
                statusMsg.classList.remove('hidden');
                contactForm.reset();
            } else {
                throw new Error('Error del servidor');
            }
        } catch {
            // Error: indicar que escriban directamente al email
            statusMsg.textContent = 'Algo salió mal. Escríbeme a jimmycabalz.a.2011@gmail.com';
            statusMsg.className   = 'text-center text-sm text-red-400 mt-2';
            statusMsg.classList.remove('hidden');
        } finally {
            // Restaurar el botón siempre, aunque haya error
            btnText.textContent = 'Enviar Mensaje';
            submitBtn.disabled  = false;
        }
    });
}
