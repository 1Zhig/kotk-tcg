/* ==========================================================
   SHEETS — reads data from the published Google Sheet.
   Used by every page that shows products, news or events.

   The journey of the data:
   Google Sheet → CSV text → rows (arrays) → objects → page
   ========================================================== */

/* ---------- 1. CSV text → rows ----------
   CSV is a table written as text: one line per row, cells
   separated by commas. A cell that contains commas or line
   breaks is wrapped in "quotes", so we can't simply split by
   commas. We read the text one character at a time instead.

   Result: [["id","nombre"], ["pkm-01","Sobre"], ...]        */
function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (insideQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        cell += '"'; // "" inside quotes = one real quote character
        i++;
      } else if (char === '"') {
        insideQuotes = false; // closing quote
      } else {
        cell += char; // commas and line breaks are just text here
      }
    } else if (char === '"') {
      insideQuotes = true; // opening quote
    } else if (char === ",") {
      row.push(cell); // end of cell
      cell = "";
    } else if (char === "\n") {
      row.push(cell); // end of row
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char; // normal character (we ignore Windows' \r)
    }
  }

  // The last row may not end with a line break
  if (cell !== "" || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

/* ---------- 2. Rows → objects ----------
   Uses row 1 (the headers) as the names of each value:
   ["id","nombre"] + ["pkm-01","Sobre"]
   → { id: "pkm-01", nombre: "Sobre" }

   Objects let us write product.nombre instead of row[1].   */
function rowsToObjects(rows) {
  const headers = rows[0].map((header) => header.trim().toLowerCase());
  const dataRows = rows.slice(1); // every row except the headers

  return dataRows
    .filter((row) => row.some((cell) => cell.trim() !== "")) // skip empty rows
    .map((row) => {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = (row[index] || "").trim();
      });
      return item;
    });
}

/* ---------- 3. Small helpers ---------- */

// "SI", "Sí", "si" → true. Anything else → false.
function isYes(value) {
  return ["SI", "SÍ"].includes((value || "").trim().toUpperCase());
}

// Makes text safe to put inside HTML. Without this, a "<" typed in
// the Sheet could break the page (or inject code).
function escapeHTML(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// "2026-11-07" → "7 de noviembre de 2026"
function formatDate(isoDate) {
  const [year, month, day] = (isoDate || "").split("-").map(Number);
  if (!year || !month || !day) return isoDate || "";
  const date = new Date(year, month - 1, day); // months start at 0 in JS
  return date.toLocaleDateString("es-PA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ---------- 4. Load one tab ----------
   "async" means this function waits for things that take time
   (downloading from Google) without freezing the page.
   "await" is where it waits.

   Returns only rows marked activo = SI.                      */
async function loadSheet(tabName) {
  const url = CONFIG.sheets[tabName];
  const response = await fetch(url); // download the CSV

  if (!response.ok) {
    throw new Error(`No se pudo cargar "${tabName}" (código ${response.status})`);
  }

  const text = await response.text();
  const items = rowsToObjects(parseCSV(text));
  return items.filter((item) => isYes(item.activo));
}
