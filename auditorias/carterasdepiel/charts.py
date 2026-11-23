# -*- coding: utf-8 -*-
"""PLANTILLA de graficas para el informe SEO (identidad visual Infosama).

Los valores dentro de cada funcion son un EJEMPLO (cliente Motroy). Sustituyelos por
los datos reales del cliente antes de ejecutar. La paleta Infosama NO se cambia.
Ejecutar:  python charts_template.py   ->  genera los PNG en ./informe-assets/
Funciones: gauge (puntuacion global) | categorias (areas) | autoridad (vs competidores) |
matriz (gap analysis) | severidad (hallazgos) | sitemap (composicion) | imagenes (pesos KB)."""
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Wedge
import numpy as np

# Paleta Infosama
AZUL = "#4688A8"
VERDE = "#A4D76C"
CARBON = "#2A2A2A"
GRIS = "#9AA0A6"
ROJO = "#D9534F"
NARANJA = "#E8A33D"
AMARILLO = "#E8D04D"

plt.rcParams.update({
    "font.family": "DejaVu Sans",
    "font.size": 11,
    "axes.edgecolor": "#cccccc",
    "axes.linewidth": 0.8,
    "figure.dpi": 150,
})

OUT = "/home/user/Santomar/auditorias/carterasdepiel/informe-assets"
os.makedirs(OUT, exist_ok=True)


def color_nota(v):
    if v < 33:
        return ROJO
    if v < 60:
        return NARANJA
    return VERDE


def _style(ax):
    for s in ["top", "right", "left"]:
        ax.spines[s].set_visible(False)
    ax.tick_params(length=0); ax.grid(axis="y", color="#eeeeee", zorder=0); ax.set_axisbelow(True)

def save(fig, name):
    fig.tight_layout(); fig.savefig(os.path.join(OUT, name), bbox_inches="tight", facecolor="white"); plt.close(fig)

SCORE = 49

def gauge():
    fig, ax = plt.subplots(figsize=(5.2, 3.0), subplot_kw={"aspect": "equal"})
    for a0, a1, c in [(0, 33, ROJO), (33, 60, NARANJA), (60, 100, VERDE)]:
        ax.add_patch(Wedge((0, 0), 1.0, 180 - a1 * 1.8, 180 - a0 * 1.8, width=0.32, facecolor=c, alpha=0.28))
    rad = np.deg2rad(180 - SCORE * 1.8)
    ax.plot([0, 0.78 * np.cos(rad)], [0, 0.78 * np.sin(rad)], color=CARBON, lw=3.2, solid_capstyle="round")
    ax.add_patch(plt.Circle((0, 0), 0.045, color=CARBON, zorder=5))
    ax.text(0, -0.18, f"{SCORE}", ha="center", va="center", fontsize=42, fontweight="bold", color=AZUL)
    ax.text(0, -0.42, "/ 100", ha="center", va="center", fontsize=13, color=GRIS)
    ax.text(-0.92, -0.05, "0", ha="center", color=GRIS, fontsize=9); ax.text(0.92, -0.05, "100", ha="center", color=GRIS, fontsize=9)
    ax.set_xlim(-1.1, 1.1); ax.set_ylim(-0.5, 1.1); ax.axis("off")
    ax.set_title("Puntuación SEO global", fontsize=13, fontweight="bold", color=CARBON, pad=6)
    save(fig, "01_gauge.png")

AREAS = [("Técnico (rastreo/indexación)", 48), ("Contenido / E-E-A-T", 55), ("On-page (titles/meta/H)", 55),
         ("Datos estructurados", 45), ("Rendimiento (Core Web Vitals)", 30), ("Visibilidad en IA (GEO)", 50),
         ("Imágenes", 45), ("Autoridad de dominio", 15), ("Competitividad", 25)]

def categorias():
    cats = sorted(AREAS, key=lambda x: x[1]); labels = [c[0] for c in cats]; vals = [c[1] for c in cats]
    fig, ax = plt.subplots(figsize=(8.2, 4.6)); y = np.arange(len(labels))
    ax.barh(y, [100] * len(labels), color="#eeeeee", height=0.62, zorder=1)
    ax.barh(y, vals, color=[color_nota(v) for v in vals], height=0.62, zorder=3)
    for i, v in enumerate(vals): ax.text(v + 2, i, f"{v}", va="center", fontsize=10.5, fontweight="bold", color=CARBON)
    ax.set_yticks(y); ax.set_yticklabels(labels, fontsize=10.5); ax.set_xlim(0, 100)
    ax.set_xlabel("Puntuación (0-100)", fontsize=10, color=GRIS)
    ax.set_title("Diagnóstico por área SEO", fontsize=13, fontweight="bold", color=CARBON, pad=8)
    for s in ["top", "right", "left"]: ax.spines[s].set_visible(False)
    ax.tick_params(length=0); save(fig, "02_categorias.png")

