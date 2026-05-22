/**
 * Pobitra Ghee - Main JavaScript
 * Handles all public website interactivity, animations, and form submissions
 */

// ============ Initialize on DOM Ready ============
document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initScrollAnimations();
  initOrderForm();
  initReviewForm();
  initMarqueeAnimation();
  initFloatingBadges();
  initQuantityButtons();
  initProductSelector();
  initMobileMenu();
  initSmoothScroll();
  initBackToTop();
  initStickyCta();
  initHeroCounter();
  initHeroScrollIndicator();
  initJarInteraction();
  initHeroMotionGraphics();
  initMagneticButtons();
  loadApprovedReviews();
  loadSettings();
});

// ============ Navigation ============
function initNavigation() {
  const navbar = document.getElementById('mainNav');
  if (!navbar) return;

  // Change navbar on scroll
  window.addEventListener('scroll', throttle(function() {
    if (window.scrollY > 100) {
      navbar.classList.add('nav--scrolled');
    } else {
      navbar.classList.remove('nav--scrolled');
    }
  }, 100));
}

// ============ Mobile Menu ============
function initMobileMenu() {
  const mobileToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileLinks = document.querySelectorAll('.nav__mobile-item, .nav__mobile-menu .btn');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', function() {
      const isOpen = mobileMenu.classList.contains('nav__mobile-menu--open');
      mobileMenu.classList.toggle('nav__mobile-menu--open');
      if (mobileOverlay) mobileOverlay.classList.toggle('nav__mobile-overlay--visible');
      mobileToggle.setAttribute('aria-expanded', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', function() {
        mobileMenu.classList.remove('nav__mobile-menu--open');
        mobileOverlay.classList.remove('nav__mobile-overlay--visible');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    }

    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('nav__mobile-menu--open');
        if (mobileOverlay) mobileOverlay.classList.remove('nav__mobile-overlay--visible');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }
}

// ============ Smooth Scroll ============
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ============ Scroll Animations ============
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add a small delay for staggered effect
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements with animation classes
  document.querySelectorAll('.animate-on-scroll, .product-card, .review-card, .trust-item').forEach((el, index) => {
    el.dataset.delay = (index % 4) * 100; // Stagger by 100ms
    observer.observe(el);
  });
}

// ============ Marquee Animation ============
function initMarqueeAnimation() {
  const marquee = document.querySelector('.marquee__track');
  if (!marquee) return;

  // Clone marquee items for seamless loop
  const items = marquee.innerHTML;
  marquee.innerHTML = items + items;
}

// ============ Floating Badges Animation ============
function initFloatingBadges() {
  const badges = document.querySelectorAll('.hero__floating-badge');
  badges.forEach((badge, index) => {
    badge.style.animationDelay = `${index * 0.5}s`;
  });
}

// ============ Quantity Buttons ============
function initQuantityButtons() {
  const minusBtn = document.getElementById('qtyDec');
  const plusBtn = document.getElementById('qtyInc');
  const quantityInput = document.getElementById('quantity');

  if (!minusBtn || !plusBtn || !quantityInput) return;

  minusBtn.addEventListener('click', function() {
    let value = parseInt(quantityInput.value) || 1;
    if (value > 1) {
      quantityInput.value = value - 1;
      updateOrderSummary();
    }
  });

  plusBtn.addEventListener('click', function() {
    let value = parseInt(quantityInput.value) || 1;
    if (value < 10) {
      quantityInput.value = value + 1;
      updateOrderSummary();
    }
  });

  quantityInput.addEventListener('change', function() {
    let value = parseInt(this.value);
    if (isNaN(value) || value < 1) this.value = 1;
    if (value > 10) this.value = 10;
    updateOrderSummary();
  });
}

