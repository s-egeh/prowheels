document.addEventListener('DOMContentLoaded', () => {

    /**
     * 1. Theme Management (Dark Mode Toggle)
     * Manages the light/dark theme based on user preference and local storage.
     */
    const initThemeToggle = () => {
        const toggleButton = document.getElementById('dark-mode-toggle');
        if (!toggleButton) return;

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        let currentTheme = localStorage.getItem('prowheels-theme') || (prefersDark ? 'dark' : 'light');

        const applyTheme = (theme) => {
            document.body.classList.toggle('dark-mode', theme === 'dark');
        };

        applyTheme(currentTheme);

        toggleButton.addEventListener('click', () => {
            currentTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
            localStorage.setItem('prowheels-theme', currentTheme);
            applyTheme(currentTheme);
        });
    };

    /**
     * 2. Hero Slideshow (Homepage Only)
     * Controls the fading slideshow in the hero section of the homepage.
     */
    const initHeroSlider = () => {
        const slidesRoot = document.getElementById('slides');
        const dotsRoot = document.getElementById('dots');
        const heroTextEl = document.getElementById('hero-text-placeholder');
        if (!slidesRoot || !dotsRoot || !heroTextEl) return;

        const slidesData = [
            { img: 'daftruck.jpg', text: 'Powerful and reliable DAF Trucks from Europe.' },
            { img: 'masseyferguson.jpg', text: 'High-quality Massey Ferguson Tractors from Japan.' },
            { img: 'trailer.jpg', text: 'Strong and dependable Semi-Trailers for heavy transport.' },
            { img: 'tyres.jpg', text: 'Premium Tyres from top brands for maximum performance.' },
        ];
        
        let currentSlide = 0;
        const slideElements = [], dotElements = [];
        let autoplayInterval = null;

        slidesData.forEach((slideData, i) => {
            const div = document.createElement('div');
            div.className = 'slide';
            div.style.backgroundImage = `url(${slideData.img})`;
            slidesRoot.appendChild(div);
            slideElements.push(div);

            const dot = document.createElement('button');
            dot.className = 'dot';
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.onclick = () => goToSlide(i);
            dotsRoot.appendChild(dot);
            dotElements.push(dot);
        });

        const showSlide = (index) => {
            slideElements.forEach((el, idx) => el.classList.toggle('active', idx === index));
            dotElements.forEach((dot, idx) => dot.classList.toggle('active', idx === index));
            heroTextEl.textContent = slidesData[index].text;
            currentSlide = index;
        };

        const startAutoplay = () => {
            autoplayInterval = setInterval(() => {
                const nextIndex = (currentSlide + 1) % slideElements.length;
                showSlide(nextIndex);
            }, 5000);
        };
        
        const goToSlide = (index) => {
            showSlide(index);
            clearInterval(autoplayInterval);
            startAutoplay();
        };

        showSlide(0);
        startAutoplay();
    };

    /**
     * 3. Client Logo Scroller (Homepage Only)
     * Creates the infinite scrolling banner of client logos.
     */
    const initClientScroller = () => {
        const strip = document.getElementById('clients-strip');
        if (!strip) return;

        const logos = ['gpha.png', 'sapholda.png', 'movis.jpg', 'trustlink.png', 'bajfreight.png', 'tematerminal.png', 'amaristerminal.png', 'medlog.png'];
        const allLogos = [...logos, ...logos]; // Duplicate for seamless loop

        allLogos.forEach(logoSrc => {
            const div = document.createElement('div');
            div.className = 'client-logo';
            const img = document.createElement('img');
            img.src = logoSrc;
            img.alt = logoSrc.split('.')[0];
            img.loading = 'lazy';
            div.appendChild(img);
            strip.appendChild(div);
        });
    };

    /**
     * 4. Sticky Header
     * Adds a class to the header when the user scrolls down.
     */
    const initStickyHeader = () => {
        const header = document.querySelector('header');
        if (!header) return;
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    };

    /**
     * 5. Custom Cursor
     * Creates a custom cursor effect that follows the mouse.
     */
    const initCustomCursor = () => {
        const cursorDot = document.createElement('div');
        cursorDot.className = 'cursor cursor-dot';
        document.body.appendChild(cursorDot);

        const cursorFollower = document.createElement('div');
        cursorFollower.className = 'cursor cursor-follower';
        document.body.appendChild(cursorFollower);

        window.addEventListener('mousemove', e => {
            requestAnimationFrame(() => {
                cursorDot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
                cursorFollower.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            });
        });

        const interactiveElements = document.querySelectorAll('a, button, .card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-grow'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-grow'));
        });
    };

    /**
     * 6. Scroll Effects (Back to Top & Fade-in Animations)
     * Manages the "back to top" button and animates elements as they scroll into view.
     */
    const initScrollEffects = () => {
        // Back to Top Button
        const backToTopButton = document.querySelector('.back-to-top');
        if (backToTopButton) {
            backToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
            window.addEventListener('scroll', () => {
                backToTopButton.classList.toggle('show', window.scrollY > window.innerHeight);
            }, { passive: true });
        }

        // Animate on Scroll
        const animatedElements = document.querySelectorAll(
            '.card, .mv-card, .testimonial-card, .why-choose-grid > div, details, .about-grid > div, .team-section, .advantage-grid > div, .product-intro-grid > div'
        );

        if ('IntersectionObserver' in window && animatedElements.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            animatedElements.forEach(el => {
                el.classList.add('animate-on-scroll');
                observer.observe(el);
            });
        }
    };

    // --- Initialize All Scripts ---
    initThemeToggle();
    initHeroSlider();
    initClientScroller();
    initStickyHeader();
    initCustomCursor();
    initScrollEffects();
});