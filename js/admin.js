/**
 * Pobitra Ghee - Admin Dashboard JavaScript
 * Handles all admin functionality including navigation, CRUD operations, and authentication
 */

// ============ Variables ============
let currentPage = 'dashboard';
let currentReviewFilter = 'all';

// ============ Initialization ============
document.addEventListener('DOMContentLoaded', function() {
  checkAuthStatus();
  setupEventListeners();
  setupDropZone();
});

// ============ Authentication ============
function checkAuthStatus() {
  if (AuthStore.isLoggedIn()) {
    showDashboard();
  } else {
    showLoginPage();
  }
}

function showLoginPage() {
  document.getElementById('loginPage').style.display = 'flex';
  document.getElementById('adminDashboard').style.display = 'none';
}

function showDashboard() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('adminDashboard').style.display = 'grid';
  updateStats();
  updateRecentReviews();
}

// ============ Event Listeners ============
function setupEventListeners() {
  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  // Navigation
  const navItems = document.querySelectorAll('.sidebar__nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const page = this.dataset.page;
      if (page) {
        navigateTo(page);
      }
    });
  });

  // Add Product button
  const addProductBtn = document.getElementById('addProductBtn');
  if (addProductBtn) {
    addProductBtn.addEventListener('click', function() {
      openProductModal();
    });
  }

  // Save Product button
  const saveProductBtn = document.getElementById('saveProductBtn');
  if (saveProductBtn) {
    saveProductBtn.addEventListener('click', handleSaveProduct);
  }

  // Add Pricing button
  const addPricingBtn = document.getElementById('addPricingBtn');
  if (addPricingBtn) {
    addPricingBtn.addEventListener('click', function() {
      openPricingModal();
    });
  }

  // Save Pricing button
  const savePricingBtn = document.getElementById('savePricingBtn');
  if (savePricingBtn) {
    savePricingBtn.addEventListener('click', handleSavePricing);
  }

  // Review filter tabs
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      currentReviewFilter = this.dataset.filter;
      updateReviewsTable();
    });
  });

  // Settings form
  const settingsForm = document.getElementById('settingsForm');
  if (settingsForm) {
    settingsForm.addEventListener('submit', handleSaveSettings);
  }

  // COD extra checkbox
  const codExtra = document.getElementById('codExtra');
  if (codExtra) {
    codExtra.addEventListener('change', function() {
      document.getElementById('codAmountGroup').style.display = this.checked ? 'block' : 'none';
    });
  }
}

// ============ Navigation ============
function navigateTo(page) {
  currentPage = page;

  // Update sidebar active state
  document.querySelectorAll('.sidebar__nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.page === page) {
      item.classList.add('active');
    }
  });

  // Hide all content sections
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });

  // Show selected content section
  const targetSection = document.getElementById('page--' + page);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Update page title
  const pageTitles = {
    'dashboard': 'Dashboard',
    'products': 'Products',
    'pricing': 'Pricing',
    'reviews': 'Reviews',
    'media': 'Media Library',
    'settings': 'Settings'
  };
  document.getElementById('pageTitle').textContent = pageTitles[page] || 'Dashboard';

  // Load page-specific data
  loadPageData(page);
}

function loadPageData(page) {
  switch (page) {
    case 'dashboard':
      updateStats();
      updateRecentReviews();
      break;
    case 'products':
      updateProductsTable();
      break;
    case 'pricing':
      updatePricingTable();
      break;
    case 'reviews':
      updateReviewsTable();
      break;
    case 'media':
      updateMediaGrid();
      break;
    case 'settings':
      loadSettings();
      break;
  }
}

// ============ Login / Logout ============
function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('loginError');

  if (AuthStore.login(username, password)) {
    errorMessage.style.display = 'none';
    showDashboard();
    // Check if default password needs changing
    if (AuthStore.checkDefaultPassword()) {
      // Could show a toast or banner here
      console.log('Default password detected - please change it');
    }
  } else {
    errorMessage.style.display = 'block';
  }
}

function handleLogout() {
  AuthStore.logout();
  showLoginPage();
}

// ============ Dashboard Stats ============
function updateStats() {
  const stats = Stats.get();
  document.getElementById('statProducts').textContent = stats.totalProducts;
  document.getElementById('statTotalReviews').textContent = stats.totalReviews;
  document.getElementById('statApproved').textContent = stats.approvedReviews;
  document.getElementById('statPending').textContent = stats.pendingReviews;
}

