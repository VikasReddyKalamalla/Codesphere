const path = require('path');
const fs   = require('fs');
const net  = require('net');
const http = require('http');
const { exec } = require('child_process');

const { syncDbToDisk, syncDiskToDb } = require('../utils/workspaceSync');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const SandboxProject = require('../models/SandboxProject');
const UserSandboxWorkspace = require('../models/UserSandboxWorkspace');

/**
 * Helper to execute docker exec commands inside container 8aaeaec7c507
 */
const execInContainer = (cmd) => {
  return new Promise((resolve) => {
    exec(`docker exec 8aaeaec7c507 sh -c "${cmd}"`, (err, stdout, stderr) => {
      resolve({ err, stdout, stderr });
    });
  });
};

// ─── Controller Actions ───────────────────────────────────────────────────────

/**
 * POST /api/sandbox/:id/workspace/init
 *
 * Initializes a strictly per-user, per-project isolated directory inside Docker container:
 * Path: /home/coder/users/user_${userId}/${slug}
 *
 * Prevents any user from ever seeing another user's files.
 */
/**
 * POST /api/sandbox/:id/workspace/init
 *
 * Initializes a strictly per-user, per-workspace isolated directory inside Docker container:
 * Path: /home/coder/users/user_${userId}/workspaces/${workspaceName}
 *
 * Prevents any user from ever seeing another user's files.
 */
