# Auditoría SEO completa — carterasdepiel.es

**Fecha:** 23/11/2026 · **Plataforma:** PrestaShop 1.7 (tema Warehouse, Creative Elements) · **Tipo de negocio:** e-commerce de fabricante (marroquinería, Ubrique/El Bosque, Cádiz) · **Marca:** Casanova (razón comercial Santomar)

**SEO Health Score: 49/100**

| Categoría | Peso | Nota | Aporte |
|---|---|---|---|
| Técnico | 22 % | 48 | 10,6 |
| Contenido | 23 % | 55 | 12,7 |
| On-page | 20 % | 55 | 11,0 |
| Schema | 10 % | 45 | 4,5 |
| Rendimiento (CWV) | 10 % | 30 | 3,0 |
| GEO / IA | 10 % | 50 | 5,0 |
| Imágenes | 5 % | 45 | 2,3 |
| **Total** | | | **49** |

Contexto (no ponderado): Autoridad 15/100 · Competitividad 25/100.

## Fuentes

- Rastreo propio: 500 URLs (439 × 200, 61 × 404, 104 redirecciones), seed = sitemap + enlaces internos.
- DinoRANK: visibilidad (dominio + 4 competidores), Search Console (may–nov 2026), canibalizaciones, content gap, linkbuilding, keyword research.
- Playwright/Chromium: rendimiento de laboratorio (móvil Moto G4, CPU ×4, 4G lenta) y capturas (`screenshots/`).
- PageSpeed Insights: **no disponible** (HTTP 429 sin clave API) → sin datos de campo CrUX.

## Resumen ejecutivo

### Top 5 problemas críticos
1. **robots.txt bloquea JS del tema y módulos** (`/themes/core.js`, `/themes/warehouse/assets/js/`, `/js/jquery/`, `/modules/*/views/js/`, además de `Disallow: /modules/`). Googlebot no renderiza igual que el usuario.
2. **Categorías en 404:** `/28-cinturones`, `/42-`, `/43-`, `/57-` (cinturones), `/44-tarjeteros-de-piel` (19 enlaces internos), `/47-carteras-mujer-casual`, `/74-76` rebajas. Líneas de producto fuera del índice.
3. **LCP móvil 7,8 s (home) / 15,4 s (categoría) / 10,7 s (ficha)**; TBT 2–3,2 s; 157–167 peticiones; 49 JS + 50 CSS; ~4 MB.
4. **Spam de enlaces reciente:** 130/200 enlaces muestreados son spam (111 de la red `*.slots-online-machine.online`), 141 detectados oct–nov 2026, 199 dofollow a la home.
5. **Entidad incoherente:** Santomar vs Casanova; teléfonos +34 956 46 09 92 (schema) vs +34 956 71 60 67 (contacto); Ubrique (schema) vs El Bosque (historia); «40» vs «50» años.

### Top 5 quick wins
1. Eliminar la sección «Desautorización manual» y `Disallow: /modules/` de robots.txt (5 min).
2. 301 de `/28-cinturones`, `/44-tarjeteros-de-piel`, `/44-tarjetero-de-piel`, `/47-…` a la categoría vigente más cercana (o reactivarlas).
3. Cambiar el enlace sitewide `/37-casanova` por `/` (240 páginas, doble 301).
4. Añadir `<link rel="canonical">` a la portada y las 24 URLs restantes sin canonical.
5. Unificar NAP (un teléfono, una dirección) en schema, contacto y pie; eliminar el `LeatherGoodsStore` duplicado.

## 1. Técnico (48/100)

