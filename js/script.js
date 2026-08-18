/* ============================================================
   FURNI. — JavaScript
   Cart · Wishlist · UI Interactions
   ============================================================ */

// ── Products Data ──────────────────────────────────────────
const PRODUCTS = [
  { id: 1, name: 'Modular Sofa',            price: 32999, category: 'living-room', material: 'upholstery', img: 'g.jpg' },
  { id: 2, name: 'Solid Wood Dining Table', price: 34999, category: 'dining-room',  material: 'wood',        img: 'g.jpg' },
  { id: 3, name: 'Minimal Lounge Chair',    price: 14999, category: 'living-room', material: 'wood',        img: 'g.jpg' },
  { id: 4, name: 'Wooden Bed Frame',        price: 22999, category: 'bedroom',      material: 'wood',        img: 'g.jpg' },
  { id: 5, name: 'Study Desk',              price: 15499, category: 'office',       material: 'wood',        img: 'g.jpg' },
  { id: 6, name: 'Wardrobe',                price: 26999, category: 'storage',      material: 'wood',        img: 'g.jpg' },
  { id: 7, name: 'Wordy Desk',              price: 22999, category: 'office',       material: 'metal',       img: 'g.jpg' },
  { id: 8, name: 'Wooden Bed Frame II',     price: 24999, category: 'bedroom',      material: 'wood',        img: 'g.jpg' },
];

// ── Cart (localStorage) ────────────────────────────────────
function getCart() {
  try { return JSON.parse(localStorage.getItem('furni_cart')) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem('furni_cart', JSON.stringify(cart));
}

function addToCart(productId, qty = 1, extras = {}) {
  const cart = getCart();
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const key = `${productId}-${extras.color || ''}-${extras.material || ''}`;
  const existing = cart.find(i => i.key === key);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      key,
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      qty,
      ...extras,
    });
  }

  saveCart(cart);
  updateCartBadge();
  showToast(`"${product.name}" added to cart`, 'check');
}

function removeFromCart(key) {
  const cart = getCart().filter(i => i.key !== key);
  saveCart(cart);
  updateCartBadge();
}

function updateCartQty(key, delta) {
  const cart = getCart();
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(cart);
  return item.qty;
}

function getCartTotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}

function updateCartBadge() {
  const total = getCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}

// ── Wishlist ────────────────────────────────────────────────
function getWishlist() {
  try { return JSON.parse(localStorage.getItem('furni_wishlist')) || []; }
  catch { return []; }
}

function toggleWishlist(productId) {
  const list = getWishlist();
  const idx  = list.indexOf(productId);
  if (idx > -1) { list.splice(idx, 1); return false; }
  else           { list.push(productId); return true; }
  localStorage.setItem('furni_wishlist', JSON.stringify(list));
}

function isWishlisted(productId) {
  return getWishlist().includes(productId);
}

