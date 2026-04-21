# Reporte de Auditoria UX/UI — Dividir Cuentas

> Fecha: 2026-04-20
> Estado actual: MVP funcional entre amigos
> Objetivo: Migrar a producto publico y profesional, mobile-first con PWA

---

## 1. BUGS CRITICOS (Detectados en testing en vivo)

### 1.0a BUG: NaN se propaga al limpiar el input de precio

- **Severidad:** Critica
- **Archivo:** `src/components/views/home/UserCard.jsx`, linea 17
- **Detalle:** `parseInt(inputNumberRef.current.value)` sobre un string vacio retorna `NaN`. No hay fallback. Toda la UI muestra "$ NaN" — en la card, en el total, y en el precio por persona.
- **Fix sugerido:** `const newValue = parseInt(value) || 0`

### 1.0b BUG: Se aceptan valores negativos

- **Severidad:** Alta
- **Detalle:** No hay validacion `min="0"` en el input. Se puede ingresar "-500" y la app muestra "Cada uno paga $ -167".

### 1.0c BUG: Decimales se truncan silenciosamente

- **Severidad:** Media
- **Archivo:** `src/components/views/home/UserCard.jsx`, linea 17
- **Detalle:** `parseInt(99.5)` devuelve `99`. El input acepta decimales pero se procesan con parseInt. El usuario ve "99.5" pero el total muestra "$99".

### 1.0d BUG: Borde rosado/rojo accidental en los bordes de la pagina

- **Severidad:** Baja
- **Detalle:** Hay un borde sutil rosado/rojo visible a izquierda y derecha de toda la pagina. Parece un box-shadow o border heredado.

---

## 2. PROBLEMAS CRITICOS DE UX

### 2.1 No se pueden eliminar hosts

- **Severidad:** Critica
- **Detalle:** Una vez que el usuario agrega un anfitrion, no hay forma de eliminarlo. El unico workaround es recargar la pagina, lo que borra TODOS los datos.
- **Impacto:** Frustracion inmediata. Cualquier error al agregar un host obliga a empezar de cero.

### 2.2 No hay persistencia de datos

- **Severidad:** Critica
- **Detalle:** Al recargar la pagina o cerrar el navegador, todos los datos se pierden. No hay localStorage, sessionStorage, ni ningun mecanismo de persistencia.
- **Impacto:** Si el usuario cierra accidentalmente la app o cambia de pestana en mobile, pierde todo el progreso.

### 2.3 Terminologia confusa para usuarios nuevos

- **Severidad:** Alta
- **Detalle:** Los terminos "Anfitriones" e "Invitados" no son intuitivos para dividir cuentas. Un usuario nuevo no entiende que "Anfitrion" = "persona que pago" e "Invitado" = "persona que no pago pero comparte el gasto".
- **Competencia:** Splitwise usa "Pagado por" y "Dividido entre". Splid usa "Quien pago" y "Para quien".

### 2.4 Sin estado vacio claro (Empty State)

- **Severidad:** Alta
- **Detalle:** Al abrir la app, el usuario ve un anfitrion vacio con inputs sin contexto. No hay instrucciones, onboarding, ni indicacion de que hacer primero.
- **Competencia:** Las apps lider muestran ilustraciones + microcopy guiando al usuario ("Agrega quienes participaron y cuanto gasto cada uno").

### 2.5 Calculo con Math.floor() pierde dinero

- **Severidad:** Alta
- **Detalle:** `Math.floor(total / users)` trunca los centavos. En un grupo de 3 personas con $100, cada uno "paga $33" y se pierden $1. No hay indicacion de quien absorbe el sobrante.
- **Competencia:** Splitwise y Tricount manejan el "remainder" asignandolo explicita y transparentemente.

---

### 2.6 El nombre del usuario no se usa para nada

- **Severidad:** Media
- **Detalle:** El input de texto "Nuevo usuario" existe pero el nombre ingresado no aparece en ningun calculo ni resumen. Genera expectativa sin cumplirla.

### 2.7 El mensaje "Deben pagarle" es confuso

