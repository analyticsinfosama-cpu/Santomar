import json
SEO="Equipo SEO (Infosama)"; DEV="Programador PrestaShop"; CLI="Cliente (Casanova) + Equipo SEO"
T=[]
def t(id,tipo,prio,titulo,desc,resp,tiempo,pasos,ref=""):
    T.append(dict(id=id,tipo=tipo,prioridad=prio,titulo=titulo,descripcion=desc,responsable=resp,tiempo=tiempo,pasos=pasos,referencia=ref))

# ---------------- PROGRAMADOR ----------------
t("dev-01","dev","alta","Desbloquear JS y CSS en robots.txt",
 "El robots.txt bloquea /themes/core.js, /themes/warehouse/assets/js/, /js/jquery/ y los JS de 25 módulos, además de Disallow: /modules/. Google no puede renderizar la página como la ve el usuario.",
 DEV,"30 min",[
 "Descargar copia de seguridad del robots.txt actual.",
 "Borrar el bloque completo «# Desautorización manual» (todas las líneas Disallow de /themes/, /js/ y /modules/…/js/).",
 "Eliminar «Disallow: /modules/» y «Disallow: /es/modules/» del bloque de directorios.",
 "Añadir «Allow: /modules/*.css» y «Allow: /modules/*.js» como red de seguridad.",
 "Importante: PrestaShop regenera robots.txt al pulsar «Generar robots.txt» en Preferencias > Tráfico; documentar el cambio para que no se pierda.",
 "Validar en Search Console > Inspección de URL > Probar URL publicada > Ver página probada (captura y recursos sin «bloqueado»)."],
 "Auditoría §3.1")
t("dev-02","dev","alta","Resolver las categorías que dan 404",
 "/28-cinturones, /42-, /43-, /57- (cinturones), /44-tarjeteros-de-piel (19 enlaces del blog), /44-tarjetero-de-piel, /47-carteras-mujer-casual y /74-76 (rebajas) devuelven 404. La hoja de estrategia sigue asignando keywords a varias de ellas.",
 DEV,"3 h",[
 "Confirmar con el cliente si los cinturones siguen a la venta. Si sí: reactivar la categoría 28 y sus hijas (Catálogo > Categorías > activar) con sus productos.",
 "Si no hay stock: crear redirecciones 301 (módulo de redirecciones o .htaccess/nginx): /28-cinturones y /42-, /43-, /57- → /27-complementos.",
 "/44-tarjeteros-de-piel y /44-tarjetero-de-piel → 301 a la nueva categoría Tarjeteros (tarea seo-14) o, mientras tanto, a /73-carteras-hombre-piel-sin-monedero.",
 "/47-carteras-mujer-casual → 301 a /26-carteras-mujer. /74-, /75-, /76- → 301 a /69-outlet.",
 "Comprobar cada URL con curl -I: debe responder 301 en un solo salto hacia una URL 200."],
 "Auditoría §3.2")
t("dev-03","dev","alta","Corregir el enlace global /37-casanova",
 "Un enlace presente en 240 páginas (cabecera o menú) apunta a /37-casanova, que encadena dos 301 hasta la portada.",
 DEV,"30 min",[
 "Localizar el enlace: buscar «37-casanova» en el megamenú (iqitmegamenu), Creative Elements y las plantillas del tema.",
 "Sustituirlo por https://carterasdepiel.es/ (o por la categoría que corresponda).",
 "Revisar las migas de pan: la ficha muestra «Inicio > Casanova > …»; si «Casanova» es la categoría raíz 37, cambiar la categoría por defecto de los productos a la subcategoría real.",
 "Vaciar caché (Parámetros avanzados > Rendimiento) y comprobar con un rastreo que ninguna página enlaza ya a /37-casanova."],
 "Auditoría §3.2")
