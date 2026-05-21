# Pobitra Ghee - Premium Artisanal Ghee Website

A premium, responsive e-commerce website for Pobitra Ghee brand built with vanilla HTML, CSS, and JavaScript. Features a public-facing website with WhatsApp-based ordering and a full admin dashboard for managing products, reviews, and settings.

## 🚀 Features

### Public Website
- **Sticky Navigation** - Changes appearance on scroll, mobile hamburger menu
- **Hero Section** - Full-screen with animated floating badges and stats
- **Scrolling Marquee** - Infinite gold banner with brand highlights
- **Trust Strip** - Four selling points with icons
- **Product Collection** - Dynamic grid with "Most Popular" highlight
- **Our Story** - Brand narrative with stats
- **Customer Reviews** - Approved testimonials with star ratings
- **Order Form** - Live price calculator with WhatsApp integration
- **Review Form** - Submit reviews for admin approval
- **Footer** - Contact info, quick links, copyright

### Admin Dashboard (`/admin.html`)
- **Login Protection** - Simple authentication (default: admin/admin123)
- **Dashboard Home** - Stats overview and recent reviews
- **Product Management** - CRUD operations for products
- **Pricing Management** - Manage pricing tiers
- **Review Moderation** - Approve/reject customer reviews
- **Media Library** - Upload images/videos (drag & drop)
- **Settings** - Update site info, contact details, about us

## 📁 Project Structure

```
pobitra-ghee/
├── index.html          # Public website
├── admin.html          # Admin dashboard
├── css/
│   ├── style.css       # Public site styles (2000+ lines)
│   └── admin.css       # Admin dashboard styles
├── js/
│   ├── data.js         # localStorage operations & data models
│   ├── utils.js        # Utility functions
│   ├── main.js         # Public site interactivity
│   └── admin.js        # Admin dashboard logic
├── assets/
│   ├── images/         # Product images (add your own)
│   └── fonts/          # Self-hosted fonts (optional)
└── prd.md              # Product requirements document
```

## 🎨 Design System

### Colors
- **Gold Tones**: `#8B6914`, `#B8860B`, `#DAA520`, `#F4C430`, `#FFD700`
- **Warm Stone**: `#1A1A1A`, `#2C2C2C`, `#3E2723`, `#5D4037`
- **Cream/Off-White**: `#FFFFFF`, `#FFF8E7`, `#FAF0E6`, `#F5F5DC`

### Fonts
- **Inter** - Clean modern sans-serif for body text
- **Cormorant Garamond** - Elegant serif for headings

### Premium Features
- Scroll-triggered reveal animations
- Hover lift effects on cards
- Gold shimmer animations
- Smooth transitions throughout
- Mobile-first responsive design
- Accessibility support (ARIA labels, focus styles, reduced motion)

## 💰 Pricing Structure

| Pack Size | Price | Delivery | COD Extra |
|-----------|-------|----------|-----------|
| 100g      | ₹149  | Free     | No        |
| 200g      | ₹230  | Free     | No        |
| 400g      | ₹449  | Free     | ₹60       |
| 800g      | ₹879  | Free     | ₹60       |
| 1kg       | ₹1,049| Free     | ₹60       |

## 🔐 Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`
- ⚠️ Change password after first login (via Settings page)

## 🚀 Getting Started

1. Open `index.html` in a browser to view the public website
2. Open `admin.html` to access the admin dashboard
3. No build process or server required - works with any static file server

## 📱 How Orders Work

1. Customer fills out the order form
2. Live price calculator shows item cost, delivery, and total
3. Clicking "Order via WhatsApp" opens WhatsApp with pre-filled message
4. Business owner receives order and confirms manually

## 💾 Data Storage

All data is stored in **localStorage** (client-side):
- Products, reviews, pricing, settings, and media
- No backend required for demo/development
- For production, consider migrating to a backend service

## 🎯 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Notes

- Replace placeholder images in `assets/images/` with actual product photos
- Update WhatsApp number in Settings to your business number
- For production deployment, consider:
  - Backend API for data persistence
  - Cloud storage for media files
  - Payment gateway integration (Razorpay/UPI)
  - WhatsApp Business API for automation

## 📄 License

This project is proprietary and confidential.

---

Built with ❤️ using vanilla HTML, CSS, and JavaScript
