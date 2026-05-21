\# Pobitra Ghee — Product Requirements Document



\## Overview



Pobitra Ghee is a premium artisanal ghee (indian word, generally means clarified butter) brand started by a mother-daughter team. This project is a website where customers can learn about the brand, browse products, place orders, and share reviews. It also includes a private admin panel for managing the store.



The brand story: Using the traditional bilona method passed down through generations, every batch is made with care using locally sourced milk from trusted farmers.



\---



\## Target Audience



\- Indian families looking for authentic, pure ghee

\- Health-conscious buyers who value traditional preparation methods

\- Customers who prefer home delivery and WhatsApp-based ordering



\---



\## Public-Facing Website Features



\### Navigation Bar

\- Sticky top navigation that changes appearance as you scroll

\- Links to Home, Collection, Our Story, and Reviews sections

\- "Order Now" call-to-action button

\- On mobile: a hamburger menu that opens a slide-down drawer



\### Hero Section

\- Full-screen introduction with the brand tagline

\- Highlights: mother-son team, traditional bilona method, no preservatives

\- Three key stats: 30+ Happy Families, 100% Natural, Free Delivery

\- Animated floating badges: FSSAI Certified, 4.9★ Rating, 100% Natural

\- On desktop: a large visual area featuring the ghee product with badge cards



\### Scrolling Marquee

\- A gold banner that scrolls brand highlights across the screen

\- Messages: Traditional Bilona Method, 100% Pure \& Natural, Free Home Delivery, Handcrafted with Love, No Preservatives



\### Trust Strip

\- Four selling points displayed side by side:

&#x20; - FSSAI Certified — Licensed \& Tested

&#x20; - 100% Natural — No Preservatives

&#x20; - Free Delivery — All Over India

&#x20; - Made with Love — Bilona Method



\### Product Collection

\- Displays all available ghee packs in a grid

\- Each product card shows: product name, weight, description, price, and free delivery badge

\- The third product is highlighted as "Most Popular"

\- A subscription banner at the bottom promotes 10% off for monthly delivery



\### Our Story Section

\- Tells the brand's origin story: mother-son team, bilona method, locally sourced milk

\- Visual placeholder with a family icon

\- Stats: 30+ Happy Families, 100% Pure \& Natural, 10+ Monthly Orders

\- Signature line: "— The Pobitra Family"



\### Customer Reviews

\- Shows approved customer testimonials with star ratings

\- Each review shows: customer name, rating, quoted comment, and "Verified Buyer" tag

\- A "Share Your Experience" button that scrolls to the review form



\### Order Form

\- Customers fill in: name, phone number, delivery address

\- Select a pack size from 5 options (100g, 200g, 400g, 800g, 1kg)

\- Choose quantity using plus/minus buttons (min 1, max 10)

\- Choose payment method: Prepaid (UPI/Transfer) or Cash on Delivery

\- See a live order summary showing item cost, free delivery, COD charges (if any), and total

\- On submit, the order details are sent via WhatsApp message to the business number

\- After submission, a success message appears confirming the order



\### Review Submission Form

\- Customers can submit a review with their name, a 1–5 star rating, and a comment

\- On submit, the review goes to the admin for approval before appearing publicly

\- A thank-you message appears after submission



\### Footer

\- Brand description and signature

\- Quick links to all sections

\- Contact information: phone, email, address

\- Copyright notice



\---



\## Admin Dashboard Features



Accessible at `/admin`. Protected by a login screen. Default credentials provided, with a reminder to change the password after first login.



\### Dashboard Home

\- Overview stats: total products, total reviews, approved reviews, pending reviews

\- Quick action cards linking to Products, Pricing, and Media pages

\- Recent reviews list with inline approve/reject buttons



\### Product Management

\- View all products in a table

\- Add new products using a form (name, weight, price, description, image URL, video URL)

\- Edit existing products

\- Delete products (with confirmation dialog)

\- Products appear on the public website's Collection section



\### Pricing Management

\- View all pricing tiers in a table

\- Add new pricing tiers (pack size, price, delivery charge, COD extra flag)

\- Edit or delete existing tiers

\- A note explaining that COD charges apply to packs above 200g



\### Review Moderation

\- View all customer reviews with filter tabs: All, Approved, Pending

\- Each review shows: customer name, star rating, comment, date, optional image

\- Approve reviews to make them visible on the public website

\- Reject or delete reviews



\### Media Library

\- Upload images and videos via drag-and-drop or file browser

\- Accepts JPG, PNG, WebP, MP4, MOV (up to 50MB)

\- Note that for production deployment, cloud storage should be set up



