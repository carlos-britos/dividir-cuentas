# Prompts de Implementacion — Mejoras UX/UI Dividir Cuentas

> Generado a partir de la auditoria UX/UI completa del proyecto.
> Estos prompts estan organizados por fase y son independientes dentro de cada fase.
> Fecha: 2026-04-20

---

## FASE 1: FUNDAMENTOS

---

### Prompt 1: Eliminar hosts + Validacion de inputs

**Prioridad:** Critica
**Archivos involucrados:** `src/components/views/home/Hosts.jsx`, `src/components/views/home/UserCard.jsx`, `src/components/views/home/Home.jsx`, `src/assets/scss/reusable/_user_list.scss`

Agregar la funcionalidad de eliminar anfitriones y validar los inputs de precio en la app de dividir cuentas.

**Eliminar hosts:**

- En `UserCard.jsx`, agregar un boton de eliminar (icono X) en la esquina superior derecha del card. Usar un `<button>` semantico con `aria-label="Eliminar participante"`.
- El boton debe llamar a una funcion `onRemove` que reciba como prop desde `Hosts.jsx`.
- En `Hosts.jsx`, crear la funcion `handleRemoveHost(hostId)` que haga `setHosts` eliminando la key del objeto. Usar destructuring: `const { [hostId]: _, ...rest } = prevHosts; return rest;`.
- Pasar `handleRemoveHost` como prop `onRemove` a cada `UserCard`.
- En `Home.jsx`, asegurarse de que si se eliminan todos los hosts, el estado quede como objeto vacio `{}` y la app no rompa.
- No permitir eliminar si es el unico host (deshabilitar el boton visualmente o no mostrarlo).
- Agregar animacion CSS de fade-out al eliminar (transition opacity 300ms).

**Validacion de inputs:**

- En `UserCard.jsx`, el input de precio (`type="number"`) debe:
  - Tener `min="0"` para evitar negativos
  - Tener `step="1"` (o `step="0.01"` si se quiere soportar decimales)
  - Filtrar en `handleSetPrice` valores NaN: `const newValue = parseInt(value) || 0`
  - No aceptar el caracter `e`, `-`, `+` (agregar `onKeyDown` que prevenga esos caracteres)
- Agregar formato visual de moneda: el `$` ya esta, pero agregar `toLocaleString()` para separador de miles en el display

**Estilos en `_user_list.scss`:**

- Boton eliminar: posicion absoluta top-right del `.user-card` (necesita `position: relative` en el card)
- Estilo: fondo transparente, icono color neutral-400, hover color bubble-red
- Touch target minimo 44x44px

**Criterio de exito:** Se puede agregar y eliminar hosts libremente. Los inputs solo aceptan numeros positivos. No hay forma de romper los calculos con input invalido.

---

### Prompt 2: Persistencia con localStorage + Empty State

**Prioridad:** Critica
**Archivos involucrados:** `src/components/views/home/Home.jsx`, `src/components/views/home/Total.jsx`, `src/assets/scss/reusable/_user_list.scss`

Implementar persistencia de datos con localStorage y un empty state claro cuando la app esta vacia.

**Persistencia localStorage:**

- En `Home.jsx`, crear un custom hook `usePersistedState(key, defaultValue)` o hacerlo inline:
  - Al montar el componente, leer `localStorage.getItem('dividir-cuentas-state')` y parsear el JSON
  - El estado guardado debe incluir: `{ hosts, guests }`
  - Usar `useEffect` para guardar en localStorage cada vez que `hosts` o `guests` cambien
  - Debounce de 500ms para no escribir en cada keystroke (usar setTimeout + clearTimeout)
  - Agregar un boton "Nueva division" que limpie localStorage y resetee el estado
  - Manejar el caso de JSON corrupto con try/catch (si falla, usar defaults)

**Empty State:**

