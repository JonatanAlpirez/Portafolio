# Portafolio Profesional
 
Sitio web personal y profesional de **Jonatan Alpirez** — Ingeniero de Software.

- **Producción:** https://jonatan.netlify.app/
- **Repositorio:** https://github.com/JonatanAlpirez/Portafolio
- **Hosting:** Netlify (free tier, redeploy automático en cada push a `main`)

---

## Stack & Diseño

Sitio web estático moderno de alto rendimiento. **Sin dependencias pesadas ni build step** — servido directamente en producción con máxima velocidad de carga.

- **HTML5 Semántico**: Estructura accesible (`header`, `nav`, `main`, `section`, `article`, `footer`)
- **CSS3 Vanilla Avanzado**: Diseño personalizado en modo oscuro tecnológico (*Dark Tech Slate*), glassmorphism, gradientes sutiles, micro-animaciones fluidas y diseño 100% responsivo (desktop, tablet, mobile).
- **JavaScript Vanilla**: Scroll spy automático, navbar dinámico, menú móvil interactivo, filtrado de proyectos en vivo, toasts y copia de email al portapapeles.
- **Tipografía**: Google Fonts (*Plus Jakarta Sans* y *JetBrains Mono*) + Devicons y Font Awesome.

---

## Estructura

```
Portafolio/
├── 📄 index.html           ← Shell semántico Single-Page
├── 📁 data/
│   └── 📄 portfolio.json   ← Contenido editable (textos, skills, proyectos, formación, contacto)
├── 📄 about.html           ← Redirección automática a #sobre-mi
├── 📄 academic.html        ← Redirección automática a #formacion
├── 📄 portafolio.html      ← Redirección automática a #proyectos
├── 📄 contacto.html        ← Redirección automática a #contacto
├── 📁 assets/
│   ├── 📁 css/             ← styles.css (design system)
│   ├── 📁 js/              ← main.js (carga portfolio.json e interactividad)
│   ├── 📁 img/             ← fotografías, capturas y assets
│   └── 📁 fonts/           ← iconos fontawesome
├── 📄 package.json         ← dev server config (live-server)
└── 📄 README.md
```

---

## Editar contenido

Toda la información visible del portafolio (Hero, Sobre Mí, Habilidades, Proyectos/Papers, Formación, Contacto y Footer) vive en [`data/portfolio.json`](data/portfolio.json).

- Edita el texto directamente en `data/portfolio.json` y recarga el navegador para ver los cambios.
- En párrafos (`about.paragraphs`) y descripciones de proyectos (`projects.items[].description`) puedes usar `**negritas**` y `*cursivas*`.
- Los contadores de los filtros en **Proyectos** se calculan automáticamente según los elementos en `projects.items`.

---

## Desarrollo local

> Como el sitio carga [`data/portfolio.json`](data/portfolio.json) mediante `fetch()`, es necesario abrirlo a través de un servidor HTTP local (`npm run dev`), no directamente como `file://`.

### Setup inicial

```bash
cd ~/Documents/projects/Portafolio
npm install    # una sola vez, baja live-server y sus deps (~30 MB en node_modules/)
```

### Levantar el dev server

```bash
npm run dev
```

Esto levanta **live-server** en `http://localhost:8000` con **live-reload automático**: cada vez que guardás un cambio en cualquier HTML/CSS/imagen, el browser se refresca solo.

Para detenerlo: `Ctrl+C` en la terminal.

---

## Workflow de cambios

```
1. npm run dev              ← levantar el server (deja corriendo)
2. Editar archivos          ← el browser refresca solo
3. git add -A && git commit -m "feat: ..."
4. git push                 ← Netlify redeploya jonatan.netlify.app en ~30s
```

---

## Notas

- `node_modules/` está en `.gitignore` — cada clonador corre `npm install` por su cuenta
- `package.json` y `node_modules/` **no afectan producción** — Netlify solo sirve los HTMLs/CSS/assets, ignora el tooling de dev
- Sin `netlify.toml` ni `_redirects` — la config de Netlify es 100% default