// ============ Interactive Product Configurator ============
function initProductSelector() {
  const VARIANTS = {
    '100g': {
      title: 'Trial Pack',
      description: 'Pure artisanal ghee made using the traditional bilona method. Perfect for daily cooking and small households.',
      price: 149,
      unitPrice: '₹1.49 / g',
      savings: 'Intro Price',
      badge: '',
      scale: 0.8
    },
    '200g': {
      title: 'Standard Pack',
      description: 'A generous portion of our premium ghee. Ideal for regular cooking and gifting to loved ones.',
      price: 230,
      unitPrice: '₹1.15 / g',
      savings: 'Save 22%',
      badge: '',
      scale: 0.9
    },
    '400g': {
      title: 'Family Pack',
      description: 'Our most loved pack! The perfect balance of quality and quantity for families who cook with love.',
      price: 449,
      unitPrice: '₹1.12 / g',
      savings: 'Save 25%',
      badge: 'Most Popular',
      scale: 1.05
    },
    '800g': {
      title: 'Connoisseur Pack',
      description: 'For the ghee connoisseurs. A substantial pack for families who use ghee generously every day.',
      price: 879,
      unitPrice: '₹1.10 / g',
      savings: 'Save 26%',
      badge: 'Best Value',
      scale: 1.18
    },
    '1kg': {
      title: 'Value Pack',
      description: 'The ultimate ghee experience. One full kilogram of pure, handcrafted goodness at the best value.',
      price: 1049,
      unitPrice: '₹1.05 / g',
      savings: 'Save 30%',
      badge: 'Super Saver',
      scale: 1.25
    }
  };

  const configCard = document.querySelector('.selector__config-card');
  const sizePills = document.querySelectorAll('.selector__size-pill');
  const jarEl = document.getElementById('selectorJar');
  const jarLabelSize = document.getElementById('selectorJarLabelSize');
  const shadowEl = document.getElementById('selectorJarShadow');
  const titleEl = document.getElementById('selectorTitle');
  const descEl = document.getElementById('selectorDescription');
  const savingsBadge = document.getElementById('selectorSavingsBadge');
  const popularBadge = document.getElementById('selectorPopularBadge');
  const priceEl = document.getElementById('selectorPrice');
  const unitPriceEl = document.getElementById('selectorUnitPrice');
  
  const qtyDecBtn = document.getElementById('selectorQtyDec');
  const qtyIncBtn = document.getElementById('selectorQtyInc');
  const qtyValEl = document.getElementById('selectorQtyValue');
  
  const checkoutBtn = document.getElementById('selectorCheckoutBtn');
  
  // Main form inputs
  const mainPackSelect = document.getElementById('packSize');
  const mainQtyInput = document.getElementById('quantity');

  let currentSize = '400g';
  let currentQty = 1;

  // Ambient Churning Gold Particles Spawner
  const churningContainer = document.getElementById('selectorChurning');
  if (churningContainer) {
    setInterval(() => {
      const particle = document.createElement('div');
      particle.className = 'selector__jar-churning-particle';
      
      const randomX = Math.random() * 80 + 10;
      particle.style.left = `${randomX}%`;
      
      const duration = Math.random() * 0.8 + 1.2;
      const size = Math.random() * 3 + 2;
      
      particle.style.animationDuration = `${duration}s`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      churningContainer.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, duration * 1000);
    }, 250);
  }

  // Update Selector UI based on size selection
  function updateSelectorSize(size, isSourceForm = false) {
    if (!VARIANTS[size]) return;
    currentSize = size;
    const data = VARIANTS[size];

    // Scale jar elements
    if (jarEl) jarEl.style.setProperty('--selector-jar-scale', data.scale);
    if (shadowEl) shadowEl.style.setProperty('--selector-jar-scale', data.scale);

    // Apply visual change fade animation
    if (configCard) {
      configCard.classList.add('selector__config-card--changing');
    }

    setTimeout(() => {
      // Update text info
      if (titleEl) titleEl.textContent = data.title;
      if (descEl) descEl.textContent = data.description;
      if (priceEl) priceEl.textContent = formatCurrency(data.price);
      if (unitPriceEl) unitPriceEl.textContent = data.unitPrice;
      if (jarLabelSize) jarLabelSize.textContent = size;

      // Update badges
      if (savingsBadge) {
        savingsBadge.textContent = data.savings;
        savingsBadge.style.display = data.savings ? 'inline-block' : 'none';
      }
      if (popularBadge) {
        if (data.badge) {
          popularBadge.textContent = data.badge;
          popularBadge.style.display = 'inline-block';
        } else {
          popularBadge.style.display = 'none';
        }
      }

      // Fade back in
      if (configCard) {
        configCard.classList.remove('selector__config-card--changing');
      }
    }, 250);

    // Sync size pills selection
    sizePills.forEach(pill => {
      const active = pill.getAttribute('data-size') === size;
      pill.classList.toggle('is-active', active);
      pill.setAttribute('aria-checked', active ? 'true' : 'false');
    });

    // Synchronize to the main order form
    if (!isSourceForm && mainPackSelect) {
      mainPackSelect.value = size;
      mainPackSelect.dispatchEvent(new Event('change'));
    }
  }

  // Click listeners for pills
  sizePills.forEach(pill => {
    pill.addEventListener('click', function() {
      const size = this.getAttribute('data-size');
      if (size !== currentSize) {
        updateSelectorSize(size);
      }
    });
  });

  // Quantity controllers
  function updateSelectorQty(qty, isSourceForm = false) {
    qty = parseInt(qty) || 1;
    if (qty < 1) qty = 1;
    if (qty > 10) qty = 10;
    currentQty = qty;

    if (qtyValEl) qtyValEl.textContent = qty;

    // Synchronize back to the main order form
    if (!isSourceForm && mainQtyInput) {
      mainQtyInput.value = qty;
      mainQtyInput.dispatchEvent(new Event('change'));
    }
  }

  if (qtyDecBtn) {
    qtyDecBtn.addEventListener('click', () => {
      if (currentQty > 1) {
        updateSelectorQty(currentQty - 1);
      }
    });
  }

  if (qtyIncBtn) {
    qtyIncBtn.addEventListener('click', () => {
      if (currentQty < 10) {
        updateSelectorQty(currentQty + 1);
      }
    });
  }

  // Checkout redirect button
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const orderSection = document.getElementById('order');
      if (orderSection) {
        orderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const nameInput = document.getElementById('customerName');
        if (nameInput) {
          setTimeout(() => nameInput.focus(), 600);
        }
      }
    });
  }

  // Sync back from the main order form
  if (mainPackSelect) {
    mainPackSelect.addEventListener('change', function() {
      if (this.value && this.value !== currentSize) {
        updateSelectorSize(this.value, true);
      }
    });
  }

  if (mainQtyInput) {
    mainQtyInput.addEventListener('change', function() {
      const val = parseInt(this.value) || 1;
      if (val !== currentQty) {
        updateSelectorQty(val, true);
      }
    });
  }

  // Tactile touch horizontal drag on pills track
  const sizeTrack = document.getElementById('selectorSizeTrack');
  if (sizeTrack) {
    let startX = 0;
    let scrollLeft = 0;
    let isDown = false;

    sizeTrack.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - sizeTrack.offsetLeft;
      scrollLeft = sizeTrack.scrollLeft;
    });

    sizeTrack.addEventListener('mouseleave', () => {
      isDown = false;
    });

    sizeTrack.addEventListener('mouseup', () => {
      isDown = false;
    });

    sizeTrack.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - sizeTrack.offsetLeft;
      const walk = (x - startX) * 1.5;
      sizeTrack.scrollLeft = scrollLeft - walk;
    });
  }
}

