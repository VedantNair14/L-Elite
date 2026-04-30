// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor Logic
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0 });
    gsap.to(follower, { x: e.clientX - 15, y: e.clientY - 15, duration: 0.3 });
});

// Preloader & Hero Entrance
window.addEventListener('load', () => {
    const tl = gsap.timeline();
    
    tl.to('#loader-progress', { width: '100%', duration: 1.5, ease: 'power2.inOut' })
      .to('#loader-logo', { opacity: 1, y: -10, duration: 0.5 })
      .to('#preloader', { y: '-100%', duration: 1, ease: 'expo.inOut', delay: 0.5 })
      .from('.hero h1 span span', {
          y: '100%',
          duration: 1.5,
          ease: 'expo.out',
          stagger: 0.2
      }, '-=0.5')
      .from('.hero p', {
          opacity: 0,
          y: 20,
          duration: 1
      }, '-=1')
      .from('nav', {
          y: -100,
          opacity: 0,
          duration: 1
      }, '-=1');

    // Trigger Reveal Masks
    document.querySelectorAll('.reveal-mask').forEach(mask => {
        ScrollTrigger.create({
            trigger: mask,
            start: 'top 85%',
            onEnter: () => mask.classList.add('active')
        });
    });

    // Parallax Effect
    document.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        document.querySelectorAll('[data-parallax-speed]').forEach(el => {
            const speed = el.getAttribute('data-parallax-speed');
            const yPos = (scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    });

    // Horizontal Gallery Scroll (Desktop Only)
    const galleryWrapper = document.querySelector('.gallery-wrapper');
    if (galleryWrapper && window.innerWidth > 1024) {
        gsap.to(galleryWrapper, {
            x: () => -(galleryWrapper.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
                trigger: "#gallery",
                start: "top top",
                end: () => `+=${galleryWrapper.scrollWidth}`,
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            }
        });
    } else if (galleryWrapper) {
        // Mobile layout adjustment for horizontal gallery
        document.getElementById('gallery').style.height = 'auto';
        galleryWrapper.style.flexDirection = 'column';
        galleryWrapper.style.width = '100%';
        galleryWrapper.style.padding = '100px 5%';
        document.querySelectorAll('.gallery-card').forEach(card => {
            card.style.width = '100%';
            card.style.height = '300px';
            card.style.marginBottom = '20px';
        });
    }

    // Magnetic Buttons (Desktop Only)
    if (window.innerWidth > 1024) {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(btn, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.3)'
                });
            });
        });
    }
});

// Mobile Nav Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// Close mobile nav on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('main-nav');
    const scrollProgress = document.getElementById('scroll-progress');
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    
    scrollProgress.style.width = scrollPercent + '%';

    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Menu Filtering Logic
function filterMenu(category) {
    const items = document.querySelectorAll('.menu-item');
    const btns = document.querySelectorAll('.tab-btn');

    // Update Buttons
    btns.forEach(btn => {
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Animate and Filter Items
    gsap.to('.menu-item', {
        opacity: 0,
        y: 20,
        duration: 0.3,
        onComplete: () => {
            items.forEach(item => {
                if (item.classList.contains(`category-${category}`)) {
                    item.style.display = 'block';
                    gsap.to(item, { opacity: 1, y: 0, duration: 0.5 });
                } else {
                    item.style.display = 'none';
                }
            });
        }
    });
}

// Initialize Swiper for Testimonials
const swiper = new Swiper('.testimonialSwiper', {
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});

// Reservation Form Handling
const reserveForm = document.getElementById('reserve-form');
if (reserveForm) {
    reserveForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const feedback = document.getElementById('form-feedback');
        const formData = new FormData(reserveForm);

        try {
            const response = await fetch('/reserve', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            if (result.status === 'success') {
                feedback.innerHTML = `<span style="color: var(--accent)">${result.message}</span>`;
                feedback.style.display = 'block';
                reserveForm.reset();
            }
        } catch (error) {
            feedback.innerHTML = `<span style="color: #ff4d4d">Something went wrong. Please try again.</span>`;
            feedback.style.display = 'block';
        }
    });
}

// Smooth Scrolling for Nav Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});