- Cuando `Object.keys(hosts).length === 0` y `guests === 0`, mostrar en vez del layout normal:
  - Un contenedor centrado con:
    - Icono o ilustracion simple (puede ser un emoji grande como icono placeholder: un SVG de personas/dinero)
    - Titulo: "Dividi cuentas facil"
    - Subtitulo: "Agrega quienes pagaron y cuantos comparten el gasto"
    - Boton CTA: "Empezar" que agregue el primer host
  - Estilos: centrado vertical y horizontal, padding generoso, tipografia clara

**Boton "Nueva division":**

- Ubicar en el header o al final de la seccion Total
- Icono de refresh/reset
- Pedir confirmacion antes de borrar: `window.confirm()` o mejor, un mini modal
- Al confirmar: `localStorage.removeItem('dividir-cuentas-state')` + resetear estados

**Criterio de exito:** Al recargar la pagina, los datos persisten. Al abrir la app por primera vez (o despues de "Nueva division"), se ve un empty state guiado. El boton "Nueva division" limpia todo con confirmacion.

---

### Prompt 3: Renombrar terminologia + Accesibilidad basica

**Prioridad:** Alta
**Archivos involucrados:** `src/components/shared/Strings.jsx`, `src/components/views/home/Hosts.jsx`, `src/components/views/home/Guests.jsx`, `src/components/views/home/UserCard.jsx`, `src/components/views/home/Total.jsx`, `src/components/reusable/Icon.jsx`

Cambiar la terminologia de la app para que sea intuitiva y corregir problemas de accesibilidad basicos.

**Nueva terminologia (en `Strings.jsx`):**

```javascript
const strings = {
  payer: "Pagador",
  payers: "Quienes pagaron",
  participant: "Participante",
  participants: "Quienes comparten",
  new_payer: "Nombre",
  total: "Total",
  each_pays: "Cada uno paga",
  receives: "Le deben",
  owes: "Debe",
  should_pay: "Debe pagarle",
  people: "personas",
  person: "persona",
  plus_extra: "y $%s extra",
  share_result: "Compartir",
  new_split: "Nueva division",
  start: "Empezar",
  empty_title: "Dividi cuentas facil",
  empty_subtitle: "Agrega quienes pagaron y cuantos comparten el gasto",
};
```

- Reemplazar todos los strings hardcodeados en los componentes por referencias a `strings.*`
- En `UserCard.jsx`, reemplazar: "Recibe" -> `strings.receives`, "Paga" -> `strings.owes`, "Deben pagarle" -> `strings.should_pay`, "personas"/"persona" -> `strings.people`/`strings.person`
- En `Hosts.jsx`, cambiar el titulo de la seccion a `strings.payers`
- En `Guests.jsx`, cambiar el titulo a `strings.participants`

**Accesibilidad:**

- En `Guests.jsx`: reemplazar `<div className="remove-guest" onClick={removeGuest}>` por `<button className="remove-guest" onClick={removeGuest} aria-label="Quitar participante">`. Mismo para `add-guest`.
- En `Hosts.jsx`: reemplazar `<div className="add-new-user" onClick={...}>` por `<button className="add-new-user" onClick={...} aria-label="Agregar pagador">`.
- En `UserCard.jsx`: agregar `<label>` oculto visualmente (clase `.sr-only`) para el input de nombre y el input de precio. O usar `aria-label` directamente en los inputs.
- En `Total.jsx`: agregar `aria-live="polite"` al contenedor del monto "Cada uno paga $X" para que los screen readers anuncien cambios.
- En `_user_list.scss` o `_helpers.scss`: agregar clase utilitaria `.sr-only` (screen-reader only):

```scss
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
```

- Verificar que todos los botones tengan `:focus-visible` con outline visible.

**Criterio de exito:** La terminologia es clara para cualquier usuario nuevo. Todos los elementos interactivos son semanticos (`<button>`), tienen aria-labels, y los inputs tienen labels asociados. La app es navegable con teclado.

---

### Prompt 4: Colores como variables CSS + Dark mode funcional

**Prioridad:** Alta
**Archivos involucrados:** `src/assets/scss/abstracts/_variables.scss`, `src/assets/scss/reusable/_user_list.scss`, `src/assets/scss/base/_base.scss`, `src/App.jsx` o `src/components/views/home/Home.jsx`