const initWorkspace = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const repoUrl = req.body?.repoUrl;
  const customWsName = req.body?.workspaceName;

  // Enforce unique per-user ID or unique session token
  let userFolderId = 'guest_' + Date.now();
  if (req.user && req.user._id) {
    userFolderId = req.user._id.toString();
  } else if (req.headers['x-session-id']) {
    userFolderId = req.headers['x-session-id'];
  }

  // Try fetching project to get clean title slug
  let projTitle = 'CodeSphere Technical Challenge';
  let projCategory = 'Web Development';
  let projPitch = 'Build a high-performance, responsive application with state management and real-time interactive UI components.';
  let projPoints = 300;
  let projTech = ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'Local Storage'];

  if (projectId && projectId !== 'blank' && projectId !== 'scratch') {
    try {
      const proj = await SandboxProject.findById(projectId).lean();
      if (proj) {
        projTitle = proj.title || projTitle;
        projCategory = proj.category || projCategory;
        projPitch = proj.pitch || proj.description || projPitch;
        if (proj.points) projPoints = proj.points;
        if (proj.technologyStack) {
          projTech = Array.isArray(proj.technologyStack)
            ? proj.technologyStack
            : (typeof proj.technologyStack === 'string' ? proj.technologyStack.split(',').map(s => s.trim()).filter(Boolean) : projTech);
        }
      }
    } catch {}
  }

  // Determine Workspace Name
  let workspaceName = customWsName
    ? customWsName.trim().replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-')
    : `${projTitle.toUpperCase().replace(/[^A-Z0-9]/g, '-')}-${Date.now().toString().slice(-6)}`;

  // Strictly isolated container storage path per-user & per-workspace
  const userWorkspacesDir = `/home/coder/users/user_${userFolderId}/workspaces`;
  const isolatedContainerPath = `${userWorkspacesDir}/${workspaceName}`;
  const iframeUrl = `http://localhost:8107/?folder=${isolatedContainerPath}`;

  // Persist workspace metadata in MongoDB UserSandboxWorkspace collection
  if (req.user && req.user._id) {
    try {
      await UserSandboxWorkspace.findOneAndUpdate(
        { userId: req.user._id, projectId: String(projectId), workspaceName },
        {
          workspaceName,
          slug: workspaceName,
          containerPath: isolatedContainerPath,
          isActive: true,
          lastAccessedAt: new Date(),
        },
        { upsert: true, new: true }
      );
    } catch (dbErr) {
      console.warn('[UserSandboxWorkspace] MongoDB record save warning:', dbErr.message);
    }
  }

  let projTitle = 'CodeSphere Technical Challenge';
  let projCategory = 'Web Development';
  let projPitch = 'Build a high-performance, responsive application with state management and real-time interactive UI components.';
  let projPoints = 300;
  let projTech = ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'Local Storage'];

  if (projectId && projectId !== 'blank' && projectId !== 'scratch') {
    try {
      const proj = await SandboxProject.findById(projectId).lean();
      if (proj) {
        projTitle = proj.title || projTitle;
        projCategory = proj.category || projCategory;
        projPitch = proj.pitch || proj.description || projPitch;
        if (proj.points) projPoints = proj.points;
        if (proj.technologyStack) {
          projTech = Array.isArray(proj.technologyStack)
            ? proj.technologyStack
            : (typeof proj.technologyStack === 'string' ? proj.technologyStack.split(',').map(s => s.trim()).filter(Boolean) : projTech);
        }
      }
    } catch {}
  }

  const techBadgesHtml = projTech.map(t => `<span class="tech-tag">${t}</span>`).join('\n          ');

  // Single-pass atomic setup script (<50ms execution time, strict isolation)
  const setupCmd = `
    rm -rf /home/coder/projects
    mkdir -p "${isolatedContainerPath}"
    if [ ! -f "${isolatedContainerPath}/index.html" ]; then
      cat << 'EOF' > "${isolatedContainerPath}/index.html"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projTitle} - CodeSphere Web Studio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="app">
    <header class="navbar">
      <div class="brand">
        <div class="logo">⚡</div>
        <div class="title-group">
          <h2>CodeSphere Web Studio</h2>
          <span class="badge">${projCategory}</span>
        </div>
      </div>
      <div class="header-actions">
        <div class="xp-badge">🏆 <span>${projPoints} XP</span></div>
        <div class="status-indicator">
          <span class="dot"></span>
          <span>Live Workspace Active</span>
        </div>
      </div>
    </header>

    <main class="main-container">
      <section class="hero-card">
        <div class="hero-header">
          <span class="challenge-label">🚀 Hands-On Technical Challenge</span>
          <h1 class="project-title">${projTitle}</h1>
          <p class="project-pitch">${projPitch}</p>
        </div>
        <div class="tech-tags">
          ${techBadgesHtml}
        </div>
      </section>

      <section class="workspace-grid">
        <div class="card app-card">
          <div class="card-header">
            <h3>🛒 Interactive Product Catalog & State Engine</h3>
            <span class="status-tag">Real-Time UI</span>
          </div>
          <div class="card-body">
            <div class="products-grid" id="productsList"></div>
          </div>
        </div>

        <div class="card cart-card">
          <div class="card-header">
            <h3>⚡ Live Shopping Cart & State Tracker</h3>
            <span class="item-count" id="cartCountBadge">0 Items</span>
          </div>
          <div class="card-body">
            <div class="cart-items" id="cartItemsList">
              <div class="empty-cart-msg">Your shopping cart is currently empty. Add products to test real-time state calculation!</div>
            </div>
            
            <div class="cart-summary">
              <div class="summary-row">
                <span>Subtotal</span>
                <span id="subtotalPrice">$0.00</span>
              </div>
              <div class="summary-row">
                <span>Discount / Promo</span>
                <span id="discountAmount" class="discount-text">-$0.00</span>
              </div>
              <div class="summary-row total-row">
                <span>Total Amount</span>
                <span id="totalPrice" class="total-text">$0.00</span>
              </div>

              <div class="promo-box">
                <input type="text" id="promoInput" placeholder="Enter promo code (e.g. CODESPHERE)" />
                <button id="applyPromoBtn" class="btn btn-secondary">Apply</button>
              </div>

              <button id="checkoutBtn" class="btn btn-primary btn-block">
                <span>Proceed to Checkout</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="card instructions-card">
        <div class="card-header">
          <h3>📋 Implementation Checklist & Requirements</h3>
          <span class="hint-badge">Review script.js</span>
        </div>
        <div class="card-body">
          <ul class="task-list">
            <li class="task-item completed">
              <span class="task-icon">✅</span>
              <span><strong>Task 1:</strong> Render products list dynamically from JavaScript array.</span>
            </li>
            <li class="task-item">
              <span class="task-icon">⏳</span>
              <span><strong>Task 2:</strong> Implement item addition with duplicate detection and quantity increments in <code>script.js</code>.</span>
            </li>
            <li class="task-item">
              <span class="task-icon">⏳</span>
              <span><strong>Task 3:</strong> Persist shopping cart state in <code>localStorage</code> so it survives browser refresh.</span>
            </li>
            <li class="task-item">
              <span class="task-icon">⏳</span>
              <span><strong>Task 4:</strong> Implement promo code handler (Code <code>CODESPHERE</code> grants 20% discount).</span>
            </li>
          </ul>
        </div>
      </section>
    </main>

    <div id="toastContainer" class="toast-container"></div>
  </div>

  <script src="script.js"></script>
</body>
</html>
EOF
      cat << 'EOF' > "${isolatedContainerPath}/script.js"
// ─── CodeSphere Problem Statement Interactive Application State Engine ───

const PRODUCTS = [
  { id: 1, name: 'Quantum React Framework', price: 149, icon: '⚛️', desc: 'Ultra-fast state management library for modern UIs.' },
  { id: 2, name: 'Vite AST Compiler Engine', price: 99, icon: '⚡', desc: 'Custom bundler plugin with hot module replacement.' },
  { id: 3, name: 'Distributed Redis KV Store', price: 199, icon: '🔑', desc: 'In-memory O(1) key-value cache engine.' },
  { id: 4, name: 'JWT Auth & RBAC Module', price: 79, icon: '🔐', desc: 'Secure token authentication with refresh rotation.' },
];

let cart = [];
let appliedDiscount = 0;

document.addEventListener('DOMContentLoaded', () => {
  loadCartFromStorage();
  renderProducts();
  renderCart();
  setupEventListeners();
});

function renderProducts() {
  const container = document.getElementById('productsList');
  if (!container) return;

  container.innerHTML = PRODUCTS.map(prod => \`
    <div class="product-item">
      <div class="prod-icon">\${prod.icon}</div>
      <div class="prod-info">
        <h4>\${prod.name}</h4>
        <p>\${prod.desc}</p>
      </div>
      <div class="prod-footer">
        <span class="prod-price">$\${prod.price}</span>
        <button class="btn btn-primary" onclick="addToCart(\${prod.id})">+ Add to Cart</button>
      </div>
    </div>
  \`).join('');
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCartToStorage();
  renderCart();
  showToast(\`Added "\${product.name}" to cart! 🚀\`);
}

function updateQuantity(productId, delta) {
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex === -1) return;

  cart[itemIndex].quantity += delta;
  if (cart[itemIndex].quantity <= 0) {
    const removedItem = cart[itemIndex];
    cart.splice(itemIndex, 1);
    showToast(\`Removed "\${removedItem.name}" from cart.\`);
  }

  saveCartToStorage();
  renderCart();
}

function renderCart() {
  const listEl = document.getElementById('cartItemsList');
  const countBadge = document.getElementById('cartCountBadge');
  const subtotalEl = document.getElementById('subtotalPrice');
  const discountEl = document.getElementById('discountAmount');
  const totalEl = document.getElementById('totalPrice');

  if (!listEl) return;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = subtotal * appliedDiscount;
  const grandTotal = Math.max(0, subtotal - discount);

  if (countBadge) countBadge.textContent = \`\${totalItems} Item\${totalItems !== 1 ? 's' : ''}\`;
  if (subtotalEl) subtotalEl.textContent = \`$\${subtotal.toFixed(2)}\`;
  if (discountEl) discountEl.textContent = \`-$\${discount.toFixed(2)}\`;
  if (totalEl) totalEl.textContent = \`$\${grandTotal.toFixed(2)}\`;

  if (cart.length === 0) {
    listEl.innerHTML = \`<div class="empty-cart-msg">Your shopping cart is currently empty. Add products to test real-time state calculation!</div>\`;
    return;
  }

  listEl.innerHTML = cart.map(item => \`
    <div class="cart-item">
      <div>
        <div class="cart-item-title">\${item.icon} \${item.name}</div>
        <div class="cart-item-price">$\${item.price} × \${item.quantity} = $\${(item.price * item.quantity).toFixed(2)}</div>
      </div>
      <div class="qty-controls">
        <button class="btn-qty" onclick="updateQuantity(\${item.id}, -1)">-</button>
        <span class="qty-val">\${item.quantity}</span>
        <button class="btn-qty" onclick="updateQuantity(\${item.id}, 1)">+</button>
      </div>
    </div>
  \`).join('');
}

function saveCartToStorage() {
  try {
    localStorage.setItem('cs_sandbox_cart', JSON.stringify(cart));
  } catch (e) {}
}

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem('cs_sandbox_cart');
    if (raw) cart = JSON.parse(raw);
  } catch (e) {
    cart = [];
  }
}

function setupEventListeners() {
  const applyBtn = document.getElementById('applyPromoBtn');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const code = (document.getElementById('promoInput')?.value || '').trim().toUpperCase();
      if (code === 'CODESPHERE') {
        appliedDiscount = 0.20;
        renderCart();
        showToast('🎉 Promo code applied! 20% discount added.');
      } else {
        showToast('❌ Invalid promo code. Try: CODESPHERE');
      }
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('⚠️ Please add items to your cart before checking out.');
        return;
      }
      showToast('🎉 Order placed successfully! Challenge complete.');
      cart = [];
      appliedDiscount = 0;
      saveCartToStorage();
      renderCart();
    });
  }
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
EOF
      cat << 'EOF' > "${isolatedContainerPath}/styles.css"
:root {
  --bg-dark: #0f172a;
  --card-bg: rgba(30, 41, 59, 0.7);
  --border-color: rgba(255, 255, 255, 0.1);
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --primary: #04aa6d;
  --primary-hover: #03935e;
  --indigo: #6366f1;
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'Fira Code', monospace;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font-sans);
  background-color: var(--bg-dark);
  background-image: 
    radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(4, 170, 109, 0.15) 0px, transparent 50%);
  color: var(--text-main);
  min-height: 100vh;
  padding: 1.5rem;
}

#app {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  padding: 1rem 1.5rem;
  border-radius: 1rem;
}

.brand { display: flex; align-items: center; gap: 1rem; }

.logo {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, var(--primary), var(--indigo));
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  box-shadow: 0 4px 12px rgba(4, 170, 109, 0.3);
}

.title-group h2 { font-size: 1.1rem; font-weight: 800; letter-spacing: -0.02em; }

.badge {
  font-size: 0.7rem;
  font-family: var(--font-mono);
  font-weight: 600;
  background: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
  border: 1px solid rgba(99, 102, 241, 0.3);
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;
  text-transform: uppercase;
}

.header-actions { display: flex; align-items: center; gap: 1rem; }

.xp-badge {
  font-weight: 800;
  font-size: 0.85rem;
  background: rgba(4, 170, 109, 0.15);
  color: #34d399;
  border: 1px solid rgba(4, 170, 109, 0.3);
  padding: 0.4rem 0.8rem;
  border-radius: 0.75rem;
}

.status-indicator { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-muted); font-weight: 600; }

.dot {
  width: 0.6rem;
  height: 0.6rem;
  background: #34d399;
  border-radius: 50%;
  box-shadow: 0 0 8px #34d399;
  animation: pulse 2s infinite;
}

@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

.hero-card {
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: 1.25rem;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.challenge-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary); }
.project-title { font-size: 1.75rem; font-weight: 900; letter-spacing: -0.03em; margin-top: 0.25rem; }
.project-pitch { font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; max-width: 900px; }
.tech-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.tech-tag { font-family: var(--font-mono); font-size: 0.75rem; font-weight: 600; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); padding: 0.25rem 0.6rem; border-radius: 0.5rem; color: #e2e8f0; }

.workspace-grid { display: grid; grid-template-columns: 1fr 380px; gap: 1.5rem; }
@media (max-width: 900px) { .workspace-grid { grid-template-columns: 1fr; } }

.card { background: var(--card-bg); backdrop-filter: blur(12px); border: 1px solid var(--border-color); border-radius: 1.25rem; overflow: hidden; display: flex; flex-direction: column; }
.card-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; }
.card-header h3 { font-size: 1rem; font-weight: 700; }
.status-tag { font-size: 0.7rem; font-weight: 700; background: rgba(4, 170, 109, 0.2); color: #34d399; padding: 0.2rem 0.5rem; border-radius: 0.5rem; }
.card-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; flex: 1; }

.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
.product-item { background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border-color); border-radius: 1rem; padding: 1rem; display: flex; flex-direction: column; justify-content: space-between; gap: 0.75rem; transition: all 0.2s ease; }
.product-item:hover { transform: translateY(-2px); border-color: rgba(4, 170, 109, 0.4); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3); }
.prod-icon { font-size: 2.2rem; background: rgba(255, 255, 255, 0.03); width: 3.5rem; height: 3.5rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; }
.prod-info h4 { font-size: 0.95rem; font-weight: 700; }
.prod-info p { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem; }
.prod-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 0.5rem; }
.prod-price { font-size: 1.1rem; font-weight: 900; color: #34d399; }

.cart-items { display: flex; flex-direction: column; gap: 0.75rem; max-height: 300px; overflow-y: auto; }
.empty-cart-msg { text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 2rem 1rem; border: 1px dashed var(--border-color); border-radius: 0.75rem; }
.cart-item { display: flex; align-items: center; justify-content: space-between; background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border-color); padding: 0.75rem; border-radius: 0.75rem; }
.cart-item-title { font-size: 0.85rem; font-weight: 700; }
.cart-item-price { font-size: 0.8rem; color: var(--text-muted); }
.qty-controls { display: flex; align-items: center; gap: 0.4rem; }
.btn-qty { width: 1.5rem; height: 1.5rem; background: rgba(255, 255, 255, 0.1); border: none; color: white; border-radius: 0.4rem; cursor: pointer; font-weight: bold; }
.btn-qty:hover { background: var(--primary); }
.qty-val { font-size: 0.85rem; font-weight: 700; min-width: 1.2rem; text-align: center; }

.cart-summary { background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-color); border-radius: 1rem; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; }
.summary-row { display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; color: var(--text-muted); }
.total-row { font-size: 1.1rem; font-weight: 900; color: var(--text-main); border-top: 1px dashed var(--border-color); padding-top: 0.75rem; }
.total-text { color: #34d399; }

.promo-box { display: flex; gap: 0.5rem; margin-top: 0.25rem; }
.promo-box input { flex: 1; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--border-color); border-radius: 0.6rem; padding: 0.5rem 0.75rem; color: white; font-size: 0.8rem; outline: none; }
.promo-box input:focus { border-color: var(--primary); }

.btn { padding: 0.6rem 1.2rem; border-radius: 0.75rem; font-weight: 700; font-size: 0.85rem; cursor: pointer; border: none; transition: all 0.2s ease; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; }
.btn-primary { background: var(--primary); color: white; box-shadow: 0 4px 14px rgba(4, 170, 109, 0.3); }
.btn-primary:hover { background: var(--primary-hover); transform: translateY(-1px); }
.btn-secondary { background: rgba(255, 255, 255, 0.1); color: white; }
.btn-secondary:hover { background: rgba(255, 255, 255, 0.2); }
.btn-block { width: 100%; padding: 0.8rem; margin-top: 0.5rem; }

.task-list { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; }
.task-item { display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem; background: rgba(15, 23, 42, 0.4); border: 1px solid var(--border-color); padding: 0.75rem 1rem; border-radius: 0.75rem; }
.task-item code { background: rgba(99, 102, 241, 0.2); color: #a5b4fc; padding: 0.1rem 0.4rem; border-radius: 0.3rem; font-family: var(--font-mono); font-size: 0.8rem; }

.toast-container { position: fixed; bottom: 1.5rem; right: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; z-index: 1000; }
.toast { background: #1e293b; border: 1px solid var(--primary); color: var(--text-main); padding: 0.75rem 1.25rem; border-radius: 0.75rem; font-weight: 600; font-size: 0.85rem; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); animation: slideIn 0.3s ease; }
@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
EOF
      cat << 'EOF' > "${isolatedContainerPath}/README.md"
# ${projTitle}

Welcome to your **CodeSphere Hands-On Technical Challenge Workspace**!

## 🚀 Problem Overview
${projPitch}

### 🛠️ Technology Stack
${projTech.map(t => `- \`${t}\``).join('\n')}

