/* ==========================================================
   EVENTS PAGE (eventos.html)
   Past events disappear automatically (no need to edit the
   Sheet the day after an event).
   ========================================================== */

const eventsGrid = document.querySelector("#events-grid");

async function initEvents() {
  let events;
  try {
    events = await loadUpcomingEvents();
  } catch (error) {
    console.error(error);
    renderStatus(eventsGrid, "No pudimos cargar los eventos en este momento.");
    return;
  }

  if (events.length === 0) {
    renderStatus(
      eventsGrid,
      "No hay eventos programados por ahora. Síguenos en Instagram para enterarte primero."
    );
    return;
  }

  eventsGrid.innerHTML = events.map(renderEventBox).join("");
}

initEvents();
