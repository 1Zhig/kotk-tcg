/* ==========================================================
   HOME PAGE (index.html)
   Shows the featured products (destacado = SI) and the
   next upcoming events.
   ========================================================== */

const featuredGrid = document.querySelector("#featured-products");
const upcomingGrid = document.querySelector("#upcoming-events");

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

async function initUpcoming() {
  let events;
  try {
    events = await loadUpcomingEvents();
  } catch (error) {
    console.error(error);
    renderStatus(upcomingGrid, "No pudimos cargar los eventos.");
    return;
  }

  if (events.length === 0) {
    renderStatus(upcomingGrid, "No hay eventos programados por ahora.");
    return;
  }

  upcomingGrid.innerHTML = events.slice(0, 3).map(renderEventBox).join("");
}

// Both start at the same time; neither waits for the other.
initFeatured();
initUpcoming();