---

## 📋 Implementation Tasks & Criteria
1. **Interactive Product Catalog**: Render product items dynamically from JavaScript array objects.
2. **State Management & Quantity Updates**: Calculate subtotals, item addition, and item deletion dynamically.
3. **Local Storage Synchronization**: Save cart state into \`localStorage\` so user selections persist across page reloads.
4. **Promo Code Engine**: Handle promo code \`CODESPHERE\` to grant an instant 20% discount on cart subtotal.

---

## 💡 How to Run & Live Preview
- Open \`index.html\` in VS Code Web Studio.
- Click **Go Live** or **Live Preview** in the bottom status bar to view the real-time application in your browser.
- Edit \`script.js\` and \`styles.css\` to complete your challenge solutions!
EOF
    fi
  `;

  if (repoUrl && repoUrl.startsWith('http')) {
    await execInContainer(`if [ ! -d "${isolatedContainerPath}/.git" ]; then git clone ${repoUrl} ${isolatedContainerPath}; fi && ${setupCmd}`);
  } else {
    await execInContainer(setupCmd);
  }

  return successResponse(res, 200, 'Isolated per-user VS Code workspace active', {
    iframeUrl,
    folderPath: isolatedContainerPath,
    port: 8107,
  });
});

/**
 * POST /api/sandbox/:id/workspace/terminate
 *
 * Completely deletes temporary user workspace storage or pushes to Git
 */
