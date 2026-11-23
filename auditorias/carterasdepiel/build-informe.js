const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, ImageRun, PageBreak, TableOfContents, Footer, Header,
  PageNumber, VerticalAlign,
} = require("docx");

const ASSETS = __dirname + "/informe-assets/";

// Paleta Infosama
const AZUL = "4688A8";
const VERDE = "A4D76C";
const CARBON = "2A2A2A";
const GRIS = "6B7177";
const ROJO = "C0392B";
const NARANJA = "C8801F";
const VERDEOSC = "5A8A2A";

const CONTENT_W = 9360;

// ---- Helpers ---------------------------------------------------------------
const H1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)] });
const H2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] });
const H3 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(t)] });

function P(text, opts = {}) {
  const runs = Array.isArray(text) ? text : [new TextRun({ text, ...opts })];
  return new Paragraph({ spacing: { after: 120, line: 276 }, children: runs, ...(opts.align ? { alignment: opts.align } : {}) });
}

function bullet(runs) {
  return new Paragraph({
    numbering: { reference: "bul", level: 0 },
    spacing: { after: 60, line: 268 },
    children: Array.isArray(runs) ? runs : [new TextRun(runs)],
  });
}

function img(file, w, h, caption) {
  const ext = "png";
  const arr = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 60 },
      children: [new ImageRun({
        type: ext,
        data: fs.readFileSync(ASSETS + file),
        transformation: { width: w, height: h },
        altText: { title: caption, description: caption, name: file },
      })],
    }),
  ];
  if (caption) {
    arr.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: caption, italics: true, size: 17, color: GRIS })],
    }));
  }
  return arr;
}

const border = { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" };
const borders = { top: border, bottom: border, left: border, right: border, insideHorizontal: border, insideVertical: border };

function cell(content, { w, fill, bold, color, align, head } = {}) {
  const runs = (Array.isArray(content) ? content : [content]).map((t) =>
    typeof t === "string" ? new TextRun({ text: t, bold: bold || head, color: color || (head ? "FFFFFF" : CARBON), size: head ? 19 : 19 }) : t);
  return new TableCell({
    borders,
    width: { size: w, type: WidthType.DXA },
    verticalAlign: VerticalAlign.CENTER,
    shading: fill ? { fill, type: ShadingType.CLEAR } : undefined,
    margins: { top: 70, bottom: 70, left: 110, right: 110 },
    children: [new Paragraph({ alignment: align || AlignmentType.LEFT, children: runs })],
  });
}

function table(headers, rows, widths) {
  const headRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => cell(h, { w: widths[i], fill: AZUL, head: true, align: i === 0 ? AlignmentType.LEFT : AlignmentType.CENTER })),
  });
  const bodyRows = rows.map((r, ri) =>
    new TableRow({
      children: r.map((c, i) => {
        const isObj = c && typeof c === "object" && !Array.isArray(c) && c.text !== undefined;
        const txt = isObj ? c.text : c;
        return cell(txt, {
          w: widths[i],
          fill: ri % 2 ? "F4F7F9" : "FFFFFF",
          color: isObj ? c.color : undefined,
          bold: isObj ? c.bold : false,
          align: i === 0 ? AlignmentType.LEFT : AlignmentType.CENTER,
        });
      }),
    }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: widths, rows: [headRow, ...bodyRows] });
}

// estado coloreado
const E = {
  fail: { text: "Deficiente", color: ROJO, bold: true },
  warn: { text: "Mejorable", color: NARANJA, bold: true },
  pass: { text: "Correcto", color: VERDEOSC, bold: true },
  nd: { text: "Sin datos", color: GRIS, bold: true },
};

// ---- Documento -------------------------------------------------------------
const children = [];
const B = (t) => new TextRun({ text: t, bold: true });
const T = (t) => new TextRun(t);
const LB = (t) => new TextRun({ text: t, bold: true, color: AZUL });

const LOGO_PATH = ASSETS + "logo-infosama.png";
children.push(
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1400, after: 700 }, children: [new ImageRun({ type: "png", data: fs.readFileSync(LOGO_PATH), transformation: { width: 380, height: 144 }, altText: { title: "Infosama", description: "Infosama — Agencia SEO en Cádiz", name: "logo-infosama" } })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: AZUL, space: 12 }, top: { style: BorderStyle.SINGLE, size: 12, color: AZUL, space: 12 } }, spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "INFORME SEO INTEGRAL", bold: true, size: 46, color: CARBON })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 300 }, children: [new TextRun({ text: "carterasdepiel.es", bold: true, size: 40, color: AZUL })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [new TextRun({ text: "Casanova · Santomar — Marroquinería artesanal de Ubrique", size: 24, color: GRIS, italics: true })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Documento de diagnóstico · Análisis del estado SEO", size: 22, color: CARBON })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "Fecha de elaboración: 23 de noviembre de 2026", size: 20, color: GRIS })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Confidencial — preparado por Infosama", size: 18, color: GRIS, italics: true })] }),
  new Paragraph({ children: [new PageBreak()] }),
  H1("Índice"),
  new TableOfContents("Tabla de contenidos", { hyperlink: true, headingStyleRange: "1-2" }),
  new Paragraph({ children: [new PageBreak()] }),
);

