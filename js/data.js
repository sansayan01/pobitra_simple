/**
 * Pobitra Ghee - Data Layer
 * Handles all localStorage operations and data management
 */

const STORAGE_KEYS = {
  PRODUCTS: 'pg_products',
  REVIEWS: 'pg_reviews',
  PRICING: 'pg_pricing',
  SETTINGS: 'pg_settings',
  MEDIA: 'pg_media',
  ADMIN_AUTH: 'pg_admin_auth',
  ADMIN_LOGGED_IN: 'pg_admin_logged_in'
};

// Default data
const DEFAULT_PRODUCTS = [
  {
    id: 'prod_1',
    name: 'Pobitra Ghee',
    weight: '100g',
    price: 149,
    description: 'Pure artisanal ghee made using the traditional bilona method. Perfect for daily cooking and small households.',
    image: 'assets/images/ghee-100g.jpg',
    video: '',
    popular: false
  },
  {
    id: 'prod_2',
    name: 'Pobitra Ghee',
    weight: '200g',
    price: 230,
    description: 'A generous portion of our premium ghee. Ideal for regular cooking and gifting to loved ones.',
    image: 'assets/images/ghee-200g.jpg',
    video: '',
    popular: false
  },
  {
    id: 'prod_3',
    name: 'Pobitra Ghee',
    weight: '400g',
    price: 449,
    description: 'Our most loved pack! The perfect balance of quality and quantity for families who cook with love.',
    image: 'assets/images/ghee-400g.jpg',
    video: '',
    popular: true
  },
  {
    id: 'prod_4',
    name: 'Pobitra Ghee',
    weight: '800g',
    price: 879,
    description: 'For the ghee connoisseurs. A substantial pack for families who use ghee generously every day.',
    image: 'assets/images/ghee-800g.jpg',
    video: '',
    popular: false
  },
  {
    id: 'prod_5',
    name: 'Pobitra Ghee',
    weight: '1kg',
    price: 1049,
    description: 'The ultimate ghee experience. One full kilogram of pure, handcrafted goodness at the best value.',
    image: 'assets/images/ghee-1kg.jpg',
    video: '',
    popular: false
  }
];

const DEFAULT_REVIEWS = [
  {
    id: 'rev_1',
    name: 'Priya Sharma',
    rating: 5,
    comment: 'The aroma and taste remind me of my grandmother\'s ghee. Absolutely pure and authentic!',
    image: '',
    date: '2024-01-15',
    approved: true
  },
  {
    id: 'rev_2',
    name: 'Rahul Verma',
    rating: 5,
    comment: 'Best ghee I\'ve ever purchased. The bilona method really makes a difference in taste.',
    image: '',
    date: '2024-01-22',
    approved: true
  },
  {
    id: 'rev_3',
    name: 'Anita Patel',
    rating: 4,
    comment: 'Lovely golden color and rich taste. My kids love it on their parathas. Will order again!',
    image: '',
    date: '2024-02-01',
    approved: true
  }
];

const DEFAULT_PRICING = [
  { id: 'price_1', size: '100g', price: 149, deliveryCharge: 0, codExtra: false },
  { id: 'price_2', size: '200g', price: 230, deliveryCharge: 0, codExtra: false },
  { id: 'price_3', size: '400g', price: 449, deliveryCharge: 0, codExtra: true, codAmount: 60 },
  { id: 'price_4', size: '800g', price: 879, deliveryCharge: 0, codExtra: true, codAmount: 60 },
  { id: 'price_5', size: '1kg', price: 1049, deliveryCharge: 0, codExtra: true, codAmount: 60 }
];

const DEFAULT_SETTINGS = {
  siteName: 'Pobitra Ghee',
  tagline: 'Pure Tradition, Pure Taste',
  phone: '+91 93394 93294',
  whatsapp: '+919339493294',
  email: 'pobitraghee@gmail.com',
  address: 'Vill + Post: Daspara, PS: Swarupnagar, North 24 Pgs, 743286, West Bengal, India',
  aboutUs: 'Pobitra Ghee is a labor of love from a mother-daughter duo who believe in the power of traditional food. Using the age-old bilona method passed down through generations, we craft each batch with care using milk from trusted local farmers. Our mission is simple: to bring the purest, most authentic ghee to every Indian household.'
};

// Initialize storage with defaults
function initStorage() {
  Object.keys(STORAGE_KEYS).forEach(key => {
    const storageKey = STORAGE_KEYS[key];
    if (!localStorage.getItem(storageKey)) {
      let defaultData;
      switch (key) {
        case 'PRODUCTS':
          defaultData = DEFAULT_PRODUCTS;
          break;
        case 'REVIEWS':
          defaultData = DEFAULT_REVIEWS;
          break;
        case 'PRICING':
          defaultData = DEFAULT_PRICING;
          break;
        case 'SETTINGS':
          defaultData = DEFAULT_SETTINGS;
          break;
        default:
          defaultData = [];
      }
      if (key !== 'ADMIN_AUTH' && key !== 'ADMIN_LOGGED_IN') {
        localStorage.setItem(storageKey, JSON.stringify(defaultData));
      }
    }
  });

  // Migrate old contact data to new values
  migrateOldSettings();

  // Initialize admin auth with default credentials
  if (!localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH)) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify({
      username: 'admin',
      password: btoa('admin123'), // Base64 encoded
      passwordChanged: false
    }));
  }
}