// ── Toast ──────────────────────────────────────────────────
function showToast(message, icon = 'check') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    check: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
    heart: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    remove: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  };

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `${icons[icon] || icons.check}<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 2900);
}

// ── Currency Format ────────────────────────────────────────
function formatPrice(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

// ── Navbar ─────────────────────────────────────────────────
function initNavbar() {
  updateCartBadge();

  // Hamburger
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
  }

  // Active link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Search overlay
  const searchBtn = document.querySelector('.search-btn');
  const searchOverlay = document.querySelector('.search-overlay');
  const searchClose = document.querySelector('.search-close');
  const searchInput = document.querySelector('.search-box input');

  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener('click', () => {
      searchOverlay.classList.add('open');
      setTimeout(() => searchInput?.focus(), 100);
    });

    searchClose?.addEventListener('click', () => searchOverlay.classList.remove('open'));
    searchOverlay.addEventListener('click', e => {
      if (e.target === searchOverlay) searchOverlay.classList.remove('open');
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') searchOverlay.classList.remove('open');
    });
  }
}

// ── Product Card Builder ───────────────────────────────────
function buildProductCard(product) {
  const wishlisted = isWishlisted(product.id);
  return `
    <article class="product-card" onclick="window.location.href='product.html'">
      <div class="product-img-wrap">
        <img src="images/${product.img}" alt="${product.name}" loading="lazy"
             onerror="this.parentElement.innerHTML='<div class=\\'product-img-placeholder\\'><div class=\\'product-img-placeholder-inner\\'><svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'1\\'><rect x=\\'3\\' y=\\'3\\' width=\\'18\\' height=\\'18\\' rx=\\'2\\'/><circle cx=\\'8.5\\' cy=\\'8.5\\' r=\\'1.5\\'/><polyline points=\\'21 15 16 10 5 21\\'/></svg><span>${product.name}</span></div></div>'">
        <button class="wishlist-btn ${wishlisted ? 'active' : ''}"
                onclick="handleWishlist(event, ${product.id}, this)"
                aria-label="Add to wishlist">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${wishlisted ? 'currentColor' : 'none'}" stroke="currentColor">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
      <div class="product-info">
        <p class="product-name">${product.name}</p>
        <p class="product-price">${formatPrice(product.price)}</p>
      </div>
    </article>`;
}

function handleWishlist(e, productId, btn) {
  e.stopPropagation();
  const added = toggleWishlist(productId);
  localStorage.setItem('furni_wishlist', JSON.stringify(getWishlist()));
  const svg = btn.querySelector('svg');
  if (added) {
    btn.classList.add('active');
    svg.setAttribute('fill', 'currentColor');
    showToast('Added to wishlist', 'heart');
  } else {
    btn.classList.remove('active');
    svg.setAttribute('fill', 'none');
    showToast('Removed from wishlist', 'remove');
  }
}

// ── SHOP PAGE ──────────────────────────────────────────────
function initShopPage() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  let activeCategory  = 'all';
  let activeMaterials = new Set();
  let activeColors    = new Set();
  let maxPrice        = 102000;

  function render() {
    let filtered = PRODUCTS.filter(p => {
      const catOk  = activeCategory === 'all' || p.category === activeCategory;
      const matOk  = activeMaterials.size === 0 || activeMaterials.has(p.material);
      const priceOk = p.price <= maxPrice;
      return catOk && matOk && priceOk;
    });

    const countEl = document.getElementById('products-count');
    if (countEl) countEl.innerHTML = `Showing <strong>${filtered.length}</strong> of <strong>${PRODUCTS.length}</strong> furniture`;

    grid.innerHTML = filtered.length
      ? filtered.map(buildProductCard).join('')
      : `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted)">No products match your filters.</div>`;
  }

  // Category filter
  document.querySelectorAll('.cat-filter-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.cat-filter-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      activeCategory = item.dataset.cat;
      render();
    });
  });

  // Material checkboxes
  document.querySelectorAll('.check-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('checked');
      const mat = item.dataset.material;
      if (item.classList.contains('checked')) activeMaterials.add(mat);
      else activeMaterials.delete(mat);
      render();
    });
  });

  // Color swatches
  document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatch.classList.toggle('active');
      const col = swatch.dataset.color;
      if (swatch.classList.contains('active')) activeColors.add(col);
      else activeColors.delete(col);
    });
  });

  // Price slider
  const rangeInput = document.getElementById('price-range');
  const priceVal   = document.getElementById('price-max-val');
  const trackFill  = document.getElementById('range-fill');

  if (rangeInput) {
    rangeInput.addEventListener('input', () => {
      maxPrice = +rangeInput.value;
      if (priceVal) priceVal.textContent = formatPrice(maxPrice);
      const pct = ((maxPrice - 5000) / (102000 - 5000)) * 100;
      if (trackFill) trackFill.style.width = pct + '%';
      render();
    });
  }

  // Sort
  const sortEl = document.getElementById('sort-select');
  if (sortEl) {
    sortEl.addEventListener('change', () => {
      const val = sortEl.value;
      if (val === 'price-asc')  PRODUCTS.sort((a, b) => a.price - b.price);
      if (val === 'price-desc') PRODUCTS.sort((a, b) => b.price - a.price);
      if (val === 'newest')     PRODUCTS.sort((a, b) => b.id - a.id);
      render();
    });
  }

  render();
}

