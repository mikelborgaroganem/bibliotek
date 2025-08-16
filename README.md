# Showcase de Formatos – Versión Separada

Este paquete contiene:
- `index.html` – Estructura base y enlaces a CSS/JS externos
- `css/estilos.css` – Todos los estilos editables
- `js/app.js` – Lógica de carga de datos, filtros, grid y modal
- `js/rueda.js` – Interacciones de la rueda (clic, tooltip, giro)

## Cómo editar
- **Colores y tipografías**: en `css/estilos.css`
- **Comportamiento de la rueda**: en `js/rueda.js`
- **Carga de datos y lógica del grid**: en `js/app.js`
- **Fuente de datos**: la variable `SHEET_CSV_URL` en `index.html` apunta a tu Google Sheet CSV publicado.

## Pasos para subirlo a un nuevo repositorio de GitHub
1. **Crear un nuevo repositorio** en [GitHub](https://github.com/new) (público o privado).
2. **Clonar el repositorio** en tu máquina local:
   ```bash
   git clone https://github.com/TU_USUARIO/TU_REPO.git
   cd TU_REPO
   ```
3. **Copiar los archivos** del paquete (`index.html`, carpeta `css/`, carpeta `js/`) dentro de la carpeta del repositorio.
4. **Confirmar y subir** los cambios:
   ```bash
   git add .
   git commit -m "Subir sitio showcase"
   git push origin main
   ```
5. **Activar GitHub Pages**:
   - Ve a **Settings → Pages** en tu repositorio.
   - En **Branch**, selecciona `main` y carpeta `/ (root)`.
   - Guarda y espera unos segundos.
6. **Abrir la URL de Pages** que te da GitHub para ver tu sitio online.

## Notas
- Si cambias la estructura de columnas o el CSV, asegúrate de que los nombres de campos coincidan con lo que espera `app.js`.
- Los archivos están listos para trabajar con **TailwindCSS** vía CDN; si prefieres, puedes migrar a un build propio.
