document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('.header-container');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
    }

    // Actualización de link activo en el nav
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section');
    window.addEventListener('scroll', () => {
        let current = 'inicio';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - header.offsetHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    AOS.init({
        duration: 800, // Duración de la animación en milisegundos
        once: true,    // La animación solo ocurre una vez
        offset: 50,    // La animación se activa 50px antes de que el elemento sea visible
    });
});