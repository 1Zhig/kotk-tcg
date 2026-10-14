/* ==========================================================
   PRODUCT DETAIL PAGE (producto.html?id=...)
   ONE html file for every product: we read the id from the
   address bar, find that row, and build the page from it.
   ========================================================== */

const detail = document.querySelector("#product-detail");

// producto.html?id=pkm-booster-01 → "pkm-booster-01"
const productId = new URLSearchParams(window.location.search).get("id");

function renderDetail(product) {
  const stock = getStockInfo(product);
  const canOrder = isAvailable(product);

  const price = CONFIG.showPrices
    ? `<p class="detail-price">${formatPrice(product.precio)}</p>`
    : "";

  const releaseDate =
    product.preventa && product.fechaLanzamiento
      ? `<p class="detail-release">📅 Lanzamiento: ${formatDate(product.fechaLanzamiento)}</p>`
      : "";

  const description = product.descripcion
    ? `<p class="detail-description">${escapeHTML(product.descripcion)}</p>`
    : "";

  const orderSection = canOrder
    ? `
      <div class="qty">
        <label for="qty-input" class="qty-label">Cantidad:</label>
        <div class="qty-control">
          <button type="button" class="qty-btn" data-qty="-1" aria-label="Quitar uno">−</button>
          <input id="qty-input" type="number" value="1" min="1" max="${product.stock}" inputmode="numeric" />
          <button type="button" class="qty-btn" data-qty="1" aria-label="Agregar uno">+</button>
        </div>
      </div>
      <div class="detail-actions">
        <a href="#" class="btn btn-primary" id="order-whatsapp" target="_blank" rel="noopener">
          ${product.preventa ? "Reservar" : "Pedir"} por WhatsApp
        </a>
        <button type="button" class="btn btn-outline" id="order-instagram">
          ${product.preventa ? "Reservar" : "Pedir"} por Instagram
        </button>
      </div>
      <p class="muted small">Pagos y entregas se coordinan por chat.</p>
    `
    : `
      <p class="detail-soldout">Este producto está agotado por ahora.</p>
      <div class="detail-actions">
        <a href="#" class="btn btn-outline" id="ask-restock" target="_blank" rel="noopener">
          Avísame cuando vuelva
        </a>
      </div>
    `;

  detail.innerHTML = `
    <a href="productos.html" class="link-more back-link">← Volver a productos</a>
    <div class="detail-grid">
      <div class="product-media detail-media">
        ${renderProductImage(product)}
      </div>

      <div class="detail-info">
        <p class="product-meta">${escapeHTML(product.juego)} · ${escapeHTML(product.tipo)}</p>
        <h1 class="detail-title">${escapeHTML(product.nombre)}</h1>
        <div class="detail-tags">
          <span class="badge ${stock.className}">${stock.label}</span>
          <span class="muted small">Código: ${escapeHTML(product.id)}</span>
        </div>

        <div class="detail-panel">
          ${price}
          ${releaseDate}
          ${description}
          ${orderSection}
        </div>
      </div>
    </div>
  `;

  document.title = `${product.nombre} | Kings of the Kingdom`;

  if (canOrder) {
    setUpOrdering(product);
  } else {
    document.querySelector("#ask-restock").href = buildWhatsappLink(
      `¡Hola! ¿Me avisan cuando vuelva a haber "${product.nombre}" (${product.id})?`
    );
  }
}

/* ---------- Quantity + order buttons ---------- */
function setUpOrdering(product) {
  const qtyInput = document.querySelector("#qty-input");
  const whatsappButton = document.querySelector("#order-whatsapp");
  const instagramButton = document.querySelector("#order-instagram");

  // Keeps the quantity between 1 and the stock, then updates the link
  function setQuantity(value) {
    const quantity = Math.min(Math.max(parseInt(value, 10) || 1, 1), product.stock);
    qtyInput.value = quantity;

    document.querySelector('[data-qty="-1"]').disabled = quantity <= 1;
    document.querySelector('[data-qty="1"]').disabled = quantity >= product.stock;

    whatsappButton.href = buildWhatsappLink(buildOrderMessage(product, quantity));
  }

  // − and + buttons: data-qty says how much to add (-1 or 1)
  document.querySelectorAll(".qty-btn").forEach((button) => {
    button.addEventListener("click", () => {
      setQuantity(Number(qtyInput.value) + Number(button.dataset.qty));
    });
  });

  // Typing a number directly
  qtyInput.addEventListener("change", () => setQuantity(qtyInput.value));

  // Instagram: copy the message, then open the chat
  instagramButton.addEventListener("click", async () => {
    const message = buildOrderMessage(product, Number(qtyInput.value));
    try {
      await navigator.clipboard.writeText(message);
      showToast("Mensaje copiado. Pégalo en el chat de Instagram 📋");
    } catch {
      showToast("No se pudo copiar el mensaje. Escríbenos el código: " + product.id);
    }
    window.open(buildInstagramDMLink(), "_blank", "noopener");
  });

  setQuantity(1); // initial state
}

/* ---------- Start ---------- */
async function initProduct() {
  if (!productId) {
    renderStatus(detail, "No se indicó ningún producto. <a href='productos.html'>Ver productos</a>");
    return;
  }

  let products;
  try {
    products = await loadProducts();
  } catch (error) {
    console.error(error);
    renderStatus(detail, "No pudimos cargar este producto. Escríbenos y te ayudamos.", true);
    return;
  }

  const product = products.find((p) => p.id === productId);

  if (!product) {
    renderStatus(
      detail,
      "Este producto ya no está disponible. <a href='productos.html'>Ver todos los productos</a>"
    );
    return;
  }

  renderDetail(product);
}

initProduct();