t("dev-04","dev","alta","Rendimiento móvil, fase 1: reducir scripts y terceros",
 "LCP móvil de 7,8 s (home), 15,4 s (categoría) y 10,7 s (ficha). Cada página carga 49 JS, más de 50 CSS y 58–76 peticiones a terceros.",
 DEV,"2 días",[
 "Activar en Parámetros avanzados > Rendimiento: CCC para CSS y JS (combinar, comprimir, mover JS al final). Probar en staging; si algún módulo falla, excluirlo.",
 "Eliminar una de las dos propiedades GA4 (G-ZX3C9R2LW2 / G-DYKLX95PJD): dejar solo la que esté en GTM.",
 "Quitar el widget de Google Translate (translate_a/element.js).",
 "Cargar WhatsApp, reCAPTCHA (solo en formularios), lottie-player e Instagram Lite bajo interacción o solo en las páginas que los usan.",
 "Desactivar módulos que no se usan (iqitcompare si no se usa comparador, revsliderprestashop si se sustituye el slider).",
 "Medir antes y después con PageSpeed Insights (móvil) en home, /38-carteras-hombre y una ficha. Objetivo fase 1: LCP < 4 s."],
 "Auditoría §3.6")
t("dev-05","dev","alta","Optimizar la imagen principal (LCP) de portada y categorías",
 "El LCP es el banner de Black Friday (JPEG 115 KB) en portada y la miniatura «thickbox» de 159 KB en categorías.",
 DEV,"4 h",[
 "Sustituir Revolution Slider de la portada por una imagen estática responsive (<picture> con versión móvil y escritorio).",
 "Añadir fetchpriority=\"high\" y <link rel=\"preload\" as=\"image\"> para la imagen del hero; quitar loading=lazy de esa imagen.",
 "En el listado de productos (themes/warehouse/templates/catalog/_partials/miniatures/product.tpl) usar home_default o medium_default en lugar de thickbox_default.",
 "Regenerar miniaturas (Diseño > Ajustes de imágenes) si se cambian tamaños.",
 "Verificar con PageSpeed que el elemento LCP pesa menos de 60 KB."],
 "Auditoría §3.6 y §6")
t("dev-06","dev","alta","Limpiar el sitemap XML",
 "El sitemap tiene 180 entradas: 10 URLs técnicas (index.php?controller=…), 12 redirecciones, 7 errores 404, 2 noindex y /blog/news repetida 7 veces. Faltan unos 89 artículos del blog.",
 DEV,"3 h",[
 "En el módulo Google Sitemap (gsitemap) desmarcar las páginas de módulos y controladores: index.php?controller=product/category/cms, módulos de pago, creativeelements, onepagecheckout, my-shopping-carts.",
 "Excluir /fabricantes, /proveedores, /tiendas, /mapa-del-sitio y las CMS en noindex.",
 "Generar el sitemap del blog con el propio ph_simpleblog (o un sitemap aparte) que incluya todos los posts, y añadirlo al índice.",
 "Crear 301 de /sitemap.xml → /2_index_sitemap.xml.",
 "Regenerar y enviar el índice en Search Console > Sitemaps. Comprobar que todas las URLs responden 200 e indexables."],
 "Auditoría §3.3")
t("dev-07","dev","alta","Redirigir productos descatalogados con 301",
 "Los productos descatalogados redirigen con 302 temporal a la categoría (Google lo trata como soft 404). Hay 12 en el sitemap.",
 DEV,"3 h",[
 "En cada producto desactivado: Catálogo > Producto > SEO > «Redirección cuando el producto está desactivado» = 301 a producto.",
 "Elegir como destino el producto sustituto más parecido (mismo modelo/tipo); si no existe, 301 a la subcategoría.",
 "Para productos eliminados sin equivalente, devolver 410 vía módulo de redirecciones.",
 "Lista inicial: 1115, 1125, 1126, 1135, 1158, 1159, 1160, 1161 y los que marque el rastreo (datos/baseline-crawl)."],
 "Auditoría §3.2")
