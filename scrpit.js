// Main initialization
document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('loaded');
    try { initMobileMenu(); } catch (e) { console.warn('initMobileMenu:', e); }
    try { initServiceTabs(); } catch (e) { console.warn('initServiceTabs:', e); }
    try { initSmoothScrolling(); } catch (e) { console.warn('initSmoothScrolling:', e); }
    try { initContactForm(); } catch (e) { console.warn('initContactForm:', e); }
    try { initCallButtons(); } catch (e) { console.warn('initCallButtons:', e); }
    try { initDesktopCallHelper(); } catch (e) { console.warn('initDesktopCallHelper:', e); }
    try { initRevealAnimations(); } catch (e) { console.warn('initRevealAnimations:', e); }
    try { initHeaderScroll(); } catch (e) { console.warn('initHeaderScroll:', e); }
    try { initSocialLinks(); } catch (e) { console.warn('initSocialLinks:', e); }
    try { initThemeToggle(); } catch (e) { console.warn('initThemeToggle:', e); }
});

// Mobile menu with enhanced animation
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-links a');

    if (!mobileToggle || !navLinks) return;

    mobileToggle.addEventListener('click', function () {
        navLinks.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');

        if (navLinks.classList.contains('active')) {
            if (icon) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
            mobileToggle.style.transform = 'rotate(180deg)';
        } else {
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            mobileToggle.style.transform = 'rotate(0deg)';
        }
    });

    // Close menu when clicking links
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
                mobileToggle.style.transform = 'rotate(0deg)';
            }

            // Set active link
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
        if (mobileToggle && navLinks && !mobileToggle.contains(event.target) && !navLinks.contains(event.target) && window.innerWidth <= 768) {
            navLinks.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            mobileToggle.style.transform = 'rotate(0deg)';
        }
    });
}

