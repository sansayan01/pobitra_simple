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
  initCardQuantityButtons();
  initMobileMenu();
  initSmoothScroll();
  initBackToTop();
  initStickyCta();
  initScrollDots();
  initHeroCounter();
  initHeroScrollIndicator();
  initJarInteraction();
  initHeroMotionGraphics();
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
  const badges = document.querySelectorAll('.hero-badge');
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

// ============ Card Quantity Buttons ============
function initCardQuantityButtons() {
  const cards = document.querySelectorAll('.product-card');

  cards.forEach(card => {
    const decBtn = card.querySelector('.card-qty__btn--dec');
    const incBtn = card.querySelector('.card-qty__btn--inc');
    const valueEl = card.querySelector('.card-qty__value');
    const selectBtn = card.querySelector('.card-select-btn');

    if (!decBtn || !incBtn || !valueEl) return;

    let qty = 1;

    decBtn.addEventListener('click', function() {
      if (qty > 1) {
        qty--;
        valueEl.textContent = qty;
        decBtn.disabled = qty <= 1;
      }
    });

    incBtn.addEventListener('click', function() {
      if (qty < 10) {
        qty++;
        valueEl.textContent = qty;
        decBtn.disabled = false;
      }
    });

    decBtn.disabled = true;

    if (selectBtn) {
      selectBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const pack = card.dataset.pack;
        const price = card.dataset.price;
        selectPackWithQty(pack, price, qty);
      });
    }
  });
}

function selectPackWithQty(packSize, price, qty) {
  const packSelect = document.getElementById('packSize');
  const quantityInput = document.getElementById('quantity');

  if (packSelect) {
    packSelect.value = packSize;
    updateOrderSummary();
  }

  if (quantityInput) {
    quantityInput.value = qty;
    updateOrderSummary();
  }

  const orderForm = document.getElementById('order');
  if (orderForm) {
    orderForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

// ============ Scroll Dots Indicator ============
function initScrollDots() {
  const grid = document.querySelector('.products__grid');
  const dots = document.querySelectorAll('.products__scroll-dot');
  const cards = document.querySelectorAll('.product-card');

  if (!grid || dots.length === 0 || cards.length === 0) return;

  grid.addEventListener('scroll', throttle(function() {
    const scrollLeft = grid.scrollLeft;
    const cardWidth = cards[0].offsetWidth + 16;
    const activeIndex = Math.round(scrollLeft / cardWidth);

    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === activeIndex);
    });
  }, 50));

  dots.forEach((dot, i) => {
    dot.addEventListener('click', function() {
      const cardWidth = cards[0].offsetWidth + 16;
      grid.scrollTo({
        left: cardWidth * i,
        behavior: 'smooth'
      });
    });
  });
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

  if (!container || !scene) return;

  const maxTilt = 20;
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;

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

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  scene.addEventListener('mousemove', function(e) {
    updateTilt(e.clientX, e.clientY);
  });

  scene.addEventListener('mouseleave', resetTilt);

  scene.addEventListener('touchmove', function(e) {
    if (e.touches.length === 1) {
      e.preventDefault();
      updateTilt(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: false });

  scene.addEventListener('touchend', resetTilt);
}

// ============ Utility: Clamp ============
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// ============ Hero Motion Graphics (Canvas) ============
function initHeroMotionGraphics() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

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
        y: canvas.offsetHeight * (0.6 + i * 0.15),
        amplitude: 20 + i * 10,
        frequency: 0.003 + i * 0.001,
        speed: 0.008 + i * 0.003,
        offset: Math.random() * Math.PI * 2,
        opacity: 0.03 + i * 0.02
      });
    }
  }

  function drawWaves(time) {
    waves.forEach(wave => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.offsetHeight);

      for (let x = 0; x <= canvas.offsetWidth; x += 2) {
        const y = wave.y + Math.sin(x * wave.frequency + wave.offset + time * wave.speed) * wave.amplitude;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(canvas.offsetWidth, canvas.offsetHeight);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, wave.y - wave.amplitude, 0, canvas.offsetHeight);
      gradient.addColorStop(0, `rgba(218, 165, 32, ${wave.opacity})`);
      gradient.addColorStop(1, 'rgba(218, 165, 32, 0)');
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
  const address = document.getElementById('customerAddress')?.value.trim();
  const packSelect = document.getElementById('packSize');
  const quantity = document.getElementById('quantity')?.value || '1';

  // Validation
  if (!name || !phone || !address) {
    alert('Please fill in all required fields.');
    return;
  }

  if (!packSelect) return;

  const selectedOption = packSelect.options[packSelect.selectedIndex];
  const packSize = selectedOption.value;
  const price = selectedOption.dataset.price;

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
Address: ${address}

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

// ============ Export global functions ============
window.selectPack = selectPack;
window.scrollToReview = scrollToReview;
window.formatCurrency = formatCurrency;
