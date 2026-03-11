/**
 * APEX AUTO - Complete JavaScript Rewrite
 * FIXED: Modal system, Mobile menu, Active nav state, Event handling
 * 
 * Key improvements:
 * - Robust modal that actually opens/closes
 * - Functional mobile hamburger menu with overlay
 * - Active nav link highlighting for current page
 * - Error-free event delegation
 */

// ===========================
// GLOBAL STATE & DOM ELEMENTS
// ===========================

// Modal elements
const modalBackdrop = document.querySelector('.modal-backdrop');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal-close');

// Navbar elements
const navbarToggle = document.querySelector('.navbar-toggle');
const navbarLinks = document.querySelector('.navbar-links');
const navLinks = document.querySelectorAll('.navbar-links a');

// Hero elements
let heroSlider = null;

// Modal global instance (needed for onclick handlers in HTML)
let modalInstance = null;

// ===========================
// HERO SLIDER - Fixed auto-play
// ===========================

class HeroSlider {
  constructor() {
    this.slides = document.querySelectorAll('.hero-slide');
    this.dots = document.querySelectorAll('.hero-dot');
    this.currentSlide = 0;
    this.autoPlayInterval = null;
    
    if (this.slides.length === 0) {
      console.warn('No hero slides found');
      return;
    }
    
    // Initialize first slide
    this.showSlide(0);
    this.startAutoPlay();
    this.setupDotListeners();
  }

  // Show specific slide with fade transition
  showSlide(index) {
    // Validate index
    if (index < 0 || index >= this.slides.length) return;
    
    // Remove active class from all
    this.slides.forEach(slide => slide.classList.remove('active'));
    this.dots.forEach(dot => dot.classList.remove('active'));

    // Add active class to current
    this.slides[index].classList.add('active');
    this.dots[index].classList.add('active');

    this.currentSlide = index;
  }

  // Next slide with wrapping
  nextSlide() {
    const next = (this.currentSlide + 1) % this.slides.length;
    this.showSlide(next);
  }

  // Previous slide with wrapping
  prevSlide() {
    const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.showSlide(prev);
  }

  // Auto-play every 5 seconds
  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
  }

  // Stop auto-play (used when user interacts)
  stopAutoPlay() {
    clearInterval(this.autoPlayInterval);
  }

  // Add click listeners to dots for manual control
  setupDotListeners() {
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.stopAutoPlay();
        this.showSlide(index);
        this.startAutoPlay(); // Resume after interaction
      });
    });
  }
}

// ===========================
// MODAL SYSTEM - FIXED & Robust
// ===========================

class Modal {
  constructor() {
    this.backdrop = document.querySelector('.modal-backdrop');
    this.modal = document.querySelector('.modal');
    this.closeBtn = document.querySelector('.modal-close');
    this.currentCarId = null;

    if (!this.backdrop || !this.modal) {
      console.error('Modal elements not found in DOM');
      return;
    }

    this.setupListeners();
  }

