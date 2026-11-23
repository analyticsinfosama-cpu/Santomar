# Plan de acción SEO — carterasdepiel.es

Documento interno (Infosama). Ordenado por prioridad y organizado según FLOW (Find → Leverage → Optimize → Win). Estimaciones de esfuerzo orientativas.

## CRÍTICO — esta semana

| # | Acción | Esfuerzo | Impacto |
|---|---|---|---|
| C1 | **robots.txt:** borrar la sección «# Desautorización manual» completa y `Disallow: /modules/` y `/es/modules/`; añadir `Allow: /modules/*.css` y `Allow: /modules/*.js` si se mantiene algún bloqueo. Validar con la inspección de URL de GSC (captura renderizada). | 15 min | Muy alto |
| C2 | **Categorías 404:** decidir para `/28-cinturones`, `/42-`, `/43-`, `/57-`, `/44-tarjeteros-de-piel`, `/47-carteras-mujer-casual`, `/74-76`: reactivar (si hay stock) o 301 a la categoría vigente (tarjeteros → `/73-carteras-hombre-piel-sin-monedero` o nueva categoría Tarjeteros; rebajas → `/69-outlet`). Actualizar llms.txt. | 2 h | Muy alto |
| C3 | **Enlaces rotos:** sustituir los 50 enlaces a 404 del blog por productos vigentes; cambiar el enlace sitewide `/37-casanova` → `/` (240 páginas, módulo de cabecera/menú). Lista completa en `datos/baseline-crawl-2026-11-23.json` (status 404). | 3 h | Alto |
| C4 | **Spam de enlaces:** exportar de DinoRANK los dominios `*.slots-online-machine.online` y PBN/casino/farmacia; subir disavow a nivel dominio en GSC. Monitorizar nuevos enlaces semanalmente. | 1 h | Alto (preventivo) |
| C5 | **Entidad/NAP:** fijar un único nombre público (recomendado «Casanova» como marca, «Santomar S.L.» como razón social en `legalName`), un teléfono, una dirección real del taller. Unificar en schema, contacto, pie, aviso legal, GBP y redes. Corregir «40/50 años» → «desde 1981». | 2 h | Alto |
| C6 | **Rendimiento móvil (fase 1):** activar CCC de PrestaShop (combinar CSS/JS, mover JS al final), eliminar el GA4 duplicado (dejar uno vía GTM), quitar Google Translate, cargar WhatsApp/reCAPTCHA/lottie en interacción, sustituir Revolution Slider por imagen estática con `fetchpriority="high"` y `<link rel=preload>`. Objetivo: LCP móvil < 4 s. | 1–2 días | Muy alto |

## ALTA — próximas 2 semanas