// ============ Sticky CTA Bar ============
function initStickyCta() {
  const stickyCta = document.getElementById('stickyCta');
  const collectionSection = document.getElementById('collection');
  const orderSection = document.getElementById('order');

  if (!stickyCta || !collectionSection) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      const collectionBottom = collectionSection.getBoundingClientRect().bottom;
      const orderTop = orderSection ? orderSection.getBoundingClientRect().top : window.innerHeight;
      const isPastCollection = collectionBottom < 0;
      const isBeforeOrder = orderTop > window.innerHeight;

      if (isPastCollection && isBeforeOrder) {
        stickyCta.classList.add('is-visible');
        stickyCta.setAttribute('aria-hidden', 'false');
      } else {
        stickyCta.classList.remove('is-visible');
        stickyCta.setAttribute('aria-hidden', 'true');
      }
    },
    { threshold: 0 }
  );

  observer.observe(collectionSection);

  window.addEventListener('scroll', throttle(function() {
    if (!collectionSection || !orderSection) return;
    const collectionBottom = collectionSection.getBoundingClientRect().bottom;
    const orderTop = orderSection.getBoundingClientRect().top;
    const isPastCollection = collectionBottom < 0;
    const isBeforeOrder = orderTop > window.innerHeight;

    if (isPastCollection && isBeforeOrder) {
      stickyCta.classList.add('is-visible');
      stickyCta.setAttribute('aria-hidden', 'false');
    } else {
      stickyCta.classList.remove('is-visible');
      stickyCta.setAttribute('aria-hidden', 'true');
    }
  }, 50));
}



// ============ Hero Counter Animation ============
function initHeroCounter() {
  const counterEl = document.querySelector('.hero__social-count');
  if (!counterEl) return;

  const target = parseInt(counterEl.dataset.target) || 30;
  const duration = 2000;
  const startTime = Date.now() + 1200;

  function updateCounter() {
    const elapsed = Date.now() - startTime;
    if (elapsed < 0) {
      requestAnimationFrame(updateCounter);
      return;
    }

    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    counterEl.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }

  requestAnimationFrame(updateCounter);
}