  // Setup all event listeners for modal
  setupListeners() {
    // Close button click
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // Backdrop click - close only if clicking on backdrop itself
    if (this.backdrop) {
      this.backdrop.addEventListener('click', (e) => {
        if (e.target === this.backdrop) this.close();
      });
    }

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
        this.close();
      }
    });
  }

  // FIXED: Open modal with car details
  open(carId) {
    const car = getCarById(carId);
    
    if (!car) {
      console.error(`Car with ID ${carId} not found`);
      return;
    }

    this.currentCarId = carId;
    this.populateModal(car);
    
    // Add active class to show modal
    this.modal.classList.add('active');
    this.backdrop.classList.add('active');
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }

  // Close modal
  close() {
    this.modal.classList.remove('active');
    this.backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Populate modal with car data
  populateModal(car) {
    // Update gallery image
    const gallery = this.modal.querySelector('.modal-gallery');
    if (gallery) {
      gallery.innerHTML = `<img src="${car.image}" alt="${car.name}" />`;
    }

    // Update title and price

    /* <span style="color: var(--accent); font-size: 1.5rem; font-weight: 700;">${car.price}</span> */
    const titleSection = this.modal.querySelector('.modal-title');
    if (titleSection) {
      titleSection.innerHTML = `
        <div>
          <h2>${car.name}</h2>
          <p style="color: var(--accent); font-weight: 600; margin-top: 0.5rem;">${car.category}</p>
          
        </div>
        
      `;
    }
    
    // Update specs grid
    const specsSection = this.modal.querySelector('.modal-specs');
    if (specsSection) {
      specsSection.innerHTML = `
        <div class="modal-spec-item">
          <span class="modal-spec-label">Horsepower</span>
          <span class="modal-spec-value">${car.specs.horsepower}</span>
        </div>
        <div class="modal-spec-item">
          <span class="modal-spec-label">0-60 Time</span>
          <span class="modal-spec-value">${car.specs.acceleration}</span>
        </div>
        <div class="modal-spec-item">
          <span class="modal-spec-label">Top Speed</span>
          <span class="modal-spec-value">${car.specs.topSpeed}</span>
        </div>
        <div class="modal-spec-item">
          <span class="modal-spec-label">Fuel Economy</span>
          <span class="modal-spec-value">${car.specs.fuelEconomy}</span>
        </div>
        <div class="modal-spec-item">
          <span class="modal-spec-label">Seating</span>
          <span class="modal-spec-value">${car.specs.seating}</span>
        </div>
        <div class="modal-spec-item">
          <span class="modal-spec-label">Warranty</span>
          <span class="modal-spec-value">${car.specs.warranty}</span>
        </div>
      `;
    }
    // Update description
    const description = this.modal.querySelector('.modal-description');
    if (description) {
      description.innerHTML = `
        <p><strong>About this vehicle:</strong></p>
        <p>${car.description}</p>
        <p style="margin-top: 1rem;">
          <strong>Year:</strong> ${car.year} | 
          <strong>Engine:</strong> ${car.engine} | 
          <strong>Transmission:</strong> ${car.transmission}
        </p>
      `;
    }


    // Update action buttons
    const actions = this.modal.querySelector('.modal-actions');
    if (actions) {
      actions.innerHTML = `
        <button class="btn btn-secondary" onclick="alert('Inspection booked for ${car.name}! We will contact you within 24 hours.')">Book Inspection</button>
        <button class="btn btn-primary" onclick="alert('Calling dealership: +1 (555) 123-4567')">Call Now</button>
      `;
    }
  }
}

// ===========================
// CAR CARD RENDERER - Generates HTML for cars
// ===========================
/* <div class="car-card-price">${car.price}</div> */
class CarCardRenderer {
  // Create HTML for a single car card
  static createCarCard(car) {
    return `
      <article class="car-card" onclick="modalInstance.open(${car.id})">
        <div class="car-card-image">
          <img src="${car.image}" alt="${car.name}" loading="lazy" />
        </div>
        <div class="car-card-content">
          <div class="car-card-header">
            <div class="car-card-info">
              <h3>${car.name}</h3>
              
            </div>
            <button class="btn btn-primary car-card-call-btn" onclick="event.stopPropagation(); alert('Calling dealership about ${car.name}...')">
              Call
            </button>
          </div>
          <div class="car-card-specs">
            <div class="car-spec">
              
              <span class="car-spec-label">Year</span>
              <span class="car-spec-value">${car.year}</span>
            </div>
            <div class="car-spec">
              
              <span class="car-spec-label">Transmission</span>
              <span class="car-spec-value">${car.transmission}</span>
            </div>
            <div class="car-spec">
              
              <span class="car-spec-label">Engine</span>
              <span class="car-spec-value">${car.engine}</span>
            </div>
          </div>
        </div>
      </article>
    `;
  }
  

