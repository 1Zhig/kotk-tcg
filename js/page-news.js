/* ==========================================================
   NEWS PAGE (noticias.html)
   ========================================================== */

const newsGrid = document.querySelector("#news-grid");

async function initNews() {
  let news;
  try {
    news = await loadNews();
  } catch (error) {
    console.error(error);
    renderStatus(newsGrid, "No pudimos cargar las noticias en este momento.");
    return;
  }

  if (news.length === 0) {
    renderStatus(newsGrid, "Pronto publicaremos noticias de la comunidad.");
    return;
  }

  newsGrid.innerHTML = news.map(renderNewsBox).join("");
}

initNews();