// Replace old contact info with current values
function migrateOldSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return;

    const settings = JSON.parse(raw);
    let changed = false;

    if (settings.phone && (settings.phone.includes('98765') || settings.phone.includes('9876'))) {
      settings.phone = DEFAULT_SETTINGS.phone;
      changed = true;
    }
    if (settings.whatsapp && (settings.whatsapp.includes('98765') || settings.whatsapp.includes('9876'))) {
      settings.whatsapp = DEFAULT_SETTINGS.whatsapp;
      changed = true;
    }
    if (settings.email && settings.email.includes('hello@')) {
      settings.email = DEFAULT_SETTINGS.email;
      changed = true;
    }
    if (settings.address && (settings.address.includes('Village Pobitra') || settings.address.includes('Gujarat'))) {
      settings.address = DEFAULT_SETTINGS.address;
      changed = true;
    }

    if (changed) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    }
  } catch (e) {
    // Ignore parse errors
  }
}

// Generic get/set helpers
function getData(key) {
  const data = localStorage.getItem(STORAGE_KEYS[key]);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
}

function setData(key, data) {
  localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data));
}

// Product Operations
const ProductStore = {
  getAll: () => getData('PRODUCTS') || [],

  getById: (id) => {
    const products = ProductStore.getAll();
    return products.find(p => p.id === id);
  },

  add: (product) => {
    const products = ProductStore.getAll();
    product.id = 'prod_' + Date.now();
    products.push(product);
    setData('PRODUCTS', products);
    return product;
  },

  update: (id, updates) => {
    const products = ProductStore.getAll();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      setData('PRODUCTS', products);
      return products[index];
    }
    return null;
  },

  delete: (id) => {
    const products = ProductStore.getAll();
    const filtered = products.filter(p => p.id !== id);
    setData('PRODUCTS', filtered);
    return filtered.length < products.length;
  }
};

// Review Operations
const ReviewStore = {
  getAll: () => getData('REVIEWS') || [],

  getApproved: () => {
    const reviews = ReviewStore.getAll();
    return reviews.filter(r => r.approved === true);
  },

  getPending: () => {
    const reviews = ReviewStore.getAll();
    return reviews.filter(r => r.approved === false);
  },

  add: (review) => {
    const reviews = ReviewStore.getAll();
    review.id = 'rev_' + Date.now();
    review.date = new Date().toISOString().split('T')[0];
    review.approved = false;
    reviews.push(review);
    setData('REVIEWS', reviews);
    return review;
  },

  approve: (id) => {
    const reviews = ReviewStore.getAll();
    const index = reviews.findIndex(r => r.id === id);
    if (index !== -1) {
      reviews[index].approved = true;
      setData('REVIEWS', reviews);
      return reviews[index];
    }
    return null;
  },

  reject: (id) => {
    return ReviewStore.delete(id);
  },

  delete: (id) => {
    const reviews = ReviewStore.getAll();
    const filtered = reviews.filter(r => r.id !== id);
    setData('REVIEWS', filtered);
    return filtered.length < reviews.length;
  }
};

// Pricing Operations
const PricingStore = {
  getAll: () => getData('PRICING') || [],

  getBySize: (size) => {
    const pricing = PricingStore.getAll();
    return pricing.find(p => p.size === size);
  },

  add: (tier) => {
    const pricing = PricingStore.getAll();
    tier.id = 'price_' + Date.now();
    pricing.push(tier);
    setData('PRICING', pricing);
    return tier;
  },

  update: (id, updates) => {
    const pricing = PricingStore.getAll();
    const index = pricing.findIndex(p => p.id === id);
    if (index !== -1) {
      pricing[index] = { ...pricing[index], ...updates };
      setData('PRICING', pricing);
      return pricing[index];
    }
    return null;
  },

  delete: (id) => {
    const pricing = PricingStore.getAll();
    const filtered = pricing.filter(p => p.id !== id);
    setData('PRICING', filtered);
    return filtered.length < pricing.length;
  }
};

// Settings Operations
const SettingsStore = {
  getAll: () => getData('SETTINGS') || DEFAULT_SETTINGS,

  update: (updates) => {
    const current = SettingsStore.getAll();
    const updated = { ...current, ...updates };
    setData('SETTINGS', updated);
    return updated;
  }
};

// Media Operations
const MediaStore = {
  getAll: () => getData('MEDIA') || [],

  add: (item) => {
    const media = MediaStore.getAll();
    item.id = 'media_' + Date.now();
    item.date = new Date().toISOString();
    media.push(item);
    setData('MEDIA', media);
    return item;
  },

  delete: (id) => {
    const media = MediaStore.getAll();
    const filtered = media.filter(m => m.id !== id);
    setData('MEDIA', filtered);
    return filtered.length < media.length;
  }
};

// Admin Authentication
const AuthStore = {
  login: (username, password) => {
    const auth = getData('ADMIN_AUTH');
    if (!auth) return false;

    const decodedPassword = atob(auth.password);
    if (auth.username === username && decodedPassword === password) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_LOGGED_IN, 'true');
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGGED_IN);
  },

  isLoggedIn: () => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_LOGGED_IN) === 'true';
  },

  changePassword: (newPassword) => {
    const auth = getData('ADMIN_AUTH');
    if (auth) {
      auth.password = btoa(newPassword);
      auth.passwordChanged = true;
      setData('ADMIN_AUTH', auth);
      return true;
    }
    return false;
  },

  checkDefaultPassword: () => {
    const auth = getData('ADMIN_AUTH');
    if (!auth) return true;
    return !auth.passwordChanged;
  }
};

// Stats for admin dashboard
const Stats = {
  get: () => {
    return {
      totalProducts: ProductStore.getAll().length,
      totalReviews: ReviewStore.getAll().length,
      approvedReviews: ReviewStore.getApproved().length,
      pendingReviews: ReviewStore.getPending().length
    };
  }
};

// Initialize on module load
initStorage();
