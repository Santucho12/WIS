// ========================================
// Software Factory — Main Script (Enhanced UX)
// ========================================

document.addEventListener('DOMContentLoaded', function () {

  const hasGsap = typeof window.gsap !== 'undefined';
  const hasScrollTrigger = typeof window.ScrollTrigger !== 'undefined';
  const hasLenis = typeof window.Lenis !== 'undefined';
  let lenis = null;

  // ── Mobile Menu Toggle (improved) ─────
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.navbar')) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
      }
    });
  }

  // ── Premium Smooth Scroll (Lenis + GSAP ticker) ─────
  if (hasGsap && hasScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    window.ScrollTrigger.config({ ignoreMobileResize: true });
  }

  if (hasLenis) {
    lenis = new window.Lenis({
      duration: 1.1, // Much faster and immediate scroll response
      lerp: 0.12,    // Higher lerp means tighter control, less "slippery" feel
      smoothWheel: true,
      smoothTouch: false, // Let mobile touch scroll be completely native and snappy
      wheelMultiplier: 1.0, // Standard responsive multiplier
      normalizeWheel: true,
    });

    if (hasGsap) {
      window.gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        window.requestAnimationFrame(raf);
      }
      window.requestAnimationFrame(raf);
    }

    if (hasScrollTrigger) {
      lenis.on('scroll', function () {
        window.ScrollTrigger.update();
      });
    }
  }

  // ── Navbar scroll style (enhanced) ────
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  if (navbar) {
    window.addEventListener('scroll', function () {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ── Smooth scroll with navbar offset ──
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length <= 1) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      const navH = navbar ? navbar.offsetHeight : 0;
      const targetId = href.slice(1);

      let extraOffset = 10;
      if (targetId === 'sobre-nosotros') extraOffset = 0;
      if (targetId === 'servicios') extraOffset = window.innerWidth <= 768 ? 100 : 120;
      if (targetId === 'portfolio' && this.closest('.navbar')) extraOffset = 20;

      const y = target.getBoundingClientRect().top + window.pageYOffset - navH - extraOffset;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.scrollTo(0, y);
        return;
      }

      if (lenis) {
        lenis.scrollTo(y, {
          duration: 1.4,
          easing: function (t) {
            return 1 - Math.pow(1 - t, 4);
          },
        });
        return;
      }

      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  // ── Intersection Observer for AOS ─────
  const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -60px 0px',
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(function () {
          entry.target.classList.add('aos-animate');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-aos]').forEach(function (el) {
    observer.observe(el);
  });

  // ── Auto Reveal + Parallax with ScrollTrigger ─────
  if (hasGsap && hasScrollTrigger) {
    const revealElements = Array.from(document.querySelectorAll('.reveal, .fade-up'));
    revealElements.forEach(function (element) {
      const isFadeUp = element.classList.contains('fade-up');
      window.gsap.fromTo(element,
        {
          y: isFadeUp ? 42 : 26,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            once: true,
          },
        }
      );
    });

    const parallaxElements = Array.from(document.querySelectorAll('.parallax'));
    parallaxElements.forEach(function (element) {
      const speedValue = parseFloat(element.getAttribute('data-speed') || '0.14');
      const triggerElement = element.closest('section') || element;
      window.gsap.to(element, {
        y: function () {
          return window.innerHeight * speedValue;
        },
        ease: 'none',
        scrollTrigger: {
          trigger: triggerElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
    });

    window.ScrollTrigger.refresh();
  }

  // ── Hero word animation (enhanced) ────
  const heroVideo = document.getElementById('hero-bg-video');
  if (heroVideo) {
    heroVideo.playbackRate = 0.8;
  }

  const animatedTitle = document.getElementById('animated-title');
  if (animatedTitle) {
    const words = ['Sistemas internos ', 'Automatizaciones ', 'Sitios web '];
    let idx = 0;
    animatedTitle.style.transition = 'opacity 0.45s cubic-bezier(.4,0,.2,1), transform 0.45s cubic-bezier(.4,0,.2,1)';

    function animateWord() {
      animatedTitle.style.opacity = '0';
      animatedTitle.style.transform = 'translateY(18px)';
      setTimeout(function () {
        animatedTitle.textContent = words[idx];
        animatedTitle.style.opacity = '1';
        animatedTitle.style.transform = 'translateY(0)';
        idx = (idx + 1) % words.length;
      }, 450);
    }

    setTimeout(function () {
      setInterval(animateWord, 2800);
    }, 600);
  }

  // ── Hero cards mobile layout (static bento 2+1) ───────
  const heroCardsContainer = document.querySelector('.hero-services-cards');
  if (heroCardsContainer) {
    heroCardsContainer.classList.remove('is-carousel-mobile');
    heroCardsContainer.querySelectorAll('.hero-service-card').forEach(function (card) {
      card.classList.remove('is-active');
    });

    const indicatorsContainer = document.querySelector('.hero-carousel-indicators');
    if (indicatorsContainer) {
      indicatorsContainer.remove();
    }
  }

  // ── Light follow effect for cards ───
  const serviceCards = Array.from(document.querySelectorAll('.service-card-new'));
  if (serviceCards.length) {
    let ticking = false;

    function updateServiceReadingCard() {
      const viewportCenter = window.innerHeight * 0.5;
      let bestCard = null;
      let bestDistance = Number.POSITIVE_INFINITY;

      serviceCards.forEach(function (card) {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.bottom > window.innerHeight * 0.18 && rect.top < window.innerHeight * 0.82;

        if (!isVisible) return;

        const cardCenter = rect.top + (rect.height / 2);
        const distance = Math.abs(cardCenter - viewportCenter);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestCard = card;
        }
      });

      serviceCards.forEach(function (card) {
        card.classList.toggle('is-reading', card === bestCard);
      });
    }

    function requestServiceCardUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        updateServiceReadingCard();
        ticking = false;
      });
    }

    updateServiceReadingCard();
    window.addEventListener('scroll', requestServiceCardUpdate, { passive: true });
    window.addEventListener('resize', requestServiceCardUpdate, { passive: true });
  }

  const portfolioCards = Array.from(document.querySelectorAll('.portfolio-item'));
  if (portfolioCards.length) {
    let portfolioTicking = false;

    function updatePortfolioReadingCard() {
      const viewportCenter = window.innerHeight * 0.5;
      let bestCard = null;
      let bestDistance = Number.POSITIVE_INFINITY;

      portfolioCards.forEach(function (card) {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.bottom > window.innerHeight * 0.16 && rect.top < window.innerHeight * 0.84;

        if (!isVisible) return;

        const cardCenter = rect.top + (rect.height / 2);
        const distance = Math.abs(cardCenter - viewportCenter);

        if (distance < bestDistance) {
          bestDistance = distance;
          bestCard = card;
        }
      });

      portfolioCards.forEach(function (card) {
        card.classList.toggle('is-reading', card === bestCard);
      });
    }

    function requestPortfolioCardUpdate() {
      if (portfolioTicking) return;
      portfolioTicking = true;
      window.requestAnimationFrame(function () {
        updatePortfolioReadingCard();
        portfolioTicking = false;
      });
    }

    updatePortfolioReadingCard();
    window.addEventListener('scroll', requestPortfolioCardUpdate, { passive: true });
    window.addEventListener('resize', requestPortfolioCardUpdate, { passive: true });
  }

  document.querySelectorAll('.about-stat-card, .about-info-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });

  // ── Portfolio item micro-interaction ───

  // ── Counter animation for stats (Only Projects) ───────
  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();
        const num = parseInt(text);
        if (!isNaN(num) && num > 0) {
          const suffix = text.replace(String(num), '');
          let current = 0;
          const increment = num / 45;
          const timer = setInterval(function () {
            current += increment;
            if (current >= num) {
              el.textContent = num + suffix;
              clearInterval(timer);
            } else {
              el.textContent = Math.floor(current) + suffix;
            }
          }, 25);
        }
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-proyectos .about-stat-number').forEach(function (el) {
    counterObserver.observe(el);
  });

  // ── Dynamic footer year ───────────────
  const yearSpan = document.getElementById('footer-year');
  if (yearSpan) {
    yearSpan.innerHTML = '&copy; ' + new Date().getFullYear();
  }

  // ── Parallax on hero shapes ───────────
  window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    document.querySelectorAll('.shape').forEach(function (shape, index) {
      const speed = (index + 1) * 0.08;
      shape.style.transform = 'translateY(' + (scrolled * speed) + 'px)';
    });
  }, { passive: true });

  // ── AI Virtual Assistant Simulator ──
  const assistantButtons = document.querySelectorAll('.assistant-btn');
  const consoleQuery = document.getElementById('console-query');
  const consoleShortAnswer = document.getElementById('console-short-answer');
  const consoleFullAnswer = document.getElementById('console-full-answer');

  // Answers Database
  const assistantAnswers = {
    desarrollo: {
      query: "¿Cuánto tarda el desarrollo?",
      short: "El tiempo estimado es de 3 a 6 semanas.",
      full: "El plazo exacto depende del alcance. La mayoría de los proyectos (sistemas internos, integraciones y landings de alta conversión) se entregan en menos de un mes, con despliegue continuo para que puedas ver el avance real semana a semana."
    },
    propiedad: {
      query: "¿El código es de mi propiedad?",
      short: "El código es 100% de tu propiedad.",
      full: "Al finalizar y liquidar el proyecto, te transferimos el acceso total al repositorio de GitHub, configuraciones cloud (Vercel/AWS) y documentación técnica completa. Sin suscripciones forzadas ni letra chica."
    },
    soporte: {
      query: "¿Ofrecen soporte post-lanzamiento?",
      short: "Sí, te acompañamos después de la entrega.",
      full: "Ofrecemos planes de soporte, optimización continua y mantenimiento mensual. Nos aseguramos de que tu software escale sin problemas, esté protegido contra vulnerabilidades y se adapte al crecimiento de tu negocio."
    },
    tecnologias: {
      query: "¿Qué tecnologías utilizan?",
      short: "Stack moderno, escalable y sin dependencias propietarias.",
      full: "Desarrollamos principalmente con React, Next.js, Node.js y bases de datos robustas (PostgreSQL, MongoDB). Para infraestructura y despliegues confiamos en AWS, Vercel y Docker. Todo configurado bajo las mejores prácticas del mercado."
    },
    integraciones: {
      query: "¿Se integran con mis sistemas?",
      short: "Sí, nos conectamos con cualquier API o base de datos.",
      full: "Ya sea que uses SAP, Salesforce, CRMs a medida, pasarelas de pago (Stripe, MercadoPago) o sistemas de facturación locales. Desarrollamos integraciones robustas y seguras para automatizar tus operaciones sin romper tus flujos actuales."
    }
  };

  let typingTimeout = null;
  let responseTimeout = null;

  function typeText(element, text, speed, callback) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        typingTimeout = setTimeout(type, speed);
      } else if (callback) {
        callback();
      }
    }
    type();
  }

  function loadAssistantAnswer(key) {
    const data = assistantAnswers[key];
    if (!data) return;

    // Clear any active typing processes
    clearTimeout(typingTimeout);
    clearTimeout(responseTimeout);

    // Reset console states
    consoleQuery.innerHTML = '';
    consoleShortAnswer.innerHTML = '';
    consoleFullAnswer.style.opacity = '0';
    consoleFullAnswer.style.transform = 'translateY(10px)';
    consoleFullAnswer.style.transition = 'none';
    consoleFullAnswer.innerHTML = '';

    // Type the User Command
    typeText(consoleQuery, data.query, 25, () => {
      // Add thinking delay & blinking cursor on AI prefix
      consoleShortAnswer.innerHTML = '<span class="terminal-cursor"></span>';
      
      responseTimeout = setTimeout(() => {
        consoleShortAnswer.innerHTML = '';
        typeText(consoleShortAnswer, data.short, 20, () => {
          // Fade in the full description block
          consoleFullAnswer.innerHTML = data.full;
          consoleFullAnswer.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
          consoleFullAnswer.style.opacity = '1';
          consoleFullAnswer.style.transform = 'translateY(0)';
        });
      }, 350);
    });
  }

  // Setup click listeners
  assistantButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      if (this.classList.contains('active')) return;

      // Update active class
      assistantButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      // Load typewriter response
      const key = this.getAttribute('data-question');
      loadAssistantAnswer(key);
    });
  });

  // Enable mouse light glow effect on assistant buttons
  assistantButtons.forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      btn.style.setProperty('--mouse-x', `${x}%`);
      btn.style.setProperty('--mouse-y', `${y}%`);
    });
  });



  // ── Cómo Trabajamos Timeline Progress (GSAP + ScrollTrigger) ──
  const progressLine = document.querySelector('.timeline-line-progress');
  const steps = document.querySelectorAll('.timeline-step');
  const workflowTimeline = document.querySelector('.workflow-timeline');

  if (hasGsap && progressLine && workflowTimeline && steps.length > 0) {
    // 1. Scrub progress line height based on scroll progress
    window.gsap.to(progressLine, {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: workflowTimeline,
        start: 'top center+=120',
        end: 'bottom center+=120',
        scrub: 0.3,
        onUpdate: (self) => {
          const progress = self.progress; // between 0 and 1
          
          // Calculate dynamic thresholds based on total step elements count
          const totalSteps = steps.length;
          const stepSegment = 1 / (totalSteps - 1 || 1); // 0.2 spacing
          
          steps.forEach((step, idx) => {
            const node = step.querySelector('.timeline-node');
            const title = step.querySelector('.step-title');
            const metaNum = step.querySelector('.step-meta-num');
            const metaLine = step.querySelector('.step-meta-line');
            
            // Trigger slightly early so visual feedback is instant
            const threshold = idx * stepSegment * 0.95;
            
            if (progress >= threshold) {
              if (node) node.classList.add('active');
              if (title) title.classList.add('active');
              if (metaNum) metaNum.classList.add('active');
              if (metaLine) metaLine.classList.add('active');
            } else {
              // Ensure first step is always active when near the top
              if (idx === 0 && progress < 0.05) {
                if (node) node.classList.add('active');
                if (title) title.classList.add('active');
                if (metaNum) metaNum.classList.add('active');
                if (metaLine) metaLine.classList.add('active');
              } else {
                if (node) node.classList.remove('active');
                if (title) title.classList.remove('active');
                if (metaNum) metaNum.classList.remove('active');
                if (metaLine) metaLine.classList.remove('active');
              }
            }
          });
        }
      }
    });

    // 2. Animate nodes and text panels slightly as they enter the screen using ScrollTrigger
    steps.forEach((step) => {
      const content = step.querySelector('.step-content-wrapper');
      if (content) {
        // Disable global AOS and animate via GSAP for better timing synchronization
        content.removeAttribute('data-aos');
        
        window.gsap.fromTo(content, 
          {
            opacity: 0,
            y: 30,
            scale: 0.98
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: step,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    });
  } else {
    // Fallback: simple intersection observer to activate steps if GSAP isn't loaded
    if ('IntersectionObserver' in window && steps.length > 0) {
      const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const step = entry.target;
            const node = step.querySelector('.timeline-node');
            const title = step.querySelector('.step-title');
            if (node) node.classList.add('active');
            if (title) title.classList.add('active');
          }
        });
      }, { threshold: 0.3 });
      
      steps.forEach(step => stepObserver.observe(step));
    }
  }

  // ── Bento Cards Mouse Glow Tracking ──
  const bentoCards = document.querySelectorAll('.bento-card');
  bentoCards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });

  // ── Calendly Integration & Configuration ──
  const CALENDLY_URL = 'https://calendly.com/santysegal/30min';
  const contactBtn = document.querySelector('.btn-navbar-cta');
  const workflowCtaBtn = document.querySelector('.btn-cta-workflow');

  function openCalendly(e) {
    if (e) e.preventDefault();
    if (typeof Calendly !== 'undefined') {
      Calendly.initPopupWidget({
        url: CALENDLY_URL,
        color: '00d2ff',          // Celeste de WIS
        textColor: 'ffffff',      // Texto blanco
        backgroundColor: '090e18' // Fondo oscuro de WIS
      });
    } else {
      // Fallback en caso de que falle el script de Calendly
      window.open(CALENDLY_URL, '_blank');
    }
  }

  // Trigger Calendly on navbar contact action
  if (contactBtn) {
    contactBtn.addEventListener('click', openCalendly);
  }

  // Trigger Calendly on workflow step "Agendar reunión" button
  if (workflowCtaBtn) {
    workflowCtaBtn.addEventListener('click', openCalendly);
  }

  console.log('🚀 Software Factory — Enhanced UX Loaded');
});