function updateRecentReviews() {
  const reviews = ReviewStore.getAll();
  const recent = reviews.slice(-5).reverse(); // Get last 5, most recent first
  const tbody = document.getElementById('recentReviewsTable');

  if (recent.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--admin-text-muted);">No reviews yet</td></tr>';
    return;
  }

  tbody.innerHTML = recent.map(review => `
    <tr>
      <td>${escapeHtml(review.name)}</td>
      <td>${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</td>
      <td>${escapeHtml(review.comment.substring(0, 50))}...</td>
      <td><span class="badge badge--${review.approved ? 'approved' : 'pending'}">${review.approved ? 'Approved' : 'Pending'}</span></td>
      <td>
        ${!review.approved ? `<button class="btn btn--sm btn--success" onclick="approveReview('${review.id}')">Approve</button>` : ''}
        <button class="btn btn--sm btn--danger" onclick="deleteReview('${review.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

// ============ Products ============
function updateProductsTable() {
  const products = ProductStore.getAll();
  const tbody = document.getElementById('productsTable');

  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--admin-text-muted);">No products yet</td></tr>';
    return;
  }

  tbody.innerHTML = products.map(product => `
    <tr>
      <td>${escapeHtml(product.name)} ${product.popular ? '<span class="badge badge--approved">Most Popular</span>' : ''}</td>
      <td>${escapeHtml(product.weight || product.size || 'N/A')}</td>
      <td>₹${product.price}</td>
      <td>${product.popular ? 'Yes' : 'No'}</td>
      <td>
        <button class="btn btn--sm btn--secondary" onclick="editProduct('${product.id}')">Edit</button>
        <button class="btn btn--sm btn--danger" onclick="deleteProduct('${product.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function openProductModal(product = null) {
  const modal = document.getElementById('productModal');
  const title = document.getElementById('productModalTitle');

  if (product) {
    title.textContent = 'Edit Product';
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name || '';
    document.getElementById('productWeight').value = product.weight || product.size || '';
    document.getElementById('productPrice').value = product.price || '';
    document.getElementById('productDesc').value = product.description || '';
    document.getElementById('productImage').value = product.image || '';
    document.getElementById('productVideo').value = product.video || '';
    document.getElementById('productPopular').checked = product.popular || false;
  } else {
    title.textContent = 'Add Product';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
  }

  modal.classList.add('active');
}

function handleSaveProduct() {
  const id = document.getElementById('productId').value;
  const productData = {
    name: document.getElementById('productName').value,
    weight: document.getElementById('productWeight').value,
    price: parseFloat(document.getElementById('productPrice').value) || 0,
    description: document.getElementById('productDesc').value,
    image: document.getElementById('productImage').value || '',
    video: document.getElementById('productVideo').value || '',
    popular: document.getElementById('productPopular').checked
  };

  if (id) {
    ProductStore.update(id, productData);
  } else {
    ProductStore.add(productData);
  }

  closeModal('productModal');
  updateProductsTable();
  updateStats();
}

function editProduct(id) {
  const product = ProductStore.getById(id);
  if (product) {
    openProductModal(product);
  }
}

function deleteProduct(id) {
  if (confirm('Are you sure you want to delete this product?')) {
    ProductStore.delete(id);
    updateProductsTable();
    updateStats();
  }
}

// ============ Pricing ============
function updatePricingTable() {
  const pricing = PricingStore.getAll();
  const tbody = document.getElementById('pricingTable');

  if (pricing.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--admin-text-muted);">No pricing tiers yet</td></tr>';
    return;
  }

  tbody.innerHTML = pricing.map(tier => `
    <tr>
      <td>${escapeHtml(tier.size)}</td>
      <td>₹${tier.price}</td>
      <td>₹${tier.deliveryCharge || 0}</td>
      <td>${tier.codExtra ? '₹' + (tier.codAmount || 60) : 'No'}</td>
      <td>
        <button class="btn btn--sm btn--secondary" onclick="editPricing('${tier.id}')">Edit</button>
        <button class="btn btn--sm btn--danger" onclick="deletePricing('${tier.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function openPricingModal(tier = null) {
  const modal = document.getElementById('pricingModal');
  const title = document.getElementById('pricingModalTitle');

  if (tier) {
    title.textContent = 'Edit Pricing Tier';
    document.getElementById('pricingId').value = tier.id;
    document.getElementById('packSize').value = tier.size || '';
    document.getElementById('packPrice').value = tier.price || '';
    document.getElementById('deliveryCharge').value = tier.deliveryCharge || 0;
    document.getElementById('codExtra').checked = tier.codExtra || false;
    document.getElementById('codAmount').value = tier.codAmount || 60;
    document.getElementById('codAmountGroup').style.display = tier.codExtra ? 'block' : 'none';
  } else {
    title.textContent = 'Add Pricing Tier';
    document.getElementById('pricingForm').reset();
    document.getElementById('pricingId').value = '';
    document.getElementById('codAmountGroup').style.display = 'none';
  }

  modal.classList.add('active');
}

function handleSavePricing() {
  const id = document.getElementById('pricingId').value;
  const pricingData = {
    size: document.getElementById('packSize').value,
    price: parseFloat(document.getElementById('packPrice').value) || 0,
    deliveryCharge: parseFloat(document.getElementById('deliveryCharge').value) || 0,
    codExtra: document.getElementById('codExtra').checked,
    codAmount: parseFloat(document.getElementById('codAmount').value) || 0
  };

  if (id) {
    PricingStore.update(id, pricingData);
  } else {
    PricingStore.add(pricingData);
  }

  closeModal('pricingModal');
  updatePricingTable();
}

function editPricing(id) {
  const tier = PricingStore.getAll().find(p => p.id === id);
  if (tier) {
    openPricingModal(tier);
  }
}

function deletePricing(id) {
  if (confirm('Are you sure you want to delete this pricing tier?')) {
    PricingStore.delete(id);
    updatePricingTable();
  }
}

// ============ Reviews ============
function updateReviewsTable() {
  const allReviews = ReviewStore.getAll();
  let reviews;

  switch (currentReviewFilter) {
    case 'approved':
      reviews = ReviewStore.getApproved();
      break;
    case 'pending':
      reviews = ReviewStore.getPending();
      break;
    default:
      reviews = allReviews;
  }

  const tbody = document.getElementById('reviewsTable');
  if (reviews.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--admin-text-muted);">No reviews found</td></tr>';
    return;
  }

  tbody.innerHTML = reviews.map(review => `
    <tr>
      <td>${escapeHtml(review.name)}</td>
      <td>${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</td>
      <td>${escapeHtml(review.comment.substring(0, 100))}...</td>
      <td>${formatDate(review.date)}</td>
      <td><span class="badge badge--${review.approved ? 'approved' : 'pending'}">${review.approved ? 'Approved' : 'Pending'}</span></td>
      <td>
        ${!review.approved ? `<button class="btn btn--sm btn--success" onclick="approveReview('${review.id}')">Approve</button>` : ''}
        <button class="btn btn--sm btn--danger" onclick="deleteReview('${review.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function approveReview(id) {
  ReviewStore.approve(id);
  updateReviewsTable();
  updateRecentReviews();
  updateStats();
}

function deleteReview(id) {
  if (confirm('Are you sure you want to delete this review?')) {
    ReviewStore.delete(id);
    updateReviewsTable();
    updateRecentReviews();
    updateStats();
  }
}

// ============ Media ============
function setupDropZone() {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');

  if (!dropZone || !fileInput) return;

  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--admin-gold)';
  });
  dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = 'var(--admin-border)';
  });
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--admin-border)';
    handleFiles(e.dataTransfer.files);
  });
  fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
  });
}