t("dev-08","dev","alta","Añadir canonical a la portada y 24 URLs",
 "La portada, contacto, «Nuestra historia», más vendidos, novedades, promociones y páginas de sistema no declaran canonical.",
 DEV,"2 h",[
 "En themes/warehouse/templates/_partials/head.tpl comprobar el bloque {block name='head_seo'}: añadir <link rel=\"canonical\" href=\"{$urls.current_url|regex_replace:'/\\?.*$/':''}\"> cuando $page.canonical esté vacío.",
 "Para la portada forzar canonical https://carterasdepiel.es/.",
 "Revisar que las páginas paginadas (?page=2) mantengan canonical autorreferente con su parámetro.",
 "Validar con curl | grep canonical en las 25 URLs."],
 "Auditoría §3.4")
t("dev-09","dev","alta","Completar el schema Product de las fichas",
 "Product no tiene valoraciones (revi instalado pero sin aggregateRating), ni envíos ni devoluciones; la marca figura como «Santomar» y se duplica en JSON-LD y microdatos.",
 DEV,"6 h",[
 "Eliminar los atributos itemprop/itemscope de Product y Offer en las plantillas del tema para dejar solo JSON-LD.",
 "Ampliar el JSON-LD con: brand «Casanova», mpn = referencia, material, countryOfOrigin ES, aggregateRating y review (desde la API/hook del módulo revi).",
 "Añadir offers.shippingDetails (gratis ≥ 20 € Península; tarifa real para pedidos menores y Baleares/Canarias) y hasMerchantReturnPolicy (30 días, devolución gratuita por correo).",
 "Plantilla completa en ACTION-PLAN.md (bloque «JSON-LD Product»).",
 "Validar 5 fichas en la Prueba de resultados enriquecidos y revisar Search Console > Fragmentos de productos / Fichas de comerciante."],
 "Auditoría §4")
t("dev-10","dev","alta","Unificar el schema de empresa de la portada",
 "Hay dos LeatherGoodsStore iguales y un Organization «Santomar» con @id y logo relativos; los datos de contacto no coinciden con los visibles.",
 DEV,"2 h",[
 "Dejar un único bloque LeatherGoodsStore con @id https://carterasdepiel.es/#organization, name «Casanova», legalName (razón social), logo absoluto, foundingDate 1981, telephone y address únicos (los que decida la tarea seo-02).",
 "Eliminar el Organization del tema o hacer que use el mismo @id.",
 "Añadir sameAs completo (Facebook, Instagram, GBP).",
 "Validar en validator.schema.org."],
 "Auditoría §4")
t("dev-11","dev","alta","Añadir cabeceras de seguridad",
 "El servidor no envía HSTS, X-Content-Type-Options, X-Frame-Options ni Referrer-Policy.",
 DEV,"1 h",[
 "En el server block de nginx añadir: add_header Strict-Transport-Security \"max-age=31536000; includeSubDomains\" always;",
 "add_header X-Content-Type-Options nosniff always; add_header X-Frame-Options SAMEORIGIN always; add_header Referrer-Policy strict-origin-when-cross-origin always;",
 "Recargar nginx y comprobar con curl -I https://carterasdepiel.es/.",
 "Content-Security-Policy: dejar para más adelante en modo Report-Only, por el número de scripts de terceros."],
 "Auditoría §3.5")
t("dev-12","dev","media","Servir imágenes en WebP/AVIF con dimensiones y lazy",
 "Todas las imágenes salen en JPEG/PNG, el 31 % no declara ancho/alto y solo 757 de 7.347 usan carga diferida.",
 DEV,"1 día",[
 "Activar WebP nativo de PrestaShop 8 (Diseño > Ajustes de imágenes) o instalar un módulo WebP; alternativa nginx: servir .webp si existe y el navegador lo acepta.",
 "Regenerar miniaturas.",
 "Añadir width y height a <img> en miniaturas, galería y bloques de Creative Elements.",
 "loading=\"lazy\" en todas las imágenes salvo la primera visible.",
 "Comprobar con DevTools > Red que las imágenes se sirven como image/webp."],
 "Auditoría §6")