\### Settings

\- Update site information: site name, tagline

\- Update contact details: phone, WhatsApp number, email, address

\- Update the About Us text

\- Save button with confirmation feedback



\---



\## Pricing Structure



| Pack Size | Price | Delivery | COD Extra Charge |

|-----------|-------|----------|-----------------|

| 100g      | ₹149  | Free     | No              |

| 200g      | ₹230  | Free     | No              |

| 400g      | ₹449  | Free     | ₹60             |

| 800g      | ₹879  | Free     | ₹60             |

| 1kg       | ₹1,049 | Free    | ₹60             |



\- Free delivery on all orders across India

\- Cash on Delivery has a ₹60 surcharge for 400g, 800g, and 1kg packs

\- 100g and 200g packs have no COD surcharge

\- Prepaid payments (UPI/bank transfer) have no extra charges



\---



\## Order Flow



1\. Customer browses products on the Collection section

2\. Clicks "Select" or "Order Now" to reach the order form

3\. Fills in personal details, selects pack, quantity, and payment method

4\. Sees a live price breakdown with total

5\. Clicks "Order via WhatsApp"

6\. A WhatsApp message opens pre-filled with the full order summary

7\. Business owner receives the order and confirms with the customer manually



Future enhancement: An automated payment gateway (Razorpay/UPI) and WhatsApp Business API for order confirmations.



\---



\## Brand Identity



\- \*\*Tone\*\*: Warm, authentic, family-oriented, traditional yet modern

\- \*\*Color palette\*\*: Gold tones (primary), warm stone/earthy browns (backgrounds), cream/off-white

\- \*\*Fonts\*\*: Inter (clean modern sans-serif for body) and Cormorant Garamond (elegant serif for headings)

\- \*\*Design feel\*\*: Premium but not ostentatious, handcrafted aesthetic, smooth animations, dark and light sections alternating



\---



\## Future Features (Not in Current Build)



\- Payment gateway integration (Razorpay/UPI)

\- WhatsApp Business automation for order confirmations

\- Customer accounts and order history

\- Cloud storage for product images and videos

\- Subscription management portal

\- SEO optimization (sitemap, structured data)

\- Analytics and conversion tracking

\- Email notifications for new orders and reviews

\- Loyalty and referral programs

\- Mobile app

\- International shipping







\# Pobitra Ghee — Product Requirements Document



\## Overview



Pobitra Ghee is a premium artisanal ghee (indian word, generally means clarified butter) brand started by a mother-daughter team. This project is a website where customers can learn about the brand, browse products, place orders, and share reviews. It also includes a private admin panel for managing the store.



The brand story: Using the traditional bilona method passed down through generations, every batch is made with care using locally sourced milk from trusted farmers.



\---



\## Target Audience



\- Indian families looking for authentic, pure ghee

\- Health-conscious buyers who value traditional preparation methods

\- Customers who prefer home delivery and WhatsApp-based ordering



\---



\## Public-Facing Website Features



\### Navigation Bar

\- Sticky top navigation that changes appearance as you scroll

\- Links to Home, Collection, Our Story, and Reviews sections

\- "Order Now" call-to-action button

\- On mobile: a hamburger menu that opens a slide-down drawer



\### Hero Section

\- Full-screen introduction with the brand tagline

\- Highlights: mother-son team, traditional bilona method, no preservatives

\- Three key stats: 30+ Happy Families, 100% Natural, Free Delivery

\- Animated floating badges: FSSAI Certified, 4.9★ Rating, 100% Natural

\- On desktop: a large visual area featuring the ghee product with badge cards



\### Scrolling Marquee

\- A gold banner that scrolls brand highlights across the screen

\- Messages: Traditional Bilona Method, 100% Pure \& Natural, Free Home Delivery, Handcrafted with Love, No Preservatives



\### Trust Strip

\- Four selling points displayed side by side:

&#x20; - FSSAI Certified — Licensed \& Tested

&#x20; - 100% Natural — No Preservatives

&#x20; - Free Delivery — All Over India

&#x20; - Made with Love — Bilona Method



\### Product Collection

\- Displays all available ghee packs in a grid

\- Each product card shows: product name, weight, description, price, and free delivery badge

\- The third product is highlighted as "Most Popular"

\- A subscription banner at the bottom promotes 10% off for monthly delivery



\### Our Story Section

\- Tells the brand's origin story: mother-son team, bilona method, locally sourced milk

\- Visual placeholder with a family icon

\- Stats: 30+ Happy Families, 100% Pure \& Natural, 10+ Monthly Orders

\- Signature line: "— The Pobitra Family"



\### Customer Reviews