- **Severidad:** Media
- **Detalle:** No queda claro QUIEN le debe pagar. "Debe pagarle: 1 persona + $2500" no aclara si es que 1 persona paga el monto completo y aparte alguien paga $2500, o que representa ese resto.

### 2.8 Los invitados no tienen representacion visual

- **Severidad:** Media
- **Detalle:** Son solo un numero con +/-. No se ve quienes son, no tienen nombre ni cards. Contrasta con los hosts que si tienen cards individuales.

### 2.9 "total" en minuscula (inconsistencia)

- **Severidad:** Baja
- **Detalle:** La seccion Total dice "1 total" en minuscula, mientras las otras usan mayuscula inicial ("Anfitriones", "Invitados").

---

## 3. PROBLEMAS DE USABILIDAD (Interaccion)

### 3.1 Input de precio sin restricciones

- No hay validacion de numeros negativos
- Acepta valores como `e`, `-`, `+` (comportamiento nativo de input type=number)
- No hay formato de moneda (separador de miles, decimales)
- No hay indicador de moneda configurable

### 2.2 Sin feedback visual al interactuar

- Agregar un host no tiene animacion ni transicion
- Cambiar un precio no muestra confirmacion visual
- Los botones +/- no tienen estado hover/active/disabled claro
- El boton de agregar guest no se deshabilita cuando no tiene sentido (ej: 0 hosts)

### 2.3 Seccion de invitados vacia

- El `user-list__body` de Guests esta vacio. Solo se ve un contador con +/-
- No hay informacion de cuanto debe pagar cada invitado individualmente
- No se puede nombrar a los invitados

### 2.4 Layout del resumen (Total) poco prominente

- El total esta al final de la pagina sin diferenciacion visual fuerte
- "Cada uno paga $X" es la informacion mas importante, pero visualmente es texto plano dentro de un contenedor generico
- Falta jerarquia visual: el monto por persona deberia ser el elemento dominante

### 2.5 Falta accesibilidad basica

- Los botones +/- son `<div>` con `onClick`, no `<button>` semanticos
- No hay `aria-labels` en ningun elemento interactivo
- Los inputs no tienen `<label>` asociados
- No hay soporte para navegacion con teclado
- Contraste de colores no verificado contra WCAG 2.1

### 2.6 No hay forma de compartir el resultado

- Los usuarios de apps de dividir cuentas necesitan compartir "quien debe cuanto a quien"
- No hay boton de compartir, copiar resultado, ni exportar

---

## 4. PROBLEMAS VISUALES Y DE DISENO

### 3.1 Sin identidad visual

- No hay logo, no hay nombre visible de la app en la interfaz
- No hay header ni branding
- El favicon es el default de Vite (React logo)

### 3.2 Paleta de colores subutilizada

- Las variables SCSS definen una paleta completa (primary, accent, neutrals) pero casi no se usa
- Los colores de "Recibe" y "Paga" estan hardcodeados (`#4CAF50`, `#F44336`) en vez de usar las variables del tema
- No hay diferenciacion visual entre secciones (Anfitriones, Invitados, Total usan el mismo estilo)

### 3.3 Tipografia sin jerarquia clara

- Los montos de dinero deberian ser mas grandes y bold
- El nombre del usuario y el monto tienen pesos visuales similares
- Falta diferenciacion entre informacion primaria (monto, resultado) y secundaria (nombre, detalle)

### 3.4 Espaciado inconsistente en mobile

- Los cards tienen padding uniforme pero no hay separacion visual clara entre "input zone" y "result zone" dentro del card
- Las secciones no tienen margenes consistentes entre si

### 3.5 Dark mode no activable

- Hay soporte CSS para dark mode pero no hay toggle visible para el usuario
- No detecta `prefers-color-scheme` del sistema

---

## 5. FEATURES PROPUESTAS (Inspiradas en competencia + mejores practicas 2026)

### 4.1 PRIORIDAD CRITICA — Flujo base

