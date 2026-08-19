/* Wood & Grains Furniture — shared site JavaScript
   Products now live in products.json — edit that file (or use /admin) to add/change products.
   No cart, no wishlist, no checkout: every product links straight to a WhatsApp enquiry. */

const WHATSAPP_NUMBER = '9746841327';
let PRODUCTS = [];

const formatPrice = n => '₹' + Number(n).toLocaleString('en-IN');

function openWhatsApp(message) {
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
}

function enquireProduct(p) {
  openWhatsApp(`Hello Wood & Grains Furniture, I'm interested in the "${p.name}" (${formatPrice(p.price)}). Could you share more details and availability?`);
}

async function loadProducts() {
  if (PRODUCTS.length) return PRODUCTS;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/products?select=*&order=created_at.desc`,
      { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
    );
    const data = await res.json();
    PRODUCTS = Array.isArray(data) ? data.map(p => ({ ...p, image: p.image_url })) : [];
  } catch (e) {
    console.error('Could not load products from Supabase', e);
    PRODUCTS = [];
  }
  return PRODUCTS;
}

function showToast(message, icon = 'check') {
  let c = document.querySelector('.toast-container');
  if (!c) { c = document.createElement('div'); c.className = 'toast-container'; document.body.appendChild(c); }
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<span>${icon === 'redirect' ? '↗' : '✓'}</span><span>${message}</span>`;
  c.appendChild(t);
  setTimeout(() => t.remove(), 2900);
}

function initNavbar() {
  const h = document.querySelector('.hamburger'), m = document.querySelector('.mobile-nav');
  if (h && m) {
    h.addEventListener('click', () => { const o = m.classList.toggle('open'); h.setAttribute('aria-expanded', o); });
    m.querySelectorAll('a').forEach(a => a.addEventListener('click', () => m.classList.remove('open')));
  }
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a,.mobile-nav a').forEach(a => {
    const p = (a.getAttribute('href') || '').split('?')[0].split('#')[0];
    if (p === path) a.classList.add('active');
  });
  const b = document.querySelector('.search-btn'), o = document.querySelector('.search-overlay'),
        cl = document.querySelector('.search-close'), inp = document.querySelector('.search-box input');
  if (b && o) {
    b.addEventListener('click', () => { o.classList.add('open'); setTimeout(() => inp?.focus(), 100); });
    cl?.addEventListener('click', () => o.classList.remove('open'));
    o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') o.classList.remove('open');
      if (e.key === 'Enter' && document.activeElement === inp && inp.value.trim())
        location.href = `shop.html?q=${encodeURIComponent(inp.value.trim())}`;
    });
  }
}

function buildProductCard(p) {
  return `<article class="product-card">
    <a href="product.html?id=${p.id}" class="product-img-wrap">
      <img src="${p.image}" alt="${p.name}" loading="lazy">
    </a>
    <div class="product-info">
      <a href="product.html?id=${p.id}"><p class="product-name">${p.name}</p></a>
      <p class="product-price">${formatPrice(p.price)}</p>
      <button class="btn btn-primary btn-sm" style="width:100%;margin-top:8px" onclick='enquireProduct(${JSON.stringify(p)})'>
        Enquire on WhatsApp
      </button>
    </div>
  </article>`;
}

async function initShopPage() {
  const g = document.getElementById('products-grid');
  if (!g) return;
  await loadProducts();
  let cat = 'all', mats = new Set(), max = 102000;
  const q = new URLSearchParams(location.search), wanted = q.get('cat'), search = (q.get('q') || '').toLowerCase();
  if (wanted && ['all', ...PRODUCTS.map(p => p.category)].includes(wanted)) {
    cat = wanted;
    document.querySelectorAll('.cat-filter-item').forEach(x => x.classList.toggle('active', x.dataset.cat === cat));
  }
  function render() {
    const a = PRODUCTS.filter(p =>
      (cat === 'all' || p.category === cat) &&
      (!mats.size || mats.has(p.material)) &&
      p.price <= max &&
      (!search || `${p.name} ${p.category} ${p.material}`.toLowerCase().includes(search))
    );
    const c = document.getElementById('products-count');
    if (c) c.innerHTML = `Showing <strong>${a.length}</strong> of <strong>${PRODUCTS.length}</strong> furniture`;
    g.innerHTML = a.length ? a.map(buildProductCard).join('') :
      '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted)">No products match your filters.</div>';
  }
  document.querySelectorAll('.cat-filter-item').forEach(x => x.addEventListener('click', () => {
    document.querySelectorAll('.cat-filter-item').forEach(i => i.classList.remove('active'));
    x.classList.add('active'); cat = x.dataset.cat; render();
  }));
  document.querySelectorAll('.check-item').forEach(x => x.addEventListener('click', () => {
    x.classList.toggle('checked');
    x.classList.contains('checked') ? mats.add(x.dataset.material) : mats.delete(x.dataset.material);
    render();
  }));
  const r = document.getElementById('price-range');
  r?.addEventListener('input', () => {
    max = +r.value;
    const v = document.getElementById('price-max-val'), f = document.getElementById('range-fill');
    if (v) v.textContent = formatPrice(max);
    if (f) f.style.width = `${((max - 5000) / 97000) * 100}%`;
    render();
  });
  render();
}