t("dev-13","dev","media","Texto alternativo correcto en la galería de producto",
 "A partir de la 2.ª imagen de la galería el alt sale truncado («…») o vacío.",
 DEV,"3 h",[
 "En la plantilla de la galería (product-cover-thumbnails.tpl) usar el legend de cada imagen sin truncar.",
 "Si la imagen no tiene leyenda, generar alt = nombre del producto + color + «vista N».",
 "Coordinar con el equipo SEO (tarea seo-09) para rellenar leyendas en las fichas prioritarias."],
 "Auditoría §6")
t("dev-14","dev","media","Corregir el schema y los H1 del blog",
 "BlogPosting tiene el autor vacío, fechas «2024-05-06 14:29:43» (no ISO 8601) y wordCount erróneo. Los listados del blog muestran H1 en inglés («Blog - whats new?», «News»).",
 DEV,"4 h",[
 "En las plantillas de ph_simpleblog formatear datePublished/dateModified como ISO 8601 con zona (date('c')).",
 "Calcular wordCount sobre el texto limpio del post.",
 "Rellenar author como Person con name y url de la página de autor (tarea seo-10).",
 "Cambiar los H1 de listado a español: «Blog de marroquinería y cuidado de la piel» y por categoría.",
 "Reparar el JSON-LD inválido detectado en un post y validar con Rich Results Test."],
 "Auditoría §4 y §5")
t("dev-15","dev","media","Permitir zoom y agrandar elementos táctiles",
 "El viewport bloquea el zoom (user-scalable=no, maximum-scale=1) y hay entre 34 y 83 enlaces o botones de menos de 24 px.",
 DEV,"2 h",[
 "Cambiar el meta viewport a: width=device-width, initial-scale=1.",
 "Aumentar a mínimo 24×24 px (ideal 44 px) el área táctil de iconos del pie, filtros y paginación.",
 "Revisar en móvil real que el menú y el carrito siguen funcionando."],
 "Auditoría §3")
t("dev-16","dev","media","Reducir el tiempo de respuesta del servidor (TTFB)",
 "El TTFB está entre 0,9 y 1,3 s y el HTML se sirve con Cache-Control: no-store.",
 DEV,"1 día",[
 "Verificar OPcache activo y PHP 8.1+.",
 "Activar caché de Smarty y caché de PrestaShop (Memcached/Redis si el hosting lo permite).",
 "Valorar un módulo de caché de página completa para visitantes no logueados.",
 "Medir TTFB antes/después con curl -w %{time_starttransfer}. Objetivo < 0,6 s."],
 "Auditoría §3.5")
t("dev-17","dev","baja","Quitar meta keywords y meta robots duplicada",
 "La cabecera incluye meta keywords (obsoleta) y dos etiquetas meta robots separadas («index» y «follow»).",
 DEV,"30 min",[
 "En head.tpl eliminar la línea de meta keywords.",
 "Unificar en una sola etiqueta: <meta name=\"robots\" content=\"index,follow\"> (o noindex donde aplique)."],
 "Auditoría §11")
t("dev-18","dev","baja","noindex en páginas de sistema vacías",
 "/fabricantes, /proveedores, /tiendas y /mapa-del-sitio son indexables con 1–37 palabras.",
 DEV,"1 h",[
 "Desactivar en Preferencias las páginas de fabricantes, proveedores y tiendas si no se usan.",
 "Si deben existir, añadir meta robots noindex,follow en sus controladores.",
 "Quitarlas del sitemap (relacionado con dev-06)."],
 "Auditoría §3.3")
t("dev-19","dev","baja","Instalar IndexNow",
 "Avisar automáticamente a Bing y otros buscadores de las URLs nuevas o modificadas.",
 DEV,"1 h",[
 "Instalar un módulo IndexNow para PrestaShop o generar la clave y alojar el .txt en la raíz.",
 "Enviar notificaciones en altas y cambios de productos, categorías y posts.",
 "Dar de alta el sitio en Bing Webmaster Tools y comprobar las URLs recibidas."],
 "Auditoría §11")