| Feature                        | Descripcion                                                     | Inspiracion         |
| ------------------------------ | --------------------------------------------------------------- | ------------------- |
| **Eliminar host**              | Boton X o swipe-to-delete en cada card                          | Splitwise, Splid    |
| **Persistencia localStorage**  | Guardar estado en localStorage, restaurar al abrir              | Todas las apps      |
| **Renombrar terminologia**     | "Quien pago" / "Quienes comparten" en vez de Anfitrion/Invitado | Splitwise, Tricount |
| **Validacion de inputs**       | Solo numeros positivos, formato de moneda, min/max              | Estandar fintech    |
| **Empty state con onboarding** | Ilustracion + instrucciones al abrir por primera vez            | Estandar UX         |

### 4.2 PRIORIDAD ALTA — Experiencia profesional

| Feature                          | Descripcion                                             | Inspiracion          |
| -------------------------------- | ------------------------------------------------------- | -------------------- |
| **PWA completa**                 | Manifest, service worker, offline support, installable  | Splid, Tricount      |
| **Compartir resultado**          | Boton "Compartir" que genera texto/imagen para WhatsApp | Splitwise            |
| **Historial de divisiones**      | Guardar divisiones pasadas, accesibles desde un listado | Splitwise, SettleUp  |
| **Selector de moneda**           | Peso argentino, USD, EUR con simbolo dinamico           | Splid (150+ monedas) |
| **Grafico de torta (pie chart)** | Visualizar proporcion de gasto de cada persona          | Splitwise premium    |
| **Dark mode toggle**             | Boton en header + deteccion automatica del sistema      | Estandar 2026        |
| **Nombres para invitados**       | Permitir nombrar invitados individualmente              | Tricount             |

### 4.3 PRIORIDAD MEDIA — Diferenciacion

| Feature                              | Descripcion                                                       | Inspiracion                   |
| ------------------------------------ | ----------------------------------------------------------------- | ----------------------------- |
| **Grafico de barras**                | Comparar visualmente cuanto gasto/debe cada persona               | Mint, apps fintech            |
| **Diagrama de flujo de pagos**       | Visualizacion de "quien le paga a quien" con flechas              | Splitwise debt simplification |
| **Division por items**               | En vez de montos totales, agregar items individuales y asignarlos | Splitty (OCR), Tab            |
| **Division desigual**                | Permitir splits por porcentaje, por partes, o personalizado       | Splitwise, SettleUp           |
| **Categorias de gasto**              | Etiquetar gastos: comida, transporte, alojamiento, etc.           | Splitwise, Tricount           |
| **Animaciones y microinteracciones** | Transiciones suaves al agregar/eliminar, feedback haptico         | Estandar fintech 2026         |
| **Resumen visual tipo dashboard**    | Card prominente con: total, por persona, participantes, grafico   | Apps fintech modernas         |

### 4.4 PRIORIDAD BAJA — Features avanzadas (futuro)

| Feature                  | Descripcion                                              | Inspiracion                    |
| ------------------------ | -------------------------------------------------------- | ------------------------------ |
| **Scan de ticket (OCR)** | Escanear ticket con camara y auto-detectar items/precios | Splitty, Tab                   |
| **Grupos recurrentes**   | Guardar grupos de personas para reutilizar               | Splitwise                      |
| **Notificaciones push**  | Recordar a alguien que debe plata (via PWA push)         | Splitwise                      |
| **Multi-idioma**         | Soporte ingles/espanol como minimo                       | Todas las apps internacionales |
| **Export PDF/Excel**     | Exportar resumen de la division                          | Splid                          |
| **Integracion pagos**    | Link a MercadoPago, PayPal, etc.                         | Venmo Groups                   |

---

## 6. PROPUESTAS DE VISUALIZACION Y DIAGRAMAS

### 5.1 Grafico de torta (Pie Chart)

**Donde:** En la seccion Total o en un nuevo panel de "Resumen"
**Que muestra:** Proporcion del gasto de cada persona sobre el total
**Por que:** Permite entender de un vistazo quien puso mas plata. Referencia: Splitwise premium charts.
**Implementacion sugerida:** Libreria `recharts` o `chart.js` (ambas livianas y react-friendly)

### 5.2 Grafico de barras horizontal