// NOTA METODOLOGICA
children.push(
  H1("Nota metodológica"),
  P("Este documento recoge un diagnóstico del estado de optimización para buscadores (SEO) del sitio web carterasdepiel.es. Su finalidad es exclusivamente informativa: describe la situación actual del proyecto, sus fortalezas, sus carencias y su posición frente a la competencia. La ejecución de mejoras se aborda en un plan de trabajo independiente."),
  P([LB("Fuentes y alcance. "), T("El análisis combina el rastreo real del dominio (500 URLs analizadas el 23/11/2026: página principal, robots.txt, sitemap XML, llms.txt, 25 categorías, 221 URLs de producto, 160 URLs del blog y páginas corporativas), datos de Google Search Console conectados a través de DinoRANK (mayo–noviembre de 2026), visibilidad y tráfico orgánico estimado de DinoRANK para el dominio y cuatro competidores, el perfil de enlaces entrantes registrado por DinoRANK y mediciones de rendimiento en laboratorio con un navegador Chromium que emula un móvil de gama media con red 4G lenta.")]),
  P([LB("Limitaciones. "), T("La API pública de PageSpeed Insights rechazó las peticiones por límite de uso, por lo que las métricas de Core Web Vitals proceden de pruebas de laboratorio propias y no de datos de campo (CrUX). El tráfico de competidores y las cifras de visibilidad son estimaciones de herramienta y se identifican como tales. No se ha dispuesto de acceso a Google Analytics ni a la ficha de Google Business Profile.")]),
  new Paragraph({ children: [new PageBreak()] }),
);

// 1. RESUMEN EJECUTIVO
children.push(
  H1("1. Resumen ejecutivo"),
  P("carterasdepiel.es es la tienda online de un fabricante de pequeña marroquinería de la Sierra de Cádiz (marca comercial Casanova, razón comercial Santomar), construida sobre PrestaShop con el tema Warehouse. Vende carteras, monederos, tarjeteros y llaveros de piel de vacuno, con un catálogo activo de unas 60–70 referencias canónicas y un blog muy desarrollado de más de 150 artículos."),
  P("El proyecto cuenta con una base de contenido superior a la media del sector —categorías con 800 a 1.260 palabras, blog extenso, llms.txt publicado, preguntas frecuentes marcadas con datos estructurados— y conserva una visibilidad estable en torno a 2.000 visitas orgánicas mensuales estimadas. Sin embargo, esa base convive con fallos técnicos de alto impacto: el robots.txt impide a Google descargar los JavaScript del tema, familias completas del catálogo (cinturones, tarjeteros) devuelven error 404, el rendimiento móvil es muy lento y el perfil de enlaces ha recibido en octubre y noviembre de 2026 una oleada de enlaces spam."),
  H2("Puntuación SEO global"),
  ...img("01_gauge.png", 300, 242, "Puntuación SEO global: 49 sobre 100."),
  P("La puntuación de 49/100 refleja un sitio con contenido y estructura aprovechables, lastrado por problemas técnicos y de rendimiento que impiden que ese contenido compita en igualdad de condiciones con los líderes del nicho."),
  ...img("02_categorias.png", 540, 299, "Desglose del diagnóstico por área SEO (0-100)."),
  H2("Síntesis por áreas"),
  table(["Área", "Estado", "Valoración"], [
    ["Técnico (rastreo/indexación)", E.warn, "48/100 — JS bloqueado en robots.txt, categorías en 404 y enlaces rotos"],
    ["Contenido / E-E-A-T", E.warn, "55/100 — blog y categorías sólidos; autoría y entidad de marca difusas"],
    ["On-page (titles/meta/H)", E.warn, "55/100 — H1 únicos; títulos largos y canibalización home–categoría"],
    ["Datos estructurados", E.warn, "45/100 — Product incompleto, LocalBusiness duplicado e incoherente"],
    ["Rendimiento (Core Web Vitals)", E.fail, "30/100 — LCP móvil de 7,8 a 15,4 s en laboratorio"],
    ["Visibilidad en IA (GEO)", E.warn, "50/100 — llms.txt y FAQ presentes; entidad de marca confusa"],
    ["Imágenes", E.warn, "45/100 — 38 % sin alt, sin WebP/AVIF, miniaturas pesadas"],
    ["Autoridad de dominio", E.fail, "15/100 — LB Rank 1,09; perfil dominado por spam reciente"],
    ["Competitividad", E.fail, "25/100 — tráfico 27 veces inferior al líder del nicho"],
  ], [3000, 1500, 4860]),
  P(""),
  P([LB("Cálculo. "), T("La puntuación global pondera Técnico (22 %), Contenido (23 %), On-page (20 %), Datos estructurados (10 %), Rendimiento (10 %), GEO (10 %) e Imágenes (5 %). Autoridad y Competitividad se muestran como contexto y no entran en la media.")]),
  H2("Principales hallazgos críticos"),
  bullet([B("robots.txt bloquea los JavaScript del tema y de los módulos "), T("(/themes/core.js, /themes/warehouse/assets/js/, /js/jquery/, /modules/*/views/js/). Google no puede renderizar la página tal como la ve el usuario.")]),
  bullet([B("La categoría Cinturones (/28-cinturones) y sus subcategorías devuelven 404, "), T("igual que /44-tarjeteros-de-piel, enlazada desde 19 artículos del blog. Una línea de producto completa ha desaparecido del índice.")]),
  bullet([B("Rendimiento móvil muy deficiente: "), T("LCP de 7,8 s en la portada, 15,4 s en la categoría de hombre y 10,7 s en ficha; más de 160 peticiones y ~4 MB por carga.")]),
  bullet([B("Oleada de enlaces spam: "), T("el 65 % de los 200 enlaces muestreados procede de una red de subdominios «slots-online-machine.online» y de PBN, casi todos dofollow hacia la portada y detectados en octubre–noviembre de 2026.")]),
  bullet([B("Entidad de marca incoherente: "), T("conviven «Santomar» y «Casanova», dos teléfonos distintos, dos direcciones (Ubrique / El Bosque) y antigüedades de «más de 40» y «más de 50 años».")]),
  bullet([B("50 enlaces internos rotos y un enlace en todo el sitio "), T("(/37-casanova, presente en 240 páginas) que encadena dos redirecciones 301 hasta la portada.")]),
  new Paragraph({ children: [new PageBreak()] }),
);