# ---------------- SEO ----------------
t("seo-01","seo","alta","Desautorizar los enlaces spam",
 "130 de 200 enlaces muestreados son spam (111 de la red *.slots-online-machine.online y 19 de casinos, farmacia y PBN), casi todos de octubre y noviembre de 2026.",
 SEO,"2 h",[
 "Exportar desde DinoRANK > Linkbuilding todos los dominios entrantes.",
 "Marcar como tóxicos: slots-online-machine.online (y variantes truncadas), dominios de casino, farmacia, cannabis, «backlinks/seo» y PBN.",
 "Crear disavow.txt con una línea «domain:xxx» por dominio.",
 "Subirlo en Search Console > Herramienta para desautorizar enlaces.",
 "Revisar cada semana los enlaces nuevos durante 2 meses y ampliar el archivo si sigue la oleada."],
 "Auditoría §2")
t("seo-02","seo","alta","Unificar nombre, dirección y teléfono de la marca",
 "Conviven «Santomar» y «Casanova», dos teléfonos (+34 956 46 09 92 en schema y +34 956 71 60 67 en contacto), dos ubicaciones (Ubrique / El Bosque) y «más de 40» y «más de 50 años».",
 CLI,"3 h",[
 "Reunión con el cliente para fijar: nombre público (Casanova), razón social (Santomar), teléfono único, dirección real del taller y año de fundación (1981).",
 "Actualizar con esos datos: página de contacto, pie de página, aviso legal, «Nuestra historia», textos de la portada y llms.txt.",
 "Pasar los datos al programador para el schema (dev-10).",
 "Revisar y corregir la ficha de Google Business Profile, Facebook, Instagram y directorios (proveedores.com, etc.)."],
 "Auditoría §4 y §7")
t("seo-03","seo","baja","Reasignar en la hoja de estrategia las keywords de URLs muertas",
 "La hoja «Estrategia SEO Santomar» asigna keywords a URLs que hoy dan 404 o redirigen: /47-carteras-mujer-casual, /44-tarjetero-de-piel, /28-cinturones, /57-cinturon-hombre-traje, /45-monederos-de-piel, /79-carteras-mujer-piel-grandes, /2-inicio.",
 SEO,"3 h",[
 "Pestaña «Cartera Mujer»: mover «monederos de piel mujer», «carteras mujer piel ubrique», «monedero de cuero mujer» y «billeteros señora» de /47 a /26-carteras-mujer; las de grandes a /79-carteras-grandes-de-mujer.",
 "Pestaña «Complementos»: tarjeteros → nueva categoría Tarjeteros (seo-14); monederos → /45-monederos-de-piel-con-cremalleras.",
 "Pestaña «Cinturones»: dejar en espera hasta que el cliente confirme si se reactiva la categoría (dev-02).",
 "Pestaña «inicio-2»: cambiar /2-inicio por https://carterasdepiel.es/.",
 "Pestaña «Enlazado interno»: revisar que cada anchor apunte a una URL 200.",
 "Añadir columna «Posición SerpReports nov-2026» con los datos del export para medir la evolución."],
 "Hoja de estrategia + SerpReports")
t("seo-04","seo","alta","Corregir los 50 enlaces rotos del blog",
 "50 URLs en 404 reciben enlaces internos, casi todas desde artículos del blog hacia productos descatalogados.",
 SEO,"4 h",[
 "Abrir el listado de 404 con enlaces internos (datos/baseline-crawl-2026-11-23.json o un rastreo con Screaming Frog).",
 "Priorizar los artículos con tráfico: piel de vacuno vs ovino, hebillas de cinturones, tarjeteros minimalistas, últimas novedades en carteras de hombre, protección RFID.",
 "Sustituir cada enlace por el producto vigente equivalente o por su categoría.",
 "Los 19 enlaces a /44-tarjeteros-de-piel: cambiarlos a la nueva categoría de tarjeteros.",
 "Volver a rastrear y confirmar 0 enlaces internos a 404."],
 "Auditoría §3.2")
