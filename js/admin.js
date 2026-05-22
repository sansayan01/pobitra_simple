/**
 * Pobitra Ghee - Admin Dashboard JavaScript
 * Supabase-backed admin panel with async data operations
 */

// ============ Variables ============
let currentPage = 'dashboard';
let currentReviewFilter = 'all';
let currentOrderFilter = 'all';

// ============ Initialization ============
document.addEventListener('DOMContentLoaded', async function() {
  await checkAuthStatus();
  setupEventListeners();
  setupDropZone();
});

// ============ Toast Notifications ============
function toast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'toast-admin toast-admin--' + type;
  el.innerHTML = '<span>' + escapeHtml(message) + '</span><button onclick="this.parentElement.remove()">&times;</button>';
  container.appendChild(el);
  requestAnimationFrame(function() { el.classList.add('show'); });
  setTimeout(function() {
    el.classList.remove('show');
    setTimeout(function() { el.remove(); }, 300);
  }, 4000);
}

// ============ Loading Helpers ============
function showLoading(tableId) {
  var tbody = document.getElementById(tableId);
  if (tbody) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:32px;color:var(--admin-text-muted)"><div class="spinner"></div> Loading...</td></tr>';
  }
}

// ============ Authentication ============
async function checkAuthStatus() {
  if (await AuthStore.isLoggedIn()) {
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
  updateRecentOrders();
}

// ============ Event Listeners ============
function setupEventListeners() {
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);

  document.querySelectorAll('.sidebar__nav-item').forEach(function(item) {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      var page = this.dataset.page;
      if (page) navigateTo(page);
    });
  });

  document.getElementById('addProductBtn').addEventListener('click', function() { openProductModal(); });
  document.getElementById('saveProductBtn').addEventListener('click', handleSaveProduct);
  document.getElementById('addPricingBtn').addEventListener('click', function() { openPricingModal(); });
  document.getElementById('savePricingBtn').addEventListener('click', handleSavePricing);

  document.querySelectorAll('.tab[data-filter]').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.tab[data-filter]').forEach(function(t) { t.classList.remove('active'); });
      this.classList.add('active');
      currentReviewFilter = this.dataset.filter;
      updateReviewsTable();
    });
  });

  document.querySelectorAll('.tab[data-order-filter]').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.tab[data-order-filter]').forEach(function(t) { t.classList.remove('active'); });
      this.classList.add('active');
      currentOrderFilter = this.dataset.orderFilter;
      updateOrdersTable();
    });
  });

  document.getElementById('settingsForm').addEventListener('submit', handleSaveSettings);

  document.getElementById('codExtra').addEventListener('change', function() {
    document.getElementById('codAmountGroup').style.display = this.checked ? 'block' : 'none';
  });
}

// ============ Navigation ============
function navigateTo(page) {
  currentPage = page;

  document.querySelectorAll('.sidebar__nav-item').forEach(function(item) {
    item.classList.toggle('active', item.dataset.page === page);
  });

  document.querySelectorAll('.content-section').forEach(function(section) {
    section.classList.remove('active');
  });

  var target = document.getElementById('page--' + page);
  if (target) target.classList.add('active');

  var titles = {
    dashboard: 'Dashboard', orders: 'Orders', products: 'Products',
    pricing: 'Pricing', reviews: 'Reviews', media: 'Media Library', settings: 'Settings'
  };
  document.getElementById('pageTitle').textContent = titles[page] || 'Dashboard';

  loadPageData(page);
}

function loadPageData(page) {
  switch (page) {
    case 'dashboard': updateStats(); updateRecentOrders(); break;
    case 'orders': updateOrdersTable(); break;
    case 'products': updateProductsTable(); break;
    case 'pricing': updatePricingTable(); break;
    case 'reviews': updateReviewsTable(); break;
    case 'media': updateMediaGrid(); break;
    case 'settings': loadSettings(); break;
  }
}

// ============ Login / Logout ============
async function handleLogin(e) {
  e.preventDefault();
  var email = document.getElementById('loginEmail').value;
  var password = document.getElementById('loginPassword').value;
  var errorMessage = document.getElementById('loginError');

  var result = await AuthStore.login(email, password);
  if (result.error) {
    errorMessage.textContent = result.error;
    errorMessage.style.display = 'block';
  } else {
    errorMessage.style.display = 'none';
    showDashboard();
    toast('Welcome back!');
  }
}

async function handleLogout() {
  await AuthStore.logout();
  showLoginPage();
}