// 2. AUTORIDAD
children.push(
  H1("2. Autoridad del proyecto y rendimiento orgánico"),
  H2("Tráfico y visibilidad"),
  P("Según DinoRANK, el dominio mantiene una visibilidad estable de unas 2.000 visitas orgánicas mensuales estimadas a lo largo de 2025 y 2026, con un pico de 3.599 en marzo de 2026. En octubre de 2026 posiciona 105 palabras clave en España: 35 en el top 10 y solo 1 en el top 3."),
  ...img("08_trafico.png", 540, 250, "Evolución del tráfico orgánico estimado (DinoRANK)."),
  P("Los datos reales de Search Console confirman esa estabilidad: entre 630 y 690 clics mensuales desde julio de 2026, sobre 76.000–85.000 impresiones, con un CTR medio del 0,8 % y una posición media que oscila entre 10,9 y 13,2. El dominio aparece mucho en Google pero convierte esas apariciones en clics con poca eficacia."),
  table(["URL (Search Console, últimos 90 días)", "Clics", "Impresiones", "Pos. media"], [
    ["Portada /", "180", "19.142", "25,4"],
    ["/38-carteras-hombre", "127", "37.728", "15,5"],
    ["Blog: piel de vacuno vs. piel de ovino", "49", "2.444", "7,5"],
    ["/26-carteras-mujer", "42", "8.028", "19,7"],
    ["/79-carteras-grandes-de-mujer", "38", "5.162", "8,1"],
    ["/69-outlet", "36", "2.034", "21,9"],
    ["/77-carteras-mujer-piel-pequenas", "4", "4.211", "16,2"],
  ], [4560, 1300, 1900, 1600]),
  P(""),
  P("Se observa además que, desde octubre de 2025, el número de palabras clave registradas en las páginas 2 a 5 de resultados cae de forma abrupta en DinoRANK mientras el tráfico se mantiene. Este patrón es coherente con el cambio que Google introdujo en septiembre de 2025 en la paginación de resultados, que redujo lo que las herramientas pueden medir más allá del top 10, y no indica una pérdida real de posiciones."),
  H2("Perfil de enlaces entrantes"),
  P("DinoRANK registra 300 enlaces desde 215 dominios y asigna al dominio un LB Rank de 1,09, un valor bajo. La composición del perfil es el dato más preocupante del área:"),
  ...img("09_backlinks.png", 480, 224, "Composición de los 200 enlaces entrantes muestreados."),
  bullet([B("111 enlaces "), T("proceden de subdominios de una misma red («editorial-link-juice-catalog.slots-online-machine.online» y similares), con anclas promocionales del tipo «De Confianza Colocación de Enlaces Contextuales para carterasdepiel.es…».")]),
  bullet([B("19 enlaces más "), T("llegan de dominios de casinos, farmacia, cannabis o PBN («High Quality Dofollow Backlinks DA 50 PA 40 Premium PBN Network»).")]),
  bullet([B("141 de los 200 enlaces "), T("se detectaron en octubre y noviembre de 2026, el 99,5 % son dofollow y 199 apuntan a la portada. Es un patrón característico de spam automatizado o de SEO negativo, ajeno a la actividad del propio sitio.")]),
  bullet([B("Los enlaces legítimos "), T("son escasos: infosama.es, revi.io, usal.es y algunos medios y directorios, con anclas de marca («Santomar», «carterasdepiel.es») y temáticas.")]),
  P("Google suele ignorar este tipo de enlaces, pero su volumen relativo, con un perfil legítimo tan reducido, distorsiona las señales de autoridad del dominio y lo expone a una valoración algorítmica desfavorable."),
  new Paragraph({ children: [new PageBreak()] }),
);

