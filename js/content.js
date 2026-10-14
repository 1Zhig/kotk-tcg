/* ==========================================================
   CONTENT — news and events: loading, sorting, and the HTML
   for each box. Same idea as products.js.
   ========================================================== */

/* ---------- 1. Helpers ---------- */

// Only allow normal web links (http/https). Blocks tricks like
// "javascript:..." typed into the Sheet.
function safeUrl(url) {
  return /^https?:\/\//i.test(url || "") ? url : "";
}

// Today as "2026-10-14", in the visitor's own time zone.
// ("en-CA" happens to use exactly this year-month-day format.)
function todayISO() {
  return new Date().toLocaleDateString("en-CA");
}

// "2026-11-15" → { day: "15", month: "nov" } for the date badge
function dateParts(isoDate) {
  const [year, month, day] = (isoDate || "").split("-").map(Number);
  if (!year || !month || !day) return { day: "--", month: "" };
  const date = new Date(year, month - 1, day);
  return {
    day: String(day),
    month: date.toLocaleDateString("es-PA", { month: "short" }).replace(".", ""),
  };
}

/* ---------- 2. News ---------- */

// Newest first. ISO dates ("2026-10-14") sort correctly as text.
async function loadNews() {
  const news = await loadSheet("noticias");
  return news.sort((a, b) => b.fecha.localeCompare(a.fecha));
}

function renderNewsBox(item) {
  const image = safeUrl(item.imagen)
    ? `<img src="${escapeHTML(item.imagen)}" alt="" loading="lazy" onerror="this.remove()" />`
    : "";
  const source = safeUrl(item.enlace_fuente)
    ? `<a href="${escapeHTML(item.enlace_fuente)}" class="link-more" target="_blank" rel="noopener">
         Ver fuente oficial →
       </a>`
    : "";

  return `
    <article class="news-box">
      <div class="news-media">${image}</div>
      <div class="news-body">
        <p class="product-meta">${formatDate(item.fecha)}</p>
        <h3 class="news-title">${escapeHTML(item.titulo)}</h3>
        <p class="news-summary">${escapeHTML(item.resumen)}</p>
        ${source}
      </div>
    </article>
  `;
}

/* ---------- 3. Events ---------- */

// Only events from today onward, soonest first.
async function loadUpcomingEvents() {
  const events = await loadSheet("eventos");
  const today = todayISO();
  return events
    .filter((event) => event.fecha >= today)
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
}

function renderEventBox(event) {
  const { day, month } = dateParts(event.fecha);

  const image = safeUrl(event.imagen)
    ? `<div class="event-media">
         <img src="${escapeHTML(event.imagen)}" alt="" loading="lazy" onerror="this.parentElement.remove()" />
       </div>`
    : "";

  const details = [
    event.hora ? `🕑 ${escapeHTML(event.hora)}` : "",
    event.lugar ? `📍 ${escapeHTML(event.lugar)}` : "",
  ]
    .filter(Boolean)
    .join("<br />");

  const signUp = safeUrl(event.enlace_inscripcion)
    ? `<a href="${escapeHTML(event.enlace_inscripcion)}" class="btn btn-primary"
          target="_blank" rel="noopener">Inscribirme</a>`
    : "";

  return `
    <article class="event-box">
      ${image}
      <div class="event-content">
        <div class="event-date" aria-label="${formatDate(event.fecha)}">
          <span class="event-day">${day}</span>
          <span class="event-month">${month}</span>
        </div>
        <div class="event-body">
          <h3 class="news-title">${escapeHTML(event.titulo)}</h3>
          ${details ? `<p class="event-details">${details}</p>` : ""}
          ${event.descripcion ? `<p class="news-summary">${escapeHTML(event.descripcion)}</p>` : ""}
          ${signUp}
        </div>
      </div>
    </article>
  `;
}