function handleFiles(files) {
  Array.from(files).forEach(file => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please upload JPG, PNG, WebP, MP4, or MOV files.');
      return;
    }

    // Check file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      alert('File too large. Maximum size is 50MB.');
      return;
    }

    // Convert to base64 and store
    fileToBase64(file).then(base64 => {
      MediaStore.add({
        name: file.name,
        type: file.type,
        size: file.size,
        data: base64
      });
      updateMediaGrid();
    });
  });
}

function updateMediaGrid() {
  const media = MediaStore.getAll();
  const grid = document.getElementById('mediaGrid');

  if (media.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--admin-text-muted);">No media uploaded yet</p>';
    return;
  }

  grid.innerHTML = media.map(item => {
    const isImage = item.type.startsWith('image/');
    return `
      <div style="background: var(--admin-bg-card); border: 1px solid var(--admin-border); border-radius: 8px; overflow: hidden;">
        ${isImage ? `<img src="${item.data}" style="width: 100%; height: 160px; object-fit: cover;">` : `<div style="width: 100%; height: 160px; display: flex; align-items: center; justify-content: center; font-size: 48px;">🎬</div>`}
        <div style="padding: 12px;">
          <p style="font-size: 0.875rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(item.name)}</p>
          <button class="btn btn--sm btn--danger" style="margin-top: 8px; width: 100%;" onclick="deleteMedia('${item.id}')">Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

function deleteMedia(id) {
  if (confirm('Are you sure you want to delete this media?')) {
    MediaStore.delete(id);
    updateMediaGrid();
  }
}

// ============ Settings ============
function loadSettings() {
  const settings = SettingsStore.getAll();
  document.getElementById('siteName').value = settings.siteName || '';
  document.getElementById('tagline').value = settings.tagline || '';
  document.getElementById('phone').value = settings.phone || '';
  document.getElementById('whatsapp').value = settings.whatsapp || '';
  document.getElementById('email').value = settings.email || '';
  document.getElementById('address').value = settings.address || '';
  document.getElementById('aboutUs').value = settings.aboutUs || '';
}

function handleSaveSettings(e) {
  e.preventDefault();
  const settingsData = {
    siteName: document.getElementById('siteName').value,
    tagline: document.getElementById('tagline').value,
    phone: document.getElementById('phone').value,
    whatsapp: document.getElementById('whatsapp').value,
    email: document.getElementById('email').value,
    address: document.getElementById('address').value,
    aboutUs: document.getElementById('aboutUs').value
  };

  SettingsStore.update(settingsData);
  alert('Settings saved successfully!');
}

// ============ Modal Utilities ============
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// ============ Export for global access ============
window.navigateTo = navigateTo;
window.openProductModal = openProductModal;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.openPricingModal = openPricingModal;
window.editPricing = editPricing;
window.deletePricing = deletePricing;
window.approveReview = approveReview;
window.deleteReview = deleteReview;
window.deleteMedia = deleteMedia;
window.closeModal = closeModal;