Migrar colores hardcodeados a variables CSS y hacer funcional el dark mode.

**Migrar colores:**

- En `_user_list.scss`, reemplazar:
  - `#4CAF50` -> `var(--bubble-green)` (color de "Recibe")
  - `#F44336` -> `var(--bubble-red)` (color de "Paga")
- Revisar todo el SCSS por cualquier otro color hardcodeado y migrar a variables

**Actualizar paleta (en `_variables.scss`):**

- Actualizar verde a uno mas moderno: `--bubble-green: #22C55E;` (light) y `--bubble-green: #16A34A;` (dark)
- Actualizar rojo a naranja-rojo suave (patron fintech): `--bubble-red: #F97316;` (light) y `--bubble-red: #C2410C;` (dark)
- Esto sigue la recomendacion de fintech UX 2026: usar naranja para deudas en vez de rojo agresivo

**Dark mode funcional:**

- En `App.jsx` o en un nuevo componente `ThemeToggle.jsx`:
  - Al montar, detectar preferencia del sistema: `window.matchMedia('(prefers-color-scheme: dark)').matches`
  - Tambien leer `localStorage.getItem('theme')` para preferencia guardada del usuario
  - Prioridad: localStorage > sistema > default (light)
  - Crear un boton toggle (icono sol/luna) que:
    - Alterne `document.documentElement.setAttribute('data-theme', 'dark'/'light')`
    - Guarde la preferencia en localStorage
  - Escuchar cambios del sistema con `matchMedia.addEventListener('change', ...)`
- Ubicar el toggle en la esquina superior derecha de la app (futuro header)

**Estilos del toggle:**

- Boton circular o pill, icono sol (light) / luna (dark)
- Transicion suave al cambiar tema (transition en `html`: `background-color 300ms, color 300ms`)

**Criterio de exito:** No hay ningun color hardcodeado en el SCSS (todos usan variables). El dark mode se activa automaticamente segun el sistema y se puede togglear manualmente. La preferencia persiste entre sesiones.

---

## FASE 2: PROFESIONALIZACION

---

### Prompt 5: Header con branding + Dashboard hero

**Prioridad:** Alta
**Archivos involucrados:** Crear `src/components/shared/Header.jsx`, crear `src/components/views/home/Dashboard.jsx`, modificar `src/components/views/home/Home.jsx`, modificar `src/components/views/home/Total.jsx`, crear `src/assets/scss/reusable/_header.scss`, crear `src/assets/scss/reusable/_dashboard.scss`

Crear un header con identidad visual y transformar la seccion Total en un dashboard hero prominente.

**Header (`Header.jsx`):**

- Contenedor fixed top con:
  - Logo/nombre de la app a la izquierda: "Dividir" en font-weight 800 + "Cuentas" en font-weight 300 (o similar tratamiento tipografico)
  - Toggle de dark mode a la derecha (del Prompt 4)
  - A futuro: boton de menu/historial
- Estilo: background blur (backdrop-filter: blur(10px)), sombra sutil, z-index alto
- Height: 56px en mobile, 64px en desktop
- Agregar padding-top al `<main>` para compensar el header fixed

**Dashboard Hero (reemplaza `Total.jsx`):**

- Transformar la seccion Total en el componente principal de la app, ubicado ARRIBA de las secciones de pagadores y participantes
- Estructura:
  ```
  [Dashboard Card]
    "Cada uno paga"          <- label pequeno, color neutral-500
    "$ 1.234"                <- monto GRANDE (2.5rem+, font-weight 800, color primary)
    [Mini stats row]
      "3 personas" | "$ 5.000 total"   <- chips pequenos
  ```
- El monto por persona debe ser el elemento visual dominante de toda la app
- Usar la clase de variables CSS para colores
- Animacion: el monto hace un sutil scale-up cuando cambia (transition transform 200ms)

**Reordenar Home.jsx:**

```jsx
<main>
  <Header />
  <Dashboard hosts={hosts} guests={guests} partial={partial} setPartial={setPartial} />
  <Payers ... />
  <Participants ... />
  <Actions />  {/* futuro: compartir, nueva division */}
</main>
```

