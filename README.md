# Creasunn — mockup dinámico

Sitio estático en HTML, CSS y JavaScript, sin dependencias de ejecución.
Incluye ocho campañas, ambientes animados, imágenes conceptuales y un
formulario de propuesta de tres pasos que prepara un mensaje para WhatsApp.
No procesa pedidos, calcula precios ni envía mensajes automáticamente.

## Vista local

Desde la raíz, ejecuta `python -m http.server 4186 --directory dist`
y abre http://localhost:4186.

## Edición y validación

- Campañas y textos: `dist/campaigns.js`.
- Escenas y comportamiento: `dist/app.js`.
- Cotizador: `dist/quote.js`.
- Contenido: `dist/index.html`.
- Después de editar CSS: `node scripts/bundle-styles.mjs`.
- Comprobaciones estáticas: `node scripts/check-site.mjs`.

Campañas por URL: `?campana=bebidas`, `hogar`, `textil`, `navidad`,
`otono`, `primavera`, `verano` y `halloween`.

## Publicación

Publica la carpeta `dist` en un alojamiento estático.
Para importar en Vercel, usa el preset **Other** y la carpeta de salida
**dist**, sin comando de compilación; el CSS compilado está incluido.
Este repositorio por sí solo no crea un despliegue.

Antes de lanzar con un dominio definitivo, actualiza el origen canónico
con `scripts/set-public-origin.mjs` y revisa `SEO-LANZAMIENTO.md`.
Confirma datos de contacto, catálogo y derechos de los recursos con la empresa.
Las imágenes generadas son montajes conceptuales, no inventario confirmado.

Se omiten documentos comerciales, capturas, archivos de publicación
y configuración privada del alojamiento anterior.
