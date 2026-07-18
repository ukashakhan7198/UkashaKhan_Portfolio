document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCustomCursor();
  initBackgroundParallax();
  initNavbarScroll();
  initMobileMenu();
  initTypingEffect();
  initScrollReveal();
  initStatsCounter();
  initSkillsProgress();
  initProjectFilter();
  initTestimonialSlider();
  initContactForm();
});

/* ==========================================================================
   PRELOADER
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const progressBar = document.querySelector('.loader-progress');
  
  if (!preloader) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        preloader.style.opacity = 0;
        preloader.style.visibility = 'hidden';
      }, 300);
    }
    progressBar.style.width = `${progress}%`;
  }, 80);
}

/* ==========================================================================
   CUSTOM CURSOR TRACKING
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  const cursorGlow = document.getElementById('custom-cursor-glow');

  if (!cursor || !cursorGlow) return;

  // Track mouse coordinates
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Direct position for the primary dot
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  // Smooth lerp (easing) for the glow ring
  function animateGlow() {
    const ease = 0.15;
    glowX += (mouseX - glowX) * ease;
    glowY += (mouseY - glowY) * ease;
    
    cursorGlow.style.left = `${glowX}px`;
    cursorGlow.style.top = `${glowY}px`;
    
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  // Highlight classes on hover
  const hoverables = document.querySelectorAll('a, button, .filter-tab, .timeline-dot, input, textarea, .social-link');
  hoverables.forEach(item => {
    item.addEventListener('mouseenter', () => {
      document.body.classList.add('hovering');
    });
    item.addEventListener('mouseleave', () => {
      document.body.classList.remove('hovering');
    });
  });
}

/* ==========================================================================
   AMBIENT BACKGROUND MOUSE PARALLAX
   ========================================================================== */
function initBackgroundParallax() {
  const blobs = document.querySelectorAll('.blob');
  
  if (blobs.length === 0 || window.matchMedia('(max-width: 1024px)').matches) return;

  document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;

    blobs.forEach((blob, idx) => {
      const speed = (idx + 1) * 30; // Shifting amounts
      blob.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
  });
}

/* ==========================================================================
   NAVBAR & SCROLL PROGRESS
   ========================================================================== */
function initNavbarScroll() {
  const header = document.querySelector('header');
  const progressBar = document.getElementById('scroll-progress-bar');
  const sections = document.querySelectorAll('section, #home');
  const navLinks = document.querySelectorAll('nav a, .nav-mobile a');

  window.addEventListener('scroll', () => {
    // 1. Sticky Navbar styling
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // 2. Scroll Progress bar
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight > 0) {
      const scrolledPercentage = (window.scrollY / scrollHeight) * 100;
      progressBar.style.width = `${scrolledPercentage}%`;
    }

    // 3. Navigation Links Active Highlight on scroll
    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   MOBILE MENU DRAWER
   ========================================================================== */
function initMobileMenu() {
  const burger = document.querySelector('.burger-menu');
  const menu = document.querySelector('.nav-mobile');
  const links = document.querySelectorAll('.nav-mobile a');

  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    menu.classList.toggle('open');
    // Lock body scroll
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ==========================================================================
   HERO TYPING CAROUSEL EFFECT
   ========================================================================== */
function initTypingEffect() {
  const textElement = document.getElementById('typing-text');
  if (!textElement) return;

  const words = JSON.parse(textElement.getAttribute('data-words'));
  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIdx];
    
    if (isDeleting) {
      textElement.textContent = currentWord.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 50; // Deletes faster
    } else {
      textElement.textContent = currentWord.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 150; // Standard typing speed
    }

    if (!isDeleting && charIdx === currentWord.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at end of word
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      typingSpeed = 500; // Pause before typing next word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Optionally stop observing once revealed
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   STATS ANIMATED COUNTER
   ========================================================================== */
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-number');
  
  const countUp = (element) => {
    const target = parseFloat(element.getAttribute('data-target'));
    const speed = 60; // speed divider
    let current = 0;
    const isFloat = element.getAttribute('data-type') === 'float';

    const updateValue = () => {
      const increment = target / speed;
      current += increment;

      if (current >= target) {
        element.textContent = isFloat ? target.toFixed(1) : Math.ceil(target);
      } else {
        element.textContent = isFloat ? current.toFixed(1) : Math.ceil(current);
        requestAnimationFrame(updateValue);
      }
    };
    updateValue();
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.8 });

  stats.forEach(stat => observer.observe(stat));
}

/* ==========================================================================
   SKILLS DYNAMIC PROGRESS TRIGGERS
   ========================================================================== */
function initSkillsProgress() {
  const progressBars = document.querySelectorAll('.skill-bar-fill');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const percent = entry.target.getAttribute('data-percent');
        entry.target.style.width = percent;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  progressBars.forEach(bar => observer.observe(bar));
}

/* ==========================================================================
   PROJECTS CATEGORY FILTER ENGINE
   ========================================================================== */
function initProjectFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.project-card');
  const grid = document.querySelector('.projects-grid');

  if (tabs.length === 0 || cards.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Set active state on tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      // Grid opacity shift for smooth transition
      grid.style.opacity = '0';

      setTimeout(() => {
        cards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.classList.remove('hide');
          } else {
            card.classList.add('hide');
          }
        });
        grid.style.opacity = '1';
        
        // Re-run scroll reveal to trigger items in new positions
        initScrollReveal();
      }, 250);
    });
  });
}

/* ==========================================================================
   TESTIMONIALS SLIDER
   ========================================================================== */
function initTestimonialSlider() {
  const wrapper = document.querySelector('.slider-wrapper');
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slider-dot');
  const arrowPrev = document.querySelector('.arrow-prev');
  const arrowNext = document.querySelector('.arrow-next');

  if (!wrapper || slides.length === 0) return;

  let currentIdx = 0;
  let autoplayInterval;

  function updateSlider() {
    wrapper.style.transform = `translateX(-${currentIdx * 100}%)`;
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIdx);
    });
  }

  function nextSlide() {
    currentIdx = (currentIdx + 1) % slides.length;
    updateSlider();
  }

  function prevSlide() {
    currentIdx = (currentIdx - 1 + slides.length) % slides.length;
    updateSlider();
  }

  // Event Listeners
  if (arrowNext) {
    arrowNext.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });
  }

  if (arrowPrev) {
    arrowPrev.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      currentIdx = parseInt(dot.getAttribute('data-slide-index'));
      updateSlider();
      resetAutoplay();
    });
  });

  // Autoplay functionality
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  startAutoplay();
}

/* ==========================================================================
   CONTACT FORM INTEGRATION & VALIDATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const feedback = document.getElementById('contact-form-feedback');

  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const message = document.getElementById('form-message').value.trim();

    feedback.className = 'form-feedback';
    feedback.style.display = 'none';

    if (!name || !email || !subject || !message) {
      feedback.textContent = 'Please fill out all fields before sending.';
      feedback.classList.add('error');
      return;
    }

    // Basic email regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      feedback.textContent = 'Please provide a valid email address.';
      feedback.classList.add('error');
      return;
    }

    // Mock successful submit
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending Message...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      feedback.textContent = 'Thank you, Ukasha! Your message has been sent successfully. I will get back to you shortly.';
      feedback.classList.add('success');
      form.reset();
    }, 1500);
  });
}