// 3. TECNICO
children.push(
  H1("3. Diagnóstico técnico"),
  table(["Categoría", "Estado", "Observación"], [
    ["Rastreabilidad (robots.txt)", E.fail, "Bloquea JS del tema y de 25 módulos; Google no renderiza la página completa"],
    ["Indexabilidad", E.warn, "241 de 391 URLs HTML son indexables; 25 sin canonical (portada incluida)"],
    ["Códigos de estado", E.fail, "61 URLs en 404, 104 redirecciones; 50 enlaces internos rotos"],
    ["Sitemap XML", E.warn, "31 de 180 entradas no válidas; ~89 artículos del blog ausentes"],
    ["Seguridad", E.warn, "HTTPS y redirecciones correctas; sin HSTS ni cabeceras de seguridad"],
    ["Estructura de URLs", E.warn, "Rutas de categoría variables en fichas; URLs de combinación (id-atributo)"],
    ["Móvil", E.warn, "Diseño adaptable, pero zoom bloqueado y elementos táctiles pequeños"],
    ["Core Web Vitals", E.fail, "LCP móvil 7,8–15,4 s; bloqueo del hilo principal 2–3 s"],
    ["Renderizado JavaScript", E.fail, "49 scripts y 50 hojas de estilo; recursos críticos bloqueados a Google"],
  ], [2600, 1400, 5360]),
  P(""),
  H2("3.1 robots.txt y renderizado"),
  P("El robots.txt generado por PrestaShop incluye una sección «Desautorización manual» que bloquea, entre otros, /themes/core.js, /themes/warehouse/assets/js/, /js/jquery/ y los JavaScript de módulos como el megamenú, Creative Elements, las reseñas (revi, iqitreviews), el carrito o el blog. Además, la regla genérica Disallow: /modules/ bloquea hojas de estilo e imágenes de módulos que no son PNG o JPG."),
  P("Google renderiza las páginas con un navegador y necesita descargar los recursos que construyen el menú, los carruseles de producto y los bloques de contenido. Con estas reglas, la versión que procesa Googlebot difiere de la que ve el usuario: el menú y los enlaces generados por JavaScript pueden no descubrirse, y Search Console tiende a señalar problemas de usabilidad móvil aunque la página funcione. Ninguno de los competidores analizados aplica bloqueos de este tipo."),
  H2("3.2 Errores 404, redirecciones y enlazado roto"),
  P("El rastreo detectó 61 URLs con respuesta 404. Las más relevantes no son productos antiguos, sino categorías completas:"),
  table(["URL", "Respuesta", "Enlaces internos que apuntan a ella"], [
    ["/28-cinturones", "404", "11 (blog) + llms.txt"],
    ["/42-cinturon-hombre-clasico · /43-…-casual · /57-…-traje", "302 → 404", "2 cada una; incluidas en el sitemap"],
    ["/44-tarjeteros-de-piel", "404", "19 artículos del blog"],
    ["/44-tarjetero-de-piel", "404", "3"],
    ["/47-carteras-mujer-casual", "302 → 404", "2; incluida en el sitemap"],
    ["/74-rebaja-40 · /75-rebaja-30 · /76-rebaja-20", "302 → 404", "Incluidas en el sitemap y en llms.txt"],
  ], [4200, 1600, 3560]),
  P(""),
  P("Hasta abril de 2026 DinoRANK registraba posiciones para «correas de cuero para hombre», «cinturones de cuero» y «tarjetero de cuero» con estas URLs. Su desaparición elimina del índice dos familias de producto con demanda contrastada (por ejemplo, «tarjeteros hombre», con 6.600 búsquedas mensuales)."),
  P("A esto se suman 50 URLs en 404 que reciben enlaces internos (en su mayoría productos descatalogados enlazados desde el blog) y 84 URLs que redirigen y siguen enlazadas internamente. El caso más extendido es /37-casanova, enlazada desde 240 páginas, que encadena dos redirecciones 301 hasta la portada. Los productos descatalogados del sitemap redirigen con un 302 temporal a la categoría padre, un tratamiento que Google suele interpretar como «soft 404»."),
  H2("3.3 Sitemap XML"),
  P("El robots.txt declara /2_index_sitemap.xml, que contiene un único sub-sitemap con 180 entradas. La dirección estándar /sitemap.xml devuelve 404."),
  ...img("06_sitemap.png", 500, 274, "Composición del sitemap XML rastreado."),
  bullet([B("Entradas no válidas: "), T("10 URLs técnicas de PrestaShop (index.php?controller=product, =cms, módulos de pago o del editor visual), 12 redirecciones, 7 errores 404 y 2 páginas noindex.")]),
  bullet([B("Duplicados: "), T("/blog/news aparece 7 veces.")]),
  bullet([B("Omisiones: "), T("el rastreo encontró 146 artículos del blog accesibles frente a 57 en el sitemap, y los artículos más recientes (noviembre de 2026) no figuran.")]),
  bullet([B("Páginas de bajo valor: "), T("/fabricantes, /proveedores, /tiendas y /mapa-del-sitio, con entre 1 y 37 palabras de contenido, están incluidas e indexables.")]),
  H2("3.4 Canonicalización e indexabilidad"),
  P("PrestaShop genera URLs de combinación (por ejemplo, /349-910-cartera-…html para cada color) que canonicalizan correctamente hacia la ficha principal. Sin embargo, 25 URLs no declaran canonical, entre ellas la portada, la página «Nuestra historia», contacto y los listados «más vendidos», «novedades» y «promociones». La portada es accesible también como /index.php y /2-inicio (ambas redirigen correctamente)."),
  P("Las páginas de contenido /content/8 a /content/13 («Billeteros de piel», «Carteras de piel baratas», «Carteras de piel para hombre», «Carteras de piel para mujer»…) están marcadas como noindex: el contenido existe, pero no compite en Google."),
  H2("3.5 Seguridad y servidor"),
  P("El sitio responde por HTTPS con HTTP/2 y compresión Brotli, y consolida correctamente las variantes http:// y www. hacia https://carterasdepiel.es/. No se envían cabeceras Strict-Transport-Security (HSTS), X-Content-Type-Options, X-Frame-Options, Referrer-Policy ni Content-Security-Policy. El tiempo de respuesta del servidor (TTFB) se sitúa entre 0,9 y 1,3 s, por encima del umbral de 0,8 s recomendado. La caché HTTP está desactivada en las páginas HTML (no-store)."),
  H2("3.6 Rendimiento y Core Web Vitals"),
  table(["Página (móvil, laboratorio)", "FCP", "LCP", "Bloqueo hilo", "CLS", "Peticiones"], [
    ["Portada", "4,6 s", { text: "7,8 s", color: ROJO, bold: true }, "2,8 s", { text: "0,005", color: VERDEOSC, bold: true }, "167"],
    ["/38-carteras-hombre", "4,5 s", { text: "15,4 s", color: ROJO, bold: true }, "3,2 s", { text: "0,026", color: VERDEOSC, bold: true }, "157"],
    ["Ficha de producto", "3,8 s", { text: "10,7 s", color: ROJO, bold: true }, "2,0 s", { text: "0,029", color: VERDEOSC, bold: true }, "167"],
  ], [2900, 1000, 1200, 1500, 1200, 1560]),
  P(""),
  P("Umbrales de Google: LCP ≤ 2,5 s y CLS ≤ 0,1. En escritorio el LCP baja a 3,7–5,4 s, también por encima del umbral. La estabilidad visual (CLS) es correcta."),
  P("Las causas principales son el volumen de recursos: 49 scripts y 50–54 hojas de estilo por página, sin agrupar, más 58–76 peticiones a terceros (dos propiedades de Google Analytics 4, Google Tag Manager, Píxel de Meta, reCAPTCHA, widget de WhatsApp, Google Translate, Revolution Slider y lottie-player). El elemento LCP es siempre una imagen JPEG: el banner de Black Friday (115 KB) en portada y la miniatura «thickbox» de 159 KB en las categorías. Estas cifras son mediciones de laboratorio en un móvil de gama media; los datos reales de usuarios (CrUX) no han podido consultarse."),
  new Paragraph({ children: [new PageBreak()] }),
);

