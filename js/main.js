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
         data-location="${item.location || ''}"
         data-price="${item.priceRange || ''}"
         data-desc="${item.description}">
      <div class="card-img-wrap">
        <img src="${item.image}"
             alt="${item.name}${item.location ? ' - ' + item.location : ''}"
             loading="lazy"
             width="400"
             height="300">
        <div class="card-overlay">
          <span class="card-overlay-text">View</span>
        </div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${item.name}</h3>
        ${item.location ? `<p class="card-location">${item.location}</p>` : ''}
        <p class="card-desc">${item.description}</p>
        ${item.priceRange ? `<p class="card-price">${item.priceRange}</p>` : ''}
        <a href="${generateWhatsAppLink(item.name)}" class="btn-teal btn-pill card-cta" aria-label="${item.cta || 'Book a Consultation'} for ${item.name}">${item.cta || 'Book a Consultation'}</a>
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
  return `https://wa.me/2348000000000?text=${encodedMessage}`;
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
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });
    document.body.style.overflow = 'hidden';
  }

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (hamburger) {
        hamburger.classList.remove('active');
      }
      if (mobileMenu) {
        mobileMenu.classList.remove('active');
      }
    });
    document.body.style.overflow = '';
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

  const words = ['Memories.', 'Experiences.', 'Homes.'];
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

/* End of main.js */