**Donde:** Debajo del pie chart o como vista alternativa
**Que muestra:** Barra por persona mostrando: lo que pago (azul) vs lo que deberia haber pagado (gris linea)
**Por que:** Hace muy visible la diferencia entre lo pagado y lo justo. Patron comun en apps de presupuesto como Mint.

### 5.3 Diagrama de flujo de pagos (Sankey / Arrows)

**Donde:** Vista dedicada "Quien le paga a quien"
**Que muestra:** Flechas de cada deudor hacia cada acreedor, con el monto sobre la flecha
**Por que:** Es LA visualizacion mas pedida en apps de dividir cuentas. Resuelve de un vistazo el problema principal.
**Implementacion sugerida:** SVG custom o `react-flow` simplificado

### 5.4 Balance individual tipo "termometro"

**Donde:** Dentro de cada UserCard
**Que muestra:** Barra de progreso que va de rojo (debe) a verde (le deben), centrada en 0
**Por que:** Reemplaza el texto "Recibe $X" / "Paga $X" con algo visual e inmediato

### 5.5 Resumen tipo Dashboard

**Donde:** Reemplazar la seccion Total actual
**Que muestra:**

- Card grande con el monto por persona (tipografia hero, 2-3x mas grande)
- Mini cards: total gastado, cantidad de personas, sobrante
- Grafico de torta mini inline
  **Por que:** El "cuanto paga cada uno" es la razon de ser de la app. Debe ser lo primero y mas grande que se ve.

---

## 7. PROPUESTA DE ARQUITECTURA DE INFORMACION (NUEVA)

### Estructura actual:

```
[Anfitriones] -> [Invitados] -> [Total]
```

### Estructura propuesta:

```
[Header: Logo + Dark Mode + Menu]
    |
[Dashboard Hero: "Cada uno paga $X" (grande)]
    |
[Participantes]
  ├── Tab: Quienes pagaron (hosts actuales con cards editables)
  └── Tab: Quienes comparten (guests con nombre + opcion de asignar monto)
    |
[Visualizacion: Grafico torta + Diagrama "quien paga a quien"]
    |
[Acciones: Compartir | Guardar | Nueva division]
    |
[Footer: Historial de divisiones pasadas]
```

### Beneficios:

- **Mobile-first:** El dato mas importante (monto por persona) esta arriba
- **Progressive disclosure:** Los graficos y detalles estan abajo para quien quiera profundizar
- **Accion clara:** Botones de compartir/guardar siempre visibles

---

## 8. BENCHMARKING — QUE HACE BIEN CADA COMPETIDOR

| App           | Fortaleza UX clave                            | Que podemos tomar                                     |
| ------------- | --------------------------------------------- | ----------------------------------------------------- |
| **Splitwise** | Debt simplification (minimiza transferencias) | Algoritmo de simplificacion + visualizacion de flujo  |
| **Splid**     | Sin login, link compartido, offline-first     | PWA offline + compartir via link (no requiere cuenta) |
| **Splitty**   | OCR de tickets, asignacion visual de items    | A futuro: scan de ticket                              |
| **Tricount**  | Balance neto prominente, UX limpia            | Dashboard hero con monto grande                       |
| **SettleUp**  | Templates recurrentes, voz                    | Grupos guardados reutilizables                        |
| **Tab**       | Interfaz minimalista                          | Mantener simplicidad, no sobre-disenar                |

---

## 9. RECOMENDACIONES DE DISENO VISUAL

### Paleta de colores propuesta

- **Primario:** Mantener azul actual (`#3f5fff`) — transmite confianza
- **Exito/Recibe:** Verde suave (`#22C55E` en vez de `#4CAF50`) — mas moderno
- **Deuda/Paga:** Naranja-rojo suave (`#F97316` en vez de `#F44336`) — menos agresivo, patron fintech 2026: "rojo suave, no alarmante"
- **Background:** Blanco puro en light, gris oscuro (`#121212`) en dark
- **Acentos:** Usar el naranja accent (`#ff8e24`) para CTAs y botones principales

### Tipografia