// ============ Dashboard Stats ============
async function updateStats() {
  var stats = await Stats.get();
  document.getElementById('statProducts').textContent = stats.totalProducts;
  document.getElementById('statOrders').textContent = stats.totalOrders;
  document.getElementById('statRevenue').textContent = '\u20B9' + stats.totalRevenue.toLocaleString('en-IN');
  document.getElementById('statTotalReviews').textContent = stats.totalReviews;
}

// ============ Recent Orders (Dashboard) ============
async function updateRecentOrders() {
  var orders = await OrderStore.getAll();
  var recent = orders.slice(0, 5);
  var tbody = document.getElementById('recentOrdersTable');

  if (recent.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--admin-text-muted);">No orders yet</td></tr>';
    return;
  }

  tbody.innerHTML = recent.map(function(order) {
    return '<tr>' +
      '<td>#' + (order.order_number || order.id.slice(0, 8)) + '</td>' +
      '<td>' + escapeHtml(order.customer_name) + '</td>' +
      '<td>' + (order.items || []).length + ' item(s)</td>' +
      '<td>\u20B9' + parseFloat(order.total).toLocaleString('en-IN') + '</td>' +
      '<td><span class="badge badge--' + order.status + '">' + capitalize(order.status) + '</span></td>' +
      '<td>' + formatDate(order.created_at) + '</td>' +
    '</tr>';
  }).join('');
}

// ============ Orders ============
async function updateOrdersTable() {
  showLoading('ordersTable');
  var allOrders = await OrderStore.getAll();
  var orders;

  if (currentOrderFilter === 'all') {
    orders = allOrders;
  } else {
    orders = allOrders.filter(function(o) { return o.status === currentOrderFilter; });
  }

  var tbody = document.getElementById('ordersTable');
  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--admin-text-muted);">No orders found</td></tr>';
    return;
  }

  tbody.innerHTML = orders.map(function(order) {
    return '<tr>' +
      '<td>#' + (order.order_number || order.id.slice(0, 8)) + '</td>' +
      '<td>' + escapeHtml(order.customer_name) + '<br><small style="color:var(--admin-text-muted)">' + escapeHtml(order.customer_phone) + '</small></td>' +
      '<td>' + (order.items || []).map(function(i) { return escapeHtml(i.name || i.weight || '') + ' x' + (i.qty || 1); }).join(', ') + '</td>' +
      '<td>\u20B9' + parseFloat(order.total).toLocaleString('en-IN') + '</td>' +
      '<td><span class="badge badge--' + order.status + '">' + capitalize(order.status) + '</span></td>' +
      '<td>' + formatDate(order.created_at) + '</td>' +
      '<td><button class="btn btn--sm btn--secondary" onclick="viewOrder(\'' + order.id + '\')">View</button></td>' +
    '</tr>';
  }).join('');
}

async function viewOrder(id) {
  var order = await OrderStore.getById(id);
  if (!order) { toast('Order not found', 'error'); return; }

  var body = document.getElementById('orderModalBody');
  var address = order.address || {};
  var items = order.items || [];

  body.innerHTML =
    '<div style="display:grid;gap:20px;">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">' +
        '<div><label style="font-size:0.8rem;color:var(--admin-text-muted);">Order Number</label><p style="font-size:1.1rem;font-weight:600;">#' + (order.order_number || order.id.slice(0, 8)) + '</p></div>' +
        '<div><label style="font-size:0.8rem;color:var(--admin-text-muted);">Date</label><p>' + formatDate(order.created_at) + '</p></div>' +
        '<div><label style="font-size:0.8rem;color:var(--admin-text-muted);">Customer</label><p>' + escapeHtml(order.customer_name) + '</p></div>' +
        '<div><label style="font-size:0.8rem;color:var(--admin-text-muted);">Phone</label><p>' + escapeHtml(order.customer_phone) + '</p></div>' +
        '<div><label style="font-size:0.8rem;color:var(--admin-text-muted);">Payment</label><p>' + capitalize(order.payment_method || 'cod') + '</p></div>' +
        '<div><label style="font-size:0.8rem;color:var(--admin-text-muted);">Total</label><p style="font-size:1.1rem;font-weight:600;color:var(--admin-gold);">\u20B9' + parseFloat(order.total).toLocaleString('en-IN') + '</p></div>' +
      '</div>' +
      (address.line1 ? '<div><label style="font-size:0.8rem;color:var(--admin-text-muted);">Delivery Address</label><p>' + escapeHtml(address.line1) + (address.line2 ? ', ' + escapeHtml(address.line2) : '') + '</p><p>' + escapeHtml(address.city || '') + ' ' + escapeHtml(address.state || '') + ' - ' + escapeHtml(address.pincode || '') + '</p></div>' : '') +
      '<div><label style="font-size:0.8rem;color:var(--admin-text-muted);">Items</label>' +
        '<table class="data-table" style="margin-top:8px;"><thead><tr><th>Product</th><th>Qty</th><th>Price</th></tr></thead><tbody>' +
        items.map(function(i) { return '<tr><td>' + escapeHtml(i.name || i.weight || 'Item') + '</td><td>' + (i.qty || 1) + '</td><td>\u20B9' + parseFloat(i.price || 0).toLocaleString('en-IN') + '</td></tr>'; }).join('') +
        '</tbody></table></div>' +
      '<div><label style="font-size:0.8rem;color:var(--admin-text-muted);">Update Status</label>' +
        '<select id="orderStatusSelect" style="width:100%;padding:12px 16px;background:var(--admin-bg-card);border:1px solid var(--admin-border);border-radius:8px;color:var(--admin-text);font-size:0.95rem;margin-top:8px;">' +
        ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(function(s) {
          return '<option value="' + s + '"' + (order.status === s ? ' selected' : '') + '>' + capitalize(s) + '</option>';
        }).join('') +
        '</select></div>' +
    '</div>';

  var footer = document.getElementById('orderModalFooter');
  footer.innerHTML =
    '<button class="btn btn--secondary" onclick="closeModal(\'orderModal\')">Close</button>' +
    '<button class="btn btn--primary" onclick="updateOrderStatus(\'' + order.id + '\')">Update Status</button>';

  document.getElementById('orderModal').classList.add('active');
}

