/* ============================================================
   FURNI. — JavaScript
   Cart · Wishlist · Product Filtering · WhatsApp Orders
   ============================================================ */

const WHATSAPP_NUMBER = '0000000000';

const PRODUCTS = [
  { id: 1, name: 'Modular Sofa', price: 32999, category: 'living-room', material: 'upholstery', img: 'g.jpg' },
  { id: 2, name: 'Solid Wood Dining Table', price: 34999, category: 'dining-room', material: 'wood', img: 'g.jpg' },
  { id: 3, name: 'Minimal Lounge Chair', price: 14999, category: 'living-room', material: 'wood', img: 'g.jpg' },
  { id: 4, name: 'Wooden Bed Frame', price: 22999, category: 'bedroom', material: 'wood', img: 'g.jpg' },
  { id: 5, name: 'Study Desk', price: 15499, category: 'office', material: 'wood', img: 'g.jpg' },
  { id: 6, name: 'Wardrobe', price: 26999, category: 'storage', material: 'wood', img: 'g.jpg' },
  { id: 7, name: 'Wordy Desk', price: 22999, category: 'office', material: 'metal', img: 'g.jpg' },
  { id: 8, name: 'Wooden Bed Frame II', price: 24999, category: 'bedroom', material: 'wood', img: 'g.jpg' },
];

function getCart() { try { return JSON.parse(localStorage.getItem('furni_cart')) || []; } catch { return []; } }
function saveCart(cart) { localStorage.setItem('furni_cart', JSON.stringify(cart)); }
function formatPrice(amount) { return '₹' + Number(amount).toLocaleString('en-IN'); }

function updateCartBadge() {
  const total = getCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(el => { el.textContent = total; el.style.display = total ? 'flex' : 'none'; });
}

function addToCart(productId, qty = 1, extras = {}) {
  const product = PRODUCTS.find(p => p.id === Number(productId));
  if (!product) return;
  const cart = getCart();
  const key = `${product.id}-${extras.color || ''}-${extras.material || ''}-${extras.fabric || ''}`;
  const existing = cart.find(i => i.key === key);
  if (existing) existing.qty += qty;
  else cart.push({ key, id: product.id, name: product.name, price: product.price, img: product.img, qty, ...extras });
  saveCart(cart); updateCartBadge(); showToast(`"${product.name}" added to cart`, 'check');
}

function removeFromCart(key) { saveCart(getCart().filter(i => i.key !== key)); updateCartBadge(); }
function updateCartQty(key, delta) { const c=getCart(), i=c.find(x=>x.key===key); if(!i)return; i.qty=Math.max(1,i.qty+delta); saveCart(c); return i.qty; }
function getCartTotal() { return getCart().reduce((s,i)=>s+i.price*i.qty,0); }

function getWishlist() { try { const v=JSON.parse(localStorage.getItem('furni_wishlist')); return Array.isArray(v)?v.map(Number):[]; } catch { return []; } }
function toggleWishlist(productId) {
  const id=Number(productId), list=getWishlist(), idx=list.indexOf(id);
  if(idx>-1){list.splice(idx,1);localStorage.setItem('furni_wishlist',JSON.stringify(list));return false;}
  list.push(id);localStorage.setItem('furni_wishlist',JSON.stringify(list));return true;
}
function isWishlisted(productId) { return getWishlist().includes(Number(productId)); }

function showToast(message, icon='check') {
  let container=document.querySelector('.toast-container');
  if(!container){container=document.createElement('div');container.className='toast-container';document.body.appendChild(container);}
  const icons={check:'✓',heart:'♥',remove:'×'}, toast=document.createElement('div');
  toast.className='toast'; toast.innerHTML=`<span style="font-size:18px">${icons[icon]||'✓'}</span><span>${message}</span>`;
  container.appendChild(toast); setTimeout(()=>toast.remove(),2900);
}

function openWhatsApp(message) { window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer'); }

function initNavbar() {
  updateCartBadge();
  const hamburger=document.querySelector('.hamburger'), mobileNav=document.querySelector('.mobile-nav');
  if(hamburger&&mobileNav){hamburger.addEventListener('click',()=>{const open=mobileNav.classList.toggle('open');hamburger.setAttribute('aria-expanded',String(open));});mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mobileNav.classList.remove('open')));}
  const path=window.location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-links a,.mobile-nav a').forEach(a=>{const p=(a.getAttribute('href')||'').split('?')[0].split('#')[0];if(p===path)a.classList.add('active');});
  const btn=document.querySelector('.search-btn'), overlay=document.querySelector('.search-overlay'), close=document.querySelector('.search-close'), input=document.querySelector('.search-box input');
  if(btn&&overlay){btn.addEventListener('click',()=>{overlay.classList.add('open');setTimeout(()=>input?.focus(),100);});close?.addEventListener('click',()=>overlay.classList.remove('open'));overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.classList.remove('open');});document.addEventListener('keydown',e=>{if(e.key==='Escape')overlay.classList.remove('open');if(e.key==='Enter'&&document.activeElement===input&&input.value.trim())window.location.href=`shop.html?q=${encodeURIComponent(input.value.trim())}`;});}
}

