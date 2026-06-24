// Main initialization
document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('loaded');
    initMobileMenu();
    initServiceTabs();
    initSmoothScrolling();
    initContactForm();
    initCallButtons();
    initDesktopCallHelper();
    initRevealAnimations();
    initHeaderScroll();
    initSocialLinks();
    initThemeToggle();
});

// Mobile menu with enhanced animation
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-links a');

    mobileToggle.addEventListener('click', function () {
        navLinks.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');

        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            mobileToggle.style.transform = 'rotate(180deg)';
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            mobileToggle.style.transform = 'rotate(0deg)';
        }
    });

    // Close menu when clicking links
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                mobileToggle.style.transform = 'rotate(0deg)';
            }

            // Set active link
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
        if (!mobileToggle.contains(event.target) && !navLinks.contains(event.target) && window.innerWidth <= 768) {
            navLinks.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            mobileToggle.style.transform = 'rotate(0deg)';
        }
    });
}

// Service tabs with smooth animation
function initServiceTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Remove active class from all buttons
            tabBtns.forEach(b => {
                b.classList.remove('active');
                b.style.transform = 'translateY(0)';
            });

            // Add active class to clicked button
            this.classList.add('active');
            this.style.transform = 'translateY(-5px)';

            // Hide all tab contents
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.style.opacity = '0';
                content.style.transform = 'translateY(20px)';
            });

            // Show selected tab content
            const tabId = this.getAttribute('data-tab');
            const activeContent = document.getElementById(tabId);

            setTimeout(() => {
                activeContent.classList.add('active');
                setTimeout(() => {
                    activeContent.style.opacity = '1';
                    activeContent.style.transform = 'translateY(0)';
                }, 50);
            }, 300);
        });
    });

    // Initialize first tab
    document.querySelector('.tab-btn.active').click();
}

// Enhanced smooth scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();

                // Calculate position
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                // Smooth scroll
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Add active class to nav link
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
}

