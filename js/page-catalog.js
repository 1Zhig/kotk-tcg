/* ==========================================================
   CATALOG PAGE (productos.html)
   Loads every product, builds the filters, and shows the
   product boxes that match the filters.
   ========================================================== */

const catalogGrid = document.querySelector("#catalog-grid");
const gameFilter = document.querySelector("#filter-game");
const typeFilter = document.querySelector("#filter-type");
const availableFilter = document.querySelector("#filter-available");
const resultCount = document.querySelector("#result-count");

let allProducts = []; // filled once the Sheet loads

// Fills a <select> with one <option> per unique value.
// Example: ["Pokémon","Pokémon","One Piece"] → Pokémon, One Piece
function fillSelect(select, values) {
  const unique = [...new Set(values.filter(Boolean))].sort();
  unique.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

// Reads the filters and shows only the matching products.
function showCatalog() {
  const game = gameFilter.value; // "" means "all"
  const type = typeFilter.value;
  const onlyAvailable = availableFilter.checked;

  const visible = allProducts.filter((product) => {
    if (game && product.juego !== game) return false;
    if (type && product.tipo !== type) return false;
    if (onlyAvailable && !isAvailable(product)) return false;
    return true;
  });

  const word = visible.length === 1 ? "producto" : "productos";
  resultCount.textContent = `${visible.length} ${word}`;

  if (visible.length === 0) {
    renderStatus(catalogGrid, "No hay productos con esos filtros.");
    return;
  }

  // One box per product, joined into one block of HTML
  catalogGrid.innerHTML = sortProducts(visible).map(renderProductBox).join("");
}

async function initCatalog() {
  try {
    allProducts = await loadProducts();
  } catch (error) {
    console.error(error); // details for us in DevTools (F12 → Console)
    renderStatus(
      catalogGrid,
      "No pudimos cargar los productos en este momento. Escríbenos y te ayudamos.",
      true
    );
    return;
  }

  if (allProducts.length === 0) {
    renderStatus(catalogGrid, "Pronto tendremos productos disponibles.", true);
    return;
  }

  fillSelect(gameFilter, allProducts.map((p) => p.juego));
  fillSelect(typeFilter, allProducts.map((p) => p.tipo));

  // Re-filter every time a filter changes
  [gameFilter, typeFilter, availableFilter].forEach((input) =>
    input.addEventListener("change", showCatalog)
  );

  showCatalog();
}

initCatalog();
