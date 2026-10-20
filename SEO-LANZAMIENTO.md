# SEO, AEO y experiencia móvil

Segunda optimización (20 de octubre de 2026): fuentes WOFF2 locales con licencias y `font-display: optional`, cinco hojas de estilo agrupadas en una, selector móvil completo en cuadrícula, pausa de transiciones, suspensión de rotación al usar teclado y modo de ahorro de datos del navegador. Tras modificar cualquier CSS ejecutar `node scripts/bundle-styles.mjs` antes de publicar. Ejecutar después `node scripts/check-site.mjs`.

Implementado: título y descripción, canonical sin parámetros de campaña, Open Graph, Twitter Card, Organization JSON-LD con los datos visibles del negocio, robots.txt, sitemap.xml y cinco preguntas frecuentes en HTML. La información principal está disponible sin ejecutar JavaScript. No se añadieron reseñas, precios ni existencias inventados.

Móvil: navegación visible, controles de campaña de al menos 44 × 44 px, texto legible, selector desplazable, CTA con texto, imágenes WebP de 480/960 px, imágenes secundarias con carga diferida y dimensiones reservadas. Las campañas no rotan automáticamente hasta 900 px. Las partículas se limitan a 30 fps, usan menos elementos en móvil y se suspenden al ocultar la pestaña, salir de la portada o pulsar pausa. Se respeta movimiento reducido.

## Antes del lanzamiento público

El Site de demostración sigue siendo privado. Sus metadatos no eliminan la autenticación: los buscadores no podrán indexarlo mientras requiera acceso. No se ha cambiado la audiencia.

Cuando se conozca el dominio definitivo, desde la raíz del proyecto ejecutar:

```powershell
node scripts/set-public-origin.mjs https://tu-dominio.com
```

Esto actualiza canonical, URLs sociales, Organization, robots y sitemap. No ejecutarlo con un dominio ficticio. El sitemap debe contener el dominio público definitivo, no una URL de vista previa. Al migrar un sitio existente, revisar redirecciones de sus URLs; el catálogo actual enlazado sigue siendo externo.

Verificar con el negocio teléfono, correo, domicilio, cobertura y permisos de uso de imágenes. Confirmar que los enlaces a catálogos sigan vigentes.

Después de publicar: comprobar acceso anónimo HTTP 200, verificar propiedad en Google Search Console, enviar /sitemap.xml y validar datos estructurados con Schema Markup Validator. Medir Lighthouse/PageSpeed móvil sobre el dominio público y Core Web Vitals con datos reales. No hay una puntuación Lighthouse ni métricas de campo certificadas en esta revisión.

SEO/AEO no garantiza posiciones ni menciones por asistentes. Se priorizaron contenido visible, respuestas directas y datos coherentes; no hay marcado especial que garantice aparecer en respuestas de IA. FAQ no implica elegibilidad para resultados enriquecidos de Google.

Comprobaciones locales: JavaScript válido, JSON-LD y sitemap parseables, vista de 320/390/768/1440 px, controles táctiles, cambio de campaña y pausa. La prueba de navegador es una simulación de viewport; no sustituye dispositivos físicos ni medición con red móvil.