def autoridad():
    comp = [("carterasdepiel.es", 2059, AZUL), ("pielini.com", 4241, GRIS), ("daviletto.es", 7087, GRIS),
            ("monpiel.com", 29743, GRIS), ("pieldeubrique.com", 55913, GRIS)]
    fig, ax = plt.subplots(figsize=(8.2, 3.8)); x = np.arange(len(comp))
    bars = ax.bar(x, [c[1] for c in comp], color=[c[2] for c in comp], width=0.6, zorder=3)
    bars[0].set_edgecolor(VERDE); bars[0].set_linewidth(2.5)
    for i, c in enumerate(comp): ax.text(i, c[1] + 900, f"{c[1]:,}".replace(",", "."), ha="center", fontsize=10.5, fontweight="bold", color=CARBON)
    ax.set_xticks(x); ax.set_xticklabels([c[0] for c in comp], fontsize=9.5); ax.set_ylim(0, 62000)
    ax.set_ylabel("Visitas orgánicas / mes (estim.)", fontsize=10, color=GRIS)
    ax.set_title("Tráfico orgánico estimado vs. competidores (oct. 2026)", fontsize=13, fontweight="bold", color=CARBON, pad=8)
    _style(ax)
    fig.text(0.5, -0.02, "Fuente: DinoRANK (visibilidad España). Estimaciones de tráfico, no datos de Analytics.", ha="center", fontsize=8, color=GRIS, style="italic")
    save(fig, "03_autoridad.png")

def matriz():
    elems = ["Product schema\ncompleto", "Valoraciones en\nresultados (estrellas)", "Envíos/devoluciones\nen schema", "Blog / contenido\ninformativo",
             "Texto en\ncategorías", "llms.txt", "Imágenes\nWebP/AVIF", "Widget de\nreseñas"]
    actores = ["carterasdepiel", "pieldeubrique", "monpiel", "daviletto"]
    data = np.array([[0.5, 1, 0.5, 0], [0, 1, 0, 0], [0, 1, 0, 0], [1, 0, 1, 0], [1, 1, 1, 1], [1, 0, 0, 0], [0, 0, 0, 1], [0.5, 0, 1, 1]])
    fig, ax = plt.subplots(figsize=(6.8, 5.0))
    for i in range(data.shape[0]):
        for j in range(data.shape[1]):
            v = data[i, j]; c = VERDE if v == 1 else (NARANJA if v == 0.5 else "#f0f0f0")
            ax.add_patch(plt.Rectangle((j, i), 0.92, 0.92, facecolor=c, edgecolor="white", lw=2))
            ax.text(j + 0.46, i + 0.46, "Sí" if v == 1 else ("~" if v == 0.5 else "No"), ha="center", va="center", fontsize=10, fontweight="bold", color="white" if v else GRIS)
    ax.set_xlim(0, 4); ax.set_ylim(0, len(elems))
    ax.set_xticks([k + 0.46 for k in range(4)]); ax.set_xticklabels(actores, fontsize=9)
    ax.set_yticks([i + 0.46 for i in range(len(elems))]); ax.set_yticklabels(elems, fontsize=8.8)
    ax.invert_yaxis(); ax.xaxis.tick_top()
    for s in ax.spines.values(): s.set_visible(False)
    ax.tick_params(length=0)
    ax.set_title("Presencia de elementos SEO clave (gap analysis)", fontsize=12.5, fontweight="bold", color=CARBON, pad=28)
    save(fig, "04_matriz.png")

SEV = [6, 8, 9, 5]
def severidad():
    labels = ["Críticos", "Alta prioridad", "Media prioridad", "Bajo / backlog"]
    fig, ax = plt.subplots(figsize=(5.4, 3.8))
    w, _ = ax.pie(SEV, colors=[ROJO, NARANJA, AMARILLO, VERDE], startangle=90, wedgeprops=dict(width=0.42, edgecolor="white", linewidth=2))
    ax.text(0, 0, f"{sum(SEV)}\nhallazgos", ha="center", va="center", fontsize=15, fontweight="bold", color=CARBON)
    ax.legend(w, [f"{l}  ({v})" for l, v in zip(labels, SEV)], loc="center left", bbox_to_anchor=(1.0, 0.5), frameon=False, fontsize=10)
    ax.set_title("Hallazgos por nivel de severidad", fontsize=12.5, fontweight="bold", color=CARBON, pad=6)
    save(fig, "05_severidad.png")