| Área | Hallazgo |
|---|---|
| Rastreo | robots.txt bloquea recursos de renderizado (ver crítico 1). Rastreadores IA permitidos. |
| Indexación | 391 HTML 200 → 241 indexables; 14 noindex (incluye `/content/8-13`, landings SEO); 136 canonicalizadas a otra URL (combinaciones de color, correcto). |
| Canonical | 25 URLs sin canonical: `/`, `/mas-vendidos`, `/contactenos`, `/fabricantes`, `/nuevos-productos`, `/promocion`, `/mapa-del-sitio`, `/proveedores`, `/tiendas`, `/content/7-nuestra-historia-carteras-de-piel`… |
| 404 | 61 en rastreo; 50 con enlaces internos (mayoría desde blog a productos descatalogados). |
| Redirecciones | 84 URLs redirigidas siguen enlazadas internamente. `/37-casanova` (240 inlinks) → 301 → 301 → `/`. Productos descatalogados → **302** a categoría (soft 404). |
| Sitemap | `/2_index_sitemap.xml` → 1 sub-sitemap, 180 entradas / 174 únicas: 143 OK, 12 redirecciones, 10 URLs técnicas (`index.php?controller=…`), 7 × 404, 2 noindex, `/blog/news` ×7. ~89 posts del blog ausentes. `/sitemap.xml` = 404. |
| Seguridad | HTTPS + HTTP/2 + Brotli OK; http/www → https 301 OK. **Sin** HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, CSP. |
| Servidor | TTFB 0,9–1,3 s; `Cache-Control: no-store` en HTML. |
| Móvil | `user-scalable=no, maximum-scale=1`; 34–83 elementos táctiles < 24 px; sin scroll horizontal. |
| Hreflang | `es` + `x-default` autorreferentes: correcto (sitio monolingüe). Widget Google Translate cargado (sin valor SEO). |

## 2. Rendimiento (30/100) — laboratorio

| Página | Disp. | TTFB | FCP | LCP | TBT* | CLS | Req. | Terceros |
|---|---|---|---|---|---|---|---|---|
| Home | Móvil | 1,28 s | 4,6 s | **7,8 s** | 2,8 s | 0,005 | 167 | 59 |
| /38-carteras-hombre | Móvil | 1,15 s | 4,5 s | **15,4 s** | 3,2 s | 0,026 | 157 | 61 |
| Ficha 349 | Móvil | 1,18 s | 3,8 s | **10,7 s** | 2,0 s | 0,029 | 167 | 76 |
| Home | Escritorio | 1,20 s | 3,6 s | 3,7 s | 0,19 s | 0,003 | 183 | 58 |
| /38-carteras-hombre | Escritorio | 1,11 s | 3,1 s | 3,7 s | 0,30 s | 0,003 | 179 | 58 |
| Ficha 349 | Escritorio | 0,92 s | 2,9 s | 5,4 s | 0,09 s | 0,081 | 179 | 73 |

\*Suma de long tasks > 50 ms (aprox. TBT). Elemento LCP: banner Black Friday JPEG 115 KB (home), miniatura `thickbox_default` 159 KB (categoría), `large_default` (ficha). Terceros: 2 × GA4 (`G-ZX3C9R2LW2`, `G-DYKLX95PJD`), GTM-PBMMK2DT, Pixel Meta, reCAPTCHA, WhatsApp, Google Translate, Revolution Slider, lottie-player.

## 3. Contenido y E-E-A-T (55/100)

- Categorías: mediana 1.263 palabras (bien). Blog: 154 posts indexables, mediana 902 palabras.
- Fichas: mediana 327 palabras; **24/60 < 300**; descripciones de plantilla repetidas; fichas duplicadas del mismo modelo (BENITO 1123/1155, CUBE 1138/1143, PANA 1110/1165).
- Blog sin autor visible (Person vacío en schema); 5 artículos sobre RFID y varios sobre cuidado del cuero solapados; temas fuera de catálogo (sandalias, bolsos).
- «Nuestra historia»: relato de Miguel, taller fundado en 1981 en El Bosque → mejor activo E-E-A-T, pero no se reutiliza (autoría blog, Organization).
- Contacto: 29 palabras, sin dirección ni horario.
- Sin reseñas externas detectadas (Trustpilot/Google) para Casanova/Santomar.

## 4. On-page (55/100)

- H1 único en el 100 % de páginas. H1 en inglés en 19 listados del blog («Blog - whats new?», «News»).
- Titles: 91/241 > 60 car.; 30 < 30 car.; 3 duplicados. Formato `【 … 】▷` en fichas.
- 21 sin meta description; ≥25 descripciones «lll➤ …» duplicadas.
- Search Console: CTR 0,8 %, posición media 10,9–13,2.
- **Canibalización:** 247 consultas con ≥2 URLs; 38 portada vs categoría (p. ej. «carteras hombre piel» 3.600/mes → posiciona la home en pos. 9 en lugar de `/38-carteras-hombre`).
- SXO: las SERP de «carteras de piel» / «cartera piel hombre» son 100 % transaccionales con páginas de categoría (mercules, gusti-cuero, pieldeubrique, monpiel, El Corte Inglés) → la home (banner + marca) es el tipo de página equivocado para esas consultas.

