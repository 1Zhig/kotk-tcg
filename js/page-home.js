/* ==========================================================
   HOME PAGE (index.html)
   Shows the featured products (destacado = SI) and the
   next upcoming events.
   ========================================================== */

const featuredGrid = document.querySelector("#featured-products");
const upcomingGrid = document.querySelector("#upcoming-events");
const eventsSection = document.querySelector("#events-section");

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
    eventsSection.hidden = true; // no events section rather than an error
    return;
  }

  // No upcoming events → hide the whole section on the homepage
  if (events.length === 0) {
    eventsSection.hidden = true;
    return;
  }

  upcomingGrid.innerHTML = events.slice(0, 3).map(renderEventBox).join("");
}

// Both start at the same time; neither waits for the other.
initFeatured();
initUpcoming();