def sitemap():
    labels = ["Indexables\ncorrectas", "Redirecciones", "URLs técnicas\n(módulos)", "Error 404", "noindex", "Duplicadas\nen el XML"]
    vals = [143, 12, 10, 7, 2, 6]; cols = [VERDE, NARANJA, ROJO, ROJO, AMARILLO, NARANJA]
    fig, ax = plt.subplots(figsize=(7.2, 3.7)); x = np.arange(len(labels))
    ax.bar(x, vals, color=cols, width=0.6, zorder=3)
    for i, v in enumerate(vals): ax.text(i, v + 2, f"{v}", ha="center", fontsize=10.5, fontweight="bold", color=CARBON)
    ax.set_xticks(x); ax.set_xticklabels(labels, fontsize=9); ax.set_ylim(0, 165)
    ax.set_ylabel("Nº de URLs", fontsize=10, color=GRIS)
    ax.set_title("Composición real del sitemap XML (180 entradas)", fontsize=12.5, fontweight="bold", color=CARBON, pad=8)
    _style(ax)
    fig.text(0.5, -0.03, "Rastreo de 2_es_0_sitemap.xml el 23/11/2026. Además, ~89 artículos del blog no figuran en el sitemap.", ha="center", fontsize=8, color=GRIS, style="italic")
    save(fig, "06_sitemap.png")

def imagenes():
    items = [("Logo (JPG)", 6), ("Producto ficha\n(large, JPG)", 24), ("Banner BF escritorio", 92), ("Banner BF móvil\n(elemento LCP)", 115), ("Miniatura listado\n(thickbox, JPG)", 159)]
    fig, ax = plt.subplots(figsize=(7.6, 3.6)); x = np.arange(len(items)); vals = [i[1] for i in items]
    ax.bar(x, vals, color=[VERDE if v < 50 else (NARANJA if v < 120 else ROJO) for v in vals], width=0.6, zorder=3)
    for i, v in enumerate(vals): ax.text(i, v + 3, f"{v} KB", ha="center", fontsize=10, fontweight="bold", color=CARBON)
    ax.set_xticks(x); ax.set_xticklabels([i[0] for i in items], fontsize=8.8); ax.set_ylim(0, 185)
    ax.set_ylabel("Peso servido (KB)", fontsize=10, color=GRIS)
    ax.set_title("Peso real de imágenes clave (todas servidas en JPEG)", fontsize=12.5, fontweight="bold", color=CARBON, pad=8)
    _style(ax); save(fig, "07_imagenes.png")

def trafico():
    m = ["2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02","2026-03","2026-04","2026-05","2026-06","2026-07","2026-08","2026-09","2026-10"]
    v = [1997,2126,2055,2065,2239,2173,1653,1853,1626,2269,3599,1530,2092,1985,2032,2077,2099,2059]
    fig, ax = plt.subplots(figsize=(8.2, 3.6))
    ax.plot(range(len(m)), v, color=AZUL, lw=2.4, marker="o", ms=4, zorder=3)
    ax.fill_between(range(len(m)), v, color=AZUL, alpha=0.08)
    ax.set_xticks(range(0, len(m), 2)); ax.set_xticklabels([x[2:].replace("-", "/") for x in m[::2]], fontsize=9)
    ax.set_ylim(0, 4000); ax.set_ylabel("Visitas orgánicas / mes (estim.)", fontsize=10, color=GRIS)
    ax.set_title("Evolución del tráfico orgánico estimado (18 meses)", fontsize=12.5, fontweight="bold", color=CARBON, pad=8)
    _style(ax)
    fig.text(0.5, -0.02, "Fuente: DinoRANK. Search Console (mismo periodo): ~640-690 clics/mes, CTR medio 0,8 %, posición media ~11-13.", ha="center", fontsize=8, color=GRIS, style="italic")
    save(fig, "08_trafico.png")

def backlinks():
    labels = ["Red spam\n«slots-online-machine»", "Otros dominios\nspam / PBN", "Enlaces\nlegítimos"]
    vals = [111, 19, 70]
    fig, ax = plt.subplots(figsize=(5.6, 3.8))
    w, _ = ax.pie(vals, colors=[ROJO, NARANJA, VERDE], startangle=90, wedgeprops=dict(width=0.42, edgecolor="white", linewidth=2))
    ax.text(0, 0, "200\nenlaces\nmuestreados", ha="center", va="center", fontsize=11, fontweight="bold", color=CARBON)
    ax.legend(w, [f"{l.replace(chr(10),' ')} ({v})" for l, v in zip(labels, vals)], loc="center left", bbox_to_anchor=(1.0, 0.5), frameon=False, fontsize=9.5)
    ax.set_title("Composición del perfil de enlaces entrantes", fontsize=12.5, fontweight="bold", color=CARBON, pad=6)
    save(fig, "09_backlinks.png")

for f in [gauge, categorias, autoridad, matriz, severidad, sitemap, imagenes, trafico, backlinks]: f()
print(sorted(os.listdir(OUT)))
