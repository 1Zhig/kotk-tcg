/* ==========================================================
   HOME PAGE (index.html)
   Shows the featured products (destacado = SI).
   ========================================================== */

const featuredGrid = document.querySelector("#featured-products");

async function initFeatured() {
  let products;
  try {
    products = await loadProducts();
  } catch (error) {
    console.error(error);
    renderStatus(featuredGrid, "No pudimos cargar los productos destacados.");
    return;
  }

  // Featured products that can still be bought
  let featured = products.filter((p) => p.destacado && isAvailable(p));

  // If none are marked as featured, show whatever is available
  if (featured.length === 0) {
    featured = products.filter(isAvailable);
  }

  if (featured.length === 0) {
    renderStatus(featuredGrid, "Pronto tendremos productos disponibles.");
    return;
  }

  featuredGrid.innerHTML = sortProducts(featured)
    .slice(0, CONFIG.featuredLimit) // only the first N
    .map(renderProductBox)
    .join("");
}

initFeatured();
