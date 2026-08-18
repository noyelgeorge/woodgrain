# Furni. — Furniture Website

## 📁 Project Structure

```
furni-website/
├── index.html          ← Home Page
├── shop.html           ← Shop (with filters)
├── product.html        ← Product Detail (Lounge Chair)
├── custom-build.html   ← Custom Build + Contact Form
├── about.html          ← About Us + Stats
├── cart.html           ← Shopping Cart + Checkout
├── css/
│   └── style.css       ← All styles
├── js/
│   └── script.js       ← Cart, wishlist, filters (localStorage)
└── images/             ← ADD YOUR IMAGES HERE (see list below)
```

---

## 🖼️ Image Names to Add

Place all images inside the `images/` folder with **exactly** these filenames:

### Hero & Categories
| Filename                  | Used On        | Description                        |
|---------------------------|----------------|------------------------------------|
| `hero-room.jpg`           | Home page      | Living room scene (hero banner)    |
| `category-living.jpg`     | Home page      | Living room category thumbnail     |
| `category-bedroom.jpg`    | Home page      | Bedroom category thumbnail         |
| `category-dining.jpg`     | Home page      | Dining room category thumbnail     |
| `category-office.jpg`     | Home page      | Office category thumbnail          |
| `category-storage.jpg`    | Home page      | Storage category thumbnail         |

### Products
| Filename                    | Product                  | Price    |
|-----------------------------|--------------------------|----------|
| `product-sofa.jpg`          | Modular Sofa             | ₹32,999  |
| `product-dining-table.jpg`  | Solid Wood Dining Table  | ₹34,999  |
| `product-lounge-chair.jpg`  | Minimal Lounge Chair     | ₹14,999  |
| `product-bed-frame.jpg`     | Wooden Bed Frame         | ₹22,999  |
| `product-study-desk.jpg`    | Study Desk               | ₹15,499  |
| `product-wardrobe.jpg`      | Wardrobe                 | ₹26,999  |
| `product-wordy-desk.jpg`    | Wordy Desk               | ₹22,999  |

### Product Detail Gallery (Lounge Chair)
| Filename              | Used On           |
|-----------------------|-------------------|
| `chair-thumb-1.jpg`   | Product detail    |
| `chair-thumb-2.jpg`   | Product detail    |
| `chair-thumb-3.jpg`   | Product detail    |

### Other Pages
| Filename                  | Used On            |
|---------------------------|--------------------|
| `custom-build-person.jpg` | Custom Build page  |
| `about-interior.jpg`      | About Us page      |

---

## ✅ Features

- 🛒 **Cart** — Add/remove items, update quantity (persisted via localStorage)
- 💛 **Wishlist** — Toggle wishlist on any product card (persisted via localStorage)
- 🔍 **Search overlay** — Click the search icon on any page
- 📱 **Responsive** — Works on mobile, tablet, and desktop
- 🎨 **Filters** — Category, price range slider, material, colour swatches
- 🔔 **Toast notifications** — Feedback on all cart/wishlist actions
- 📋 **Custom Build Form** — With submit handler + validation
- 🏷️ **Cart badge** — Live item count on nav cart icon

---

## 🚀 How to Open

Just open `index.html` in any browser. No build step needed.

> ⚠️ Note: Images won't show until you add them to the `images/` folder.
> The site works without images — placeholders are shown automatically.
