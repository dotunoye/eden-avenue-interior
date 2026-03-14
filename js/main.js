/* ================================================
   EDEN AVENUE INTERIORS - JAVASCRIPT ENGINE
   Pure vanilla JS: render, modal, nav, animations
   ================================================ */

/* ========== RENDER FUNCTIONS - CMS Ready ========== */
/** These functions accept data as parameters (not accessing window.siteData directly)
    enabling easy integration with headless CMS (Sanity, Contentful, etc.) */

/**
 * Render portfolio cards (Interiors/Homes)
 * @param {Array} items - Array of portfolio items
 * @param {String} containerId - Target container ID
 */
function renderPortfolioCards(items, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = items.map(item => `
    <div class="card portfolio-card"
         role="button"
         tabindex="0"
         aria-label="View ${item.name}"
         data-modal="true"
         data-name="${item.name}"
         data-image="${item.image}"
         data-description="${item.description}"
         data-location="${item.location}"
         data-price="${item.priceRange || ''}"
         data-desc="${item.description}">
      <div class="card-img-wrap">
        <img src="${item.image}"
             alt="${item.name} - ${item.location}"
             loading="lazy"
             width="400"
             height="300">
        <div class="card-overlay">
          <span class="card-overlay-text">View</span>
        </div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${item.name}</h3>
        <p class="card-location">${item.location}</p>
        <p class="card-desc">${item.description}</p>
        <a href="${generateWhatsAppLink(item.name)}" class="btn-teal btn-pill card-cta" aria-label="Book consultation for ${item.name}">Book a Consultation</a>
      </div>
    </div>
  `).join('');
}

/**
 * Render product cards (Drapes/Flooring)
 * @param {Array} items - Array of product items
 * @param {String} containerId - Target container ID
 */
function renderProductCards(items, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = items.map(item => `
    <div class="card portfolio-card"
         role="button"
         tabindex="0"
         aria-label="View ${item.name}"
         data-modal="true"
         data-name="${item.name}"
         data-image="${item.image}"
         data-description="${item.description}"
         data-price="${item.priceRange}"
         data-desc="${item.description}">
      <div class="card-img-wrap">
        <img src="${item.image}"
             alt="${item.name}"
             loading="lazy"
             width="400"
             height="300">
        <div class="card-overlay">
          <span class="card-overlay-text">View</span>
        </div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${item.name}</h3>
        <p class="card-desc">${item.description}</p>
        <p class="card-price">${item.priceRange}</p>
        <a href="${generateWhatsAppLink(item.name)}" class="btn-teal btn-pill card-cta" aria-label="Book consultation for ${item.name}">Book a Consultation</a>
      </div>
    </div>
  `).join('');
}

/* ========== WHATSAPP INTEGRATION ========== */
/**
 * Generate WhatsApp link with pre-written message
 * @param {String} projectName - Name of the project/product
 * @returns {String} WhatsApp URL
 */