async function updateOrderStatus(id) {
  var status = document.getElementById('orderStatusSelect').value;
  var result = await OrderStore.updateStatus(id, status);
  if (result) {
    toast('Order updated to ' + capitalize(status));
    closeModal('orderModal');
    updateOrdersTable();
    updateRecentOrders();
    updateStats();
  } else {
    toast('Failed to update order', 'error');
  }
}

// ============ Products ============
async function updateProductsTable() {
  showLoading('productsTable');
  var products = await ProductStore.getAll();
  var tbody = document.getElementById('productsTable');

  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--admin-text-muted);">No products yet</td></tr>';
    return;
  }

  tbody.innerHTML = products.map(function(product) {
    return '<tr>' +
      '<td>' + escapeHtml(product.name) + (product.popular ? ' <span class="badge badge--approved">Most Popular</span>' : '') + '</td>' +
      '<td>' + escapeHtml(product.weight) + '</td>' +
      '<td>\u20B9' + parseFloat(product.price).toLocaleString('en-IN') + '</td>' +
      '<td>' + (product.popular ? 'Yes' : 'No') + '</td>' +
      '<td>' +
        '<button class="btn btn--sm btn--secondary" onclick="editProduct(\'' + product.id + '\')">Edit</button>' +
        '<button class="btn btn--sm btn--danger" onclick="deleteProduct(\'' + product.id + '\')">Delete</button>' +
      '</td>' +
    '</tr>';
  }).join('');
}