## 5. Schema (45/100)

| Página | Detectado | Problemas |
|---|---|---|
| Home | Organization, WebSite+SearchAction, LeatherGoodsStore ×2, FAQPage | LeatherGoodsStore duplicado (mismo `@id`), Organization «Santomar» con `@id` y logo relativos; NAP distinto al visible. |
| Categoría | Organization, FAQPage (6/14), BreadcrumbList (microdatos) | Sin ItemList/CollectionPage en 12/14. |
| Producto | Product+Offer+Brand (JSON-LD **y** microdatos) | Sin `aggregateRating`/`review` (revi instalado), sin `shippingDetails`, sin `hasMerchantReturnPolicy`, sin GTIN, brand «Santomar», doble marcado con sku/URL distintos. |
| Blog | BlogPosting, Person, ImageObject | Autor vacío, fechas `2024-05-06 14:29:43` (no ISO 8601), `wordCount` 6.857 vs 1.166 reales, 1 JSON-LD inválido. |

FAQPage: válido pero sin rich result desde 2023 (solo gobierno/salud); útil para GEO.

## 6. Imágenes (45/100)

- 7.347 `<img>` rastreadas: **2.775 sin alt (38 %)**, 2.286 sin width/height (31 %), solo 757 con `loading="lazy"`.
- Galería de producto: alt truncado («…») o vacío desde la 2.ª imagen; `src` = `blank.png` (lazy JS).
- Sin WebP/AVIF aunque el navegador lo acepte (probado con `Accept: image/avif,image/webp`).
- Pesos: miniatura listado 159 KB, banner móvil 115 KB, escritorio 92 KB, ficha 24 KB, logo 6 KB.
- `og:image` = logo JPEG 5,8 KB.

## 7. GEO / búsqueda con IA (50/100)

- ✅ llms.txt publicado (único del grupo competidor); ✅ GPTBot, ClaudeBot, PerplexityBot, Google-Extended permitidos; ✅ FAQ y guías citables.
- ❌ llms.txt enlaza `/28-cinturones` (404) e incluye lista de ~70 keywords (ruido).
- ❌ Entidad ambigua (3 nombres, 2 NAP) → difícil desambiguación por LLMs.
- ❌ Sin menciones externas (prensa, foros, Wikipedia, directorios de Ubrique).
- DinoRANK: 0 prompts de IA monitorizados.

## 8. Autoridad y backlinks

- DinoRANK: 300 enlaces / 215 dominios; LB Rank 1,09.
- Muestra 200: 111 red `slots-online-machine.online`, 19 otros spam/PBN (casino, farmacia, cannabis), 70 legítimos (infosama.es, revi.io, usal.es, medios).
- 141/200 detectados oct–nov 2026; 199/200 dofollow; 199 a la home. Anclas: «De Confianza Colocación de Enlaces Contextuales para carterasdepiel.es…» (121), «High Quality Dofollow Backlinks DA 50…» (28).

## 9. Competencia (DinoRANK, oct 2026)

| Dominio | Tráfico est. | KW | Top 3 | Top 10 |
|---|---|---|---|---|
| **carterasdepiel.es** | **2.059** | 105 | 1 | 35 |
| pieldeubrique.com | 55.913 | 274 | 120 | 193 |
| monpiel.com | 29.743 | 253 | 73 | 177 |
| daviletto.es | 7.087 | 146 | 12 | 64 |
| pielini.com | 4.241 | 64 | 6 | 15 |

Gap principal: «cartera hombre» (27.100), «tarjeteros hombre» (6.600), «billeteros mujer» (2.400), «carteras pequeñas hombre» (1.900), «carteras y monederos mujer» (1.600), «carteras personalizadas» (1.000), «cartera tarjetero hombre» (1.000), «cartera hombre personalizada» (880).

