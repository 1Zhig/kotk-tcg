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
    showNoEvents();
    return;
  }

  eventsGrid.innerHTML = events.map(renderEventBox).join("");
}

// Friendly empty state: follow us + invite organizers to reach out
function showNoEvents() {
  const organizerMessage =
    "¡Hola! Estoy organizando un evento TCG y me gustaría que KOTK participe.";

  eventsGrid.innerHTML = `
    <div class="status-message">
      <p>
        <strong>Por ahora no tenemos eventos programados.</strong><br />
        Síguenos en Instagram para enterarte primero de ferias, ventas
        especiales y torneos.
      </p>
      <a class="btn btn-primary" target="_blank" rel="noopener"
         href="${buildInstagramLink()}">Seguir en Instagram</a>
      <p class="small">¿Organizas un evento TCG y quieres que participemos?</p>
      <a class="btn btn-outline" target="_blank" rel="noopener"
         href="${buildWhatsappLink(organizerMessage)}">Escríbenos</a>
    </div>
  `;
}

initEvents();
