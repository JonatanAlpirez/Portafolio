# Portafolio

Sitio web estático del portafolio personal de Jonatan Alpirez — Desarrollador Web.

- **Producción:** https://jonatan.netlify.app/
- **Repositorio:** https://github.com/JonatanAlpirez/Portafolio
- **Hosting:** Netlify (free tier, redeploy automático en cada push a `main`)

---

## Stack

Sitio estático HTML/CSS puro. **Sin build step** — los archivos se sirven tal cual.

- HTML5 semántico
- CSS3 (custom properties, flexbox, grid, responsive)
- Assets estáticos (imágenes, fuentes) en `assets/`

No usa frameworks JS ni bundlers. Netlify lee los archivos directo desde `main`.

---

## Estructura

```
Portafolio/
├── 📄 index.html           ← landing page
├── 📄 about.html           ← sobre mí
├── 📄 academic.html        ← formación académica
├── 📄 portafolio.html      ← proyectos / trabajos
├── 📄 blog.html            ← entradas
├── 📄 contacto.html        ← formulario de contacto
├── 📁 assets/              ← CSS, imágenes, fuentes
├── 📁 05-diseno-web1/      ← material del curso (ignorado por git)
├── 📄 package.json         ← dev server config (no afecta producción)
├── 📄 .gitignore
└── 📄 README.md
```

---

## Desarrollo local

> El sitio es HTML estático: podés abrir `index.html` directamente en el browser. Pero un dev server local evita problemas con paths relativos y suma **live-reload** para iterar diseño más rápido.

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