// 4. DATOS ESTRUCTURADOS
children.push(
  H1("4. Datos estructurados (Schema.org)"),
  table(["Tipo de página", "Marcado detectado", "Estado"], [
    ["Portada", "Organization, WebSite + SearchAction, LeatherGoodsStore (×2), FAQPage", E.warn],
    ["Categorías", "Organization, FAQPage (6 de 14), BreadcrumbList (microdatos)", E.warn],
    ["Fichas de producto", "Product + Offer + Brand (JSON-LD y microdatos)", E.warn],
    ["Blog", "BlogPosting, Person, ImageObject, Organization", E.warn],
    ["Contacto / Historia", "Solo Organization", E.fail],
  ], [2400, 5160, 1800]),
  P(""),
  H2("Incidencias detectadas"),
  bullet([B("Entidad duplicada e incoherente. "), T("La portada contiene dos bloques LeatherGoodsStore idénticos con el mismo @id, con logo distinto al del bloque Organization. Organization usa el nombre «Santomar», un @id relativo («#store-organization») y un logo con ruta relativa; LeatherGoodsStore usa «Casanova - Fábrica de Carteras de Piel de Ubrique». Google recibe dos identidades para el mismo negocio.")]),
  bullet([B("NAP contradictorio. "), T("El marcado declara el teléfono +34 956 46 09 92 y la dirección «Polígono Industrial Ubrique, Calle Ingeniero Juan de la Cierva», mientras la página de contacto muestra +34 956 71 60 67 y la historia de la empresa sitúa el taller en El Bosque.")]),
  bullet([B("Product sin valoraciones. "), T("El módulo de reseñas revi está instalado, pero ninguna ficha incluye aggregateRating ni review, por lo que no pueden mostrarse estrellas en los resultados. pieldeubrique.com sí las muestra.")]),
  bullet([B("Product sin envíos ni devoluciones. "), T("Faltan shippingDetails y hasMerchantReturnPolicy, aunque el sitio ofrece envío gratuito desde 20 € y devoluciones en 30 días. Estos campos influyen en la elegibilidad para fichas de comerciante y Google Shopping gratuito.")]),
  bullet([B("Marca y doble marcado. "), T("La marca de producto se declara «Santomar» aunque el producto se comercializa como Casanova. Cada ficha incluye Product en JSON-LD y en microdatos con valores distintos (sku «10064» frente a «10064||MARRON»; URL canónica frente a URL de combinación).")]),
  bullet([B("BlogPosting con datos erróneos. "), T("El autor (Person) está vacío; las fechas usan un formato no ISO 8601 («2024-05-06 14:29:43», sin «T» ni zona horaria) y wordCount declara 6.857 palabras en un artículo de 1.166. Un artículo presenta JSON-LD no válido.")]),
  bullet([B("FAQPage. "), T("Correctamente construido, aunque desde 2023 Google solo muestra resultados enriquecidos de FAQ para webs gubernamentales y sanitarias. Conserva valor como fuente para los motores de IA.")]),
  new Paragraph({ children: [new PageBreak()] }),
);

// 5. ON-PAGE Y CONTENIDO
children.push(
  H1("5. On-page y contenido"),
  H2("5.1 Titles, descripciones y encabezados"),
  table(["Elemento (241 URLs indexables)", "Resultado", "Estado"], [
    ["H1 único por página", "100 % de las páginas", E.pass],
    ["Titles de más de 60 caracteres", "91 (38 %)", E.warn],
    ["Titles de menos de 30 caracteres", "30", E.warn],
    ["Titles duplicados", "3 pares (fichas BENITO, CUBE y portada)", E.warn],
    ["Sin meta description", "21", E.warn],
    ["Descripciones de plantilla repetidas", "≥ 25 fichas («lll➤ …»)", E.warn],
    ["H1 en inglés en el blog", "19 páginas («Blog - whats new?», «News»)", E.fail],
  ], [4000, 3600, 1760]),
  P(""),
  P("Los títulos de producto siguen el patrón «【 NOMBRE EN MAYÚSCULAS 】▷ MODELO» y las descripciones comienzan con «lll➤» y terminan con emojis. Es una fórmula pensada para destacar en resultados, pero Google reescribe con frecuencia estos títulos y el formato resta credibilidad a una marca artesanal. El CTR medio del 0,8 % con posición media cercana a 11 indica que los fragmentos actuales no están captando el clic."),
  H2("5.2 Canibalización e intención de búsqueda"),
  P("Search Console registra 247 consultas en las que dos o más URLs del sitio compiten entre sí; en 38 de ellas compiten la portada y una categoría. La portada posiciona para «carteras hombre piel» (3.600 búsquedas/mes, posición 9), «cartera de piel de hombre» (1.300) o «carteras de piel mujer» (1.000), mientras las categorías específicas quedan por detrás. En los resultados de Google para estas búsquedas predominan páginas de categoría de tiendas especializadas, por lo que la portada —una página de marca con banner promocional— no responde al tipo de página que Google premia para esa intención."),
  H2("5.3 Calidad del contenido"),
  table(["Tipo de página", "URLs", "Palabras (mediana)", "Menos de 300 palabras"], [
    ["Portada", "1", "1.215", "0"],
    ["Categorías", "14", "1.263", "0"],
    ["Fichas de producto", "60", "327", "24 (40 %)"],
    ["Blog", "154", "902", "5"],
    ["Páginas de sistema (fabricantes, tiendas…)", "8", "37", "8"],
  ], [3800, 1200, 2100, 2260]),
  P(""),
  P("Las categorías y el blog tienen una extensión superior a la de la mayoría de competidores. Las fichas, en cambio, comparten estructuras casi idénticas entre modelos y colores (composición, RFID, medidas), y existen fichas duplicadas del mismo modelo con IDs distintos (BENITO 1123 y 1155, CUBE 1138 y 1143, PANA 1110 y 1165). El blog acumula 160 URLs con temas que se solapan (cinco artículos distintos sobre RFID, varios sobre cuidado e hidratación del cuero) y alterna temas de producto con otros lejanos al catálogo (sandalias, bolsos, síndrome de la cartera)."),
  new Paragraph({ children: [new PageBreak()] }),
);