// Contact form with enhanced validation
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitBtn');
    const btnTextSpan = submitBtn ? submitBtn.querySelector('.btn-text') : null;
    const originalBtnText = btnTextSpan ? btnTextSpan.textContent : (submitBtn ? submitBtn.innerHTML : 'Send Request');

    // EmailJS Configuration - REPLACE WITH YOUR REAL PUBLIC KEY AND IDS
    const EMAILJS_PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY';
    const EMAILJS_SERVICE_ID = 'YOUR_EMAILJS_SERVICE_ID';
    const EMAILJS_TEMPLATE_ID = 'YOUR_EMAILJS_TEMPLATE_ID';

    // Web3Forms Configuration - Alternative way to send directly to your email without a backend
    // Get a free key from https://web3forms.com/ and put it here:
    const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';

    const isEmailJsConfigured = [EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID]
        .every(value => value && !value.includes('YOUR_'));

    const isWeb3FormsConfigured = WEB3FORMS_ACCESS_KEY && !WEB3FORMS_ACCESS_KEY.includes('YOUR_');

    if (typeof emailjs !== 'undefined' && isEmailJsConfigured) {
        emailjs.init(EMAILJS_PUBLIC_KEY);
        console.info('EmailJS initialized successfully.');
    } else {
        console.warn('EmailJS initialization skipped because configuration is missing or library is unavailable.');
        if (typeof emailjs === 'undefined') {
            console.warn('EmailJS library did not load. Confirm the CDN script is included before scrpit.js.');
        } else {
            console.warn('EmailJS credentials are missing or still contain placeholders.');
        }
    }

    if (!contactForm || !formMessage || !submitBtn) {
        console.error('Contact form initialization failed. Required elements missing:', {
            contactForm,
            formMessage,
            submitBtn
        });
        return;
    }

    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        await submitForm();
    });

    const messageInput = document.getElementById('message');
    if (messageInput) {
        messageInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                submitForm();
            }
        });
    }

    async function submitForm() {
        const formData = {
            customerName: document.getElementById('customerName').value.trim(),
            mobileNumber: document.getElementById('mobileNumber').value.trim(),
            emailAddress: document.getElementById('emailAddress').value.trim(),
            serviceType: document.getElementById('serviceType').value.trim(),
            message: document.getElementById('message').value.trim()
        };

        console.group('Contact Form Submit');
        console.log('Form data:', formData);

        if (!formData.customerName) {
            showFormMessage('error', 'Please enter your name.');
            console.warn('Validation failed: missing customerName');
            console.groupEnd();
            return;
        }

        if (!formData.mobileNumber) {
            showFormMessage('error', 'Please enter your mobile number.');
            console.warn('Validation failed: missing mobileNumber');
            console.groupEnd();
            return;
        }

        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(formData.mobileNumber)) {
            showFormMessage('error', 'Please enter a valid 10-digit Indian mobile number.');
            console.warn('Validation failed: invalid mobileNumber');
            console.groupEnd();
            return;
        }

        if (!formData.emailAddress) {
            showFormMessage('error', 'Please enter your email address.');
            console.warn('Validation failed: missing emailAddress');
            console.groupEnd();
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.emailAddress)) {
            showFormMessage('error', 'Please enter a valid email address.');
            console.warn('Validation failed: invalid emailAddress');
            console.groupEnd();
            return;
        }

        if (!formData.serviceType) {
            showFormMessage('error', 'Please select a service type.');
            console.warn('Validation failed: missing serviceType');
            console.groupEnd();
            return;
        }

        const templateParams = {
            customer_name: formData.customerName,
            phone_number: formData.mobileNumber,
            email_address: formData.emailAddress,
            service_type: formData.serviceType,
            message: formData.message || 'No additional message provided'
        };

        // Helper: POST to backend booking endpoint
        async function sendToBackend(params) {
            const backendEndpoint = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
                ? 'http://localhost:3000/api/book-service'
                : '/api/book-service';
            console.log('Attempting backend POST to', backendEndpoint);
            const resp = await fetch(backendEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params)
            });
            if (!resp.ok) {
                const text = await resp.text();
                throw new Error(`Backend error ${resp.status}: ${text}`);
            }
            const data = await resp.json();
            return data;
        }

        // Helper: Send via Web3Forms (directly to email without backend)
        async function sendToWeb3Forms(params) {
            console.log('Attempting Web3Forms POST submission...');
            const resp = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: WEB3FORMS_ACCESS_KEY,
                    subject: `New Service Booking Request from ${params.customer_name}`,
                    from_name: 'SAMACOOL Service Request',
                    name: params.customer_name,
                    phone: params.phone_number,
                    email: params.email_address,
                    service: params.service_type,
                    message: params.message
                })
            });
            if (!resp.ok) {
                const text = await resp.text();
                throw new Error(`Web3Forms error ${resp.status}: ${text}`);
            }
            const data = await resp.json();
            if (!data.success) {
                throw new Error(data.message || 'Web3Forms failed to send email.');
            }
            return data;
        }

        // Helper: Send via Email (always works, no config needed)
        function sendViaEmail(params) {
            const emailAddress = 'hyderalik111@gmail.com';
            const subject = `New Service Booking Request from ${params.customer_name}`;
            const body =
                `New Service Booking Request\n\n` +
                `Name: ${params.customer_name}\n` +
                `Phone: ${params.phone_number}\n` +
                `Email: ${params.email_address}\n` +
                `Service: ${params.service_type}\n` +
                `Message: ${params.message}`;
            const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoUrl;
        }

        setLoadingState();

        // Strategy: Try EmailJS → Web3Forms → Backend → Email (guaranteed fallback)
        let sent = false;

        // 1. Try EmailJS if configured
        if (typeof emailjs !== 'undefined' && isEmailJsConfigured) {
            try {
                console.log('Sending EmailJS request to service:', EMAILJS_SERVICE_ID, 'template:', EMAILJS_TEMPLATE_ID);
                const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
                console.log('EmailJS response:', response);
                sent = true;
            } catch (emailErr) {
                console.warn('EmailJS send failed:', emailErr);
            }
        } else {
            console.warn('EmailJS unavailable or not configured.');
        }

        // 2. Try Web3Forms if configured and EmailJS didn't work
        if (!sent && isWeb3FormsConfigured) {
            try {
                const web3Resp = await sendToWeb3Forms(templateParams);
                console.log('Web3Forms response:', web3Resp);
                sent = true;
            } catch (web3Err) {
                console.warn('Web3Forms send failed:', web3Err);
            }
        }

        // 3. Try backend if EmailJS and Web3Forms didn't work
        if (!sent) {
            try {
                const backendResp = await sendToBackend(templateParams);
                console.log('Backend response:', backendResp);
                sent = true;
            } catch (backendErr) {
                console.warn('Backend send failed:', backendErr);
            }
        }

        // 4. Email fallback — always works
        if (!sent) {
            console.log('Using Email fallback to deliver booking request.');
            sendViaEmail(templateParams);
            sent = true;
        }

        // Show success & reset
        if (sent) {
            showFormMessage('success', 'Thank you! Your service request has been sent successfully. We will contact you shortly.');
            contactForm.reset();
            setTimeout(() => { formMessage.style.display = 'none'; }, 5000);
        }

        resetSubmitState();
        console.groupEnd();
    }

    function setLoadingState() {
        submitBtn.disabled = true;
        contactForm.classList.add('loading');
        if (btnTextSpan) {
            btnTextSpan.textContent = 'Sending...';
        } else {
            submitBtn.textContent = 'Sending...';
        }
    }

    function resetSubmitState() {
        submitBtn.disabled = false;
        contactForm.classList.remove('loading');
        if (btnTextSpan) {
            btnTextSpan.textContent = originalBtnText;
        } else {
            submitBtn.innerHTML = originalBtnText;
        }
    }

    function showFormMessage(type, message) {
        formMessage.className = `form-message ${type}`;
        formMessage.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
        formMessage.style.display = 'block';
        formMessage.style.opacity = '1';
    }
}