function openProductModal(product) {
  var modal = document.getElementById('productModal');
  var title = document.getElementById('productModalTitle');

  if (product) {
    title.textContent = 'Edit Product';
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name || '';
    document.getElementById('productWeight').value = product.weight || '';
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

async function handleSaveProduct() {
  var id = document.getElementById('productId').value;
  var productData = {
    name: document.getElementById('productName').value,
    weight: document.getElementById('productWeight').value,
    price: parseFloat(document.getElementById('productPrice').value) || 0,
    description: document.getElementById('productDesc').value,
    image: document.getElementById('productImage').value || '',
    video: document.getElementById('productVideo').value || '',
    popular: document.getElementById('productPopular').checked
  };

  var result;
  if (id) {
    result = await ProductStore.update(id, productData);
  } else {
    result = await ProductStore.add(productData);
  }

  if (result) {
    toast(id ? 'Product updated' : 'Product added');
    closeModal('productModal');
    updateProductsTable();
    updateStats();
  } else {
    toast('Failed to save product', 'error');
  }
}

async function editProduct(id) {
  var product = await ProductStore.getById(id);
  if (product) openProductModal(product);
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  var success = await ProductStore.delete(id);
  if (success) {
    toast('Product deleted');
    updateProductsTable();
    updateStats();
  } else {
    toast('Failed to delete product', 'error');
  }
}

// ============ Pricing ============
async function updatePricingTable() {
  showLoading('pricingTable');
  var pricing = await PricingStore.getAll();
  var tbody = document.getElementById('pricingTable');

  if (pricing.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--admin-text-muted);">No pricing tiers yet</td></tr>';
    return;
  }

  tbody.innerHTML = pricing.map(function(tier) {
    return '<tr>' +
      '<td>' + escapeHtml(tier.size) + '</td>' +
      '<td>\u20B9' + parseFloat(tier.price).toLocaleString('en-IN') + '</td>' +
      '<td>\u20B9' + parseFloat(tier.delivery_charge || 0).toLocaleString('en-IN') + '</td>' +
      '<td>' + (tier.cod_extra ? '\u20B9' + (tier.cod_amount || 60) : 'No') + '</td>' +
      '<td>' +
        '<button class="btn btn--sm btn--secondary" onclick="editPricing(\'' + tier.id + '\')">Edit</button>' +
        '<button class="btn btn--sm btn--danger" onclick="deletePricing(\'' + tier.id + '\')">Delete</button>' +
      '</td>' +
    '</tr>';
  }).join('');
}

function openPricingModal(tier) {
  var modal = document.getElementById('pricingModal');
  var title = document.getElementById('pricingModalTitle');

  if (tier) {
    title.textContent = 'Edit Pricing Tier';
    document.getElementById('pricingId').value = tier.id;
    document.getElementById('packSize').value = tier.size || '';
    document.getElementById('packPrice').value = tier.price || '';
    document.getElementById('deliveryCharge').value = tier.delivery_charge || 0;
    document.getElementById('codExtra').checked = tier.cod_extra || false;
    document.getElementById('codAmount').value = tier.cod_amount || 60;
    document.getElementById('codAmountGroup').style.display = tier.cod_extra ? 'block' : 'none';
  } else {
    title.textContent = 'Add Pricing Tier';
    document.getElementById('pricingForm').reset();
    document.getElementById('pricingId').value = '';
    document.getElementById('codAmountGroup').style.display = 'none';
  }

  modal.classList.add('active');
}

async function handleSavePricing() {
  var id = document.getElementById('pricingId').value;
  var pricingData = {
    size: document.getElementById('packSize').value,
    price: parseFloat(document.getElementById('packPrice').value) || 0,
    delivery_charge: parseFloat(document.getElementById('deliveryCharge').value) || 0,
    cod_extra: document.getElementById('codExtra').checked,
    cod_amount: parseFloat(document.getElementById('codAmount').value) || 0
  };

  var result;
  if (id) {
    result = await PricingStore.update(id, pricingData);
  } else {
    result = await PricingStore.add(pricingData);
  }

  if (result) {
    toast(id ? 'Pricing updated' : 'Pricing added');
    closeModal('pricingModal');
    updatePricingTable();
  } else {
    toast('Failed to save pricing', 'error');
  }
}

async function editPricing(id) {
  var pricing = await PricingStore.getAll();
  var tier = pricing.find(function(p) { return p.id === id; });
  if (tier) openPricingModal(tier);
}

async function deletePricing(id) {
  if (!confirm('Are you sure you want to delete this pricing tier?')) return;
  var success = await PricingStore.delete(id);
  if (success) {
    toast('Pricing tier deleted');
    updatePricingTable();
  } else {
    toast('Failed to delete pricing', 'error');
  }
}

// ============ Reviews ============
async function updateReviewsTable() {
  showLoading('reviewsTable');
  var reviews;

  switch (currentReviewFilter) {
    case 'approved': reviews = await ReviewStore.getApproved(); break;
    case 'pending': reviews = await ReviewStore.getPending(); break;
    default: reviews = await ReviewStore.getAll();
  }

  var tbody = document.getElementById('reviewsTable');
  if (reviews.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--admin-text-muted);">No reviews found</td></tr>';
    return;
  }

  tbody.innerHTML = reviews.map(function(review) {
    return '<tr>' +
      '<td>' + escapeHtml(review.name) + '</td>' +
      '<td>' + '\u2605'.repeat(review.rating) + '\u2606'.repeat(5 - review.rating) + '</td>' +
      '<td>' + escapeHtml(review.comment.substring(0, 100)) + (review.comment.length > 100 ? '...' : '') + '</td>' +
      '<td>' + formatDate(review.date || review.created_at) + '</td>' +
      '<td><span class="badge badge--' + (review.approved ? 'approved' : 'pending') + '">' + (review.approved ? 'Approved' : 'Pending') + '</span></td>' +
      '<td>' +
        (!review.approved ? '<button class="btn btn--sm btn--success" onclick="approveReview(\'' + review.id + '\')">Approve</button>' : '') +
        '<button class="btn btn--sm btn--danger" onclick="deleteReview(\'' + review.id + '\')">Delete</button>' +
      '</td>' +
    '</tr>';
  }).join('');
}