// 6. IMAGENES
children.push(
  H1("6. Optimización de imágenes"),
  ...img("07_imagenes.png", 520, 241, "Peso real servido de imágenes representativas."),
  bullet([B("Texto alternativo: "), T("2.775 de 7.347 etiquetas de imagen rastreadas (38 %) carecen de alt. En la galería de producto, a partir de la segunda imagen el alt se trunca («Cartera con monedero exterior piel...») o queda vacío.")]),
  bullet([B("Formatos: "), T("todas las imágenes se sirven en JPEG o PNG aunque el navegador acepte WebP o AVIF. daviletto.es ya sirve WebP.")]),
  bullet([B("Dimensiones: "), T("el 31 % de las imágenes no declara width y height. El CLS es bajo, pero el riesgo de desplazamientos persiste.")]),
  bullet([B("Tamaños: "), T("los listados de categoría cargan la variante «thickbox» (159 KB), pensada para el zoom, como miniatura; es el elemento LCP de las categorías.")]),
  bullet([B("Carga diferida: "), T("solo 757 imágenes usan loading=\"lazy\"; las de la galería se cargan mediante un blank.png que Google puede no asociar al producto.")]),
  bullet([B("Imagen social: "), T("og:image apunta al logotipo en JPEG (5,8 KB), no a una imagen de producto o marca en formato 1200×630.")]),
  new Paragraph({ children: [new PageBreak()] }),
);

// 7. E-E-A-T
children.push(
  H1("7. Señales E-E-A-T"),
  table(["Señal", "Estado", "Observación"], [
    ["Experiencia", E.pass, "Historia familiar real desde 1981, taller propio y proceso artesanal descritos"],
    ["Pericia", E.warn, "Blog extenso, pero sin autor identificado ni credenciales del artesano"],
    ["Autoridad", E.fail, "Pocas menciones independientes; perfil de enlaces dominado por spam"],
    ["Confianza", E.warn, "Envíos, devoluciones y garantía visibles; NAP contradictorio y sin reseñas visibles en Google"],
  ], [2000, 1400, 5960]),
  P(""),
  P("La página «Nuestra historia» es el activo E-E-A-T más valioso del sitio: un relato en primera persona de Miguel sobre el taller fundado en 1981 por sus padres en El Bosque. Sin embargo, esa autoría no se traslada al blog, que se publica sin firma, y la propia página se titula «Nuestra Historia | Casanova» mientras el texto habla de «SANTOMAR». La portada afirma a la vez «más de 40 años» y «más de 50 años» de tradición, y el taller se sitúa en Ubrique en el marcado y en El Bosque en la historia. La página de contacto tiene 29 palabras, sin dirección física ni horario."),
  P("En la búsqueda de opiniones independientes sobre «Casanova» o «Santomar» no aparecen reseñas en plataformas externas; solo fichas de directorios de proveedores con descripciones propias de la empresa."),
  new Paragraph({ children: [new PageBreak()] }),
);

// 8. GEO
children.push(
  H1("8. Visibilidad en buscadores con IA (GEO)"),
  table(["Factor", "Estado", "Observación"], [
    ["Acceso de rastreadores IA", E.pass, "Ni GPTBot, ClaudeBot, PerplexityBot ni Google-Extended están bloqueados"],
    ["llms.txt", E.warn, "Publicado y bien estructurado; enlaza /28-cinturones (404) y una lista de 70 keywords"],
    ["Contenido citable", E.pass, "FAQ marcadas, guías comparativas (vacuno vs. ovino) con datos concretos"],
    ["Entidad reconocible", E.fail, "Dos nombres de marca y NAP contradictorio dificultan la desambiguación"],
    ["Menciones de marca externas", E.fail, "Sin presencia detectada en medios, foros o Wikipedia"],
    ["Seguimiento de prompts", E.nd, "DinoRANK no tiene prompts de IA configurados para el dominio"],
  ], [2700, 1400, 5260]),
  P(""),
  P("carterasdepiel.es es el único sitio del grupo analizado que publica llms.txt, y su contenido informativo (diferencias entre pieles, RFID, cuidado del cuero) es el tipo de pasaje que los asistentes de IA citan. El principal freno es la identidad: un modelo de lenguaje que lee «Santomar», «Casanova» y «Carteras de Piel» como tres nombres, con dos teléfonos y dos localidades, tiene dificultades para consolidar una entidad y recomendarla. La falta de menciones de terceros (reseñas, prensa, directorios de Ubrique) refuerza esa debilidad."),
  new Paragraph({ children: [new PageBreak()] }),
);

