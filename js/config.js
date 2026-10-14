/* ==========================================================
   CONFIG — the ONLY file you should need to edit for
   contact details and site settings. Everything else reads
   from here.
   ========================================================== */

const CONFIG = {
  shopName: "Kings of the Kingdom",

  // WhatsApp number in international format, digits only, no "+" or spaces.
  // Example for Panama: "5076XXXXXXX". Leave empty until the owner gives it.
  whatsappNumber: "65048787",

  // Instagram username (without the @)
  instagramUser: "kotkpanama",

  // Default message when someone taps a general WhatsApp button
  defaultWhatsappMessage:
    "¡Hola, Kings of the Kingdom! Vengo de su página web y tengo una consulta.",

  // Published Google Sheet tabs (File → Share → Publish to web → .csv)
  sheets: {
    productos:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRyjbTBey0FKO6_sPAgADho9lVS27LsV-UYKlYfhMnoSh7Mw83AWbW_ZeQJJYhj2NFgjO2hu9_TEdGQ/pub?gid=0&single=true&output=csv",
    noticias:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRyjbTBey0FKO6_sPAgADho9lVS27LsV-UYKlYfhMnoSh7Mw83AWbW_ZeQJJYhj2NFgjO2hu9_TEdGQ/pub?gid=1530603174&single=true&output=csv",
    eventos:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRyjbTBey0FKO6_sPAgADho9lVS27LsV-UYKlYfhMnoSh7Mw83AWbW_ZeQJJYhj2NFgjO2hu9_TEdGQ/pub?gid=218788088&single=true&output=csv",
  },

  // false = hide every price on the site (and in order messages)
  showPrices: true,

  // At this many units or fewer, show "¡Últimas unidades!"
  lowStockThreshold: 5,

  // How many featured products to show on the homepage
  featuredLimit: 4,
};