- **Montos de dinero:** 1.5-2x mas grande que el texto base, font-weight 700
- **Nombres de personas:** font-weight 600, tamano base
- **Labels y metadata:** font-weight 400, tamano 0.85rem, color neutral-500
- **Hero (monto por persona):** 2.5-3rem, font-weight 800

### Espaciado

- **Cards:** border-radius 12px (en vez de 8px), sombra suave
- **Secciones:** gap de 1.5rem entre secciones
- **Touch targets:** minimo 44x44px para todos los botones (estandar Apple HIG)

### Iconografia

- Reemplazar SVGs inline por una libreria consistente (`lucide-react` es liviana y moderna)
- Agregar iconos para: eliminar, compartir, configuracion, historial

---

## 10. CHECKLIST DE ACCESIBILIDAD (WCAG 2.1 AA)

- [ ] Reemplazar `<div onClick>` por `<button>` semanticos
- [ ] Agregar `aria-label` a todos los botones de icono
- [ ] Asociar `<label>` a cada `<input>`
- [ ] Verificar contraste minimo 4.5:1 para texto, 3:1 para elementos grandes
- [ ] Soporte completo de navegacion por teclado (Tab, Enter, Escape)
- [ ] Focus visible en todos los elementos interactivos
- [ ] Anuncios para screen readers cuando cambian los calculos (aria-live)
- [ ] Textos alternativos en graficos/visualizaciones

---

## 11. ROADMAP DE IMPLEMENTACION SUGERIDO

### Fase 1: Fundamentos (1-2 semanas)

1. Fix: Eliminar hosts
2. Fix: Persistencia localStorage
3. Fix: Renombrar terminologia
4. Fix: Validacion de inputs
5. Fix: Accesibilidad basica (buttons semanticos, labels, aria)
6. Fix: Colores hardcodeados -> variables CSS

### Fase 2: Profesionalizacion (2-3 semanas)

1. Header con branding + dark mode toggle
2. Dashboard hero con monto por persona prominente
3. Empty state con onboarding
4. Nombres para invitados
5. PWA: manifest + service worker + offline
6. Boton compartir (Web Share API)
7. Microinteracciones y animaciones

### Fase 3: Visualizaciones (2-3 semanas)

1. Grafico de torta con recharts
2. Diagrama "quien paga a quien"
3. Balance visual tipo termometro en cards
4. Grafico de barras comparativo

### Fase 4: Features avanzadas (3-4 semanas)

1. Historial de divisiones
2. Selector de moneda
3. Division por items
4. Division desigual (porcentaje/partes)
5. Categorias de gasto
6. Export/compartir como imagen

---

## FUENTES DE INVESTIGACION

- [Splitwiser UX Case Study — UX Planet](https://uxplanet.org/splitwiser-the-all-new-splitwise-mobile-app-redesign-ui-ux-case-study-4d3c0313ae6f)
- [7 Best Bill Splitting Apps 2026 — Splitty](https://splittyapp.com/learn/best-bill-splitting-apps/)
- [Splitwise UX Case Study — UX Collective](https://uxdesign.cc/splitwise-a-ux-case-study-dc2581971226)
- [Split Bill App UI Design — AllCloneScript](https://allclonescript.com/blog/split-bill-app-ui-design)
- [Top 10 Fintech UX Design Practices 2026 — Onething Design](https://www.onething.design/post/top-10-fintech-ux-design-practices-2026)
- [Splitwise vs Splid vs SettleUp — Splitty](https://splittyapp.com/learn/splitwise-vs-splid-vs-settleup/)
- [Design Critique: Splitwise — IXD Pratt](https://ixd.prattsi.org/2026/02/design-critique-splitwise-mobile-app/)
- [PWA Best Practices 2026 — WireFuture](https://wirefuture.com/post/progressive-web-apps-pwa-best-practices-for-2026)
- [Mobile-First UX Design 2026 — Trinergy Digital](https://www.trinergydigital.com/news/mobile-first-ux-design-best-practices-in-2026)
- [Bill Splitting App Case Study — Medium](https://medium.com/design-bootcamp/designing-a-bill-splitting-app-de556d296e33)
