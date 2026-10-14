# Kings of the Kingdom (KOTK) — Sitio web

Sitio web de **Kings of the Kingdom**, tienda de Pokémon TCG en Panamá.
Catálogo con stock actualizado, noticias, eventos y pedidos directos por WhatsApp o Instagram.

## Funcionalidades

- [x] Diseño responsive (mobile-first) con menú móvil
- [x] Enlaces a WhatsApp/Instagram configurables desde un solo archivo
- [x] Catálogo de productos con stock y precio en vivo desde Google Sheets
- [x] Filtros por juego, tipo y disponibilidad
- [x] Página de detalle por producto con selector de cantidad
- [x] Pedido por WhatsApp (mensaje pre-llenado) o Instagram (mensaje copiado)
- [x] Preventas con fecha de lanzamiento
- [x] Noticias de la comunidad TCG
- [x] Eventos (los pasados se ocultan solos) con enlace de inscripción
- [x] Página de contacto
- [x] Publicado en GitHub Pages
- [ ] Logo e identidad visual final
- [ ] Preguntas frecuentes (pagos y envíos)
- [ ] Dominio propio

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