async function initProductPage() {
  await loadProducts();
  const id = Number(new URLSearchParams(location.search).get('id') || (PRODUCTS[0]?.id ?? 1));
  const p = PRODUCTS.find(x => x.id === id) || PRODUCTS[0];
  if (!p) return;
  const set = (s, v) => { const e = document.querySelector(s); if (e) e.textContent = v; };
  set('.product-detail-name', p.name);
  set('.product-detail-price', formatPrice(p.price));
  set('.breadcrumb span:last-child', p.name);
  document.title = `${p.name} — Wood & Grains Furniture`;
  const main = document.getElementById('main-product-img');
  if (main) { main.src = p.image; main.alt = p.name; }
  document.querySelectorAll('.thumb-item img').forEach(i => { i.src = p.image; i.alt = p.name; });
  document.querySelectorAll('.thumb-item').forEach(t => t.addEventListener('click', () => {
    document.querySelectorAll('.thumb-item').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    if (main) main.src = t.querySelector('img').src;
  }));
  const descEl = document.querySelector('.product-detail-desc');
  if (descEl && p.description) descEl.textContent = p.description;

  const enquireBtn = document.getElementById('enquire-btn');
  if (enquireBtn) enquireBtn.addEventListener('click', () => enquireProduct(p));

  const rg = document.getElementById('related-grid');
  if (rg) rg.innerHTML = PRODUCTS.filter(x => x.id !== p.id).slice(0, 4).map(buildProductCard).join('');
}

function customBuildWhatsApp() {
  const v = id => document.getElementById(id)?.value.trim() || 'Not provided';
  showToast('Redirecting you to our team on WhatsApp to complete your request', 'redirect');
  openWhatsApp(`Hello Wood & Grains Furniture, I would like to request a custom furniture build.

CUSTOM BUILD REQUEST
Name: ${v('cf-name')}
Email: ${v('cf-email')}
Phone: ${v('cf-phone')}
Furniture type: ${v('cf-type')}
Budget: ${v('cf-budget')}
Timeline: ${v('cf-timeline')}
Description: ${v('cf-desc')}

Please contact me with the quote and next steps.`);
}

function injectMobileStyles() {
  const s = document.createElement('style');
  s.textContent = `
@media(max-width:700px){.container{padding-left:18px!important;padding-right:18px!important}.navbar{height:64px}.navbar .container{min-height:64px;padding-left:18px!important;padding-right:18px!important;gap:8px}.footer-grid{grid-template-columns:1fr!important;gap:28px!important}.footer-brand{max-width:100%}.footer-brand .nav-logo{font-size:18px;line-height:1.2;white-space:normal}.footer-col{border-top:1px solid var(--border-lt);padding-top:20px}.footer-newsletter{border-top:1px solid var(--border-lt);padding-top:20px}.newsletter-form{display:flex!important;width:100%}.newsletter-form input{min-width:0!important;flex:1}.footer-bottom{flex-direction:column!important;align-items:flex-start!important;gap:14px!important;padding-bottom:24px}.footer-socials{align-self:flex-start}.custom-form-section{padding:28px 18px!important;margin-top:40px!important}.form-grid{gap:16px!important}.product-detail-grid{grid-template-columns:1fr!important}.related-grid,.products-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important}.product-info{padding:10px!important}.product-name{font-size:13px!important}.product-price{font-size:13px!important}.breadcrumb{padding-top:20px!important}.section-title{line-height:1.12}.search-box{width:calc(100% - 28px)!important}.btn-lg{min-height:46px}.custom-build-hero{grid-template-columns:1fr!important}.custom-build-img{min-height:260px!important}.custom-options-grid{grid-template-columns:1fr 1fr!important;gap:12px!important}.custom-option-card{padding:18px 14px!important}.custom-option-card h3{font-size:14px!important}.custom-option-card p{font-size:12px!important}}
@media(max-width:420px){.related-grid,.products-grid{grid-template-columns:1fr 1fr!important}.custom-options-grid{grid-template-columns:1fr!important}}`;
  document.head.appendChild(s);
}

document.addEventListener('submit', e => {
  if (document.body.dataset.page === 'custom-build' && e.target.matches('form')) {
    e.preventDefault(); e.stopImmediatePropagation(); customBuildWhatsApp();
  }
}, true);

document.addEventListener('DOMContentLoaded', async () => {
  injectMobileStyles();
  initNavbar();
  const p = document.body.dataset.page;
  if (p === 'shop') initShopPage();
  if (p === 'product') initProductPage();
  if (p === 'home') {
    await loadProducts();
    const g = document.getElementById('featured-grid');
    if (g) g.innerHTML = PRODUCTS.slice(0, 4).map(buildProductCard).join('');
  }
});
