/**
 * ProWheels Website Main Script - V2
 * ------------------------------------
 * This script adds advanced interactivity for a modern user experience.
 *
 * Features:
 * 1. Hero Slideshow: Manages the main banner rotation.
 * 2. Sticky Header: Shrinks header on scroll.
 * 3. Custom Cursor: Adds a premium follower cursor.
 * 4. Scroll Effects: Manages back-to-top button and on-scroll animations.
 * 5. Theme Management: Handles dark/light mode.
 * 6. Event Initializers: Runs all site scripts.
 */

document.addEventListener('DOMContentLoaded', () => {

    /**
     * 1. Hero Slideshow
     * Re-implements and controls the automatic hero banner slideshow.
     */
    const initHeroSlider = () => {
        const slidesData = [
            { img: 'daftruck.jpg', text: 'Powerful and reliable DAF Trucks from Europe — built for performance and endurance.' },
            { img: 'massyferguson.jpg', text: 'High-quality Massey Ferguson Tractors from Japan, built for efficiency and durability.' },
            { img: 'semitrailers.jpg', text: 'Strong and dependable Semi-Trailers designed for long-distance heavy transport.' },
            { img: 'tyres.jpg', text: 'Premium Tyres from top brands for maximum traction and performance.' },
        ];

        const slidesRoot = document.getElementById('slides');
        const dotsRoot = document.getElementById('dots');
        const heroTextEl = document.getElementById('hero-text-placeholder');
        
        if (!slidesRoot || !dotsRoot || !heroTextEl) return;

        let currentSlide = 0;
        let slideElements = [];
        let dotElements = [];
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

        const goToSlide = (index) => {
            showSlide(index);
            clearInterval(autoplayInterval);
            startAutoplay();
        };

        const startAutoplay = () => {
            autoplayInterval = setInterval(() => {
                const nextIndex = (currentSlide + 1) % slideElements.length;
                showSlide(nextIndex);
            }, 5000);
        };
        
        showSlide(0);
        startAutoplay();
    };


    /**
     * 2. Sticky Header
     * Adds a 'scrolled' class to the header when the user scrolls down.
     */
    const initStickyHeader = () => {
        const header = document.querySelector('header');
        if (!header) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    };


    /**
     * 3. Custom Cursor
     * Creates a two-part cursor that follows the mouse and reacts to hovers.
     */
    const initCustomCursor = () => {
        const cursorDot = document.createElement('div');
        cursorDot.className = 'cursor cursor-dot';
        document.body.appendChild(cursorDot);

        const cursorFollower = document.createElement('div');
        cursorFollower.className = 'cursor cursor-follower';
        document.body.appendChild(cursorFollower);

        window.addEventListener('mousemove', e => {
            // Use requestAnimationFrame for performance
            requestAnimationFrame(() => {
                cursorDot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
                cursorFollower.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            });
        });

        const interactiveElements = document.querySelectorAll('a, button, .card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorDot.parentElement.classList.add('cursor-grow'));
            el.addEventListener('mouseleave', () => cursorDot.parentElement.classList.remove('cursor-grow'));
        });
    };


    /**
     * 4. Scroll Effects
     * Manages on-scroll animations and the back-to-top button.
     */
    const initScrollEffects = () => {
        const animatedElements = document.querySelectorAll('.card, .mv-card, .testimonial-card, .why-choose-grid > div');
        const backToTopButton = document.createElement('button');
        backToTopButton.className = 'back-to-top';
        backToTopButton.innerHTML = `&#8593;`; // Up arrow
        backToTopButton.setAttribute('aria-label', 'Go to top of page');
        document.body.appendChild(backToTopButton);
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Intersection Observer for fade-in animations
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            animatedElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                observer.observe(el);
            });
        }
        
        // Scroll listener for the back-to-top button
        window.addEventListener('scroll', () => {
             if (window.scrollY > window.innerHeight) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        }, { passive: true });
    };


    /**
     * 5. Theme Management (Dark/Light Mode)
     * Persists the user's theme choice via localStorage.
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
     * 6. Event Initializers
     * Runs all necessary functions to activate the site's interactivity.
     */
    initHeroSlider();
    initStickyHeader();
    initCustomCursor();
    initScrollEffects();
    initThemeToggle();
});