// 9. COMPETIDORES
children.push(
  H1("9. Competidores y análisis de deficiencias"),
  P("Se han seleccionado los competidores que comparten SERP con el dominio para «carteras de piel» y «cartera piel hombre»: pieldeubrique.com y monpiel.com (líderes), daviletto.es y pielini.com (comparables). El Corte Inglés, Amazon y El Potro también aparecen, pero juegan en otra liga de autoridad."),
  ...img("03_autoridad.png", 540, 263, "Tráfico orgánico mensual estimado (DinoRANK, octubre de 2026)."),
  table(["Dominio", "Tráfico est.", "Keywords", "Top 3", "Top 10"], [
    [{ text: "carterasdepiel.es", bold: true, color: AZUL }, "2.059", "105", "1", "35"],
    ["pieldeubrique.com", "55.913", "274", "120", "193"],
    ["monpiel.com", "29.743", "253", "73", "177"],
    ["daviletto.es", "7.087", "146", "12", "64"],
    ["pielini.com", "4.241", "64", "6", "15"],
  ], [3160, 1600, 1500, 1500, 1600]),
  P(""),
  ...img("04_matriz.png", 470, 343, "Presencia de elementos SEO clave frente a la competencia."),
  H2("Brechas de palabras clave"),
  P("El análisis de content gap de DinoRANK identifica búsquedas en las que los competidores posicionan y carterasdepiel.es no aparece:"),
  table(["Palabra clave", "Volumen/mes", "Competidor (posición)"], [
    ["cartera hombre", "27.100", "pieldeubrique (5), monpiel (10)"],
    ["tarjeteros hombre", "6.600", "pielini (6)"],
    ["billeteros mujer", "2.400", "pielini (7)"],
    ["carteras pequeñas hombre", "1.900", "pielini (6)"],
    ["carteras y monederos mujer", "1.600", "pielini (5)"],
    ["cartera tarjetero hombre", "1.000", "pieldeubrique (4), monpiel (7)"],
    ["carteras personalizadas", "1.000", "pieldeubrique (3), monpiel (5)"],
    ["cartera hombre personalizada", "880", "monpiel (3)"],
  ], [3600, 1800, 3960]),
  P(""),
  P("En las búsquedas compartidas, pieldeubrique.com ocupa las posiciones 1–2 para «cartera hombre piel» y «cartera piel hombre» (3.600 búsquedas cada una) con su categoría de hombre, frente a la posición 5 de carterasdepiel.es. Los dos líderes ofrecen personalización (grabado), una línea de producto que carterasdepiel.es no tiene y que concentra demanda creciente."),
  H2("Oportunidades de proximidad"),
  P("Varias búsquedas de alto volumen están en posiciones donde una mejora moderada multiplica el tráfico:"),
  table(["Palabra clave", "Volumen", "Posición", "URL actual"], [
    ["cartera piel hombre", "3.600", "5", "/38-carteras-hombre"],
    ["monedero hombre", "2.900", "12", "/38-carteras-hombre"],
    ["cartera hombre pequeña", "2.400", "7", "/38-carteras-hombre"],
    ["cartera piel mujer", "1.900", "15", "Portada"],
    ["cartera hombre con monedero", "1.600", "19", "/38-carteras-hombre"],
    ["carteras de piel mujer", "1.000", "6", "Portada"],
    ["carteras mujer", "14.800", "25", "/26-carteras-mujer"],
    ["monederos mujer", "12.100", "29", "/26-carteras-mujer"],
  ], [3300, 1500, 1300, 3260]),
  new Paragraph({ children: [new PageBreak()] }),
);

// 10. ESCALA
children.push(
  H1("10. Contenido y oportunidad de escala"),
  P("La arquitectura actual agrupa el catálogo por sexo y tamaño (hombre con/sin monedero, mini carteras, mujer pequeña/mediana/grande). Los modelos llevan nombres de ciudades españolas (Córdoba, Jaén, Huelva, Salamanca, Zamora, Segovia…) y se fabrican en varios colores, lo que genera combinaciones canonicalizadas correctamente hacia la ficha principal."),
  P("No existen hoy páginas para atributos con demanda propia: protección RFID (cinco artículos de blog sobre el tema, sin categoría que los recoja), cierre con elástico, cartera americana, tarjetero, monedero de tacón o color (marrón, negro, cuero natural). Tampoco hay una página para regalo de empresa o venta al por mayor más allá de /content/14, que ya posiciona en 4.ª posición para «carteras al por mayor». La personalización, presente en los dos líderes, es la oportunidad de mayor volumen detectada."),
  P("El blog, por su parte, tiene volumen suficiente para organizarse en grupos temáticos (cuidado del cuero, tipos de piel, guías de compra por perfil, regalos), pero hoy funciona como un archivo cronológico con títulos que compiten entre sí y enlaces a productos descatalogados."),
  new Paragraph({ children: [new PageBreak()] }),
);