function generateWhatsAppLink(projectName) {
  const message = `I saw the ${projectName} on your website and I'd like to book a consultation for something similar.`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/2347047999787?text=${encodedMessage}`;
}

/* ========== MODAL - Click/Keyboard Activated ========== */
/** Handles modal activation from existing portfolio-modal HTML structure */
function initModal() {
  const portfolio_modal = document.getElementById('portfolio-modal');
  
  // Only initialize if portfolio-modal exists in HTML
  if (!portfolio_modal) return;

  // Event delegation: open modal on card click
  document.addEventListener('click', e => {
    const card = e.target.closest('[data-modal="true"]');
    if (card) {
      openModal(card);
    }

    // Close modal: overlay click or close button
    if (e.target === portfolio_modal.querySelector('.portfolio-modal__overlay') || 
        e.target.classList.contains('portfolio-modal__close')) {
      closeModal();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal();
    }
    if (e.key === 'Enter') {
      const activeCard = document.activeElement.closest('[data-modal="true"]');
      if (activeCard) {
        openModal(activeCard);
      }
    }
  });
}

/**
 * Open modal with data from clicked card
 * @param {Element} card - The card element
 */
function openModal(card) {
  const modal = document.getElementById('portfolio-modal');
  if (!modal) return;

  const img = modal.querySelector('#modal-image');
  const name = modal.querySelector('#modal-name');
  const desc = modal.querySelector('#modal-desc');
  const location = modal.querySelector('#modal-location');
  const price = modal.querySelector('#modal-price');
  const cta = modal.querySelector('.portfolio-modal__cta');

  // Set image
  img.src = card.dataset.image;
  img.alt = card.dataset.name || 'Project image';

  // Set text content
  name.textContent = card.dataset.name || '';
  desc.textContent = card.dataset.description || '';
  location.textContent = card.dataset.location || '';
  
  // Set price if available
  if (card.dataset.price) {
    price.textContent = card.dataset.price;
    price.style.display = 'block';
  } else {
    price.style.display = 'none';
  }

  // Update WhatsApp CTA button
  if (cta) {
    cta.href = generateWhatsAppLink(card.dataset.name);
    cta.setAttribute('aria-label', `Book consultation via WhatsApp for ${card.dataset.name}`);
  }

  // Show modal
  modal.classList.add('active');
  document.body.classList.add('menu-open');
  document.body.style.overflow = 'hidden';

  // Focus management
  name.focus();
}

/**
 * Close modal
 */
function closeModal() {
  const modal = document.getElementById('portfolio-modal');
  if (!modal) return;
  
  modal.classList.remove('active');
  document.body.classList.remove('menu-open');
  document.body.style.overflow = '';
}

/* ========== NAVIGATION LOGIC ========== */

/**
 * Initialize floating pill navigation
 */
function initNavigation() {
  const nav = document.querySelector('nav.pill-nav');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const navLinks = document.querySelectorAll('nav.pill-nav .nav-links a, .mobile-menu a');

  // Scroll shadow effect on navigation
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 10) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  // Mobile menu toggle
  if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
}

  // Close mobile menu on link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    mobileMenu?.classList.remove('active');
    document.body.style.overflow = '';
  });
});

  // Set active nav link based on current page
  setActiveNavLink();
}

/**
 * Set active navigation link based on current page
 */
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav.pill-nav .nav-links a, .mobile-menu a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ========== TYPEWRITER EFFECT ========== */

/**
 * Initialize typewriter effect for hero text
 */
function initTypewriter() {
  const typedEl = document.querySelector('.hero__typed');
  if (!typedEl) return;

  const words = ['Mems.', 'Expe.', 'es.'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];

    if (!isDeleting) {
      // Typing
      typedEl.textContent = currentWord.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentWord.length) {
        // Fully typed — pause then start deleting
        setTimeout(() => {
          isDeleting = true;
          type();
        }, 2200);
        return;
      }

      setTimeout(type, 90);

    } else {
      // Deleting
      typedEl.textContent = currentWord.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        // Fully deleted — move to next word
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 400);
        return;
      }

      setTimeout(type, 55);
    }
  }

  // Start after initial delay
  setTimeout(type, 800);
}

/* ========== SCROLL ANIMATIONS ========== */

/**
 * Initialize scroll animations with Intersection Observer
 */
function initScrollAnimations() {
const targets = [
  // Backstory — slide in from sides
  { selector: '.backstory__image-wrap', anim: 'slide-left' },
  { selector: '.backstory__text', anim: 'slide-right' },

  // What We Do header — fade up only
  { selector: '.wwd__header', anim: 'fade-up' },

  // What We Do splits — fade up instead of slide
  { selector: '.wwd__split--normal .wwd__image-wrap', anim: 'fade-up' },
  { selector: '.wwd__split--normal .wwd__text', anim: 'fade-up' },
  { selector: '.wwd__split--reverse .wwd__text', anim: 'fade-down' },
  { selector: '.wwd__split--reverse .wwd__image-wrap', anim: 'fade-down' },

  // Bento — scale up only
  { selector: '.bento__header', anim: 'fade-up' },
  { selector: '.bento-card', anim: 'scale-up' },

  // Process header — fade up
  { selector: '.process__header', anim: 'fade-up' },

  // Testimonials — fade up
  { selector: '.testimonials__header', anim: 'fade-up' },
  { selector: '.testimonial-card', anim: 'fade-up' },

  // CTA — scale up
  { selector: '.cta-banner__inner', anim: 'scale-up' },
];

  // Apply animation classes
  targets.forEach(({ selector, anim }) => {
    document.querySelectorAll(selector).forEach((el, index) => {
      el.classList.add('anim', `anim--${anim}`);

      // Stagger delay for cards and testimonials
      if (anim === 'scale-up' || anim === 'fade-up') {
        el.style.transitionDelay = `${index * 0.08}s`;
      }
    });
  });

  // Observe
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim--visible');
      }else {
      entry.target.classList.remove('anim--visible');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.anim').forEach(el => observer.observe(el));
}

/* ========== SECTION 1: VALUES - Horizontal Scroll ========== */
/**
 * Initialize VALUES section with horizontal scroll on desktop
 */
function initValuesScroll() {
  const container = document.querySelector('.values-scroll-container');
  if (!container) {
    console.warn('Values scroll container not found');
    return;
  }
  console.log('Values scroll initialized:', { container });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const inner = document.querySelector('.values-inner');
  if (!inner) {
    console.warn('Values inner not found');
    return;
  }
  console.log('Values inner found:', { inner });

  let ticking = false;

  const updateScroll = () => {
    const rect = container.getBoundingClientRect();
    const containerHeight = container.offsetHeight;
    const viewportHeight = window.innerHeight;

    // How far scrolled into container
    const scrolled = -rect.top / (containerHeight - viewportHeight);
    const progress = Math.max(0, Math.min(1, scrolled));

    console.log('Scroll update:', { rectTop: rect.top, containerHeight, viewportHeight, scrolled: scrolled.toFixed(3), progress: progress.toFixed(3) });
    inner.style.transform = `translateX(${progress * -300}vw)`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateScroll);
      ticking = true;
    }
  }, { passive: true });

  // iOS Safari needs this to fire scroll events inside sticky
  document.addEventListener('touchmove', () => {
    if (!ticking) {
      requestAnimationFrame(updateScroll);
      ticking = true;
    }
  }, { passive: true });

  updateScroll();
}

function initProcessScroll() {
  const phases = document.querySelectorAll('.process__phase');
  const imageWraps = document.querySelectorAll('.process__image-wrap');
  
  if (!phases.length) return;

  // Activate first phase by default
  phases[0].classList.add('active');
  imageWraps[0].classList.add('active');

  // Observe each image wrap — when it enters viewport, activate matching phase
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const phase = entry.target.dataset.phase;
        
        // Deactivate all
        phases.forEach(p => p.classList.remove('active'));
        imageWraps.forEach(img => img.classList.remove('active'));
        
        // Activate matching ones
        const matchingPhase = document.querySelector(`.process__phase[data-phase="${phase}"]`);
        if (matchingPhase) matchingPhase.classList.add('active');
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.5
  });

  imageWraps.forEach(wrap => observer.observe(wrap));
}

/* ========== SECTION 2: TEAM - Mobile Carousel ========== */
/**
 * Initialize TEAM carousel for mobile auto-scroll
 */
function initTeamCarousel() {
  const carousel = document.getElementById('team-carousel');
  if (!carousel || window.innerWidth >= 768) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let currentIndex = 0;
  const cards = carousel.querySelectorAll('.team-card');
  const cardWidth = carousel.offsetWidth;

  const autoScroll = () => {
    currentIndex = (currentIndex + 1) % cards.length;
    carousel.scrollTo({
      left: currentIndex * cardWidth,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  };

  // Auto-advance every 3000ms
  if (!prefersReducedMotion) {
    setInterval(autoScroll, 3000);
  }
}

/* ========== SECTION 3: HOW WE WORK - SVG Roadmap ========== */
/**
 * Initialize HOW WE WORK - SVG path animation and stop scaling
 */
function initRoadmap() {
  const section = document.getElementById('process-roadmap');
  if (!section) return;

  const svg = section.querySelector('.roadmap-svg');
  const path = section.querySelector('.roadmap-path');
  const stops = section.querySelectorAll('.roadmap-stop');

  if (!svg || !path) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Get total path length for dash animation
  const pathLength = path.getTotalLength();
  path.style.strokeDasharray = pathLength;
  path.style.strokeDashoffset = pathLength;

  // Intersection Observer for path animation
  const pathObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!prefersReducedMotion) {
          path.style.strokeDashoffset = '0';
        } else {
          path.style.strokeDasharray = 'none';
        }
        // Disconnect after first trigger
        pathObserver.disconnect();
      }
    });
  }, { threshold: 0.1 });

  pathObserver.observe(svg);

  // Animate stops when they enter viewport
  const stopObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const circle = entry.target.querySelector('.roadmap-stop__circle');
        if (circle && !prefersReducedMotion) {
          circle.style.animation = 'labelScaleIn 0.4s ease-out forwards';
        }
      }
    });
  }, { threshold: 0.5 });

  stops.forEach(stop => stopObserver.observe(stop));
}

/* ========== SECTION 4: AWARDS - Counting Animation ========== */
/**
 * Initialize AWARDS - Animate year counting and mobile carousel
 */
function initAwardsCarousel() {
  const timeline = document.getElementById('awards-timeline');
  if (!timeline) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const milestones = timeline.querySelectorAll('.award-milestone');

  // Animate year numbers counting up
  const animateCounter = (start, end, element, duration) => {
    if (prefersReducedMotion) {
      element.textContent = end;
      return;
    }

    let current = start;
    const range = end - start;
    const increment = range / (duration / 16); // 60fps
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        element.textContent = end;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  };

  // Intersection Observer for counting animation
  const yearObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const yearEl = entry.target.querySelector('.award-year');
        if (yearEl && !yearEl.dataset.animated) {
          const startYear = parseInt(yearEl.dataset.start) || 2015;
          const endYear = parseInt(yearEl.dataset.end);
          animateCounter(startYear, endYear, yearEl, 1500);
          yearEl.dataset.animated = 'true';
        }
        // Keep observing for mobile carousel view
      }
    });
  }, { threshold: 0.5 });

  milestones.forEach(milestone => yearObserver.observe(milestone));

  // Mobile carousel
  if (window.innerWidth < 768) {
    let currentIndex = 0;
    
    const autoScroll = () => {
      currentIndex = (currentIndex + 1) % milestones.length;
      timeline.scrollTo({
        left: currentIndex * timeline.offsetWidth,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    };

    if (!prefersReducedMotion) {
      setInterval(autoScroll, 2500);
    }
  }
}

/* ========== SECTION 5: TESTIMONIALS - Slider ========== */
/**
 * Initialize TESTIMONIALS - Quote carousel with navigation
 */
function initTestimonialSlider() {
  const container = document.getElementById('testimonials-slider');
  const prevBtn = document.getElementById('testimonials-prev');
  const nextBtn = document.getElementById('testimonials-next');
  const currentSpan = document.getElementById('testimonials-current');
  const totalSpan = document.getElementById('testimonials-total');

  if (!container) return;

  const quotes = container.querySelectorAll('.testimonial-quote');
  let currentIndex = 0;

  // Show quote at index
  const showQuote = (index) => {
    quotes.forEach(quote => quote.classList.remove('active'));
    quotes[index].classList.add('active');
    
    if (currentSpan) {
      currentSpan.textContent = String(index + 1).padStart(2, '0');
    }
  };

  // Navigation handlers
  const goNext = () => {
    currentIndex = (currentIndex + 1) % quotes.length;
    showQuote(currentIndex);
  };

  const goPrev = () => {
    currentIndex = (currentIndex - 1 + quotes.length) % quotes.length;
    showQuote(currentIndex);
  };

  // Attach event listeners
  if (nextBtn) nextBtn.addEventListener('click', goNext);
  if (prevBtn) prevBtn.addEventListener('click', goPrev);

  // Set total count
  if (totalSpan) totalSpan.textContent = quotes.length;

  // Show first quote
  showQuote(0);

  // Only on mobile
  if (window.innerWidth < 1024) {
    // Optional: keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!container.parentElement.offsetParent) return; // Check if visible
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    });
  }
}

/* ========== PAGE INITIALIZATION ========== */

document.addEventListener('DOMContentLoaded', () => {
  // Check if data is available
  if (!window.siteData) {
    console.error('window.siteData not loaded. Ensure data.js is included before main.js');
    return;
  }

  const d = window.siteData;

  // HOMEPAGE: Render featured items previews
  renderPortfolioCards(d.interiors.filter(i => i.featured).slice(0, 3), 'preview-interiors');
  renderPortfolioCards(d.homes.filter(i => i.featured).slice(0, 3), 'preview-homes');
  renderProductCards(d.drapes.filter(i => i.featured).slice(0, 3), 'preview-drapes');
  renderProductCards(d.flooring.filter(i => i.featured).slice(0, 3), 'preview-flooring');

  // FULL PAGES: Render all items
  renderPortfolioCards(d.interiors, 'grid-interiors');
  renderPortfolioCards(d.homes, 'grid-homes');
  renderProductCards(d.drapes, 'grid-drapes');
  renderProductCards(d.flooring, 'grid-flooring');

  // Initialize interactive features
  initModal();
  initNavigation();
  initTypewriter();
  initScrollAnimations();
  initProcessScroll();
  
  // Initialize new about page sections
  initValuesScroll();
  initTeamCarousel();
  initRoadmap();
  initAwardsCarousel();
  initTestimonialSlider();
});

/* ========== ERROR HANDLING ========== */

/** Handle missing/broken images gracefully by hiding them */
document.addEventListener('error', (e) => {
  if (e.target.tagName === 'IMG') {
    e.target.style.display = 'none';
    console.warn('Image failed to load:', e.target.src);
  }
}, true);

function renderPortfolioGrid(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container || !items) return;

  container.innerHTML = items.map(item => `
    <div class="portfolio-card" 
         data-id="${item.id}"
         data-name="${item.name || ''}"
         data-image="${item.image}"
         data-location="${item.location || ''}"
         data-desc="${item.description || ''}"
         data-price="${item.priceRange || ''}"
         tabindex="0"
         role="button"
         aria-label="View ${item.name || 'project'} details">
      <div class="portfolio-card__image">
        <img src="${item.image}" alt="${item.name || 'Eden Avenue project'}" loading="lazy">
      </div>
      <div class="portfolio-card__info">
        <div class="portfolio-card__meta">
          ${item.name ? `<h3 class="portfolio-card__name">${item.name}</h3>` : ''}
          ${item.location ? `<span class="portfolio-card__location">${item.location}</span>` : ''}
        </div>
        <a class="portfolio-card__cta">Book a Session</a>
      </div>
    </div>
  `).join('');

  // Attach click events
  container.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('click', () => openPortfolioModal(card.dataset));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter') openPortfolioModal(card.dataset);
    });
  });
}

function openPortfolioModal(data) {
  document.getElementById('modal-image').src = data.image;
  document.getElementById('modal-image').alt = data.name || 'Project image';
  document.getElementById('modal-name').textContent = data.name || '';
  document.getElementById('modal-location').textContent = data.location || '';
  document.getElementById('modal-desc').textContent = data.desc || '';
  document.getElementById('modal-price').textContent = data.price || '';

  const modal = document.getElementById('portfolio-modal');
  modal.classList.add('active');
  document.body.classList.add('menu-open');
}

function closePortfolioModal() {
  const modal = document.getElementById('portfolio-modal');
  modal.classList.remove('active');
  document.body.classList.remove('menu-open');
}

// Close triggers
document.getElementById('modal-close')?.addEventListener('click', closePortfolioModal);
document.getElementById('modal-overlay')?.addEventListener('click', closePortfolioModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePortfolioModal();
});

// Init
if (document.getElementById('grid-interiors')) {
  renderPortfolioGrid('grid-interiors', window.siteData.interiors);
}

const scrollIndicator = document.querySelector('.hero-scroll-indicator');
if (scrollIndicator) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      scrollIndicator.style.opacity = '0';
      scrollIndicator.style.pointerEvents = 'none';
    } else {
      scrollIndicator.style.opacity = '1';
    }
  }, { passive: true });
}
/* End of main.js */
