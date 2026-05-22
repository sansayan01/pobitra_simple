/**
 * Pobitra Ghee - Supabase Client & Data Layer
 * On admin.html: provides Supabase-backed stores via window.*
 * On index.html: only saveOrder()/saveReview() via window.*
 * Uses window.* to avoid conflicts with data.js's const declarations on the public site.
 */

const _SUPABASE_URL = 'https://svpgzhlfslfuuddubxgo.supabase.co';
const _SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2cGd6aGxmc2xmdXVkZHVieGdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMzMyODEsImV4cCI6MjA5NDkwOTI4MX0.jO5Jsaif5TnJES23LRuXLS5u1d_BABgu-Bb9XCDajqM';

// Use window property to avoid TDZ issues
if (!window._supabaseClient) {
  window._supabaseClient = window.supabase.createClient(_SUPABASE_URL, _SUPABASE_ANON_KEY);
}
const _db = window._supabaseClient;

// --- Shared functions (both pages) ---

window.saveOrder = async function(order) {
  return await _db.from('orders').insert(order).select().single();
};

window.saveReview = async function(review) {
  review.approved = false;
  review.date = new Date().toISOString().split('T')[0];
  return await _db.from('reviews').insert(review).select().single();
};

// --- Admin-only stores ---
if (document.getElementById('adminDashboard')) {

  window.AuthStore = {
    async login(email, password) {
      const { data, error } = await _db.auth.signInWithPassword({ email, password });
      if (error) { console.error('AuthStore.login:', error.message); return { error: error.message }; }
      return { data };
    },

    async logout() {
      await _db.auth.signOut();
    },

    async getSession() {
      const { data: { session } } = await _db.auth.getSession();
      return session;
    },

    async isLoggedIn() {
      const session = await this.getSession();
      return !!session;
    }
  };

  window.ProductStore = {
    _cache: [],
    async getAll() {
      const { data, error } = await _db.from('products').select('*').order('sort_order');
      if (error) { console.error('ProductStore.getAll:', error); return this._cache; }
      this._cache = data || [];
      return this._cache;
    },
    async getById(id) {
      const { data, error } = await _db.from('products').select('*').eq('id', id).single();
      if (error) return null;
      return data;
    },
    async add(product) {
      const { data, error } = await _db.from('products').insert(product).select().single();
      if (error) { console.error('ProductStore.add:', error); return null; }
      return data;
    },
    async update(id, updates) {
      updates.updated_at = new Date().toISOString();
      const { data, error } = await _db.from('products').update(updates).eq('id', id).select().single();
      if (error) { console.error('ProductStore.update:', error); return null; }
      return data;
    },
    async delete(id) {
      const { error } = await _db.from('products').delete().eq('id', id);
      if (error) { console.error('ProductStore.delete:', error); return false; }
      return true;
    }
  };

  window.PricingStore = {
    _cache: [],
    async getAll() {
      const { data, error } = await _db.from('pricing').select('*').order('sort_order');
      if (error) { console.error('PricingStore.getAll:', error); return this._cache; }
      this._cache = data || [];
      return this._cache;
    },
    async add(tier) {
      const { data, error } = await _db.from('pricing').insert(tier).select().single();
      if (error) { console.error('PricingStore.add:', error); return null; }
      return data;
    },
    async update(id, updates) {
      updates.updated_at = new Date().toISOString();
      const { data, error } = await _db.from('pricing').update(updates).eq('id', id).select().single();
      if (error) { console.error('PricingStore.update:', error); return null; }
      return data;
    },
    async delete(id) {
      const { error } = await _db.from('pricing').delete().eq('id', id);
      if (error) { console.error('PricingStore.delete:', error); return false; }
      return true;
    }
  };

  window.ReviewStore = {
    _cache: [],
    async getAll() {
      const { data, error } = await _db.from('reviews').select('*').order('created_at', { ascending: false });
      if (error) { console.error('ReviewStore.getAll:', error); return this._cache; }
      this._cache = data || [];
      return this._cache;
    },
    async getApproved() {
      const { data, error } = await _db.from('reviews').select('*').eq('approved', true).order('created_at', { ascending: false });
      if (error) return [];
      return data || [];
    },
    async getPending() {
      const { data, error } = await _db.from('reviews').select('*').eq('approved', false).order('created_at', { ascending: false });
      if (error) return [];
      return data || [];
    },
    async add(review) {
      review.approved = false;
      review.date = new Date().toISOString().split('T')[0];
      const { data, error } = await _db.from('reviews').insert(review).select().single();
      if (error) { console.error('ReviewStore.add:', error); return null; }
      return data;
    },
    async approve(id) {
      const { data, error } = await _db.from('reviews').update({ approved: true }).eq('id', id).select().single();
      if (error) { console.error('ReviewStore.approve:', error); return null; }
      return data;
    },
    async delete(id) {
      const { error } = await _db.from('reviews').delete().eq('id', id);
      if (error) { console.error('ReviewStore.delete:', error); return false; }
      return true;
    }
  };

  window.OrderStore = {
    _cache: [],
    async getAll() {
      const { data, error } = await _db.from('orders').select('*').order('created_at', { ascending: false });
      if (error) { console.error('OrderStore.getAll:', error); return this._cache; }
      this._cache = data || [];
      return this._cache;
    },
    async getById(id) {
      const { data, error } = await _db.from('orders').select('*').eq('id', id).single();
      if (error) return null;
      return data;
    },
    async updateStatus(id, status) {
      const { data, error } = await _db.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id).select().single();
      if (error) { console.error('OrderStore.updateStatus:', error); return null; }
      return data;
    },
    async delete(id) {
      const { error } = await _db.from('orders').delete().eq('id', id);
      if (error) { console.error('OrderStore.delete:', error); return false; }
      return true;
    }
  };

  window.SettingsStore = {
    _cache: {},
    async getAll() {
      const { data, error } = await _db.from('settings').select('*');
      if (error) { console.error('SettingsStore.getAll:', error); return this._cache; }
      const settings = {};
      (data || []).forEach(row => { settings[row.key] = row.value; });
      this._cache = settings;
      return settings;
    },
    async update(updates) {
      const rows = Object.entries(updates).map(([key, value]) => ({
        key, value: String(value), updated_at: new Date().toISOString()
      }));
      const { data, error } = await _db.from('settings').upsert(rows, { onConflict: 'key' }).select();
      if (error) { console.error('SettingsStore.update:', error); return null; }
      Object.assign(this._cache, updates);
      return data;
    }
  };

  window.MediaStore = {
    _cache: [],
    async getAll() {
      const { data, error } = await _db.from('media').select('*').order('created_at', { ascending: false });
      if (error) { console.error('MediaStore.getAll:', error); return this._cache; }
      this._cache = data || [];
      return this._cache;
    },
    async add(item) {
      const { data, error } = await _db.from('media').insert(item).select().single();
      if (error) { console.error('MediaStore.add:', error); return null; }
      return data;
    },
    async delete(id) {
      const { error } = await _db.from('media').delete().eq('id', id);
      if (error) { console.error('MediaStore.delete:', error); return false; }
      return true;
    }
  };

  window.Stats = {
    async get() {
      const [products, allReviews, approved, pending, orders, revenue] = await Promise.all([
        _db.from('products').select('id', { count: 'exact', head: true }),
        _db.from('reviews').select('id', { count: 'exact', head: true }),
        _db.from('reviews').select('id', { count: 'exact', head: true }).eq('approved', true),
        _db.from('reviews').select('id', { count: 'exact', head: true }).eq('approved', false),
        _db.from('orders').select('id', { count: 'exact', head: true }),
        _db.from('orders').select('total').in('status', ['confirmed', 'shipped', 'delivered'])
      ]);
      const totalRevenue = (revenue.data || []).reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
      return {
        totalProducts: products.count || 0,
        totalReviews: allReviews.count || 0,
        approvedReviews: approved.count || 0,
        pendingReviews: pending.count || 0,
        totalOrders: orders.count || 0,
        totalRevenue
      };
    }
  };

}