| # | Acción | Esfuerzo |
|---|---|---|
| A1 | **Sitemap:** excluir URLs `index.php?controller=…`, `/my-shopping-carts`, `/fabricantes`, `/proveedores`, `/tiendas`, noindex y redirecciones; incluir todos los posts del blog (módulo ph_simpleblog → sitemap propio o Google Sitemap module); quitar duplicados `/blog/news`; crear 301 `/sitemap.xml` → `/2_index_sitemap.xml`. | 2 h |
| A2 | **Descatalogados:** cambiar 302 → 301 hacia el producto sustituto más cercano (no a la categoría genérica) o 410 si no hay equivalente. | 2 h |
| A3 | **Canonical:** añadir canonical autorreferente a portada y 24 URLs sin él (override de `head.tpl`). | 1 h |
| A4 | **Product schema** (ver bloque JSON-LD abajo): eliminar microdatos duplicados del tema, añadir `aggregateRating` + `review` desde revi, `shippingDetails`, `hasMerchantReturnPolicy`, `brand: Casanova`, `mpn` = referencia. Validar en Rich Results Test. | 4 h |
| A5 | **Home schema:** dejar un único `LeatherGoodsStore` con `@id` absoluto `https://carterasdepiel.es/#organization`, `logo` absoluto, `foundingDate: 1981`, `founder`, `telephone` único, `sameAs` completo; eliminar el bloque Organization «Santomar» del tema o fusionarlo. | 1 h |
| A6 | **Canibalización / SXO:** desoptimizar la home para «carteras de piel hombre/mujer» (title/H1 de marca + Ubrique), enlazar con anclas exactas desde home y blog a `/38-carteras-hombre` y `/26-carteras-mujer`; title de `/38`: «Carteras de Piel para Hombre hechas en Ubrique \| Casanova». | 3 h |
| A7 | **Titles y meta:** reescribir 91 titles > 60 car. y las 21 metas vacías; eliminar `【】▷`/`lll➤`; plantilla ficha: «{Tipo} de piel {sexo} {Modelo} – {Color} \| Casanova». | 1 día |
| A8 | **Cabeceras de seguridad** (nginx): `Strict-Transport-Security: max-age=31536000; includeSubDomains`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`. | 30 min |

### JSON-LD Product (plantilla)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "{url}#product",
  "name": "{nombre}",
  "sku": "{referencia}",
  "mpn": "{referencia}",
  "brand": {"@type": "Brand", "name": "Casanova"},
  "manufacturer": {"@id": "https://carterasdepiel.es/#organization"},
  "material": "Piel de vacuno",
  "countryOfOrigin": "ES",
  "image": ["{img1}", "{img2}"],
  "description": "{descripcion}",
  "aggregateRating": {"@type": "AggregateRating", "ratingValue": "{media_revi}", "reviewCount": "{n_revi}"},
  "offers": {
    "@type": "Offer",
    "url": "{url}",
    "priceCurrency": "EUR",
    "price": "{precio}",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": {"@type": "MonetaryAmount", "value": "0", "currency": "EUR"},
      "shippingDestination": {"@type": "DefinedRegion", "addressCountry": "ES"},
      "deliveryTime": {"@type": "ShippingDeliveryTime",
        "handlingTime": {"@type": "QuantitativeValue", "minValue": 0, "maxValue": 1, "unitCode": "DAY"},
        "transitTime": {"@type": "QuantitativeValue", "minValue": 1, "maxValue": 5, "unitCode": "DAY"}}
    },
    "hasMerchantReturnPolicy": {
      "@type": "MerchantReturnPolicy",
      "applicableCountry": "ES",
      "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
      "merchantReturnDays": 30,
      "returnMethod": "https://schema.org/ReturnByMail",
      "returnFees": "https://schema.org/FreeReturn"
    }
  }
}
```
(Envío 0 € solo para pedidos ≥ 20 € en Península: añadir un segundo `OfferShippingDetails` con la tarifa real para pedidos inferiores o Baleares/Canarias.)

## MEDIA — este mes

| # | Acción |
|---|---|
| M1 | **Imágenes:** alt descriptivo y único en galerías (modelo + color + vista); activar WebP/AVIF (módulo o nginx `try_files` con `.webp`); miniaturas de listado con `home_default`/`medium_default` en vez de `thickbox`; `width`/`height` en todas; `loading="lazy"` salvo la primera. |
| M2 | **Blog:** autor real (Miguel, artesano) con página de autor y `Person` con `sameAs`; fechas ISO 8601 con zona; `wordCount` correcto; H1 de listados en español («Blog de marroquinería»); reparar el JSON-LD inválido. |
| M3 | **Fichas:** fusionar duplicados (BENITO 1123/1155, CUBE 1138/1143, PANA 1110/1165) con 301; ampliar las 24 fichas < 300 palabras (uso, medidas, cuidado, diferencias con modelos hermanos, FAQ). |
| M4 | **Móvil:** viewport `width=device-width, initial-scale=1` (quitar `user-scalable=no`, `maximum-scale=1`); áreas táctiles ≥ 24 px. |
| M5 | **Contacto:** dirección completa, mapa, horario, teléfono único, CIF, enlace a GBP. |
| M6 | **Landings noindex** `/content/8–13`: evaluar si duplican categorías; si aportan, indexar y enlazar; si no, 301 a la categoría equivalente. |
| M7 | **Clusters del blog** (seo-cluster): Cuidado del cuero (hub: cómo cuidar y limpiar carteras de piel) · Tipos de piel (hub: piel de vacuno vs ovino, 49 clics/mes) · RFID (fusionar 5 posts en 1 guía + enlace a fichas RFID) · Guías de compra hombre · Guías de compra mujer · Regalos · Ubrique y artesanía. Consolidar duplicados con 301. |
| M8 | **Terceros:** auditoría GTM, retrasar Pixel/GA4 hasta interacción o consentimiento; objetivo < 25 peticiones de terceros. |
| M9 | **CTR:** reescritura de snippets de las 20 URLs con más impresiones en GSC (home, `/38`, `/26`, `/79`, `/77`, `/69`). |

## BAJA — backlog