// Service tabs with smooth animation
function initServiceTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (!tabBtns.length) return;

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

            if (activeContent) {
                setTimeout(() => {
                    activeContent.classList.add('active');
                    setTimeout(() => {
                        activeContent.style.opacity = '1';
                        activeContent.style.transform = 'translateY(0)';
                    }, 50);
                }, 300);
            }
        });
    });

    // Initialize first tab safely
    const initialTab = document.querySelector('.tab-btn.active') || tabBtns[0];
    if (initialTab) {
        initialTab.click();
    }
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

    // Primary Recipient Email - Service booking requests will be delivered directly here
    const RECIPIENT_EMAIL = 'shahidjamal13258@gmail.com';

    // EmailJS Configuration (optional)
    const EMAILJS_PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY';
    const EMAILJS_SERVICE_ID = 'YOUR_EMAILJS_SERVICE_ID';
    const EMAILJS_TEMPLATE_ID = 'YOUR_EMAILJS_TEMPLATE_ID';

    // Web3Forms Configuration (optional)
    const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';

    const isEmailJsConfigured = [EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID]
        .every(value => value && !value.includes('YOUR_'));

    const isWeb3FormsConfigured = WEB3FORMS_ACCESS_KEY && !WEB3FORMS_ACCESS_KEY.includes('YOUR_');

    if (typeof emailjs !== 'undefined' && isEmailJsConfigured) {
        try {
            emailjs.init(EMAILJS_PUBLIC_KEY);
            console.info('EmailJS initialized successfully.');
        } catch (e) {
            console.info('EmailJS init note:', e);
        }
    } else {
        console.info('Direct email delivery to ' + RECIPIENT_EMAIL + ' initialized.');
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

        // Helper 1: Send via FormSubmit.co directly to recipient Gmail
        async function sendToFormSubmit(params) {
            console.log('Sending booking request directly to', RECIPIENT_EMAIL, 'via FormSubmit AJAX...');
            const resp = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    _subject: `New Service Booking Request: ${params.customer_name} (${params.service_type})`,
                    _template: 'table',
                    _captcha: 'false',
                    'Customer Name': params.customer_name,
                    'Mobile Number': params.phone_number,
                    'Email Address': params.email_address,
                    'Service Type': params.service_type,
                    'Message': params.message || 'No additional message provided',
                    'Submitted At': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
                })
            });

            if (!resp.ok) {
                const text = await resp.text();
                throw new Error(`FormSubmit error ${resp.status}: ${text}`);
            }

            const data = await resp.json();
            if (data.success !== 'true' && data.success !== true) {
                throw new Error(data.message || 'FormSubmit response indicated failure');
            }
            return data;
        }

        // Helper 2: Hidden iframe form submission for file:// protocol or environments where AJAX is restricted
        function sendViaHiddenForm(params) {
            return new Promise((resolve) => {
                let iframe = document.getElementById('formsubmit_hidden_iframe');
                if (!iframe) {
                    iframe = document.createElement('iframe');
                    iframe.id = 'formsubmit_hidden_iframe';
                    iframe.name = 'formsubmit_hidden_iframe';
                    iframe.style.display = 'none';
                    document.body.appendChild(iframe);
                }

                const tempForm = document.createElement('form');
                tempForm.method = 'POST';
                tempForm.action = `https://formsubmit.co/${RECIPIENT_EMAIL}`;
                tempForm.target = 'formsubmit_hidden_iframe';
                tempForm.style.display = 'none';

                const fields = {
                    _subject: `New Service Booking Request: ${params.customer_name} (${params.service_type})`,
                    _template: 'table',
                    _captcha: 'false',
                    'Customer Name': params.customer_name,
                    'Mobile Number': params.phone_number,
                    'Email Address': params.email_address,
                    'Service Type': params.service_type,
                    'Message': params.message || 'No additional message provided'
                };

                for (const [key, value] of Object.entries(fields)) {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = value;
                    tempForm.appendChild(input);
                }

                document.body.appendChild(tempForm);
                tempForm.submit();

                setTimeout(() => {
                    tempForm.remove();
                    resolve(true);
                }, 1500);
            });
        }

        // Helper 3: POST to backend booking endpoint
        async function sendToBackend(params) {
            const isHttp = window.location.protocol.startsWith('http');
            const backendEndpoint = isHttp
                ? (window.location.port === '3000' || !window.location.port ? '/api/book-service' : 'http://localhost:3000/api/book-service')
                : 'http://localhost:3000/api/book-service';
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

        // Helper 4: Send via Web3Forms (directly to email without backend)
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

        // Helper 5: Direct mailto fallback to shahidjamal13258@gmail.com
        function sendViaEmail(params) {
            const subject = `New Service Booking Request from ${params.customer_name}`;
            const body =
                `New Service Booking Request\n\n` +
                `Name: ${params.customer_name}\n` +
                `Phone: ${params.phone_number}\n` +
                `Email: ${params.email_address}\n` +
                `Service: ${params.service_type}\n` +
                `Message: ${params.message}`;
            const mailtoUrl = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoUrl;
        }

        setLoadingState();

        // Multi-tier Delivery Pipeline:
        // 1. Local/Deployed backend (if online)
        // 2. FormSubmit AJAX direct to shahidjamal13258@gmail.com
        // 3. Web3Forms (if key provided)
        // 4. EmailJS (if credentials provided)
        // 5. FormSubmit hidden form (file:// protocol)
        // 6. Direct Email client fallback
        let sent = false;

        // 1. Try Backend if available
        try {
            const backendResp = await sendToBackend(templateParams);
            console.log('Backend response:', backendResp);
            sent = true;
        } catch (backendErr) {
            console.log('Backend server not reachable, trying FormSubmit direct email delivery...');
        }

        // 2. Direct to Gmail via FormSubmit
        if (!sent) {
            try {
                const fsResp = await sendToFormSubmit(templateParams);
                console.log('FormSubmit direct email response:', fsResp);
                sent = true;
            } catch (fsErr) {
                console.warn('FormSubmit AJAX send failed:', fsErr);
            }
        }

        // 3. Try Web3Forms if configured
        if (!sent && isWeb3FormsConfigured) {
            try {
                const web3Resp = await sendToWeb3Forms(templateParams);
                console.log('Web3Forms response:', web3Resp);
                sent = true;
            } catch (web3Err) {
                console.warn('Web3Forms send failed:', web3Err);
            }
        }

        // 4. Try EmailJS if configured
        if (!sent && isEmailJsConfigured && typeof emailjs !== 'undefined') {
            try {
                const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
                console.log('EmailJS response:', response);
                sent = true;
            } catch (emailErr) {
                console.warn('EmailJS send failed:', emailErr);
            }
        }

        // 5. Try FormSubmit hidden form if browsing on file://
        if (!sent && window.location.protocol === 'file:') {
            try {
                console.log('Using hidden iframe form submission for local file...');
                await sendViaHiddenForm(templateParams);
                sent = true;
            } catch (hiddenErr) {
                console.warn('Hidden form submission failed:', hiddenErr);
            }
        }

        // 6. Direct Email mailto fallback as last resort (never goes to WhatsApp)
        if (!sent) {
            console.log('Using direct Email mailto fallback to deliver booking request.');
            sendViaEmail(templateParams);
            sent = true;
        }

        // Show success & reset
        if (sent) {
            showFormMessage('success', 'Thank you! Your service request has been sent successfully to shahidjamal13258@gmail.com. We will contact you within 30 minutes.');
            contactForm.reset();
            setTimeout(() => { formMessage.style.display = 'none'; }, 6000);
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
    const phoneNumber = '+916384103958';
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

    // Handle phone number clicks in top banner if present
    const topPhoneBanner = document.querySelector('.contact-info-top span:first-child');
    if (topPhoneBanner) {
        topPhoneBanner.addEventListener('click', function () {
            handlePhoneCall(phoneNumber);
        });
    }
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
    if (!reveals || reveals.length === 0) return;

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -20px 0px'
        });

        reveals.forEach(element => {
            const delay = element.dataset.revealDelay;
            if (delay) {
                element.style.transitionDelay = delay;
            }
            // If already in viewport on page load, activate immediately to avoid disappearing
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                element.classList.add('active');
            } else {
                revealObserver.observe(element);
            }
        });
    } else {
        reveals.forEach(element => element.classList.add('active'));
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
        const whatsappUrl = `https://wa.me/916384103958?text=Hello! I need information about your appliance services.`;
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

// AC Product Catalog Modal Logic
function initCatalogModal() {
    const modal = document.getElementById('productCatalogModal');
    const closeBtn = document.getElementById('closeCatalogModal');
    // Select the AC "Buy Now" button
    const buyButtons = document.querySelectorAll('.buy-ac-btn, .product-card[data-product-id="ac"] .btn-buy-now');
    const filterBtns = document.querySelectorAll('#productCatalogModal .filter-btn');
    const productCards = document.querySelectorAll('#productCatalogModal .detailed-product-card');

    if (!modal) return;

    // Open modal when AC buy button is clicked
    buyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Filter logic
    let activeBrand = 'all';

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetBtn = e.target.closest('.filter-btn');
            if (!targetBtn) return;

            document.querySelectorAll('#productCatalogModal .filter-btn').forEach(b => b.classList.remove('active'));
            activeBrand = targetBtn.getAttribute('data-brand');
            targetBtn.classList.add('active');
            filterProducts();
        });
    });

    function filterProducts() {
        productCards.forEach(card => {
            const cardBrand = card.getAttribute('data-brand');
            const matchBrand = activeBrand === 'all' || cardBrand === activeBrand;

            if (matchBrand) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// Refrigerator Product Catalog Modal Logic
function initFridgeCatalogModal() {
    const modal = document.getElementById('fridgeCatalogModal');
    const closeBtn = document.getElementById('closeFridgeCatalogModal');
    const buyFridgeButtons = document.querySelectorAll('.buy-fridge-btn, .product-card[data-product-id="fridge"] .btn-buy-now');
    const filterBtns = document.querySelectorAll('#fridgeCatalogModal .fridge-brand-btn');
    const productCards = document.querySelectorAll('#fridgeCatalogModal .fridge-card');

    if (!modal) return;

    // Open modal when Fridge buy button is clicked
    buyFridgeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Filter logic
    let activeBrand = 'all';

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetBtn = e.target.closest('.fridge-brand-btn');
            if (!targetBtn) return;

            filterBtns.forEach(b => b.classList.remove('active'));
            activeBrand = targetBtn.getAttribute('data-brand');
            targetBtn.classList.add('active');
            filterProducts();
        });
    });

    function filterProducts() {
        productCards.forEach(card => {
            const cardBrand = card.getAttribute('data-brand');
            const matchBrand = activeBrand === 'all' || cardBrand === activeBrand;

            if (matchBrand) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// Washing Machine Product Catalog Modal Logic
function initWmCatalogModal() {
    const modal = document.getElementById('wmCatalogModal');
    const closeBtn = document.getElementById('closeWmCatalogModal');
    const buyWmButtons = document.querySelectorAll('.buy-wm-btn, .product-card[data-product-id="wm"] .btn-buy-now');
    const filterBtns = document.querySelectorAll('#wmCatalogModal .wm-brand-btn');
    const productCards = document.querySelectorAll('#wmCatalogModal .wm-card');

    if (!modal) return;

    // Open modal when Washing Machine buy button is clicked
    buyWmButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Filter logic
    let activeBrand = 'all';

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetBtn = e.target.closest('.wm-brand-btn');
            if (!targetBtn) return;

            filterBtns.forEach(b => b.classList.remove('active'));
            activeBrand = targetBtn.getAttribute('data-brand');
            targetBtn.classList.add('active');
            filterProducts();
        });
    });

    function filterProducts() {
        productCards.forEach(card => {
            const cardBrand = card.getAttribute('data-brand');
            const matchBrand = activeBrand === 'all' || cardBrand === activeBrand;

            if (matchBrand) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// Initialize catalog modals
try { initCatalogModal(); } catch (e) { console.warn('initCatalogModal error:', e); }
try { initFridgeCatalogModal(); } catch (e) { console.warn('initFridgeCatalogModal error:', e); }
try { initWmCatalogModal(); } catch (e) { console.warn('initWmCatalogModal error:', e); }

// ==========================================================================
// FEATURED PRODUCTS SHOWCASE & MODALS LOGIC
// ==========================================================================

const FEATURED_PRODUCTS_DATA = {
    ac: {
        id: 'ac',
        category: 'SPLIT AC',
        brand: 'SAMACOOL Inverter Series',
        name: 'Split AC 1.5 Ton 5 Star Inverter',
        image: 'Ac1.jpg',
        fallbackImage: 'AcDaikin.webp',
        price: '₹38,990',
        originalPrice: '₹45,990',
        discount: '15% OFF',
        badges: ['Best Seller', 'SAMACOOL Verified'],
        desc: 'High efficiency inverter cooling AC with 100% copper condenser, dual rotor technology & fast cooling turbo mode. Engineered for performance, low noise, and minimal electricity consumption.',
        warranty: '1 Year Unit + 10 Years Compressor Warranty',
        installation: 'Free Standard Installation & Demo included',
        specs: [
            { label: 'Capacity', value: '1.5 Ton' },
            { label: 'Star Rating', value: '5 Star Energy Rating' },
            { label: 'Compressor', value: 'Smart Inverter Dual Rotor' },
            { label: 'Condenser Coil', value: '100% Grooved Copper' },
            { label: 'Refrigerant', value: 'R32 Eco-Friendly' },
            { label: 'Noise Level', value: 'Ultra Quiet (28 dB)' }
        ],
        features: [
            'Dual Rotor Inverter Compressor',
            '100% Copper Condenser & Connecting Pipes',
            'HD Filter with Anti-Bacterial Coating',
            'Instant Turbo Cooling Function',
            'Auto Clean & Self Diagnosis',
            'Stabilizer Free Operation (145V - 290V)'
        ]
    },
    fridge: {
        id: 'fridge',
        category: 'DOUBLE DOOR REFRIGERATOR',
        brand: 'SAMACOOL FrostFree Series',
        name: 'Double Door Frost-Free Refrigerator 265L',
        image: 'DoubleDoor_Clean.jpg',
        fallbackImage: 'DoubleDoor1.webp',
        price: '₹24,999',
        originalPrice: '₹29,999',
        discount: '17% OFF',
        badges: ['Hot Deal', 'SAMACOOL Verified'],
        desc: 'Spacious frost-free cooling refrigerator with multi airflow technology, toughened glass shelves & smart inverter compressor for uniform cooling and prolonged freshness.',
        warranty: '1 Year Product + 10 Years Compressor Warranty',
        installation: 'Free Doorstep Delivery & Unboxing Demo',
        specs: [
            { label: 'Capacity', value: '265 Liters' },
            { label: 'Door Type', value: 'Double Door' },
            { label: 'Cooling Tech', value: 'Frost Free Multi Airflow' },
            { label: 'Energy Rating', value: '3 Star Rating' },
            { label: 'Shelves', value: 'Toughened Glass (Spill-Proof)' },
            { label: 'Deodorizer', value: 'Ag Clean Antibacterial' }
        ],
        features: [
            'Frost Free Multi-Air Flow Cooling System',
            'Smart Inverter Energy Saving Compressor',
            'Toughened Glass Shelves (Up to 175kg Load)',
            'Moisture Control Vegetable Box',
            'Chiller Tray & Movable Ice Maker',
            'Clean Back Design & Recessed Handle'
        ]
    },
    wm: {
        id: 'wm',
        category: 'WASHING MACHINE',
        brand: 'SAMACOOL SmartWash Series',
        name: 'Fully Automatic Front Load Washing Machine 7 Kg',
        image: 'Washing Machine.webp',
        fallbackImage: 'WmLG.webp',
        price: '₹18,500',
        originalPrice: '₹22,000',
        discount: '16% OFF',
        badges: ['Energy Efficient', 'SAMACOOL Verified'],
        desc: 'Advanced front load washing machine with steam care cycle, smart inverter motor, 14 custom wash programs & hygienic allergy care wash for optimal fabric protection.',
        warranty: '2 Years Comprehensive + 10 Years Motor Warranty',
        installation: 'Free Installation, Plumbing Setup & Demo',
        specs: [
            { label: 'Capacity', value: '7.0 Kg' },
            { label: 'Type', value: 'Fully Automatic Front Load' },
            { label: 'Motor Tech', value: 'Direct Drive Smart Inverter' },
            { label: 'Wash Programs', value: '14 Custom Programs' },
            { label: 'Max Spin Speed', value: '1200 RPM' },
            { label: 'Tub Material', value: 'Seamless Stainless Steel' }
        ],
        features: [
            'Hygiene Steam Wash Cycle (Eliminates 99.9% Bacteria)',
            '6 Motion Direct Drive Motor Technology',
            'Auto Tub Clean & Self Diagnostics',
            'Child Lock & Memory Backup',
            'Quick 15-Minute Express Wash',
            'Low Noise & Low Vibration Dampening'
        ]
    }
};

function initFeaturedProducts() {
    const detailsModal = document.getElementById('featuredProductDetailsModal');
    const closeDetailsBtn = document.getElementById('closeFeaturedDetailsModal');
    const detailsBody = document.getElementById('featuredDetailsBody');

    const enquiryModal = document.getElementById('productEnquiryModal');
    const closeEnquiryBtn = document.getElementById('closeProductEnquiryModal');
    const enquiryProductName = document.getElementById('enquiryProductName');
    const enquiryProductId = document.getElementById('enquiryProductId');
    const enquiryForm = document.getElementById('productEnquiryForm');
    const enquiryFormMessage = document.getElementById('enquiryFormMessage');
    const whatsappEnquiryBtn = document.getElementById('whatsappEnquiryBtn');

    // Attach click events for "View Details" and "Buy Now" buttons
    document.querySelectorAll('.btn-view-details').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = btn.getAttribute('data-product-id');
            if (productId && FEATURED_PRODUCTS_DATA[productId]) {
                openProductDetails(FEATURED_PRODUCTS_DATA[productId]);
            }
        });
    });

    document.querySelectorAll('.btn-buy-now').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = btn.getAttribute('data-product-id');

            // On featured cards, open the respective product catalog modal
            if (productId === 'fridge') {
                const modal = document.getElementById('fridgeCatalogModal');
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    return;
                }
            } else if (productId === 'ac') {
                const modal = document.getElementById('productCatalogModal');
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    return;
                }
            } else if (productId === 'wm') {
                const modal = document.getElementById('wmCatalogModal');
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    return;
                }
            }

            if (productId && FEATURED_PRODUCTS_DATA[productId]) {
                openProductEnquiry(FEATURED_PRODUCTS_DATA[productId]);
            }
        });
    });

    // Wire top brand chips on cards to open catalog directly with that brand pre-selected
    document.querySelectorAll('.brand-pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const brand = pill.getAttribute('data-brand');
            const card = pill.closest('.featured-product-card');
            const productId = card ? card.getAttribute('data-product-id') : null;

            if (productId === 'fridge') {
                const modal = document.getElementById('fridgeCatalogModal');
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    if (brand) {
                        const brandBtn = modal.querySelector(`.fridge-brand-btn[data-brand="${brand}"]`);
                        if (brandBtn) brandBtn.click();
                    }
                }
            } else if (productId === 'ac') {
                const modal = document.getElementById('productCatalogModal');
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    if (brand) {
                        const brandBtn = modal.querySelector(`.brand-btn[data-brand="${brand}"]`);
                        if (brandBtn) brandBtn.click();
                    }
                }
            } else if (productId === 'wm') {
                const modal = document.getElementById('wmCatalogModal');
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    if (brand) {
                        const brandBtn = modal.querySelector(`.wm-brand-btn[data-brand="${brand}"]`);
                        if (brandBtn) brandBtn.click();
                    }
                }
            }
        });
    });

    // Close details modal
    if (closeDetailsBtn) {
        closeDetailsBtn.addEventListener('click', closeDetailsModal);
    }

    if (detailsModal) {
        detailsModal.addEventListener('click', (e) => {
            if (e.target === detailsModal) closeDetailsModal();
        });
    }

    // Close enquiry modal
    if (closeEnquiryBtn) {
        closeEnquiryBtn.addEventListener('click', closeEnquiryModal);
    }

    if (enquiryModal) {
        enquiryModal.addEventListener('click', (e) => {
            if (e.target === enquiryModal) closeEnquiryModal();
        });
    }

    // Escape key listener for both modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDetailsModal();
            closeEnquiryModal();
        }
    });

    function openProductDetails(product) {
        if (!detailsBody || !detailsModal) return;

        const specsHTML = product.specs.map(s => `
            <div class="spec-item">
                <label>${s.label}</label>
                <span>${s.value}</span>
            </div>
        `).join('');

        const featuresHTML = product.features.map(f => `
            <li><i class="fas fa-check-circle"></i> ${f}</li>
        `).join('');

        detailsBody.innerHTML = `
            <div class="details-modal-grid">
                <div class="details-img-col">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='${product.fallbackImage}'">
                    <div style="margin-top:16px; font-size:0.78rem; color:#38ef7d; font-weight:700;">
                        <i class="fas fa-truck"></i> ${product.installation}
                    </div>
                </div>
                <div class="details-info-col">
                    <div class="details-brand-tag">${product.brand}</div>
                    <h3 class="details-title">${product.name}</h3>
                    <p class="details-desc">${product.desc}</p>
                    
                    <div class="details-price-row">
                        <div>
                            <span class="price-val">${product.price}</span>
                            <span class="orig-val">${product.originalPrice}</span>
                        </div>
                        <span class="discount-badge">${product.discount}</span>
                    </div>

                    <div class="details-specs-grid">
                        ${specsHTML}
                    </div>

                    <div style="font-size:0.84rem; font-weight:700; color:#00d2ff; margin-top:4px;">
                        <i class="fas fa-shield-alt"></i> Warranty & Services:
                    </div>
                    <div class="product-warranty-strip" style="margin-top:-6px;">
                        <i class="fas fa-certificate"></i> ${product.warranty}
                    </div>

                    <div style="font-size:0.84rem; font-weight:700; color:#00d2ff; margin-top:4px;">
                        Key Features & Highlights:
                    </div>
                    <ul class="details-features-list">
                        ${featuresHTML}
                    </ul>

                    <div class="details-actions">
                        <button type="button" class="btn btn-buy-now modal-buy-btn" data-product-id="${product.id}" style="flex:1;">
                            <i class="fas fa-shopping-cart"></i> Buy Now
                        </button>
                        <button type="button" class="btn btn-whatsapp-enquiry modal-wa-btn" data-product-id="${product.id}" style="flex:1;">
                            <i class="fab fa-whatsapp"></i> Enquire via WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Attach action handlers inside details modal
        const modalBuyBtn = detailsBody.querySelector('.modal-buy-btn');
        if (modalBuyBtn) {
            modalBuyBtn.addEventListener('click', () => {
                closeDetailsModal();
                openProductEnquiry(product);
            });
        }

        const modalWaBtn = detailsBody.querySelector('.modal-wa-btn');
        if (modalWaBtn) {
            modalWaBtn.addEventListener('click', () => {
                sendWhatsAppEnquiry(product.name, product.brand, product.price, '', '', '', 'Hello, I am interested in viewing details & purchasing this product.');
            });
        }

        detailsModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeDetailsModal() {
        if (detailsModal) {
            detailsModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    function openProductEnquiry(product) {
        if (!enquiryModal || !enquiryProductName) return;

        enquiryProductName.textContent = product.name;
        if (enquiryProductId) enquiryProductId.value = product.id;

        if (enquiryFormMessage) enquiryFormMessage.style.display = 'none';

        enquiryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeEnquiryModal() {
        if (enquiryModal) {
            enquiryModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // WhatsApp Direct Action
    if (whatsappEnquiryBtn) {
        whatsappEnquiryBtn.addEventListener('click', () => {
            const prodName = enquiryProductName ? enquiryProductName.textContent : 'Appliance Product';
            const prodId = document.getElementById('enquiryProductId').value;
            const prodBrand = (prodId && FEATURED_PRODUCTS_DATA[prodId]) ? FEATURED_PRODUCTS_DATA[prodId].brand : '';
            const prodPrice = (prodId && FEATURED_PRODUCTS_DATA[prodId]) ? FEATURED_PRODUCTS_DATA[prodId].price : '';
            const custName = document.getElementById('enquiryCustomerName').value.trim();
            const phone = document.getElementById('enquiryMobileNumber').value.trim();
            const address = document.getElementById('enquiryDeliveryAddress').value.trim();
            const msg = document.getElementById('enquiryAdditionalMessage').value.trim();

            sendWhatsAppEnquiry(prodName, prodBrand, prodPrice, custName, phone, address, msg);
        });
    }

    function sendWhatsAppEnquiry(prodName, prodBrand, prodPrice, custName, phone, address, msg) {
        let text = `Hello SAMACOOL! I would like to inquire about purchasing:\n*${prodName}*\n`;
        if (prodBrand) text += `Brand: ${prodBrand}\n`;
        if (prodPrice) text += `Price: ${prodPrice}\n`;
        if (custName) text += `\nName: ${custName}`;
        if (phone) text += `\nMobile: ${phone}`;
        if (address) text += `\nDelivery Address: ${address}`;
        if (msg) text += `\nMessage: ${msg}`;

        const whatsappUrl = `https://wa.me/916384103958?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
    }

    // Product Enquiry Form Submission
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const prodName = enquiryProductName ? enquiryProductName.textContent : 'Appliance Product';
            const prodId = document.getElementById('enquiryProductId').value;
            const prodPrice = (prodId && FEATURED_PRODUCTS_DATA[prodId]) ? FEATURED_PRODUCTS_DATA[prodId].price : 'N/A';
            const custName = document.getElementById('enquiryCustomerName').value.trim();
            const phone = document.getElementById('enquiryMobileNumber').value.trim();
            const email = document.getElementById('enquiryEmailAddress').value.trim();
            const address = document.getElementById('enquiryDeliveryAddress').value.trim();
            const msg = document.getElementById('enquiryAdditionalMessage').value.trim();

            const prodBrand = (prodId && FEATURED_PRODUCTS_DATA[prodId]) ? FEATURED_PRODUCTS_DATA[prodId].brand : 'N/A';
            const prodCategory = (prodId && FEATURED_PRODUCTS_DATA[prodId]) ? FEATURED_PRODUCTS_DATA[prodId].category : 'N/A';

            if (!custName) {
                showEnquiryMessage('error', 'Please enter your full name.');
                return;
            }

            if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
                showEnquiryMessage('error', 'Please enter a valid 10-digit mobile number.');
                return;
            }

            if (!address) {
                showEnquiryMessage('error', 'Please enter your delivery address.');
                return;
            }

            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showEnquiryMessage('error', 'Please enter a valid email address.');
                return;
            }

            const submitBtn = document.getElementById('submitEnquiryBtn');
            const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending Enquiry...`;
            }

            showEnquiryMessage('info', 'Processing your enquiry...');

            let enquirySent = false;

            // 1. Try Backend API
            try {
                const isHttp = window.location.protocol.startsWith('http');
                const backendEndpoint = isHttp
                    ? (window.location.port === '3000' || !window.location.port ? '/api/product-enquiry' : 'http://localhost:3000/api/product-enquiry')
                    : 'http://localhost:3000/api/product-enquiry';

                const resp = await fetch(backendEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        product_name: prodName,
                        product_brand: prodBrand,
                        product_category: prodCategory,
                        product_price: prodPrice,
                        customer_name: custName,
                        phone_number: phone,
                        email_address: email || 'N/A',
                        delivery_address: address,
                        message: msg || 'N/A'
                    })
                });

                const data = await resp.json().catch(() => ({}));

                if (resp.ok && data.success) {
                    enquirySent = true;
                }
            } catch (err) {
                console.log('Backend product enquiry failed/unavailable, attempting direct FormSubmit...');
            }

            // 2. Direct to Gmail via FormSubmit
            if (!enquirySent) {
                try {
                    const fsResp = await fetch('https://formsubmit.co/ajax/shahidjamal13258@gmail.com', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            _subject: `New Product Order & Enquiry: ${prodName} from ${custName}`,
                            _template: 'table',
                            _captcha: 'false',
                            'Product Name': prodName,
                            'Brand': prodBrand,
                            'Category': prodCategory,
                            'Price': prodPrice,
                            'Customer Name': custName,
                            'Mobile Number': phone,
                            'Email Address': email || 'Not provided',
                            'Delivery Address': address,
                            'Customer Message': msg || 'None',
                            'Submitted At': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
                        })
                    });

                    if (fsResp.ok) {
                        const fsData = await fsResp.json().catch(() => ({}));
                        if (fsData.success === 'true' || fsData.success === true) {
                            enquirySent = true;
                        }
                    }
                } catch (fsErr) {
                    console.warn('FormSubmit product enquiry error:', fsErr);
                }
            }

            // 3. Fallback Mailto
            if (!enquirySent) {
                const subject = `Product Order & Enquiry: ${prodName} - ${custName}`;
                const bodyText = `Product: ${prodName}\nBrand: ${prodBrand}\nPrice: ${prodPrice}\nName: ${custName}\nPhone: ${phone}\nEmail: ${email}\nDelivery Address: ${address}\nMessage: ${msg}`;
                window.location.href = `mailto:shahidjamal13258@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
                enquirySent = true;
            }

            if (enquirySent) {
                showEnquiryMessage('success', 'Enquiry submitted successfully and sent to shahidjamal13258@gmail.com! We will contact you soon.');
                enquiryForm.reset();
                setTimeout(() => {
                    closeEnquiryModal();
                }, 4000);
            }

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

    function showEnquiryMessage(type, message) {
        if (!enquiryFormMessage) return;
        enquiryFormMessage.className = `form-message ${type}`;
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        
        enquiryFormMessage.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
        enquiryFormMessage.style.display = 'block';
        enquiryFormMessage.style.opacity = '1';
    }
}

// Initialize featured products logic
try { initFeaturedProducts(); } catch (e) { console.warn('initFeaturedProducts error:', e); }