// ── PRODUCT DETAIL PAGE ────────────────────────────────────
function initProductPage() {
  // Thumbnail gallery
  document.querySelectorAll('.thumb-item').forEach(thumb => {
    thumb.addEventListener('click', () => {
      document.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const main = document.getElementById('main-product-img');
      if (main) main.src = thumb.querySelector('img').src;
    });
  });

  // Color chips
  document.querySelectorAll('.detail-color-swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      document.querySelectorAll('.detail-color-swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
    });
  });

  // Material chips
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const group = chip.closest('.option-chips');
      group.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  // Quantity
  const qtyInput = document.getElementById('qty-input');
  document.querySelector('.qty-inc')?.addEventListener('click', () => {
    if (qtyInput) qtyInput.value = +qtyInput.value + 1;
  });
  document.querySelector('.qty-dec')?.addEventListener('click', () => {
    if (qtyInput) qtyInput.value = Math.max(1, +qtyInput.value - 1);
  });

  // Add to Cart
  document.getElementById('add-to-cart-btn')?.addEventListener('click', () => {
    const qty = +(qtyInput?.value || 1);
    const color = document.querySelector('.detail-color-swatch.active')?.dataset.color || '';
    addToCart(3, qty, { color });
  });

  // Wishlist
  document.getElementById('wishlist-btn')?.addEventListener('click', () => {
    const btn = document.getElementById('wishlist-btn');
    const added = toggleWishlist(3);
    localStorage.setItem('furni_wishlist', JSON.stringify(getWishlist()));
    if (added) {
      btn.classList.add('active');
      btn.innerHTML = btn.innerHTML.replace('Add to Wishlist', 'Wishlisted');
      showToast('Added to wishlist', 'heart');
    } else {
      btn.classList.remove('active');
      btn.innerHTML = btn.innerHTML.replace('Wishlisted', 'Add to Wishlist');
      showToast('Removed from wishlist', 'remove');
    }
  });

  // Related products
  const relatedGrid = document.getElementById('related-grid');
  if (relatedGrid) {
    relatedGrid.innerHTML = PRODUCTS.filter(p => p.id !== 3).slice(0, 4).map(buildProductCard).join('');
  }
}

// ── CART PAGE ──────────────────────────────────────────────
function initCartPage() {
  renderCart();
}

function renderCart() {
  const cart    = getCart();
  const listEl  = document.getElementById('cart-items');
  const emptyEl = document.getElementById('cart-empty');
  const summaryEl = document.getElementById('order-summary');

  if (!listEl) return;

  if (cart.length === 0) {
    listEl.innerHTML = '';
    if (emptyEl)   emptyEl.style.display = 'block';
    if (summaryEl) summaryEl.style.display = 'none';
    return;
  }

  if (emptyEl)   emptyEl.style.display = 'none';
  if (summaryEl) summaryEl.style.display = 'block';

  listEl.innerHTML = cart.map(item => `
    <div class="cart-item" id="cart-item-${item.key.replace(/[^a-z0-9]/gi, '_')}">
      <div class="cart-item-img">
        <img src="images/${item.img}" alt="${item.name}"
             onerror="this.src=''; this.parentElement.style.background='var(--bg-alt)'">
      </div>
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-meta">${item.color ? 'Color: ' + item.color : 'Solid Wood · Beige'}</p>
        <div class="cart-item-qty">
          <button class="cart-qty-btn" onclick="changeCartQty('${item.key}', -1)">−</button>
          <span class="cart-qty-val" id="qty-${item.key.replace(/[^a-z0-9]/gi, '_')}">${item.qty}</span>
          <button class="cart-qty-btn" onclick="changeCartQty('${item.key}', 1)">+</button>
        </div>
      </div>
      <div class="cart-item-right">
        <p class="cart-item-price">${formatPrice(item.price * item.qty)}</p>
        <button class="remove-btn" onclick="handleRemove('${item.key}')" aria-label="Remove item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>`).join('');

  updateSummary();
}

function changeCartQty(key, delta) {
  const newQty = updateCartQty(key, delta);
  const safeKey = key.replace(/[^a-z0-9]/gi, '_');
  const qtyEl = document.getElementById('qty-' + safeKey);
  if (qtyEl) qtyEl.textContent = newQty;
  updateSummary();
  updateCartBadge();
}

function handleRemove(key) {
  removeFromCart(key);
  showToast('Item removed from cart', 'remove');
  renderCart();
  updateCartBadge();
}

function updateSummary() {
  const cart     = getCart();
  const subtotal = getCartTotal();
  const shipping = subtotal >= 25000 ? 0 : 499;
  const total    = subtotal + shipping;

  const el = id => document.getElementById(id);
  if (el('summary-subtotal')) el('summary-subtotal').textContent = formatPrice(subtotal);
  if (el('summary-shipping')) el('summary-shipping').textContent = shipping === 0 ? 'Free' : formatPrice(shipping);
  if (el('summary-total'))    el('summary-total').textContent    = formatPrice(total);
  if (el('cart-count'))       el('cart-count').textContent       = `(${cart.reduce((s,i)=>s+i.qty,0)} items)`;
}

// ── DOMContentLoaded ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();

  const page = document.body.dataset.page;
  if (page === 'shop')    initShopPage();
  if (page === 'product') initProductPage();
  if (page === 'cart')    initCartPage();
});