function buildProductCard(product) {
  const wished=isWishlisted(product.id);
  return `<article class="product-card" onclick="window.location.href='product.html?id=${product.id}'"><div class="product-img-wrap"><img src="images/${product.img}" alt="${product.name}" loading="lazy"><button class="wishlist-btn ${wished?'active':''}" onclick="handleWishlist(event,${product.id},this)" aria-label="${wished?'Remove from wishlist':'Add to wishlist'}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${wished?'currentColor':'none'}" stroke="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button></div><div class="product-info"><p class="product-name">${product.name}</p><p class="product-price">${formatPrice(product.price)}</p></div></article>`;
}
function handleWishlist(e,id,btn){e.stopPropagation();const added=toggleWishlist(id),svg=btn.querySelector('svg');btn.classList.toggle('active',added);svg?.setAttribute('fill',added?'currentColor':'none');btn.setAttribute('aria-label',added?'Remove from wishlist':'Add to wishlist');showToast(added?'Added to wishlist':'Removed from wishlist',added?'heart':'remove');}

function initShopPage(){
  const grid=document.getElementById('products-grid');if(!grid)return;
  let category='all',materials=new Set(),maxPrice=102000;
  const params=new URLSearchParams(location.search), requested=params.get('cat'), q=(params.get('q')||'').trim().toLowerCase();
  if(requested&&['all',...PRODUCTS.map(p=>p.category)].includes(requested)){category=requested;document.querySelectorAll('.cat-filter-item').forEach(x=>x.classList.toggle('active',x.dataset.cat===category));}
  function render(){const filtered=PRODUCTS.filter(p=>(category==='all'||p.category===category)&&(materials.size===0||materials.has(p.material))&&p.price<=maxPrice&&(!q||`${p.name} ${p.category} ${p.material}`.toLowerCase().includes(q)));const count=document.getElementById('products-count');if(count)count.innerHTML=`Showing <strong>${filtered.length}</strong> of <strong>${PRODUCTS.length}</strong> furniture`;grid.innerHTML=filtered.length?filtered.map(buildProductCard).join(''):`<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted)">No products match your filters.</div>`;}
  document.querySelectorAll('.cat-filter-item').forEach(x=>x.addEventListener('click',()=>{document.querySelectorAll('.cat-filter-item').forEach(i=>i.classList.remove('active'));x.classList.add('active');category=x.dataset.cat;render();}));
  document.querySelectorAll('.check-item').forEach(x=>x.addEventListener('click',()=>{x.classList.toggle('checked');x.classList.contains('checked')?materials.add(x.dataset.material):materials.delete(x.dataset.material);render();}));
  const range=document.getElementById('price-range'), val=document.getElementById('price-max-val'), fill=document.getElementById('range-fill');
  range?.addEventListener('input',()=>{maxPrice=+range.value;if(val)val.textContent=formatPrice(maxPrice);if(fill)fill.style.width=`${((maxPrice-5000)/97000)*100}%`;render();});
  const sort=document.getElementById('sort-select');sort?.addEventListener('change',()=>{const copy=[...PRODUCTS],v=sort.value;if(v==='price-asc')copy.sort((a,b)=>a.price-b.price);if(v==='price-desc')copy.sort((a,b)=>b.price-a.price);if(v==='newest')copy.sort((a,b)=>b.id-a.id);const original=PRODUCTS.slice();PRODUCTS.splice(0,PRODUCTS.length,...copy);render();PRODUCTS.splice(0,PRODUCTS.length,...original);});
  render();
}

