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

// 1. Sanity Configuration (Top-Level)
const PROJECT_ID = 't4wq6q4h'; 
const DATASET = 'production';
const API_VERSION = 'v2021-10-21';

// The query needs to match your nested schema: "alt": image.alt
const QUERY = encodeURIComponent(`{
  "interiors": *[_type == "interiors"]{name, location, description, priceRange, "image": image.asset->url, "alt": image.alt, featured},
  "homes": *[_type == "homes"]{name, description, priceRange, "image": image.asset->url, "alt": image.alt, featured},
  "flooring": *[_type == "flooring"]{name, description, priceRange, "image": image.asset->url, "alt": image.alt, featured},
  "drapes": *[_type == "drapes"]{name, description, priceRange, "image": image.asset->url, "alt": image.alt, featured}
}`);

const SANITY_URL = `https://${PROJECT_ID}.apicdn.sanity.io/${API_VERSION}/data/query/${DATASET}?query=${QUERY}`;
// 3. The Fetch Engine
async function initSite() {
  try {
    const response = await fetch(SANITY_URL);
    const { result } = await response.json();
    
    // This is the magic line. It overwrites your old static data with LIVE data.
    window.siteData = result; 

    // Now that data is loaded, run your existing init logic
    setupApp(); 
  } catch (error) {
    console.error("Sanity connection failed. Check your Project ID or Network.", error);
  }
}

// 4. Update your DOMContentLoaded
document.addEventListener('DOMContentLoaded', initSite);

// Added 'ctaText' parameter with a default fallback
function renderPortfolioCards(items, containerId, category = 'interiors', ctaText = 'Book a Consultation') {
  const container = document.getElementById(containerId);
  if (!container || !items) return;

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
         data-price="${item.priceRange || ''}">
      <div class="card-img-wrap">
        <img src="${item.image}" alt="${item.alt || item.name}" loading="lazy" width="400" height="300">
        <div class="card-overlay"><span class="card-overlay-text">View</span></div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${item.name}</h3>
        ${item.location ? `<p class="card-location">${item.location}</p>` : ''}
        <p class="card-desc">${item.description}</p>
        ${item.priceRange ? `<p class="card-price">${item.priceRange}</p>` : ''}
        
        <a href="${generateWhatsAppLink(item.name, category)}" class="btn-teal btn-pill card-cta">${ctaText}</a>
      </div>
    </div>
  `).join('');
}

// Added 'ctaText' parameter with a default fallback
function renderProductCards(items, containerId, category = "drapes", ctaText = 'Book a Consultation') {
  const container = document.getElementById(containerId);
  if (!container || !items) return;

  container.innerHTML = items.map(item => `
    <div class="card portfolio-card" data-modal="true" data-name="${item.name}" data-image="${item.image}" data-description="${item.description}" data-price="${item.priceRange}">
      <div class="card-img-wrap">
        <img src="${item.image}" alt="${item.alt || item.name}" loading="lazy" width="400" height="300">
        <div class="card-overlay"><span class="card-overlay-text">View</span></div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${item.name}</h3>
        <p class="card-desc">${item.description}</p>
        <p class="card-price">${item.priceRange}</p>
        
        <a href="${generateWhatsAppLink(item.name, category)}" class="btn-teal btn-pill card-cta">${ctaText}</a>
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
const WHATSAPP_NUMBERS = {
  interiors: '2348143784615',
  homes: '2347048549662',
  drapes: '2347048549662',
  flooring: '2347048549662',
};

const WHATSAPP_MESSAGES = {
  interiors: (name) => `Hi, I saw the *${name}* project on your website and I'd like to discuss something similar for my space.\n\nView it here: https://edenavenue.com/interiors.html`,
  homes: (name) => `Hi, I'm interested in the *${name}* from your Homes collection. Please send me more details.\n\nView it here: https://edenavenue.com/homes.html`,
  drapes: (name) => `Hi, I saw the *${name}* on your website and I'd like to get a quote for my windows.\n\nView it here: https://edenavenue.com/drapes.html`,
  flooring: (name) => `Hi, I saw the *${name}* on your website and I'd like to get a quote for my space.\n\nView it here: https://edenavenue.com/flooring.html`,
};

function generateWhatsAppLink(projectName, category = 'interiors') {
  const number = WHATSAPP_NUMBERS[category] || WHATSAPP_NUMBERS.interiors;
  const messageFn = WHATSAPP_MESSAGES[category] || WHATSAPP_MESSAGES.interiors;
  const message = messageFn(projectName);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
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
  cta.href = generateWhatsAppLink(card.dataset.name, card.dataset.category);
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

  const words = ['Memories', 'Experiences', 'Homes'];
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

/* ========== PROCESS SCROLL - Sticky text + scrolling images ========== */
function initProcessScroll() {
  const phases = document.querySelectorAll('.process__phase');
  const imageWraps = document.querySelectorAll('.process__image-wrap');

  if (!phases.length || !imageWraps.length) return;

  // Activate first phase by default
  phases[0].classList.add('active');
  imageWraps[0].classList.add('active');

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
  }, { threshold: 0.5 });

  imageWraps.forEach(wrap => observer.observe(wrap));
}

/* ========== PAGE INITIALIZATION ========== */

async function initEdenAvenue() {
  // Init nav and UI immediately — doesn't need data
  initNavigation();
  initTypewriter();
  initScrollAnimations();
  initProcessScroll();

   const gridIds = ['grid-interiors', 'grid-homes', 'grid-drapes', 'grid-flooring'];
  gridIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '<div class="grid-loading">Loading...</div>';
  });
  
  try {
    const response = await fetch(SANITY_URL);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const { result } = await response.json();
    window.siteData = result;

    const d = window.siteData;

    // FULL PAGES
    renderPortfolioCards(d.interiors || [], 'grid-interiors', 'interiors', "Book a Session");
    renderPortfolioCards(d.homes || [], 'grid-homes', 'homes', "Place an Order");
    renderProductCards(d.drapes || [], 'grid-drapes', 'drapes', "Get your Drape");
    renderProductCards(d.flooring || [], 'grid-flooring', 'flooring', "Get a Quote");

    // Init modal after cards are rendered
    initModal();

    console.log('✅ Sanity data loaded successfully');

  } catch (error) {
    console.error('❌ Failed to load Sanity data:', error);
  }
}

document.addEventListener('DOMContentLoaded', initEdenAvenue);

/* ========== ERROR HANDLING ========== */
document.addEventListener('error', (e) => {
  if (e.target.tagName === 'IMG') {
    e.target.style.display = 'none';
    console.warn('Image failed to load:', e.target.src);
  }
}, true);

document.addEventListener('DOMContentLoaded', () => {
  // 1. Get the current URL path (e.g., '/about' or '/')
  const currentPath = window.location.pathname;

  // 2. Select every link in both your desktop and mobile navs
  const allNavLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

  allNavLinks.forEach(link => {
    // 3. Rip the active class off every link to clear any hardcoded copy-paste mistakes
    link.classList.remove('active');

    // 4. Get where the link is trying to go
    const linkHref = link.getAttribute('href');

    // 5. The Logic: If the URL matches the link, give it the teal underline
    // We also include a fallback in case the root '/' matches '/index'
    if (currentPath === linkHref || (currentPath === '/' && (linkHref === '/' || linkHref === '/index'))) {
      link.classList.add('active');
    }
  });
});

/* ========== MODAL CLOSE TRIGGERS ========== */
document.getElementById('modal-close')?.addEventListener('click', closeModal);
document.getElementById('modal-overlay')?.addEventListener('click', closeModal);

/* End of main.js */

/* End of main.js */