t("seo-05","seo","alta","Resolver la canibalización entre portada y categorías",
 "SerpReports muestra la portada posicionando para búsquedas de categoría: «carteras hombre» (22.200/mes, pos. 16), «carteras piel hombre» (3.600, pos. 15), «carteras pequeñas hombre» (880, pos. 12), «carteras piel mujer» (1.600, pos. 9), «monedero grande mujer» (390, pos. 11). Search Console registra 38 consultas en conflicto portada–categoría.",
 SEO,"1 día",[
 "Definir la URL objetivo de cada keyword: hombre → /38-carteras-hombre; mujer → /26-carteras-mujer; pequeñas → /77 o /82; grandes → /79.",
 "Desoptimizar la portada: title y H1 orientados a marca + «fábrica de carteras de piel de Ubrique», sin repetir «carteras de piel hombre/mujer».",
 "Añadir en la portada bloques con enlaces de anchor exacto hacia /38 y /26.",
 "Enlazar desde 5–10 posts del blog a la categoría objetivo con el anchor de la keyword.",
 "Revisar en 4 semanas en SerpReports que la URL posicionada cambia a la categoría."],
 "SerpReports + Auditoría §5.2")
t("seo-06","seo","alta","Reescribir titles y meta descriptions",
 "91 de 241 titles superan 60 caracteres, 21 páginas no tienen meta description y las fichas usan «【 】▷» y «lll➤». CTR medio del 0,8 %.",
 SEO,"1 día",[
 "Categorías (14): title «{Keyword principal} | Hechas en Ubrique – Casanova» (máx. 60), meta de 140–155 caracteres con beneficio + envío gratis.",
 "Fichas: plantilla «{Tipo} de piel {para hombre/mujer} {MODELO} – {Color} | Casanova».",
 "Quitar «【 】▷», «lll➤» y emojis.",
 "Empezar por las 20 URLs con más impresiones en Search Console (home, /38, /26, /79, /77, /69).",
 "Anotar fecha del cambio y medir CTR a 28 días en Search Console."],
 "Auditoría §5.1")
t("seo-07","seo","alta","Empujar las keywords cercanas al top 3",
 "Según SerpReports hay búsquedas de alto volumen a un paso: «carteras piel mujer» (1.600, pos. 9), «carteras grandes mujer» (880, pos. 11), «mini cartera hombre» (320, pos. 11), «carteras mujer grandes» (720, pos. 12), «carteras de cuero» (480, pos. 7), «carteras de piel para hombre» (140, pos. 4).",
 SEO,"2 días",[
 "Para cada keyword confirmar la URL objetivo (tras seo-05).",
 "Revisar la intención en Google y comparar con los 3 primeros (longitud, secciones, filtros, FAQ).",
 "Ampliar el texto de la categoría con la keyword en H2 y una sección de preguntas frecuentes.",
 "Añadir 3–5 enlaces internos con anchor exacto desde posts y categorías hermanas.",
 "Seguimiento semanal en SerpReports; objetivo top 3 en 8 semanas."],
 "SerpReports")
t("seo-08","seo","media","Optimizar /26-carteras-mujer según el brief",
 "Objetivo: «carteras mujer» (14.800, pos. 25), «monederos mujer» (12.100, pos. 29), «cartera mujer pequeña» (1.600, pos. 30 en SerpReports), «carteras de piel de mujer» (590, pos. 20).",
 SEO,"1 día",[
 "Title: «Carteras y Monederos de Piel para Mujer | Hechos en Ubrique – Casanova». H1: «Carteras de piel para mujer».",
 "Intro de 120 palabras sobre la parrilla.",
 "Bloque inferior de 600–800 palabras: cómo elegir el tamaño, piel de vacuno de Ubrique, RFID, cuidados, 4 preguntas frecuentes.",
 "Enlaces a /77, /78 y /79 y al post de cuidado del cuero.",
 "Referencias: pielini.com/es/17-carteras-mujer y pieldeubrique.com/65-billeteras-de-senora-carteras-mujer."],
 "ACTION-PLAN · Brief")