// 11. SINTESIS
children.push(
  H1("11. Síntesis de deficiencias por nivel de impacto"),
  P("Se recoge la distribución de los 28 hallazgos del diagnóstico según su impacto potencial sobre la visibilidad del sitio. La clasificación describe la severidad de cada carencia y no constituye un plan de ejecución."),
  ...img("05_severidad.png", 420, 286, "Distribución de los hallazgos del diagnóstico por nivel de severidad."),
  H2("Impacto crítico"),
  bullet("JavaScript del tema y de los módulos bloqueados en robots.txt."),
  bullet("Categoría Cinturones y sus subcategorías, y la categoría de tarjeteros, en error 404."),
  bullet("LCP móvil entre 7,8 y 15,4 s en laboratorio y más de 160 peticiones por página."),
  bullet("Oleada de enlaces spam (65 % del perfil muestreado) en octubre y noviembre de 2026."),
  bullet("Entidad de marca incoherente: dos nombres, dos teléfonos y dos localidades."),
  bullet("50 enlaces internos rotos y enlace sitewide con doble redirección 301."),
  H2("Impacto alto"),
  bullet("Sitemap con 31 entradas no válidas, duplicados y ~89 artículos ausentes."),
  bullet("Productos descatalogados redirigidos con 302 a la categoría (soft 404)."),
  bullet("Canibalización portada–categoría en 38 consultas y desajuste de intención."),
  bullet("Product schema sin valoraciones, envíos ni devoluciones, y con doble marcado."),
  bullet("LeatherGoodsStore duplicado y Organization con @id y logo relativos."),
  bullet("Portada y otras 24 URLs sin etiqueta canonical."),
  bullet("Titles largos o con formato de plantilla y CTR medio del 0,8 %."),
  bullet("Ausencia de cabeceras de seguridad (HSTS, nosniff, X-Frame-Options)."),
  H2("Impacto medio"),
  bullet("38 % de imágenes sin alt, sin WebP/AVIF y miniaturas de 159 KB."),
  bullet("Blog sin autor, fechas no ISO y wordCount erróneo en BlogPosting."),
  bullet("H1 en inglés en 19 páginas de listado del blog."),
  bullet("40 % de fichas con menos de 300 palabras y fichas duplicadas del mismo modelo."),
  bullet("Zoom bloqueado (user-scalable=no) y elementos táctiles pequeños."),
  bullet("Dos propiedades GA4, GTM, Píxel y Google Translate cargados en cada página."),
  bullet("Página de contacto sin dirección ni horario."),
  bullet("Landings de contenido (/content/8–13) en noindex."),
  bullet("Blog con temas solapados y sin organización por grupos temáticos."),
  H2("Impacto bajo"),
  bullet("Meta keywords obsoleta y meta robots duplicada."),
  bullet("Páginas de sistema vacías indexables (/fabricantes, /proveedores, /tiendas)."),
  bullet("llms.txt con enlaces rotos y lista de palabras clave."),
  bullet("/sitemap.xml estándar inexistente."),
  bullet("og:image basada en el logotipo."),
  new Paragraph({ children: [new PageBreak()] }),
);

// 12. CONCLUSION
children.push(
  H1("12. Conclusión"),
  P("carterasdepiel.es dispone de lo que a muchos competidores les falta: una historia de fabricante real, un blog con más de 150 artículos, categorías con contenido extenso y un llms.txt pensado para la búsqueda con IA. Ese capital explica que, con una autoridad baja, el dominio mantenga unas 2.000 visitas orgánicas mensuales y posiciones de primera página para búsquedas como «cartera piel hombre» o «piel de ubrique»."),
  P("El diagnóstico muestra que ese contenido no se está aprovechando por razones mayoritariamente técnicas: Google no puede renderizar la página completa, líneas de producto enteras han desaparecido del índice, el rendimiento móvil está lejos de los umbrales y la marca se presenta con identidades contradictorias. A ello se suma un perfil de enlaces contaminado recientemente por spam."),
  P("La distancia con pieldeubrique.com y monpiel.com es grande en tráfico, pero no en calidad de contenido. Las áreas que concentran el mayor margen son tres: el saneamiento técnico (rastreo, 404, sitemap y rendimiento), la unificación de la entidad de marca y el aprovechamiento de las posiciones 5–20 en búsquedas de alto volumen que hoy ya están al alcance."),
  new Paragraph({ spacing: { before: 400 }, border: { top: { style: BorderStyle.SINGLE, size: 8, color: AZUL, space: 8 } }, children: [new TextRun({ text: "", size: 2 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200 }, children: [new TextRun({ text: "Documento elaborado por ", size: 18, color: GRIS }), new TextRun({ text: "INFO", bold: true, size: 18, color: AZUL }), new TextRun({ text: "SAMA", bold: true, size: 18, color: VERDE }), new TextRun({ text: " · Agencia SEO en Cádiz", size: 18, color: GRIS })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Datos de rendimiento obtenidos en laboratorio; para datos de campo se recomienda consultar CrUX/PageSpeed Insights con clave de API.", size: 16, color: GRIS, italics: true })] }),
);

// ---- Build -----------------------------------------------------------------
const doc = new Document({
  creator: "Infosama",
  title: "Informe SEO integral - carterasdepiel.es",
  styles: {
    default: { document: { run: { font: "Arial", size: 21, color: CARBON } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, font: "Arial", color: AZUL },
        paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 0, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "A4D76C", space: 4 } } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: CARBON },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 21, bold: true, font: "Arial", color: GRIS },
        paragraph: { spacing: { before: 140, after: 80 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { run: { color: AZUL }, paragraph: { indent: { left: 600, hanging: 280 } } } }] },
    ],
  },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1300, right: 1440, bottom: 1300, left: 1440 } } },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "DDDDDD", space: 4 } }, children: [new TextRun({ text: "Informe SEO · carterasdepiel.es", size: 15, color: GRIS })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, border: { top: { style: BorderStyle.SINGLE, size: 4, color: "DDDDDD", space: 4 } }, children: [new TextRun({ text: "Infosama — Agencia SEO en Cádiz   |   Página ", size: 15, color: GRIS }), new TextRun({ children: [PageNumber.CURRENT], size: 15, color: GRIS })] })] }) },
    children,
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(__dirname + "/Informe-SEO-CarterasDePiel.docx", buffer);
  console.log("DOCX generado OK");
});