function initProductPage(){
  const id=Number(new URLSearchParams(location.search).get('id')||3), product=PRODUCTS.find(p=>p.id===id)||PRODUCTS.find(p=>p.id===3);if(!product)return;
  const text=(s,v)=>{const e=document.querySelector(s);if(e)e.textContent=v;};text('.product-detail-name',product.name);text('.product-detail-price',formatPrice(product.price));text('.breadcrumb span:last-child',product.name);document.title=`${product.name} — Furni.`;
  const main=document.getElementById('main-product-img');if(main){main.src=`images/${product.img}`;main.alt=product.name;}
  document.querySelectorAll('.thumb-item img').forEach(i=>{i.src=`images/${product.img}`;i.alt=product.name;});
  document.querySelectorAll('.thumb-item').forEach(t=>t.addEventListener('click',()=>{document.querySelectorAll('.thumb-item').forEach(x=>x.classList.remove('active'));t.classList.add('active');if(main)main.src=t.querySelector('img').src;}));
  document.querySelectorAll('.detail-color-swatch').forEach(s=>s.addEventListener('click',()=>{document.querySelectorAll('.detail-color-swatch').forEach(x=>x.classList.remove('active'));s.classList.add('active');}));
  document.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>{c.closest('.option-chips')?.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));c.classList.add('active');}));
  const qty=document.getElementById('qty-input');document.querySelector('.qty-inc')?.addEventListener('click',()=>{if(qty)qty.value=Math.min(99,+qty.value+1);});document.querySelector('.qty-dec')?.addEventListener('click',()=>{if(qty)qty.value=Math.max(1,+qty.value-1);});
  document.getElementById('add-to-cart-btn')?.addEventListener('click',()=>{const material=document.querySelectorAll('.option-chips')[0]?.querySelector('.chip.active')?.textContent.trim()||'';const fabric=document.querySelectorAll('.option-chips')[1]?.querySelector('.chip.active')?.textContent.trim()||'';const color=document.querySelector('.detail-color-swatch.active')?.dataset.color||'';addToCart(product.id,+(qty?.value||1),{material,fabric,color});});
  const wish=document.getElementById('wishlist-btn');function sync(){if(!wish)return;const on=isWishlisted(product.id);wish.classList.toggle('active',on);wish.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${on?'currentColor':'none'}" stroke="currentColor" stroke-width="2" style="width:18px;height:18px"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>${on?'Wishlisted':'Add to Wishlist'}`;}sync();wish?.addEventListener('click',()=>{const a=toggleWishlist(product.id);sync();showToast(a?'Added to wishlist':'Removed from wishlist',a?'heart':'remove');});
  const related=document.getElementById('related-grid');if(related)related.innerHTML=PRODUCTS.filter(p=>p.id!==product.id).slice(0,4).map(buildProductCard).join('');
}

function renderCart(){const cart=getCart(),list=document.getElementById('cart-items'),empty=document.getElementById('cart-empty'),summary=document.getElementById('order-summary');if(!list)return;if(!cart.length){list.innerHTML='';if(empty)empty.style.display='block';if(summary)summary.style.display='none';return;}if(empty)empty.style.display='none';if(summary)summary.style.display='block';list.innerHTML=cart.map(i=>`<div class="cart-item"><div class="cart-item-img"><img src="images/${i.img}" alt="${i.name}"></div><div class="cart-item-info"><p class="cart-item-name">${i.name}</p><p class="cart-item-meta">${[i.material?'Material: '+i.material:'',i.fabric?'Fabric: '+i.fabric:'',i.color?'Color: '+i.color:''].filter(Boolean).join(' · ')||'Standard configuration'}</p><div class="cart-item-qty"><button class="cart-qty-btn" onclick="changeCartQty('${i.key}',-1)">−</button><span class="cart-qty-val" id="qty-${i.key.replace(/[^a-z0-9]/gi,'_')}">${i.qty}</span><button class="cart-qty-btn" onclick="changeCartQty('${i.key}',1)">+</button></div></div><div class="cart-item-right"><p class="cart-item-price">${formatPrice(i.price*i.qty)}</p><button class="remove-btn" onclick="handleRemove('${i.key}')" aria-label="Remove item">×</button></div></div>`).join('');updateSummary();}
function changeCartQty(key,delta){const q=updateCartQty(key,delta),e=document.getElementById('qty-'+key.replace(/[^a-z0-9]/gi,'_'));if(e)e.textContent=q;updateSummary();updateCartBadge();}
function handleRemove(key){removeFromCart(key);showToast('Item removed from cart','remove');renderCart();}
function updateSummary(){const c=getCart(),sub=getCartTotal(),ship=sub>=25000?0:499,total=sub+ship;const e=id=>document.getElementById(id);if(e('summary-subtotal'))e('summary-subtotal').textContent=formatPrice(sub);if(e('summary-shipping'))e('summary-shipping').textContent=ship?'₹499':'Free';if(e('summary-total'))e('summary-total').textContent=formatPrice(total);if(e('cart-count'))e('cart-count').textContent=`(${c.reduce((s,i)=>s+i.qty,0)} items)`;}
function checkoutCartViaWhatsApp(){const c=getCart();if(!c.length){showToast('Your cart is empty!','remove');return;}const sub=getCartTotal(),ship=sub>=25000?0:499,total=sub+ship,items=c.map((i,n)=>`${n+1}. ${i.name}\n   Qty: ${i.qty}\n   Unit price: ${formatPrice(i.price)}\n   ${[i.material?'Material: '+i.material:'',i.fabric?'Fabric: '+i.fabric:'',i.color?'Color: '+i.color:''].filter(Boolean).join(', ')||'Standard configuration'}\n   Line total: ${formatPrice(i.price*i.qty)}`).join('\n\n');openWhatsApp(`Hello Furni., I would like to place an order.\n\nORDER DETAILS\n${items}\n\nSubtotal: ${formatPrice(sub)}\nShipping: ${ship?'₹499':'Free'}\nTotal: ${formatPrice(total)}\n\nPlease confirm availability, delivery details, and next steps.`);}

function initCartPage(){renderCart();}
document.addEventListener('DOMContentLoaded',()=>{initNavbar();const page=document.body.dataset.page;if(page==='shop')initShopPage();if(page==='product')initProductPage();if(page==='cart')initCartPage();});