\- Shows approved customer testimonials with star ratings

\- Each review shows: customer name, rating, quoted comment, and "Verified Buyer" tag

\- A "Share Your Experience" button that scrolls to the review form



\### Order Form

\- Customers fill in: name, phone number, delivery address

\- Select a pack size from 5 options (100g, 200g, 400g, 800g, 1kg)

\- Choose quantity using plus/minus buttons (min 1, max 10)

\- Choose payment method: Prepaid (UPI/Transfer) or Cash on Delivery

\- See a live order summary showing item cost, free delivery, COD charges (if any), and total

\- On submit, the order details are sent via WhatsApp message to the business number

\- After submission, a success message appears confirming the order



\### Review Submission Form

\- Customers can submit a review with their name, a 1–5 star rating, and a comment

\- On submit, the review goes to the admin for approval before appearing publicly

\- A thank-you message appears after submission



\### Footer

\- Brand description and signature

\- Quick links to all sections

\- Contact information: phone, email, address

\- Copyright notice



\---



\## Admin Dashboard Features



Accessible at `/admin`. Protected by a login screen. Default credentials provided, with a reminder to change the password after first login.



\### Dashboard Home

\- Overview stats: total products, total reviews, approved reviews, pending reviews

\- Quick action cards linking to Products, Pricing, and Media pages

\- Recent reviews list with inline approve/reject buttons



\### Product Management

\- View all products in a table

\- Add new products using a form (name, weight, price, description, image URL, video URL)

\- Edit existing products

\- Delete products (with confirmation dialog)

\- Products appear on the public website's Collection section



\### Pricing Management

\- View all pricing tiers in a table

\- Add new pricing tiers (pack size, price, delivery charge, COD extra flag)

\- Edit or delete existing tiers

\- A note explaining that COD charges apply to packs above 200g



\### Review Moderation

\- View all customer reviews with filter tabs: All, Approved, Pending

\- Each review shows: customer name, star rating, comment, date, optional image

\- Approve reviews to make them visible on the public website

\- Reject or delete reviews



\### Media Library

\- Upload images and videos via drag-and-drop or file browser

\- Accepts JPG, PNG, WebP, MP4, MOV (up to 50MB)

\- Note that for production deployment, cloud storage should be set up



\### Settings

\- Update site information: site name, tagline

\- Update contact details: phone, WhatsApp number, email, address

\- Update the About Us text

\- Save button with confirmation feedback



\---



\## Pricing Structure



| Pack Size | Price | Delivery | COD Extra Charge |

|-----------|-------|----------|-----------------|

| 100g      | ₹149  | Free     | No              |

| 200g      | ₹230  | Free     | No              |

| 400g      | ₹449  | Free     | ₹60             |

| 800g      | ₹879  | Free     | ₹60             |

| 1kg       | ₹1,049 | Free    | ₹60             |



\- Free delivery on all orders across India

\- Cash on Delivery has a ₹60 surcharge for 400g, 800g, and 1kg packs

\- 100g and 200g packs have no COD surcharge

\- Prepaid payments (UPI/bank transfer) have no extra charges



\---



\## Order Flow



1\. Customer browses products on the Collection section

2\. Clicks "Select" or "Order Now" to reach the order form

3\. Fills in personal details, selects pack, quantity, and payment method

4\. Sees a live price breakdown with total

5\. Clicks "Order via WhatsApp"

6\. A WhatsApp message opens pre-filled with the full order summary

7\. Business owner receives the order and confirms with the customer manually



Future enhancement: An automated payment gateway (Razorpay/UPI) and WhatsApp Business API for order confirmations.



\---



\## Brand Identity



\- \*\*Tone\*\*: Warm, authentic, family-oriented, traditional yet modern

\- \*\*Color palette\*\*: Gold tones (primary), warm stone/earthy browns (backgrounds), cream/off-white

\- \*\*Fonts\*\*: Inter (clean modern sans-serif for body) and Cormorant Garamond (elegant serif for headings)

\- \*\*Design feel\*\*: Premium but not ostentatious, handcrafted aesthetic, smooth animations, dark and light sections alternating



\---



\## Future Features (Not in Current Build)



\- Payment gateway integration (Razorpay/UPI)

\- WhatsApp Business automation for order confirmations

\- Customer accounts and order history

\- Cloud storage for product images and videos

\- Subscription management portal

\- SEO optimization (sitemap, structured data)

\- Analytics and conversion tracking

\- Email notifications for new orders and reviews

\- Loyalty and referral programs

\- Mobile app

\- International shipping







the project should be in html, css and js with a super duper premium ui/ux