**Criterio de exito:** La app tiene identidad visual con nombre. El dato mas importante (cuanto paga cada uno) es lo primero y mas grande que se ve. El layout sigue la arquitectura de informacion propuesta en el reporte de auditoria.

---

### Prompt 6: PWA completa (manifest + service worker + offline)

**Prioridad:** Alta
**Archivos involucrados:** Crear `public/manifest.json`, crear `public/icons/` (iconos PWA), modificar `index.html`, modificar `vite.config.js`, `package.json`

Convertir la app en una Progressive Web App instalable y con soporte offline.

**Instalar plugin:**

- Agregar dependencia: `vite-plugin-pwa` (`npm install -D vite-plugin-pwa`)
- En `vite.config.js`, importar y configurar `VitePWA`:

```javascript
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "icons/*.png"],
      manifest: {
        name: "Dividir Cuentas",
        short_name: "DividirCuentas",
        description: "Dividi gastos con amigos de forma facil y rapida",
        theme_color: "#3f5fff",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/dividir-cuentas/",
        scope: "/dividir-cuentas/",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: "CacheFirst",
            options: { cacheName: "google-fonts-stylesheets" },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
});
```

**Iconos PWA:**

- Crear iconos en `public/icons/`: `icon-192.png` y `icon-512.png`
- Usar un diseno simple: fondo azul primario (#3f5fff), simbolo de division o $ en blanco
- Si no se puede generar imagen, crear SVGs simples como placeholder

**Meta tags en `index.html`:**

```html
<meta name="theme-color" content="#3f5fff" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta
  name="apple-mobile-web-app-status-bar-style"
  content="black-translucent"
/>
<link rel="apple-touch-icon" href="/dividir-cuentas/icons/icon-192.png" />
```

**Criterio de exito:** La app es instalable desde Chrome/Safari mobile. Funciona offline despues de la primera carga. Lighthouse PWA score > 90. Los iconos se ven correctos en la pantalla de inicio del telefono.

---

### Prompt 7: Compartir resultado + Microinteracciones

**Prioridad:** Alta
**Archivos involucrados:** Crear `src/components/shared/ShareButton.jsx`, modificar `src/components/views/home/Home.jsx`, modificar `src/assets/scss/reusable/_user_list.scss`, crear `src/assets/scss/reusable/_animations.scss`

Implementar boton de compartir resultado y agregar microinteracciones a toda la app.

**Boton Compartir (`ShareButton.jsx`):**

- Usar la Web Share API (nativa en mobile): `navigator.share()`
- Generar texto de resumen:

  ```
  Dividimos cuentas:
  Total: $5.000
  Cada uno paga: $1.666

  Pagadores:
  - Juan: pago $3.000 (le deben $1.334)
  - Maria: pago $2.000 (le deben $334)

  Participantes: 3

  Hecho con DividirCuentas
  ```

- Fallback para desktop (que no soporta Web Share API): copiar al clipboard con `navigator.clipboard.writeText()` y mostrar toast "Copiado al portapapeles"
- Recibir como props: `hosts`, `guests`, `partial`, y los nombres de los hosts
- Boton con icono de compartir, texto "Compartir", estilo primario
- Ubicar debajo del Dashboard hero o como boton flotante (FAB) en mobile

**Microinteracciones (en `_animations.scss`):**

- **Agregar host/guest:** animacion de entrada `slideInUp` (translateY(20px) + opacity 0 -> 0 + 1, 300ms ease-out)
- **Eliminar host:** animacion de salida `fadeOut` (opacity 1 -> 0, height auto -> 0, 300ms)
- **Cambio de monto en Dashboard:** sutil `pulse` (scale 1 -> 1.05 -> 1, 200ms) cuando el valor cambia
- **Botones:** transicion `transform 100ms` con `active: scale(0.95)` para feedback tactil
- **Cards hover (desktop):** sutil elevacion con box-shadow transition
- **Toggle dark mode:** transicion suave de 300ms en colores de fondo y texto (ya mencionado en Prompt 4)

**Toast notifications:**

- Crear un mini sistema de toast (sin libreria):
  - Componente `Toast.jsx`: posicion fixed bottom-center, auto-dismiss 3s
  - Usar para: "Copiado al portapapeles", "Division guardada", "Participante eliminado"
  - Animacion: slide-up + fade-in al aparecer, fade-out al desaparecer

**Criterio de exito:** El boton compartir genera un resumen legible y funciona en WhatsApp/Telegram desde mobile. En desktop copia al clipboard. Todas las interacciones tienen feedback visual suave. La app se siente responsive y fluida.

---

## FASE 3: VISUALIZACIONES

---

### Prompt 8: Graficos (Pie chart + Barras + Diagrama de flujo de pagos)

**Prioridad:** Media
**Archivos involucrados:** Crear `src/components/views/home/Charts.jsx`, crear `src/components/views/home/PaymentFlow.jsx`, modificar `src/components/views/home/Home.jsx`, crear `src/assets/scss/reusable/_charts.scss`, `package.json`

Agregar visualizaciones de datos: grafico de torta, barras, y diagrama de flujo de pagos.

**Dependencia:** `npm install recharts` (libreria ligera, React-native, ~45kb gzipped)

**Grafico de torta (`Charts.jsx` - seccion PieChart):**

- Mostrar proporcion de gasto de cada pagador sobre el total
- Datos: array de `{ name: "Juan", value: 3000 }` derivado de `hosts`
- Colores: usar la paleta primary con variaciones (primary-300, primary-500, primary-700, accent)
- Labels: nombre + monto dentro o al costado del slice
- Tamano: 250px de ancho en mobile, 300px en desktop
- Ubicar debajo de las secciones de pagadores/participantes

**Grafico de barras horizontal (`Charts.jsx` - seccion BarChart):**

- Una barra por persona mostrando:
  - Barra llena: lo que pago (color primary)
  - Linea vertical: lo que deberia haber pagado (el promedio/partial)
- Esto hace visual la diferencia entre lo pagado y lo justo
- Labels: nombre a la izquierda, monto a la derecha
- Ordenar de mayor a menor gasto

**Diagrama de flujo de pagos (`PaymentFlow.jsx`):**

- Visualizacion SVG custom (sin libreria extra) que muestra "quien le paga a quien"
- Estructura:
  - A la izquierda: personas que deben (deudores, diff < 0)
  - A la derecha: personas a las que les deben (acreedores, diff > 0)
  - Flechas/lineas del deudor al acreedor con el monto sobre la flecha
- Algoritmo: simplificar deudas (minimizar transferencias)
  - Ordenar acreedores de mayor a menor
  - Ordenar deudores de mayor a menor
  - Ir asignando pagos del deudor mas grande al acreedor mas grande hasta saldar
- Colores: flechas en primary-300, montos en bold
- Responsive: en mobile las personas van arriba/abajo en vez de izquierda/derecha

**Tabs o acordeon para visualizaciones:**

- Crear un tab bar con: "Resumen" | "Graficos" | "Quien paga a quien"
- O usar un acordeon que se expanda al tocar
- Por defecto mostrar "Resumen" (el layout actual), las otras tabs bajo demanda

**Criterio de exito:** Los 3 graficos se renderizan correctamente con datos reales. El diagrama de flujo calcula correctamente las transferencias minimas. Las visualizaciones son responsivas y se ven bien en mobile. Los graficos usan la paleta de colores del tema (light/dark).

---

## NOTAS

- Los Prompts 1-4 (Fase 1) son completamente independientes y se pueden ejecutar en paralelo.
- El Prompt 5 depende del Prompt 3 (usa la nueva terminologia) y del Prompt 4 (integra el dark mode toggle).
- Los Prompts 6 y 7 son independientes entre si pero se recomienda ejecutar despues de Fase 1.
- El Prompt 8 es independiente pero se recomienda ejecutar al final ya que cambia la estructura visual.
- Todos los prompts asumen que el proyecto usa React 18 + Vite 5 + SCSS. No se introduce TypeScript ni otra libreria de estado.
