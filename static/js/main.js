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

// Interactive Cursor Text
document.querySelectorAll('.menu-item, .gallery-card, .btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
        follower.classList.add('hovering');
        if (el.classList.contains('menu-item')) follower.setAttribute('data-text', 'ORDER');
        if (el.classList.contains('gallery-card')) follower.setAttribute('data-text', 'VIEW');
    });
    el.addEventListener('mouseleave', () => {
        follower.classList.remove('hovering');
        follower.setAttribute('data-text', '');
    });
});

// 3D Tilt Effect
function applyTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        scale: 1.05,
        duration: 0.5,
        ease: 'power2.out',
        transformPerspective: 1000
    });
}

function resetTilt(e) {
    gsap.to(e.currentTarget, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out'
    });
}

document.querySelectorAll('.menu-item').forEach(card => {
    card.addEventListener('mousemove', applyTilt);
    card.addEventListener('mouseleave', resetTilt);
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

// --- CART & ORDER SYSTEM ---
let cart = [];

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('active');
}

function addToCart(id, name, price) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    updateCartUI();
    gsap.to('.cart-btn', { scale: 1.2, duration: 0.1, yoyo: true, repeat: 1 });
}

function updateCartUI() {
    const container = document.getElementById('cart-items');
    const count = document.querySelector('.cart-count');
    const totalEl = document.getElementById('cart-total-amount');
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); margin-top: 50px;">Your cart is empty.</p>';
        count.innerText = '0';
        totalEl.innerText = '$0';
        return;
    }

    let total = 0;
    let totalItems = 0;
    container.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        totalItems += item.quantity;
        return `
            <div class="cart-item">
                <div>
                    <h4 style="color: var(--accent)">${item.name}</h4>
                    <small>${item.quantity} x $${item.price}</small>
                </div>
                <button onclick="removeFromCart(${item.id})" style="background:transparent; border:none; color:#ff4d4d; cursor:pointer; font-size: 10px;">REMOVE</button>
            </div>
        `;
    }).join('');
    count.innerText = totalItems;
    totalEl.innerText = `$${total}`;
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function showCheckout() {
    if (cart.length === 0) return alert('Your cart is empty!');
    document.getElementById('checkout-modal').style.display = 'flex';
}

function closeCheckout() {
    document.getElementById('checkout-modal').style.display = 'none';
}

const orderForm = document.getElementById('order-form');
if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(orderForm);
        const data = {
            address: formData.get('address'),
            phone: formData.get('phone'),
            items: cart,
            total: document.getElementById('cart-total-amount').innerText
        };

        try {
            const response = await fetch('/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.status === 'success') {
                alert(result.message + "\nOrder ID: " + result.order_id);
                cart = [];
                updateCartUI();
                closeCheckout();
                toggleCart();
            }
        } catch (error) {
            alert('Error placing order. Please try again.');
        }
    });
}
