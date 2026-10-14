/* ==========================================================
   PRODUCTS — everything about products that more than one
   page needs: loading, price/stock rules, the product box,
   and the order messages.
   ========================================================== */

/* ---------- 1. Sheet row → clean product ----------
   Everything that comes from a CSV is text. Here we turn
   "5.50" into the number 5.5, "SI" into true, etc.          */
function toProduct(row) {
  return {
    id: row.id,
    nombre: row.nombre,
    juego: row.juego,
    tipo: row.tipo,
    descripcion: row.descripcion,
    precio: parseFloat(row.precio) || 0,
    stock: parseInt(row.stock, 10) || 0,
    imagen: row.imagen,
    destacado: isYes(row.destacado),
    preventa: isYes(row.preventa),
    fechaLanzamiento: row.fecha_lanzamiento,
  };
}

async function loadProducts() {
  const rows = await loadSheet("productos");
  return rows.map(toProduct);
}

/* ---------- 2. Business rules ---------- */

function formatPrice(price) {
  return `$${price.toFixed(2)}`; // 5.5 → "$5.50"
}

function isAvailable(product) {
  return product.stock > 0;
}

// Decides the text and color of the stock badge.
// For pre-orders, "stock" = how many reservations are left.
function getStockInfo(product) {
  if (product.stock <= 0) {
    return { label: "Agotado", className: "badge-out" };
  }
  if (product.preventa) {
    return { label: "Preventa", className: "badge-preorder" };
  }

  // --- MODE A (active): exact numbers ---
  if (product.stock <= CONFIG.lowStockThreshold) {
    const units = product.stock === 1 ? "unidad" : "unidades";
    return { label: `¡Últimas ${product.stock} ${units}!`, className: "badge-low" };
  }
  return { label: `${product.stock} disponibles`, className: "badge-ok" };

  /* --- MODE B: status only, no numbers ---
     To switch: comment out everything in MODE A (from its
     "if" to its last "return"), then uncomment this block:

  if (product.stock <= CONFIG.lowStockThreshold) {
    return { label: "Pocas unidades", className: "badge-low" };
  }
  return { label: "Disponible", className: "badge-ok" };
  */
}

// Available first, then pre-orders, sold out last.
function sortProducts(products) {
  const rank = (p) => (!isAvailable(p) ? 2 : p.preventa ? 1 : 0);
  return [...products].sort((a, b) => rank(a) - rank(b));
}

/* ---------- 3. The product box (HTML) ----------
   Returns the HTML for one box as text. The catalog and the
   homepage both use this, so a design change happens once.  */
function renderProductBox(product) {
  const stock = getStockInfo(product);
  const link = `producto.html?id=${encodeURIComponent(product.id)}`;
  const price = CONFIG.showPrices
    ? `<span class="price">${formatPrice(product.precio)}</span>`
    : "";

  return `
    <article class="product-box ${isAvailable(product) ? "" : "is-sold-out"}">
      <a href="${link}" class="product-link">
        <div class="product-media">
          ${renderProductImage(product)}
        </div>
        <div class="product-body">
          <p class="product-meta">${escapeHTML(product.juego)} · ${escapeHTML(product.tipo)}</p>
          <h3 class="product-title">${escapeHTML(product.nombre)}</h3>
          <div class="product-footer">
            ${price}
            <span class="badge ${stock.className}">${stock.label}</span>
          </div>
        </div>
      </a>
    </article>
  `;
}

// If there's no image (or it fails to load), the KOTK placeholder
// behind it stays visible.
function renderProductImage(product) {
  if (!product.imagen) return "";
  return `<img src="${escapeHTML(product.imagen)}" alt="${escapeHTML(product.nombre)}"
            loading="lazy" onerror="this.remove()" />`;
}

/* ---------- 4. Ordering ---------- */

function buildOrderMessage(product, quantity) {
  let message = `¡Hola, Kings of the Kingdom! Quiero pedir:\n\n`;
  message += `• ${quantity}x ${product.nombre}`;
  if (CONFIG.showPrices) {
    message += ` (${formatPrice(product.precio)} c/u)`;
  }
  message += `\nCódigo: ${product.id}`;
  if (product.preventa) {
    message += `\n(Es una preventa)`;
  }
  message += `\n\nVengo de su página web.`;
  return message;
}

// Opens a direct-message chat with the shop on Instagram.
// (Instagram can't pre-fill the text, so we copy it first.)
function buildInstagramDMLink() {
  return `https://ig.me/m/${CONFIG.instagramUser}`;
}

/* ---------- 5. Toast (small pop-up notice) ---------- */
function showToast(text) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status"); // screen readers announce it
    document.body.appendChild(toast);
  }
  toast.textContent = text;
  toast.classList.add("is-visible");

  clearTimeout(toast.hideTimer);
  toast.hideTimer = setTimeout(() => toast.classList.remove("is-visible"), 4000);
}

/* ---------- 6. Error / empty messages ---------- */
function renderStatus(container, text, withWhatsapp = false) {
  const button = withWhatsapp
    ? `<a class="btn btn-primary" target="_blank" rel="noopener"
          href="${buildWhatsappLink(CONFIG.defaultWhatsappMessage)}">Escríbenos por WhatsApp</a>`
    : "";
  container.innerHTML = `
    <div class="status-message">
      <p>${text}</p>
      ${button}
    </div>
  `;
}