Striking distance: «cartera piel hombre» 3.600 pos 5 · «monedero hombre» 2.900 pos 12 · «cartera hombre pequeña» 2.400 pos 7 · «cartera piel mujer» 1.900 pos 15 · «cartera hombre con monedero» 1.600 pos 19 · «carteras mujer» 14.800 pos 25 · «monederos mujer» 12.100 pos 29.

## 10. Cobertura de los 26 skills SEO

| # | Skill | Aplicación en esta auditoría |
|---|---|---|
| 1 | `seo` | Orquestación, detección de tipo de negocio (e-commerce fabricante). |
| 2 | `seo-audit` | Rastreo 500 URLs, scoring ponderado, este informe + ACTION-PLAN. |
| 3 | `auditoria-seo-infosama` | Informe Word `Informe-SEO-CarterasDePiel.docx` (+ PDF) con identidad Infosama y 9 gráficas. |
| 4 | `seo-technical` | §1: robots, indexación, canonical, 404/redirecciones, seguridad, móvil, JS. |
| 5 | `seo-content` | §3: E-E-A-T, thin content, duplicados, autoría. |
| 6 | `seo-schema` | §5: detección/validación; JSON-LD propuesto en ACTION-PLAN. |
| 7 | `seo-sitemap` | §1: composición, errores, omisiones del sitemap. |
| 8 | `seo-images` | §6: alt, formatos, pesos, lazy, dimensiones. |
| 9 | `seo-geo` | §7: llms.txt, crawlers IA, citabilidad, entidad. |
| 10 | `seo-page` | Análisis profundo de home, `/38-carteras-hombre`, ficha 349, post del blog, historia y contacto. |
| 11 | `seo-backlinks` | §8: perfil, toxicidad, anclas (vía DinoRANK linkbuilding). |
| 12 | `seo-ecommerce` | Product schema, Merchant listings, fichas duplicadas, gap de catálogo (personalización). |
| 13 | `seo-local` | NAP, LeatherGoodsStore, señales locales Ubrique/El Bosque. |
| 14 | `seo-maps` | Limitado: sin DataForSEO/GBP API → solo coherencia NAP y geo del schema (36.6772, -5.4455). |
| 15 | `seo-google` | GSC vía DinoRANK (clics, impresiones, CTR, posición, URLs). PSI/CrUX sin clave (429). |
| 16 | `seo-dataforseo` | No instalado → sustituido por DinoRANK (SERP, volúmenes, competidores). |
| 17 | `seo-sxo` | §4: desajuste de tipo de página (home vs categoría) en SERP transaccionales. |
| 18 | `seo-cluster` | Agrupación temática del blog y de la arquitectura propuesta (ACTION-PLAN §Contenido). |
| 19 | `seo-competitor-pages` | Comparativa de elementos con 4 competidores; propuesta de páginas «vs» y guías comparativas. |
| 20 | `seo-content-brief` | Brief para `/26-carteras-mujer` en ACTION-PLAN. |
| 21 | `seo-plan` | Roadmap 90 días en ACTION-PLAN. |
| 22 | `seo-programmatic` | Análisis de modelos × colores × atributos (RFID, americana, tarjetero) y salvaguardas de thin content. |
| 23 | `seo-hreflang` | Validado `es` + `x-default` (monolingüe, correcto). |
| 24 | `seo-drift` | Baseline guardada en `datos/baseline-crawl-2026-11-23.json` (el script nativo fue bloqueado por la política de red del proxy). |
| 25 | `seo-flow` | Plan organizado en FLOW: Find → Leverage → Optimize → Win. |
| 26 | `seo-image-gen` | No ejecutable (requiere extensión nanobanana); especificación de OG image 1200×630 en ACTION-PLAN. |

## Archivos

- `Informe-SEO-CarterasDePiel.docx` / `.pdf` — informe cliente (tono informativo).
- `ACTION-PLAN.md` — plan interno priorizado.
- `informe-assets/` — gráficas PNG. `screenshots/` — capturas móvil/escritorio.
- `datos/` — robots.txt, llms.txt, rendimiento de laboratorio, baseline de rastreo.