async function approveReview(id) {
  var result = await ReviewStore.approve(id);
  if (result) {
    toast('Review approved');
    updateReviewsTable();
    updateStats();
  } else {
    toast('Failed to approve review', 'error');
  }
}

async function deleteReview(id) {
  if (!confirm('Are you sure you want to delete this review?')) return;
  var success = await ReviewStore.delete(id);
  if (success) {
    toast('Review deleted');
    updateReviewsTable();
    updateStats();
  } else {
    toast('Failed to delete review', 'error');
  }
}

// ============ Media ============
function setupDropZone() {
  var dropZone = document.getElementById('dropZone');
  var fileInput = document.getElementById('fileInput');
  if (!dropZone || !fileInput) return;

  dropZone.addEventListener('click', function() { fileInput.click(); });
  dropZone.addEventListener('dragover', function(e) {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--admin-gold)';
  });
  dropZone.addEventListener('dragleave', function() {
    dropZone.style.borderColor = 'var(--admin-border)';
  });
  dropZone.addEventListener('drop', function(e) {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--admin-border)';
    handleFiles(e.dataTransfer.files);
  });
  fileInput.addEventListener('change', function(e) { handleFiles(e.target.files); });
}

async function handleFiles(files) {
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];
    if (allowedTypes.indexOf(file.type) === -1) {
      toast('Invalid file type. Upload JPG, PNG, WebP, MP4, or MOV.', 'error');
      continue;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast('File too large. Max 50MB.', 'error');
      continue;
    }

    var base64 = await fileToBase64(file);
    await MediaStore.add({
      name: file.name,
      type: file.type,
      size: file.size,
      url: base64
    });
  }
  toast('Media uploaded');
  updateMediaGrid();
}

async function updateMediaGrid() {
  var media = await MediaStore.getAll();
  var grid = document.getElementById('mediaGrid');

  if (media.length === 0) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--admin-text-muted);">No media uploaded yet</p>';
    return;
  }

  grid.innerHTML = media.map(function(item) {
    var isImage = item.type && item.type.startsWith('image/');
    return '<div style="background:var(--admin-bg-card);border:1px solid var(--admin-border);border-radius:8px;overflow:hidden;">' +
      (isImage ? '<img src="' + item.url + '" style="width:100%;height:160px;object-fit:cover;">' : '<div style="width:100%;height:160px;display:flex;align-items:center;justify-content:center;font-size:48px;">\uD83C\uDFAC</div>') +
      '<div style="padding:12px;">' +
        '<p style="font-size:0.875rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + escapeHtml(item.name) + '</p>' +
        '<button class="btn btn--sm btn--danger" style="margin-top:8px;width:100%;" onclick="deleteMedia(\'' + item.id + '\')">Delete</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

async function deleteMedia(id) {
  if (!confirm('Delete this media?')) return;
  var success = await MediaStore.delete(id);
  if (success) {
    toast('Media deleted');
    updateMediaGrid();
  }
}

// ============ Settings ============
async function loadSettings() {
  var settings = await SettingsStore.getAll();
  document.getElementById('siteName').value = settings.siteName || '';
  document.getElementById('tagline').value = settings.tagline || '';
  document.getElementById('phone').value = settings.phone || '';
  document.getElementById('whatsapp').value = settings.whatsapp || '';
  document.getElementById('email').value = settings.email || '';
  document.getElementById('address').value = settings.address || '';
  document.getElementById('aboutUs').value = settings.aboutUs || '';
}

async function handleSaveSettings(e) {
  e.preventDefault();
  var settingsData = {
    siteName: document.getElementById('siteName').value,
    tagline: document.getElementById('tagline').value,
    phone: document.getElementById('phone').value,
    whatsapp: document.getElementById('whatsapp').value,
    email: document.getElementById('email').value,
    address: document.getElementById('address').value,
    aboutUs: document.getElementById('aboutUs').value
  };

  var result = await SettingsStore.update(settingsData);
  if (result) {
    toast('Settings saved');
  } else {
    toast('Failed to save settings', 'error');
  }
}

// ============ Utilities ============
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

// ============ Global Exports ============
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
window.viewOrder = viewOrder;
window.updateOrderStatus = updateOrderStatus;