t("seo-09","seo","media","Ampliar fichas cortas y fusionar duplicadas",
 "24 de 60 fichas tienen menos de 300 palabras y hay modelos duplicados con IDs distintos (BENITO 1123/1155, CUBE 1138/1143, PANA 1110/1165). SerpReports muestra fichas posicionando para búsquedas de categoría («tarjetero piel hombre» → ficha PANA; «carteras de piel hombre» → ficha FLORENCIA).",
 SEO,"3 días",[
 "Decidir con el cliente qué ficha duplicada se conserva; pedir al programador 301 de la otra.",
 "Plantilla de ficha: uso ideal, medidas y capacidad, materiales, RFID, diferencias con modelos hermanos, cuidados, 3 preguntas frecuentes.",
 "Escribir leyendas de imagen (alt) por color y vista.",
 "Empezar por las fichas con impresiones en Search Console (200 CLASSIC, 349 CLASSIC, 1099 FLORENZIA, 1108 PANA, 1101 FLORENCIA)."],
 "Auditoría §5.3")
t("seo-10","seo","media","Crear la página de autor del blog",
 "El blog se publica sin autor. «Nuestra historia» (Miguel, taller familiar desde 1981) es el mayor activo de confianza y no se aprovecha.",
 SEO,"4 h",[
 "Redactar la bio de Miguel: oficio, años en el taller, especialidad.",
 "Crear la página de autor (CMS) con foto real del taller.",
 "Asignar el autor a todos los posts y mostrar firma con enlace a la bio.",
 "Pasar la URL al programador para el schema Person (dev-14)."],
 "Auditoría §7")
t("seo-11","seo","media","Reorganizar el blog en grupos temáticos",
 "Más de 150 posts con temas solapados (5 sobre RFID, varios sobre cuidado e hidratación del cuero) y otros alejados del catálogo.",
 SEO,"2 días",[
 "Agrupar posts en: Cuidado del cuero, Tipos de piel, RFID, Guías de compra hombre, Guías de compra mujer, Regalos, Ubrique y artesanía.",
 "Elegir un post pilar por grupo (p. ej. «piel de vacuno vs ovino», 49 clics/mes).",
 "Fusionar duplicados en el pilar y pedir 301 de los fusionados.",
 "Enlazar cada post del grupo al pilar y el pilar a la categoría de producto.",
 "Decidir qué hacer con posts fuera de catálogo (sandalias, bolsos): actualizar, noindex o eliminar."],
 "Auditoría §5.3 y §10")
t("seo-12","seo","media","Completar la página de contacto",
 "La página de contacto tiene 29 palabras, sin dirección ni horario.",
 SEO,"2 h",[
 "Añadir dirección del taller, teléfono único, email, horario y CIF (datos de seo-02).",
 "Texto breve sobre venta al por mayor y visitas al taller.",
 "Enlace a la ficha de Google Business Profile y a «Nuestra historia»."],
 "Auditoría §7")
t("seo-13","seo","media","Decidir qué hacer con las landings en noindex",
 "/content/8 a /content/13 («Billeteros de piel», «Carteras de piel baratas», «para hombre», «para mujer»…) existen pero no se indexan.",
 SEO,"2 h",[
 "Leer cada landing y compararla con la categoría equivalente.",
 "Si duplica la categoría: pedir 301 a la categoría y mover el texto útil a ella.",
 "Si aporta un ángulo distinto (p. ej. «baratas», «al por mayor»): quitar noindex, optimizar y enlazar desde el menú o el pie."],
 "Auditoría §3.4")
t("seo-14","seo","media","Crear la categoría Tarjeteros de piel",
 "«tarjeteros hombre» suma 6.600 búsquedas/mes (pielini en pos. 6) y la antigua categoría de tarjeteros da 404. SerpReports: «tarjeteros de piel» pos. 28 con una ficha.",
 SEO,"1 día",[
 "Pedir al programador que cree la categoría (o reactive la 44) con URL /tarjeteros-de-piel.",
 "Asignar los productos tipo tarjetero y cartera americana tarjetero.",
 "Escribir title, meta, intro y texto inferior (500–700 palabras) con «tarjeteros de piel», «tarjetero piel hombre», «tarjetero de cuero».",
 "Redirigir /44-tarjeteros-de-piel a la nueva URL y actualizar la hoja de estrategia."],
 "Content gap")
