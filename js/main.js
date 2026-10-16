/* ==========================================================
   MAIN — code shared by every page.
   Read it top to bottom; each block does ONE job.
   ========================================================== */

/* ---------- 1. Mobile menu (hamburger) ----------
   When the button is clicked, toggle the class "is-open"
   on the nav. CSS shows/hides the menu based on that class. */
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector("#site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open"); // returns true/false
    navToggle.setAttribute("aria-expanded", isOpen);
    navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  });
}

/* ---------- 2. Contact links ----------
   Any element with data-whatsapp or data-instagram gets its
   link filled in from CONFIG. Change the number ONCE in
   config.js and every button on the site updates. */

// Builds a WhatsApp link with a pre-written message.
// We'll reuse this on Day 2 for "Pedir 2x [producto]".
function buildWhatsappLink(message) {
  const number = CONFIG.whatsappNumber.replace(/\D/g, ""); // remove any non-digit characters
  const text = encodeURIComponent(message); // makes spaces/accents URL-safe
  return `https://wa.me/${number}?text=${text}`;
}

function buildInstagramLink() {
  // Instagram can't pre-fill DMs, so we send people to the profile.
  return `https://www.instagram.com/${CONFIG.instagramUser}/`;
}

// data-whatsapp="custom message" uses that message; empty uses the default
document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  const message = link.dataset.whatsapp || CONFIG.defaultWhatsappMessage;
  link.href = buildWhatsappLink(message);
  link.target = "_blank"; // open in a new tab
  link.rel = "noopener"; // security best practice for target="_blank"
});

document.querySelectorAll("[data-instagram]").forEach((link) => {
  link.href = buildInstagramLink();
  link.target = "_blank";
  link.rel = "noopener";
});

// Showroom on Google Maps
document.querySelectorAll("[data-maps]").forEach((link) => {
  link.href =
    CONFIG.mapsUrl ||
    "https://www.google.com/maps/search/?api=1&query=KOTK+Panam%C3%A1";
  link.target = "_blank";
  link.rel = "noopener";
});

/* ---------- 3. Footer year ---------- */
const yearSpan = document.querySelector("#year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}