  // Render cars to a DOM container
  static renderCarsToContainer(cars, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Container with ID "${containerId}" not found`);
      return;
    }
    
    if (cars.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No cars found</p>';
      return;
    }
    
    container.innerHTML = cars.map(car => this.createCarCard(car)).join('');
  }
}

// ===========================
// MOBILE NAVIGATION - FIXED hamburger menu
// ===========================

function setupMobileNav() {
  if (!navbarToggle || !navbarLinks) {
    console.warn('Mobile nav elements not found');
    return;
  }

  // Toggle menu on hamburger click
  navbarToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent closing immediately
    navbarToggle.classList.toggle('active');
    navbarLinks.classList.toggle('active');
  });

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navbarToggle.classList.remove('active');
      navbarLinks.classList.remove('active');
      updateActiveNav(); // Update which link is highlighted
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('nav')) {
      navbarToggle.classList.remove('active');
      navbarLinks.classList.remove('active');
    }
  });
}

// ===========================
// ACTIVE NAV HIGHLIGHTING - FIXED for current page
// ===========================

function updateActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    const isActive = 
      (currentPage === '' && href === 'index.html') ||
      (href === currentPage) ||
      (currentPage === 'index.html' && href === 'index.html');
    
    if (isActive) {
      link.classList.add('active');
      link.style.color = 'var(--accent)';
    } else {
      link.classList.remove('active');
      link.style.color = 'var(--text-main)';
    }
  });
}

// ===========================
// CAROUSEL - Horizontal scroll with arrows
// ===========================

class Carousel {
  constructor(selector) {
    this.carousel = document.querySelector(selector);
    if (!this.carousel) return;

    this.track = this.carousel.querySelector('.carousel-track');
    this.prevBtn = this.carousel.querySelector('.carousel-arrow.prev');
    this.nextBtn = this.carousel.querySelector('.carousel-arrow.next');

    if (this.track) {
      this.setupListeners();
    }
  }

  setupListeners() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.scroll(-1));
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.scroll(1));
    }
  }

  // Scroll carousel by item width
  scroll(direction) {
    if (!this.track) return;
    const itemWidth = this.track.querySelector('.carousel-item')?.offsetWidth || 350;
    const scrollAmount = itemWidth + 20; // 20px gap
    this.track.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  }
}

// ===========================
// SMOOTH SCROLL - For anchor links
// ===========================

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ===========================
// FORM HANDLING
// ===========================

function setupFormHandlers() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('fullName');
    
    // Show success message
    alert(`Thank you, ${name}! We will contact you within 24 hours.`);
    
    // Reset form
    contactForm.reset();
  });
}

// ===========================
// INITIALIZATION - Run on page load
// ===========================

document.addEventListener('DOMContentLoaded', () => {
  console.log('APEX AUTO - Initializing...');

  // Initialize hero slider (if on home page)
  const heroElement = document.querySelector('.hero-slider');
  if (heroElement) {
    heroSlider = new HeroSlider();
  }

  // Initialize modal system
  modalInstance = new Modal();
  window.modal = modalInstance; // Global reference for HTML onclick handlers

  // Initialize mobile navigation
  setupMobileNav();
  updateActiveNav();

  // Initialize carousels
  const carousels = document.querySelectorAll('.carousel');
  carousels.forEach(carousel => {
    new Carousel('.carousel');
  });

  // Setup form handlers
  setupFormHandlers();

  // Setup smooth scroll
  setupSmoothScroll();

  // Populate cars on home page
  if (document.getElementById('featuredCarsContainer')) {
    const featuredCars = getFeaturedCars();
    CarCardRenderer.renderCarsToContainer(featuredCars, 'featuredCarsContainer');
  }

  if (document.getElementById('dealsContainer')) {
    const dealsCars = getDiscountCars();
    CarCardRenderer.renderCarsToContainer(dealsCars, 'dealsContainer');
  }

  console.log('APEX AUTO - Ready!');
});

// Handle window resize to close mobile menu
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    navbarToggle?.classList.remove('active');
    navbarLinks?.classList.remove('active');
  }
});

// ===========================
// SHOWROOM PAGE SPECIFIC CODE
// ===========================

// Only runs if ShowroomManager class is defined (on showroom.html)
if (typeof ShowroomManager !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    new ShowroomManager();
  });
}