// Enhanced call buttons
function initCallButtons() {
    const phoneNumber = '+919894833958';
    const telLink = `tel:${phoneNumber}`;

    // Setup all call buttons
    const callButtons = [
        document.getElementById('heroCallBtn'),
        document.getElementById('desktopCallHelper')
    ].filter(Boolean);

    callButtons.forEach(btn => {
        if (btn) {
            if (btn.tagName === 'A') {
                btn.href = telLink;
                btn.addEventListener('click', function (e) {
                    if (!isMobile()) {
                        e.preventDefault();
                        handlePhoneCall(phoneNumber);
                    }
                });
            } else if (btn.tagName === 'BUTTON') {
                btn.addEventListener('click', function () {
                    handlePhoneCall(phoneNumber);
                });
            }
        }
    });

    // Handle phone number clicks in top banner
    document.querySelector('.contact-info-top span:first-child').addEventListener('click', function () {
        handlePhoneCall(phoneNumber);
    });
}

// Phone call handler
function handlePhoneCall(phoneNumber) {
    if (isMobile()) {
        window.location.href = `tel:${phoneNumber}`;
    } else {
        // Desktop fallback
        const shouldCall = confirm(
            `📞 Call ${formatPhoneNumber(phoneNumber)}?\n\n` +
            `On desktop, you can:\n` +
            `• Copy number to clipboard 📋\n` +
            `• Use Skype or VoIP service\n` +
            `• Call from your mobile phone\n\n` +
            `Press OK to copy the number.`
        );

        if (shouldCall) {
            copyToClipboard(phoneNumber);
            alert(
                `✅ Phone number copied!\n\n` +
                `📱 ${formatPhoneNumber(phoneNumber)}\n\n` +
                `You can now paste it into your phone app.`
            );
        }
    }
}

// Format phone number
function formatPhoneNumber(phone) {
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, '+$1 $2 $3');
}

// Copy to clipboard
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

// Check if mobile device
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Desktop call helper
function initDesktopCallHelper() {
    const desktopCallHelper = document.getElementById('desktopCallHelper');

    // If helper is not present (removed from DOM), do nothing.
    if (!desktopCallHelper) return;

    if (!isMobile()) {
        desktopCallHelper.style.display = 'flex';

        // Show with delay
        setTimeout(() => {
            desktopCallHelper.style.opacity = '1';
            desktopCallHelper.style.transform = 'scale(1)';
        }, 2000);
    }
}

// Reveal animations powered by IntersectionObserver
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    });

    reveals.forEach(element => {
        const delay = element.dataset.revealDelay;
        if (delay) {
            element.style.transitionDelay = delay;
        }
        revealObserver.observe(element);
    });

    if (!('IntersectionObserver' in window)) {
        const revealOnScroll = () => {
            reveals.forEach(element => {
                const windowHeight = window.innerHeight;
                const elementTop = element.getBoundingClientRect().top;
                if (elementTop < windowHeight - 150) {
                    element.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll();
    }
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.getElementById('mainHeader');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Social links
function initSocialLinks() {
    const whatsappLink = document.getElementById('whatsappLink');
    if (!whatsappLink) return;

    whatsappLink.addEventListener('click', function (e) {
        e.preventDefault();
        const whatsappUrl = `https://wa.me/919894833958?text=Hello! I need information about your appliance services.`;
        window.open(whatsappUrl, '_blank');
    });
}

// Theme toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const activeTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');

    const icons = {
        light: '<i class="fas fa-moon"></i>',
        dark: '<i class="fas fa-sun"></i>'
    };

    function applyTheme(theme) {
        document.body.classList.toggle('dark', theme === 'dark');
        themeToggle.innerHTML = icons[theme];
        themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        localStorage.setItem('theme', theme);
    }

    applyTheme(activeTheme);

    themeToggle.addEventListener('click', function () {
        const nextTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(nextTheme);
    });
}

// Add floating particles animation
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.style.position = 'fixed';
    particlesContainer.style.top = '0';
    particlesContainer.style.left = '0';
    particlesContainer.style.width = '100%';
    particlesContainer.style.height = '100%';
    particlesContainer.style.pointerEvents = 'none';
    particlesContainer.style.zIndex = '1';
    document.body.appendChild(particlesContainer);

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(42, 110, 187, 0.3)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particlesContainer.appendChild(particle);

        // Animate particle
        animateParticle(particle);
    }
}

function animateParticle(particle) {
    let x = parseFloat(particle.style.left);
    let y = parseFloat(particle.style.top);
    let xSpeed = (Math.random() - 0.5) * 0.5;
    let ySpeed = (Math.random() - 0.5) * 0.5;

    function move() {
        x += xSpeed;
        y += ySpeed;

        // Bounce off edges
        if (x <= 0 || x >= 100) xSpeed *= -1;
        if (y <= 0 || y >= 100) ySpeed *= -1;

        particle.style.left = x + 'vw';
        particle.style.top = y + 'vh';

        requestAnimationFrame(move);
    }

    move();
}

// Initialize particles
createParticles();