// ============ Hero Scroll Indicator Fade ============
function initHeroScrollIndicator() {
  const scrollIndicator = document.querySelector('.hero__scroll-indicator');
  if (!scrollIndicator) return;

  window.addEventListener('scroll', throttle(function() {
    const scrollY = window.scrollY;
    const fadeStart = 50;
    const fadeEnd = 200;

    if (scrollY < fadeStart) {
      scrollIndicator.style.opacity = '1';
      scrollIndicator.style.pointerEvents = 'auto';
    } else if (scrollY < fadeEnd) {
      const opacity = 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart);
      scrollIndicator.style.opacity = String(opacity);
      scrollIndicator.style.pointerEvents = 'none';
    } else {
      scrollIndicator.style.opacity = '0';
      scrollIndicator.style.pointerEvents = 'none';
    }
  }, 16));
}

// ============ Interactive Ghee Jar ============
function initJarInteraction() {
  const container = document.getElementById('jarContainer');
  const scene = document.getElementById('jarScene');
  const light = document.getElementById('jarLight');
  const shadow = document.getElementById('jarShadow');
  const badges = document.querySelectorAll('.hero__floating-badge');
  const churningContainer = document.getElementById('jarChurning');
  const heroSection = document.querySelector('.hero');
  const heroAura = document.getElementById('heroAura');
  const tagEl = document.getElementById('heroJarTag');

  if (!container || !scene) return;

  const maxTilt = 20;
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;

  // Tag swinging variables
  let tagRotation = 10;
  let tagVelocity = 0;
  let previousY = 0;

  // Disable CSS transitions on floating badges during JS control
  badges.forEach(badge => {
    badge.style.transition = 'none';
  });

  // Churning Gold Particles Spawner
  let churningInterval = null;

  function startChurning() {
    if (churningInterval) return;
    churningInterval = setInterval(() => {
      if (!churningContainer) return;
      const particle = document.createElement('div');
      particle.className = 'hero__jar-churning-particle';
      
      const randomX = Math.random() * 80 + 10; // 10% to 90% horizontal range
      particle.style.left = `${randomX}%`;
      
      const duration = Math.random() * 0.8 + 1.2; // 1.2s to 2s lifespan
      const size = Math.random() * 3 + 2; // 2px to 5px size
      
      particle.style.animationDuration = `${duration}s`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      churningContainer.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, duration * 1000);
    }, 150);
  }

  function stopChurning() {
    if (churningInterval) {
      clearInterval(churningInterval);
      churningInterval = null;
    }
  }

  const jar = document.querySelector('.hero__jar');
  if (jar) {
    jar.addEventListener('mouseenter', startChurning);
    jar.addEventListener('mouseleave', stopChurning);
    jar.addEventListener('touchstart', startChurning, { passive: true });
    jar.addEventListener('touchend', stopChurning);
  }

  // Aura follower tracking
  if (heroSection && heroAura) {
    heroSection.addEventListener('mousemove', function(e) {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      heroAura.style.background = `radial-gradient(circle 350px at ${x}px ${y}px, rgba(218, 165, 32, 0.16), transparent 70%)`;
    });

    heroSection.addEventListener('mouseenter', function() {
      heroAura.style.opacity = '1';
    });

    heroSection.addEventListener('mouseleave', function() {
      heroAura.style.opacity = '0';
    });
  }

  // Hotspots toggling for touchscreens & clicks
  const hotspots = document.querySelectorAll('.hero__hotspot');
  hotspots.forEach(hotspot => {
    hotspot.addEventListener('click', function(e) {
      e.stopPropagation();
      const isActive = this.classList.contains('is-active');
      hotspots.forEach(h => h.classList.remove('is-active'));
      if (!isActive) {
        this.classList.add('is-active');
      }
    });
  });

  // Close hotspots on clicking outside
  document.addEventListener('click', function() {
    hotspots.forEach(h => h.classList.remove('is-active'));
  });

  function updateTilt(clientX, clientY) {
    const rect = scene.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (clientX - centerX) / (rect.width / 2);
    const deltaY = (clientY - centerY) / (rect.height / 2);

    targetX = clamp(deltaY * maxTilt, -maxTilt, maxTilt);
    targetY = clamp(-deltaX * maxTilt, -maxTilt, maxTilt);

    if (light) {
      const lightX = 30 + deltaX * 40;
      const lightY = 30 + deltaY * 40;
      light.style.background = `radial-gradient(circle at ${lightX}% ${lightY}%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)`;
    }

    if (shadow) {
      const shadowX = -deltaX * 8;
      shadow.style.transform = `translateX(${shadowX}px)`;
      shadow.style.opacity = 0.25 + Math.abs(deltaX) * 0.15;
    }
  }

  function resetTilt() {
    targetX = 0;
    targetY = 0;

    if (light) {
      light.style.background = 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.12) 0%, transparent 50%)';
    }
    if (shadow) {
      shadow.style.transform = 'translateX(0)';
      shadow.style.opacity = 0.25;
    }
  }

  function animate() {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;

    container.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;

    // Update floating badges parallax and idle oscillation
    const time = Date.now() * 0.001;
    badges.forEach((badge, idx) => {
      const depth = parseFloat(badge.getAttribute('data-depth')) || 0.15;
      
      // Calculate depth translation (using currentX and currentY for smooth dampening)
      const shiftX = currentY * depth * 8;
      const shiftY = -currentX * depth * 8;

      // Add elegant floating sine oscillation
      const floatY = Math.sin(time + idx * 1.5) * 8;
      const floatRot = Math.cos(time * 0.8 + idx) * 2;

      badge.style.transform = `translate3d(${shiftX}px, ${shiftY + floatY}px, 30px) rotate(${floatRot}deg)`;
    });

    // Tag swinging spring physics
    if (tagEl) {
      const force = -(currentY - previousY) * 2.2;
      const gravityForce = -tagRotation * 0.08;
      tagVelocity += force + gravityForce;
      tagVelocity *= 0.86; // Damping/air resistance
      tagRotation += tagVelocity;

      const ambientSway = Math.sin(time * 2.0) * 1.2;
      tagEl.style.transform = `rotate(${tagRotation + ambientSway}deg)`;
    }
    previousY = currentY;

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  scene.addEventListener('mousemove', function(e) {
    updateTilt(e.clientX, e.clientY);
  });

  scene.addEventListener('mouseleave', resetTilt);

  // Skip touch-tilt on touch devices: it forces preventDefault and breaks
  // vertical scrolling when the user's finger lands on the jar.
  const supportsHover = window.matchMedia('(hover: hover)').matches;
  if (supportsHover) {
    scene.addEventListener('touchmove', function(e) {
      if (e.touches.length === 1) {
        e.preventDefault();
        updateTilt(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });

    scene.addEventListener('touchend', resetTilt);
  }
}

// ============ Utility: Clamp ============
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// ============ Hero Motion Graphics (Canvas) ============
function initHeroMotionGraphics() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  // Skip the canvas RAF loop on phones and when the user prefers reduced
  // motion. The CSS at <576px also hides the element; this avoids running
  // the animation for nothing.
  const isSmallScreen = window.matchMedia('(max-width: 767px)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isSmallScreen || reducedMotion) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let waves = [];
  let mouse = { x: -1000, y: -1000 };
  let animationId;

  function resize() {
    width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    initParticles();
    initWaves();
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 8000), 60);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.2 - 0.1,
        opacity: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01
      });
    }
  }

  function initWaves() {
    waves = [];
    for (let i = 0; i < 3; i++) {
      waves.push({
        y: canvas.offsetHeight * (0.65 + i * 0.1),
        amplitude: 15 + i * 8,
        frequency: 0.002 + i * 0.0008,
        speed: 0.005 + i * 0.002,
        offset: Math.random() * Math.PI * 2,
        opacity: 0.04 + i * 0.02
      });
    }
  }

  function drawWaves(time) {
    waves.forEach(wave => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.offsetHeight);

      for (let x = 0; x <= canvas.offsetWidth; x += 3) {
        // Multi-layered sine calculation for organic liquid curves
        const mainWave = Math.sin(x * wave.frequency + wave.offset + time * wave.speed) * wave.amplitude;
        const subWave = Math.sin(x * wave.frequency * 2.3 + wave.offset * 0.5 - time * wave.speed * 1.4) * (wave.amplitude * 0.35);
        const microWave = Math.cos(x * wave.frequency * 4.1 + time * wave.speed * 2.2) * (wave.amplitude * 0.1);
        
        const y = wave.y + mainWave + subWave + microWave;
        if (x === 0) {
          ctx.lineTo(0, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.lineTo(canvas.offsetWidth, canvas.offsetHeight);
      ctx.closePath();

      // Premium liquid gold gradient stops
      const gradient = ctx.createLinearGradient(0, wave.y - wave.amplitude * 1.5, 0, canvas.offsetHeight);
      gradient.addColorStop(0, `rgba(255, 223, 0, ${wave.opacity * 1.8})`); // spec highlight
      gradient.addColorStop(0.2, `rgba(218, 165, 32, ${wave.opacity})`);  // rich gold
      gradient.addColorStop(0.7, `rgba(139, 90, 0, ${wave.opacity * 0.3})`); // deep amber
      gradient.addColorStop(1, 'rgba(26, 20, 16, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fill();
    });
  }

  function drawParticles(time) {
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += p.pulseSpeed;

      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const mouseInfluence = dist < 150 ? (150 - dist) / 150 : 0;

      const currentOpacity = p.opacity + Math.sin(p.pulse) * 0.15 + mouseInfluence * 0.3;
      const currentSize = p.size + mouseInfluence * 2;

      ctx.beginPath();
      ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(218, 165, 32, ${Math.min(currentOpacity, 0.8)})`;
      ctx.fill();

      if (mouseInfluence > 0) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize + 8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(218, 165, 32, ${mouseInfluence * 0.1})`;
        ctx.fill();
      }

      if (p.x < -10) p.x = canvas.offsetWidth + 10;
      if (p.x > canvas.offsetWidth + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.offsetHeight + 10;
      if (p.y > canvas.offsetHeight + 10) p.y = -10;
    });
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(218, 165, 32, ${(1 - dist / 100) * 0.08})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate(time) {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    drawWaves(time);
    drawConnections();
    drawParticles(time);
    animationId = requestAnimationFrame(animate);
  }

  resize();
  animate(0);

  canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', function() {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  canvas.addEventListener('touchmove', function(e) {
    if (e.touches.length === 1) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
    }
  }, { passive: true });

  canvas.addEventListener('touchend', function() {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  window.addEventListener('resize', function() {
    cancelAnimationFrame(animationId);
    resize();
    animate(0);
  });
}

// ============ Order Form ============
function initOrderForm() {
  const orderForm = document.getElementById('orderForm');
  const packSelect = document.getElementById('packSize');
  const paymentMethod = document.querySelectorAll('input[name="paymentMethod"]');

  if (!orderForm) return;

  // Update order summary when pack or payment changes
  if (packSelect) {
    packSelect.addEventListener('change', updateOrderSummary);
  }

  paymentMethod.forEach(radio => {
    radio.addEventListener('change', updateOrderSummary);
  });

  // Form submission
  orderForm.addEventListener('submit', function(e) {
    e.preventDefault();
    handleOrderSubmit();
  });

  // Initialize order summary
  updateOrderSummary();
}

function updateOrderSummary() {
  const packSelect = document.getElementById('packSize');
  const quantityInput = document.getElementById('quantity');
  const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');

  if (!packSelect) return;

  // Get selected pack
  const selectedOption = packSelect.options[packSelect.selectedIndex];
  const price = parseFloat(selectedOption.dataset.price) || 0;
  const codExtra = selectedOption.dataset.cod === 'true';
  const size = selectedOption.value;

  // Get quantity
  const quantity = parseInt(quantityInput?.value) || 1;

  // Get payment method
  let paymentMethod = 'prepaid';
  paymentRadios.forEach(radio => {
    if (radio.checked) {
      paymentMethod = radio.value;
    }
  });

  // Calculate totals
  const itemCost = price * quantity;
  let codCharge = 0;

  if (paymentMethod === 'cod' && codExtra) {
    codCharge = 60;
  }

  const total = itemCost + codCharge;

  // Update UI
  const itemCostEl = document.getElementById('summaryItemCost');
  const codRow = document.getElementById('summaryCODRow');
  const codEl = document.getElementById('summaryCOD');
  const totalEl = document.getElementById('summaryTotal');

  if (itemCostEl) itemCostEl.textContent = formatCurrency(itemCost);
  if (codRow) codRow.style.display = codCharge > 0 ? 'flex' : 'none';
  if (codEl) {
    codEl.textContent = codCharge > 0 ? `+${formatCurrency(codCharge)}` : '₹0';
  }
  if (totalEl) totalEl.textContent = formatCurrency(total);
}

function handleOrderSubmit() {
  const name = document.getElementById('customerName')?.value.trim();
  const phone = document.getElementById('customerPhone')?.value.trim();
  const addrLine1 = document.getElementById('addrLine1')?.value.trim();
  const addrLine2 = document.getElementById('addrLine2')?.value.trim();
  const addrLandmark = document.getElementById('addrLandmark')?.value.trim();
  const addrPincode = document.getElementById('addrPincode')?.value.trim();
  const addrCity = document.getElementById('addrCity')?.value.trim();
  const addrState = document.getElementById('addrState')?.value;
  const packSelect = document.getElementById('packSize');
  const quantity = document.getElementById('quantity')?.value || '1';

  // Validation
  const required = [
    { val: name, label: 'Full Name' },
    { val: phone, label: 'WhatsApp Number' },
    { val: addrLine1, label: 'Address Line 1' },
    { val: addrLine2, label: 'Address Line 2' },
    { val: addrPincode, label: 'Pincode' },
    { val: addrCity, label: 'City' },
    { val: addrState, label: 'State' },
  ];

  const missing = required.filter(f => !f.val).map(f => f.label);
  if (missing.length > 0) {
    alert('Please fill in all required fields:\n• ' + missing.join('\n• '));
    return;
  }

  if (!/^[0-9]{6}$/.test(addrPincode)) {
    alert('Please enter a valid 6-digit pincode.');
    return;
  }

  if (!packSelect) return;

  const selectedOption = packSelect.options[packSelect.selectedIndex];
  const packSize = selectedOption.value;
  const price = selectedOption.dataset.price;

  // Build full address
  let fullAddress = `${addrLine1}, ${addrLine2}`;
  if (addrLandmark) fullAddress += `, Landmark: ${addrLandmark}`;
  fullAddress += `, ${addrCity}, ${addrState} - ${addrPincode}`;

  // Get payment method
  const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
  let paymentMethod = 'Prepaid (UPI/Transfer)';
  paymentRadios.forEach(radio => {
    if (radio.checked && radio.value === 'cod') {
      paymentMethod = 'Cash on Delivery';
    }
  });

  // Get order summary values
  const summaryTotal = document.getElementById('summaryTotal')?.textContent || '';

  // Build WhatsApp message
  const message = `
🛒 *NEW ORDER - Pobitra Ghee*

*Customer Details:*
Name: ${name}
Phone: ${phone}

*Delivery Address:*
${fullAddress}

*Order Details:*
Product: Pobitra Ghee (${packSize})
Quantity: ${quantity}
Payment: ${paymentMethod}
Total: ${summaryTotal}

Thank you for your order! 🙏
  `.trim();

  // Get WhatsApp number from settings (or use default)
  const settings = SettingsStore.getAll();
  const whatsappNumber = settings.whatsapp || '+919339493294';

  // Open WhatsApp
  const whatsappUrl = generateWhatsAppUrl(whatsappNumber, message);
  window.open(whatsappUrl, '_blank');

  // Show success message
  showOrderSuccess();
}

function showOrderSuccess() {
  const form = document.getElementById('orderForm');
  const successDiv = document.getElementById('orderSuccess');

  if (form) form.style.display = 'none';
  if (successDiv) successDiv.style.display = 'block';
}

// ============ Review Form ============
function initReviewForm() {
  const reviewForm = document.getElementById('submitReviewForm');
  if (!reviewForm) return;

  // Star rating interaction
  const starInputs = document.querySelectorAll('.star-rating__input');
  const starLabels = document.querySelectorAll('.star-rating label');

  starInputs.forEach(input => {
    input.addEventListener('change', function() {
      const rating = parseInt(this.value);

      // Update visual state for all stars
      starLabels.forEach(label => {
        const labelInput = label.querySelector('.star-rating__input');
        const starSvg = label.querySelector('.star-rating__star');
        const labelValue = parseInt(labelInput.value);

        if (labelValue <= rating) {
          starSvg.classList.add('filled');
          label.classList.add('selected');
        } else {
          starSvg.classList.remove('filled');
          label.classList.remove('selected');
        }
      });
    });
  });

  reviewForm.addEventListener('submit', function(e) {
    e.preventDefault();
    handleReviewSubmit();
  });
}

function handleReviewSubmit() {
  const name = document.getElementById('reviewerName')?.value.trim();
  const ratingInput = document.querySelector('.star-rating__input:checked');
  const rating = ratingInput ? parseInt(ratingInput.value) : 0;
  const comment = document.getElementById('reviewComment')?.value.trim();

  if (!name || !rating || !comment) {
    alert('Please fill in all fields and select a rating.');
    return;
  }

  // Save review to pending
  ReviewStore.add({
    name: name,
    rating: rating,
    comment: comment,
    image: ''
  });

  // Show thank you message
  const form = document.getElementById('submitReviewForm');
  const container = document.querySelector('.review-form__card');
  
  if (container) {
    container.innerHTML = `
      <div class="thank-you" style="text-align: center; padding: var(--space-12) var(--space-6);">
        <div style="font-size: 64px; margin-bottom: var(--space-6);">🙏</div>
        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: var(--text-3xl); font-weight: 700; margin-bottom: var(--space-4); color: var(--cream-100);">Thank You!</h3>
        <p style="color: var(--cream-400); font-size: var(--text-lg); line-height: 1.6;">Your review has been submitted successfully. It will appear on our website after approval.</p>
      </div>
    `;
  }
}

// ============ Load Approved Reviews ============
function loadApprovedReviews() {
  const reviewsGrid = document.querySelector('.reviews__grid');
  if (!reviewsGrid) return;

  const approvedReviews = ReviewStore.getApproved();

  if (approvedReviews.length === 0) {
    reviewsGrid.innerHTML = '<p class="no-reviews" style="text-align: center; grid-column: 1/-1; color: var(--stone-600); font-size: var(--text-lg);">No reviews yet. Be the first to share your experience!</p>';
    return;
  }

  reviewsGrid.innerHTML = approvedReviews.map(review => `
    <article class="review-card animate-on-scroll" role="listitem">
      <div class="review-card__header">
        <span class="review-card__author">${escapeHtml(review.name)}</span>
        <span class="review-card__badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Verified Buyer
        </span>
      </div>
      <div class="review-card__stars" aria-label="${review.rating} out of 5 stars" role="img">
        ${generateStars(review.rating)}
      </div>
      <p class="review-card__text">"${escapeHtml(review.comment)}"</p>
    </article>
  `).join('');

  // Reinitialize scroll animations for new elements
  setTimeout(() => initScrollAnimations(), 100);
}

// ============ Load Settings ============
function loadSettings() {
  try {
    const settings = SettingsStore.getAll();

    // Update contact info in footer
    const contactItems = document.querySelectorAll('.footer__contact-text');
    if (contactItems.length >= 3) {
      if (settings.phone) {
        contactItems[0].textContent = settings.phone;
        const phoneLink = contactItems[0].closest('a');
        if (phoneLink) phoneLink.href = 'tel:' + settings.phone.replace(/\s/g, '');
      }
      if (settings.email) {
        contactItems[1].textContent = settings.email;
        const emailLink = contactItems[1].closest('a');
        if (emailLink) emailLink.href = 'mailto:' + settings.email;
      }
      if (settings.address) contactItems[2].textContent = settings.address;
    }
  } catch (e) {
    console.warn('Settings not yet initialized');
  }
}

// ============ Back to Top Button ============
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', throttle(function() {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, 100));

  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============ Utility Functions ============
function formatCurrency(amount) {
  return '\u20B9' + amount.toLocaleString('en-IN');
}

function generateStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += '<svg class="star filled" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
    } else {
      stars += '<svg class="star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
    }
  }
  return stars;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function generateWhatsAppUrl(phone, message) {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  toast.style.cssText = `position: fixed; bottom: 24px; right: 24px; padding: 16px 24px; border-radius: 8px; color: white; z-index: 1000; transform: translateY(100px); transition: transform 0.3s ease;`;

  if (type === 'success') toast.style.background = 'var(--success, #10b981)';
  if (type === 'error') toast.style.background = 'var(--error, #ef4444)';

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.transform = 'translateY(100px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============ Product Selection ============
function selectPack(packSize, price) {
  const packSelect = document.getElementById('packSize');
  if (packSelect) {
    packSelect.value = packSize;
    updateOrderSummary();
  }

  // Scroll to order form
  const orderForm = document.getElementById('order');
  if (orderForm) {
    orderForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ============ Scroll to Review Form ============
function scrollToReview() {
  const reviewForm = document.getElementById('reviews');
  if (reviewForm) {
    reviewForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ============ Magnetic Buttons Interaction ============
function initMagneticButtons() {
  if (window.innerWidth < 992) return; // Disable on mobile/tablet viewports
  const magneticBtns = document.querySelectorAll('.hero__cta, .hero__cta-secondary, .btn--primary');

  document.addEventListener('mousemove', function(e) {
    if (window.innerWidth < 992) return;
    magneticBtns.forEach(btn => {
      const rect = btn.getBoundingClientRect();
      const btnX = rect.left + rect.width / 2;
      const btnY = rect.top + rect.height / 2;

      const distX = e.clientX - btnX;
      const distY = e.clientY - btnY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < 80) {
        const pull = (80 - distance) / 80;
        const targetX = distX * pull * 0.35;
        const targetY = distY * pull * 0.35;

        btn.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
        btn.style.transition = 'transform 0.1s ease-out';
      } else {
        btn.style.transform = 'translate3d(0, 0, 0)';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
      }
    });
  });
}

// ============ Export global functions ============
window.selectPack = selectPack;
window.scrollToReview = scrollToReview;
window.formatCurrency = formatCurrency;
