# Kings of the Kingdom (KOTK) — Sitio web

Sitio web de **Kings of the Kingdom**, tienda de Pokémon TCG en Panamá.
Catálogo con stock actualizado, noticias, eventos y pedidos directos por WhatsApp o Instagram.

## Funcionalidades

- [x] Estructura base, diseño responsive (mobile-first) y menú móvil
- [x] Enlaces a WhatsApp/Instagram configurables desde un solo archivo
- [x] Catálogo de productos con stock y precio desde Google Sheets
- [x] Botón "Pedir por WhatsApp" con mensaje pre-llenado por producto
- [x] Preventas
- [ ] Noticias de la comunidad TCG
- [ ] Eventos (con enlace a formulario de inscripción)
- [x] Página de contacto
- [ ] Publicado en GitHub Pages

## Tecnologías

- HTML5, CSS3 (Flexbox, Grid, variables CSS), JavaScript (vanilla, sin frameworks)
- Google Sheets como fuente de datos (sin servidor)
- GitHub Pages para hosting

## Cómo correrlo localmente

1. Clona el repositorio.
2. Abre la carpeta en VS Code.
3. Clic derecho en `index.html` → **Open with Live Server**.

## Estructura

```
kotk-tcg/
├── index.html        # Página de inicio
├── css/styles.css    # Todos los estilos
└── js/
    ├── config.js     # Número de WhatsApp, usuario de Instagram
    └── main.js       # Menú móvil, enlaces de contacto
```