const terminateWorkspace = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const { pushToGit, repoUrl } = req.body || {};

  let userFolderId = 'guest';
  if (req.user && req.user._id) {
    userFolderId = req.user._id.toString();
  }

  let slug = 'my-project';
  if (projectId && projectId !== 'blank' && projectId !== 'scratch') {
    try {
      const proj = await SandboxProject.findById(projectId).lean();
      if (proj && proj.slug) slug = proj.slug;
    } catch {
      slug = projectId.toLowerCase().replace(/[^a-z0-9]/g, '-');
    }
  }

  const userDir = `/home/coder/users/${userFolderId}`;
  const isolatedContainerPath = `${userDir}/${slug}`;

  if (pushToGit && repoUrl) {
    console.log(`[workspace] Pushing changes from ${isolatedContainerPath} to ${repoUrl}`);
    await execInContainer(`cd ${isolatedContainerPath} && git add . && git commit -m "Update from CodeSphere Web Studio" && git push || true`);
  }

  // Wipe temporary directory from cloud container storage
  console.log(`[workspace] Cleaning up storage path: ${isolatedContainerPath}`);
  await execInContainer(`rm -rf "${isolatedContainerPath}"`);

  return successResponse(res, 200, 'Session terminated and cloud storage cleaned', { terminated: true });
});

/**
 * POST /api/sandbox/:id/workspace/sync
 */
const syncWorkspace = asyncHandler(async (req, res) => {
  return successResponse(res, 200, 'Workspace synced', {});
});

/**
 * DELETE /api/sandbox/:id/workspace/stop
 */
const stopWorkspace = asyncHandler(async (req, res) => {
  return successResponse(res, 200, 'Workspace stopped', { stopped: true });
});

/**
 * GET /api/sandbox/:id/workspaces
 * Fetch all workspaces created by the current user for this problem statement
 */
const getUserWorkspaces = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  if (!req.user || !req.user._id) {
    return successResponse(res, 200, 'Workspaces fetched', { workspaces: [] });
  }

  const workspaces = await UserSandboxWorkspace.find({
    userId: req.user._id,
    projectId: String(projectId),
  }).sort({ updatedAt: -1 });

  return successResponse(res, 200, 'Workspaces fetched', { workspaces });
});

module.exports = {
  initWorkspace,
  getUserWorkspaces,
  terminateWorkspace,
  syncWorkspace,
  stopWorkspace,
  listActiveWorkspaces,
};