t("seo-15","seo","media","Activar la captación de reseñas",
 "El módulo revi está instalado pero no aparecen valoraciones en Google ni reseñas externas de la marca.",
 CLI,"2 h",[
 "Configurar en revi el email automático de solicitud de reseña 7–10 días tras la entrega.",
 "Activar Google Customer Reviews en Merchant Center.",
 "Pedir reseña en Google Business Profile en el email de envío.",
 "Objetivo: 100 reseñas en 6 meses. Responder todas."],
 "Auditoría §7")
t("seo-16","seo","baja","Actualizar el llms.txt",
 "El llms.txt enlaza /28-cinturones (404) e incluye una lista de unas 70 palabras clave.",
 SEO,"1 h",[
 "Quitar la sección «Palabras clave objetivo».",
 "Sustituir enlaces muertos por URLs vigentes.",
 "Añadir secciones «Sobre el fabricante» (1981, El Bosque/Ubrique), «Envíos y devoluciones» y «Guías destacadas»."],
 "Auditoría §8")
t("seo-17","seo","baja","Crear una imagen social de marca",
 "La imagen que se muestra al compartir la web (og:image) es el logotipo en JPEG de 5,8 KB.",
 SEO,"2 h",[
 "Diseñar una imagen 1200×630 con producto y taller.",
 "Pasarla al programador para og:image de portada y por defecto.",
 "Revisar la vista previa en el depurador de Facebook y LinkedIn Post Inspector."],
 "Auditoría §6")
t("seo-18","seo","baja","Conseguir menciones y enlaces locales",
 "El perfil legítimo de enlaces es muy pequeño y no hay menciones externas de la marca.",
 SEO,"4 h/mes",[
 "Contactar con la Asociación de la Piel de Ubrique y el Museo de la Piel para aparecer en sus directorios.",
 "Proponer una noticia a la prensa local (Diario de Cádiz, Europa Sur) sobre el taller familiar desde 1981.",
 "Alta en directorios de artesanía andaluza y de fabricantes.",
 "Registrar cada enlace conseguido en la hoja de estrategia."],
 "Auditoría §2 y §8")
t("seo-19","seo","baja","Monitorizar la presencia en asistentes de IA",
 "DinoRANK no tiene prompts de IA configurados para el dominio.",
 SEO,"1 h",[
 "Configurar en DinoRANK > LLMs prompts como «mejores carteras de piel de Ubrique», «dónde comprar cartera de piel hecha en España», «fábrica de carteras de piel en Cádiz».",
 "Revisar mensualmente si la marca aparece y qué fuentes citan."],
 "Auditoría §8")
t("seo-20","seo","baja","Estudiar una línea de carteras personalizadas",
 "Los dos líderes venden carteras con grabado: «carteras personalizadas» (1.000/mes) y «cartera hombre personalizada» (880). Requiere decisión de negocio.",
 CLI,"2 h (estudio)",[
 "Presentar al cliente volumen de búsqueda y competidores (pieldeubrique, monpiel).",
 "Si se aprueba: definir productos, precio y proceso de grabado.",
 "Planificar la categoría y su contenido como en seo-14."],
 "Content gap")
t("seo-21","seo","baja","Seguimiento mensual de posiciones y re-auditoría",
 "Medir el efecto del plan sobre las keywords de SerpReports y la hoja de estrategia.",
 SEO,"2 h/mes",[
 "Exportar SerpReports cada mes y actualizar la columna de posición en la hoja.",
 "Revisar en Search Console clics, CTR y posición de las 20 URLs principales.",
 "A los 90 días repetir el rastreo completo y comparar con datos/baseline-crawl-2026-11-23.json."],
 "Seguimiento")

json.dump(T,open('tasks.json','w'),ensure_ascii=False,indent=1)
from collections import Counter
print(len(T),Counter((x['tipo'],x['prioridad']) for x in T))