- Eliminar `meta keywords` y la meta robots duplicada.
- noindex o eliminar `/fabricantes`, `/proveedores`, `/tiendas`, `/mapa-del-sitio`.
- llms.txt: quitar lista de keywords; añadir secciones «Sobre el fabricante», «Envíos y devoluciones», «Guías destacadas» con URLs vigentes.
- OG image 1200×630 de marca (producto + taller) en lugar del logo.
- IndexNow (módulo PrestaShop) para Bing/Yandex.
- Configurar prompts de IA en DinoRANK («mejores carteras de piel de Ubrique», «dónde comprar cartera de piel hecha en España»…).

## Crecimiento (Leverage / Win)

### Nuevas páginas por demanda (seo-programmatic / seo-ecommerce)
| Página | Keyword principal | Volumen |
|---|---|---|
| Categoría Tarjeteros de piel (hombre) | tarjeteros hombre | 6.600 |
| Categoría Carteras personalizadas (grabado) | carteras personalizadas / cartera hombre personalizada | 1.000 / 880 |
| Categoría Cinturones de piel (reactivar) | cinturón piel / cinturones de piel | competidores top 1–5 |
| Filtro indexable Carteras RFID | cartera rfid hombre | (validar) |
| Landing Regalos de empresa | regalos de empresa piel | estacional (Navidad) |

Salvaguardas: solo indexar combinaciones con ≥ 6 productos y texto único ≥ 300 palabras; el resto noindex,follow.

### Brief — `/26-carteras-mujer` (seo-content-brief)
- **Objetivo:** «carteras mujer» (14.800, pos. 25), «monederos mujer» (12.100, pos. 29), «cartera monedero mujer» (1.900), «carteras de piel mujer» (1.000).
- **Title:** «Carteras y Monederos de Piel para Mujer \| Hechos en Ubrique – Casanova» · **H1:** «Carteras de piel para mujer».
- **Estructura:** intro 120 palabras sobre la parrilla · filtros visibles por tamaño (pequeña/mediana/grande) y tipo (billetero, monedero, con cremallera) · bloque bajo parrilla 600–800 palabras: «Cómo elegir el tamaño» (150), «Piel de vacuno de Ubrique: por qué dura más» (150), «RFID en carteras de mujer» (100), «Cuidados» (100, enlace al hub), FAQ ×4 (200).
- **Enlazado:** a `/77`, `/78`, `/79`; desde home con ancla «carteras de piel para mujer» y desde 5 posts del cluster mujer.
- **Competidores de referencia:** pielini.com/es/17-carteras-mujer (pos. 3–6), pieldeubrique.com/65-billeteras-de-senora-carteras-mujer.

### Páginas comparativas (seo-competitor-pages)
- «Piel de Ubrique vs piel genuina vs cuero sintético» (ya existe base: «piel genuina» pos. 2).
- «Cartera americana vs cartera con monedero vs tarjetero: cuál elegir».
- Evitar páginas «Casanova vs [marca]» con nombres de competidores hasta tener reseñas propias.

### Autoridad y GEO
- Reseñas: activar solicitud automática de revi post-compra y Google Customer Reviews; objetivo 100 reseñas en 6 meses.
- Menciones: Ayuntamiento/Asociación de la piel de Ubrique, Museo de la Piel, prensa local (Diario de Cádiz, Europa Sur), directorios de artesanía andaluza.
- GBP: verificar ficha del taller con NAP unificado, fotos de fabricación, categoría «Fábrica de artículos de cuero».

## Roadmap 90 días (seo-plan / FLOW)

| Semana | FLOW | Entregables |
|---|---|---|
| 1 | Find/Optimize | C1–C5, disavow, baseline nueva en GSC |
| 2–3 | Optimize | C6 rendimiento fase 1, A1–A5, A8 |
| 4–5 | Optimize | A6–A7, M1, M4 |
| 6–8 | Leverage | M2, M3, M5–M7, categoría Tarjeteros, reactivar Cinturones |
| 9–12 | Win | Brief `/26`, personalización, reseñas, menciones locales, rendimiento fase 2 (imágenes WebP, critical CSS) |

### KPIs de seguimiento
- Clics GSC: 685/mes → objetivo 1.200/mes a 90 días.
- CTR medio: 0,8 % → 1,5 %.
- Keywords top 3: 1 → 10; top 10: 35 → 60.
- LCP móvil (laboratorio): 7,8 s → < 2,5 s (home); comprobar CrUX con clave PSI.
- 0 URLs 404 enlazadas internamente; sitemap 100 % URLs 200 indexables.
