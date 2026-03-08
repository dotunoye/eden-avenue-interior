/* ================================================
   EDEN AVENUE INTERIORS - JAVASCRIPT ENGINE
   Pure vanilla JS - render functions, modal, navigation
   ================================================ */

/* ========== RENDER FUNCTIONS (CMS-Ready) ========== */

/**
 * Render portfolio cards (Interiors/Homes)
 * @param {Array} items - Array of portfolio items
 * @param {String} containerId - Target container ID
 */
function renderPortfolioCards(items, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = items.map(item => `
    <div class="card"
         role="button"
         tabindex="0"
         aria-label="View ${item.name}"
         data-modal="true"
         data-name="${item.name}"
         data-image="${item.image}"
         data-description="${item.description}"
         data-meta="${item.location}">
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
    <div class="card"
         role="button"
         tabindex="0"
         aria-label="View ${item.name}"
         data-modal="true"
         data-name="${item.name}"
         data-image="${item.image}"
         data-description="${item.description}"
         data-meta="${item.priceRange}">
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
      </div>
    </div>
  `).join('');
}

/* ========== MODAL INITIALIZATION & LOGIC ========== */

/**
 * Initialize modal on page load
 */
function initModal() {
  // Create modal HTML and append to body
  const modal = document.createElement('div');
  modal.id = 'card-modal';
  modal.className = 'modal-overlay';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'modal-title');
  modal.innerHTML = `
    <div class="modal-container">
      <button class="modal-close" aria-label="Close modal">&times;</button>
      <div class="modal-image-wrap">
        <img id="modal-img"
             src=""
             alt=""
             width="800"
             height="600">
      </div>
      <div class="modal-body">
        <h2 id="modal-title" class="modal-title"></h2>
        <p class="modal-desc"></p>
        <p class="modal-meta"></p>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Event delegation: open modal on card click, close on overlay/button click
  document.addEventListener('click', e => {
    const card = e.target.closest('[data-modal="true"]');
    if (card) {
      openModal(card);
    }

    if (e.target === modal || e.target.classList.contains('modal-close')) {
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
  const modal = document.getElementById('card-modal');
  const img = document.getElementById('modal-img');
  const title = document.getElementById('modal-title');
  const desc = modal.querySelector('.modal-desc');
  const meta = modal.querySelector('.modal-meta');

  img.src = card.dataset.image;
  img.alt = card.dataset.name;
  title.textContent = card.dataset.name;
  desc.textContent = card.dataset.description;
  meta.textContent = card.dataset.meta;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Trap focus in modal for accessibility
  title.focus();
}

/**
 * Close modal
 */
function closeModal() {
  const modal = document.getElementById('card-modal');
  modal.classList.remove('active');
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

/* ========== UTILITY FUNCTIONS ========== */

/**
 * Preload images for better performance
 * @param {String} src - Image URL
 */
function preloadImage(src) {
  const img = new Image();
  img.src = src;
}

/**
 * Format price for display
 * @param {Number} price - Price in Naira
 * @returns {String} Formatted price
 */
function formatPrice(price) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

/* ========== ERROR HANDLING ========== */

// Global error handler for async operations
window.addEventListener('error', (e) => {
  console.error('Page error:', e.message);
});

// Handle missing images gracefully
document.addEventListener('error', (e) => {
  if (e.target.tagName === 'IMG') {
    e.target.style.display = 'none';
    console.warn('Failed to load image:', e.target.src);
  }
}, true);

if (window.innerWidth < 768) {
  const video = document.querySelector('.hero-video__bg');
  if (video) {
    const section = document.querySelector('.hero-video');
    section.style.backgroundImage = 'url("images/hero-poster.jpg")';
    section.style.backgroundSize = 'cover';
    section.style.backgroundPosition = 'center';
  }
}

function initProcessTimeline() {

    if (window.innerWidth < 768) {
    const images = document.querySelectorAll('.process__image-wrap');
    const phases = document.querySelectorAll('.process__phase');
    const left = document.querySelector('.process__left');
    const right = document.querySelector('.process__right');
    const body = document.querySelector('.process__body');

    // Create a new wrapper
    const mobileWrapper = document.createElement('div');
    mobileWrapper.className = 'process__mobile';

    images.forEach((img, i) => {
      const block = document.createElement('div');
      block.className = 'process__mobile-block';
      block.appendChild(img.cloneNode(true));
      if (phases[i]) block.appendChild(phases[i].cloneNode(true));
      mobileWrapper.appendChild(block);
    });

    // Replace body content
    left.style.display = 'none';
    right.style.display = 'none';
    body.appendChild(mobileWrapper);
    return; // Skip parallax logic on mobile
  }

  const imageWraps = document.querySelectorAll('.process__image-wrap');
  const phases = document.querySelectorAll('.process__phase');

  if (!imageWraps.length) return;

  // Add indicators
  const indicatorContainer = document.createElement('div');
  indicatorContainer.className = 'process__indicators';
  imageWraps.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'process__indicator' + (i === 0 ? ' active' : '');
    indicatorContainer.appendChild(dot);
  });
  document.querySelector('.process__right')?.appendChild(indicatorContainer);

  const indicators = document.querySelectorAll('.process__indicator');

  function setActive(index) {
    // Images
    imageWraps.forEach((wrap, i) => {
      wrap.classList.toggle('active', i === index);
    });

    // Text phases
    phases.forEach((phase, i) => {
      phase.classList.toggle('active', i === index);
    });

    // Indicators
    indicators.forEach((ind, i) => {
      ind.classList.toggle('active', i === index);
    });
  }

  // Activate first by default
  setActive(0);

  // Observe each image
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = parseInt(entry.target.dataset.phase);
        setActive(index);
      }
    });
  }, {
    threshold: 0.5,
    rootMargin: '0px 0px -35% 0px'
  });

  imageWraps.forEach(wrap => observer.observe(wrap));
}

initProcessTimeline();
// function initScrollStory() {
//   const imageWraps = document.querySelectorAll('.story-image-wrap');
//   const storyItems = document.querySelectorAll('.story-item');

//   if (!imageWraps.length) return;

//   // Activate first item by default
//   storyItems[0]?.classList.add('active');

//   const observer = new IntersectionObserver((entries) => {
//     entries.forEach(entry => {
//       if (entry.isIntersecting) {
//         const index = entry.target.dataset.index;

//         // Deactivate all
//         storyItems.forEach(item => item.classList.remove('active'));

//         // Activate matching text item
//         const activeItem = document.querySelector(`.story-item[data-index="${index}"]`);
//         activeItem?.classList.add('active');
//       }
//     });
//   }, {
//     threshold: 0.5,
//     rootMargin: '0px 0px -20% 0px'
//   });

//   imageWraps.forEach(wrap => observer.observe(wrap));
// }

// // Call inside DOMContentLoaded
// document.addEventListener('DOMContentLoaded', () => {
//   // ... your existing render calls ...
//   initScrollStory();
// });

/* End of main.js */
