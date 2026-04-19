# PRD UI/UX — PET CENTER E-commerce
**Versión:** 2.0 · Diseño & Frontend  
**Para:** GitHub Copilot / Cursor / VS Code AI  
**Stack:** Next.js 14 (App Router) · Tailwind CSS  
**Audiencia objetivo:** Dueños de mascotas en Tacna, Perú. Mobile-first.

---

## 1. Sistema de Diseño Global

### Paleta de colores (CSS variables / Tailwind config)
```js
// tailwind.config.js
colors: {
  pet: {
    green:        '#1D9E75',   // Color primario — botones, badges "Disponible"
    'green-light': '#E1F5EE',  // Fondos suaves, hero strip, chips activos
    'green-dark':  '#085041',  // Texto sobre fondo verde, footer
    'green-mid':   '#0F6E56',  // Hover de botones, precio
    amber:         '#EF9F27',  // Acento cálido — badge "Últimas unidades"
    'amber-light': '#FAEEDA',  // Fondo de notificaciones Yape
  },
  status: {
    available:    { bg: '#E1F5EE', text: '#085041' },
    sold_out:     { bg: '#F1EFE8', text: '#5F5E5A' },
    low_stock:    { bg: '#FAEEDA', text: '#633806' },
    danger:       { bg: '#FCEBEB', text: '#A32D2D' },
    pending:      { bg: '#F1EFE8', text: '#5F5E5A' },
    confirmed:    { bg: '#FAEEDA', text: '#633806' },
    ready:        { bg: '#E6F1FB', text: '#0C447C' },
    delivered:    { bg: '#E1F5EE', text: '#085041' },
    cancelled:    { bg: '#FCEBEB', text: '#A32D2D' },
  }
}
```

Nota de implementación: si el proyecto no usa `tailwind.config.*`, definir estos tokens en `app/globals.css` con CSS variables (`--pet-green`, etc.) y consumirlos con clases arbitrarias (`bg-[var(--pet-green)]`).

### Tipografía
```js
// globals.css + next/font
import { Nunito, Poppins } from 'next/font/google'

// Poppins → títulos (H1, H2, logo, precios grandes)
// Nunito  → cuerpo, labels, botones, inputs
```

### Border-radius estándar
- Tarjetas de producto: `rounded-2xl` (14px)  
- Botones grandes: `rounded-xl` (12px)  
- Inputs / chips / badges pequeños: `rounded-lg` (10px) o `rounded-full`  
- Modales: `rounded-2xl`

### Sombras
No usar drop-shadows pesadas. Solo `shadow-sm` en hover de tarjetas si es necesario.

### Botón flotante WhatsApp
```tsx
// Visible en TODAS las páginas públicas
// Posición: bottom-6 right-6 — z-50
// Color: bg-[#25D366]
// Tamaño: w-14 h-14, rounded-full
```

---

## 2. Componentes Globales

### 2.1 Navbar (móvil)
```
[← Volver]  [Título de página]  [Ícono carrito + badge rojo]
```
- Fondo: `bg-white border-b border-gray-100`
- Logo en Home: ícono cuadrado `bg-pet-green-dark rounded-xl` + texto "PET **CENTER**"
- Badge carrito: círculo rojo con cantidad, posición `absolute -top-1 -right-1`
- Sticky top: `sticky top-0 z-40`

### 2.2 Chip / Filtro activo
```
Inactivo: bg-gray-100 text-gray-500 border border-gray-200
Activo:   bg-pet-green-light text-pet-green-dark border border-[#9FE1CB]
```

### 2.3 Badge de disponibilidad
```tsx
// Disponible
<span className="bg-[#E1F5EE] text-[#085041] text-[10px] font-bold px-2 py-0.5 rounded-full">
  Disponible
</span>

// Agotado
<span className="bg-[#F1EFE8] text-[#5F5E5A] text-[10px] font-bold px-2 py-0.5 rounded-full">
  Agotado
</span>

// Últimas unidades
<span className="bg-[#FAEEDA] text-[#633806] text-[10px] font-bold px-2 py-0.5 rounded-full">
  Últimas ud.
</span>
```

### 2.4 Toggle de disponibilidad (admin)
```tsx
// ON: bg-pet-green
// OFF: bg-gray-300
// Implementar con Headless UI Switch o HTML nativo
```

---

## 3. Página: Home (`/`)

### Estructura (top → bottom)
1. **Navbar** con logo, carrito
2. **Hero Banner** — degradado verde oscuro a claro
3. **Barra de búsqueda** — input con lupa
4. **Sección Categorías** — grid 2×2
5. **Sección Productos destacados** — scroll horizontal
6. **Sección Servicios** — lista vertical con íconos
7. **Strip de confianza** — 3 ítems (Yape/Plin · Retiro en tienda · WhatsApp)
8. **Footer** — verde oscuro, dirección, botón WA
9. **FAB WhatsApp**

### Hero Banner
```
Fondo: linear-gradient(135deg, #085041 0%, #1D9E75 60%, #5DCAA5 100%)
Padding: px-4 pt-6 pb-5
Badge "Tacna, Perú": bg-white/20 text-white text-[11px] font-bold rounded-full px-3 py-1
H1: font-poppins text-xl font-bold text-white leading-tight
  "Tu veterinaria de confianza, online"
  Palabra "online" → color: #9FE1CB
Subtítulo: text-white/85 text-[12.5px] leading-relaxed
Botones: flex gap-2 mt-4
  Primario: bg-white text-pet-green-dark font-bold rounded-xl px-4 py-2.5
  Secundario: bg-white/20 border border-white/35 text-white rounded-xl px-4 py-2.5
```

### Grid de Categorías
```
grid-cols-4 gap-2.5 px-4
Cada card:
  bg-gray-50 rounded-2xl p-3 text-center border border-gray-100
  Ícono: w-10 h-10 rounded-xl mx-auto mb-1.5 flex items-center justify-center text-xl
    Farmacia   → bg-[#E1F5EE]
    Nutrición  → bg-[#FAEEDA]
    Accesorios → bg-[#EEEDFE]
    Servicios  → bg-[#FAECE7]
  Label: text-[10.5px] font-bold leading-tight
```

### Tarjeta de Producto (destacados — scroll horizontal)
```
min-w-[130px] max-w-[130px] rounded-2xl overflow-hidden border border-gray-100
Imagen: h-[100px] w-full object-cover bg-[color de cat] (o emoji/placeholder)
Body: p-2.5
  Badge disponibilidad (ver 2.3)
  Nombre: text-[12px] font-bold leading-tight text-gray-900
  Marca/subcategoría: text-[10.5px] text-gray-400
  Fila precio + botón "+":
    Precio: font-poppins text-sm font-bold text-pet-green-dark
    Botón "+": w-6 h-6 bg-pet-green rounded-lg text-white text-base
              disabled si agotado → bg-gray-300 cursor-not-allowed
```

### Sección Servicios
```
Lista vertical gap-2
Cada ítem: flex gap-3 items-center bg-gray-50 rounded-2xl p-3 border border-gray-100
  Ícono: w-11 h-11 rounded-xl flex items-center justify-content text-xl
  Info: nombre font-bold text-[13px] + descripción text-[11.5px] text-gray-400
  Flecha: text-gray-400 text-base →
```

### Strip de confianza
```
bg-[#E1F5EE] flex justify-around py-3.5
Cada ítem: text-center
  Ícono: text-xl mb-0.5
  Label: text-[10.5px] font-bold text-pet-green-dark
```

### Footer
```
bg-[#085041] px-4 py-5 text-white/85
Logo: font-poppins font-bold text-[15px] text-white
Dirección + horario: text-[11.5px] leading-relaxed mb-2.5
Botón WhatsApp: bg-pet-green rounded-xl px-3.5 py-2.5 text-white font-bold text-[12.5px]
Copyright: text-white/40 text-[10.5px] mt-3
```

---

## 4. Página: Listado de categoría (`/farmacia`, `/nutricion`, `/accesorios`)

### Estructura
1. Navbar con título de categoría + carrito
2. Barra de búsqueda + chips de subcategoría
3. Barra de resultados ("N productos") + botón "Ordenar"
4. Grid de productos (2 columnas)
5. Paginación

### Barra de búsqueda
```
bg-white px-4 py-2.5 border-b border-gray-100
Input: bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-3
       placeholder="Buscar en Farmacia..."
       Debounce: 300ms
       Ícono lupa: absolute left, text-gray-400
Chips de subcategoría (solo Farmacia):
  overflow-x-auto flex gap-1.5 no-scrollbar mt-2.5
  Ver estilos 2.2
```

### Grid de productos
```
grid grid-cols-2 gap-2.5 p-3
Cada tarjeta: igual a destacados pero height imagen = 110px
```

### Paginación
```
flex items-center justify-center gap-1.5 p-3 bg-white border-t border-gray-100
Botón: w-8 h-8 rounded-lg border border-gray-200 text-[12.5px] font-bold
Activo: bg-pet-green text-white border-pet-green
Flechas: text-pet-green
```

---

## 5. Página: Ficha de producto (`/producto/[slug]`)

### Estructura
1. Navbar "Detalle" + carrito
2. Imagen grande (200px height, object-cover, bg de categoría o placeholder)
3. Sección info del producto
4. Caja recomendación médica (si existe)
5. Caja aviso legal (si `aviso_legal = true`)
6. Botón "Agregar al carrito"
7. Separador + sección "Productos relacionados" (scroll horizontal)

### Info del producto
```
px-4 pt-4
Badges: flex gap-1.5 mb-2
  - Disponibilidad (ver 2.3)
  - Categoría: bg-[#EEEDFE] text-[#3C3489]
H1: font-poppins text-[18px] font-bold leading-tight text-gray-900
Marca/presentación: text-[12.5px] text-gray-400 mt-1 mb-3
Fila precio + control cantidad:
  Precio: font-poppins text-[26px] font-bold text-pet-green-dark
  Qty: [−] [1] [+] — botones w-8 h-8 rounded-xl border border-gray-200 bg-gray-50
Descripción: text-[12.5px] text-gray-500 leading-relaxed mb-3.5
```

### Caja de recomendación médica
```
bg-[#F1EFE8] rounded-xl p-3 mb-2.5 border-l-[3px] border-[#888780]
Label: text-[10.5px] font-bold text-[#5F5E5A] flex items-center gap-1
  Ícono: escudo (shield) 12px
Texto: text-[11.5px] text-[#5F5E5A] italic leading-relaxed
```

### Caja de aviso legal (solo si aviso_legal = true)
```
bg-[#FCEBEB] rounded-xl p-3 mb-3.5 border-l-[3px] border-[#E24B4A]
Label: text-[10.5px] font-bold text-[#A32D2D] flex items-center gap-1
  Ícono: círculo con "!" 12px
Texto: text-[11px] text-[#A32D2D] leading-relaxed
```

### Botón agregar al carrito
```
w-full py-3.5 bg-pet-green text-white font-bold text-[14px] rounded-xl
flex items-center justify-center gap-2
Ícono bolsa de compras blanco 16px
disabled si agotado: opacity-50 cursor-not-allowed
```

---

## 6. Página: Carrito (drawer o página `/carrito`)

### Estructura
```
Navbar "Mi carrito"
Lista de ítems:
  Cada ítem: flex gap-2 items-center py-2.5 border-b border-gray-100
    Imagen: 46×46 rounded-xl bg-[cat-color]
    Info: nombre font-bold text-[12px] + "xN · S/ precio" text-[11px] text-gray-400
    Precio total: font-poppins font-bold text-[13px] text-pet-green-dark
    Botón eliminar: w-6 h-6 rounded-lg bg-[#FCEBEB] — ícono X en rojo
Fila total:
  bg-gray-50 border-t px-4 py-2.5
  "Total" text-[12px] font-semibold text-gray-400
  "S/ XXX.00" font-poppins font-bold text-[16px] text-pet-green-dark
Botón "Continuar al checkout":
  w-full mx-4 (ajustar) bg-pet-green text-white font-bold rounded-xl py-3.5
Link "Seguir comprando": text-center text-pet-green text-[13px] font-semibold
```

---

## 7. Página: Checkout (`/checkout`)

### Stepper de 3 pasos
```
flex items-center px-4 py-2.5 bg-white border-b border-gray-100
Cada paso: flex flex-col items-center flex-1
  Punto: w-6 h-6 rounded-full text-[10px] font-bold
    Completado: bg-pet-green text-white (con ícono check)
    Activo:     bg-pet-green-dark text-white
    Pendiente:  bg-gray-300 text-gray-400
  Label: text-[9px] font-bold text-gray-400 (activo: text-pet-green-dark)
Línea conectora: flex-1 h-[1.5px]
  Completada: bg-pet-green
  Pendiente:  bg-gray-300
```

### Paso 1: Datos
```
Campos:
  Nombre completo (required) — input full width
  Teléfono (required):
    Prefijo "+51" como span absoluto dentro del input
    padding-left: 36px en el input
  Notas (opcional) — textarea 3 líneas
Todos: bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-[12px]
Label encima: text-[10.5px] font-bold text-gray-400
```

### Paso 2: Entrega
```
Card verde: bg-[#E1F5EE] rounded-xl p-3 mx-4 border-[1.5px] border-[#9FE1CB]
Título: "Recojo en tienda" font-bold text-[11.5px] text-pet-green-dark
        ícono pin de ubicación 12px
Dirección: text-[11px] text-[#0F6E56] leading-relaxed
```

### Paso 3: Pago
```
3 opciones tipo radio card:
  Cada una: flex gap-2 items-center p-3 rounded-xl border border-gray-200 mb-1.5
  Seleccionada: border-pet-green bg-[#E1F5EE]
  Radio dot: círculo 16px border-2
    Inactivo: border-gray-300
    Activo:   border-pet-green con punto interno bg-pet-green w-8 h-8

Si Yape/Plin está seleccionado:
  Card ámbar: bg-[#FAEEDA] rounded-xl p-3 mx-4 mb-3 border border-[#FAC775]
  Label: "Envía S/ X a este Yape:" text-[10px] text-[#854F0B] text-center
  Número: font-poppins font-bold text-[16px] text-[#633806] text-center tracking-wide

Si Efectivo:
  Card gris: "Paga al momento de recoger en tienda"
```

### Confirmación (`/checkout/confirmacion`)
```
Pantalla centrada, padding generoso
Círculo check: w-14 h-14 bg-[#E1F5EE] rounded-full flex items-center justify-center
  SVG check stroke="#1D9E75" 28px
Título: "¡Pedido recibido!" font-poppins font-bold text-[15px]
Número: "#PET-2026-XXX" font-bold text-pet-green-dark
Card mensaje: bg-[#E1F5EE] rounded-xl p-3 text-[11.5px] text-[#085041] leading-relaxed
Botón WhatsApp: bg-[#25D366] w-full rounded-xl py-3 text-white font-bold
Botón "Seguir comprando": bg-gray-100 border border-gray-200 w-full rounded-xl py-2.5
```

---

## 8. Servicios (`/servicios`)

```
Lista de servicios tipo card:
  Imagen/ícono + nombre + descripción + precio orientativo
  CTA: "Agendar por WhatsApp" → abre wa.me/51XXXXXXXXX
No hay carrito para servicios — solo contacto por WhatsApp
```

---

## 9. Panel Admin

> Solo accesible desde `/admin` — layout separado, sin navbar público.

### Login (`/admin/login`)
```
Pantalla centrada, max-w-sm
Logo PET CENTER centrado
Email + Contraseña — inputs estándar
Botón "Ingresar" — bg-pet-green w-full
```

### Layout admin
```
Sidebar (desktop) o topnav (mobile):
  Logo + badge "Admin"
  Links: Dashboard · Productos · Pedidos
  Logout link abajo
```

### Dashboard (`/admin`)
```
Grid de 4 metric cards:
  bg-gray-50 rounded-xl p-3.5
  Label: text-[11px] text-gray-400 mb-1
  Valor: font-poppins text-[22px] font-bold
  Subtítulo positivo: text-pet-green · negativo: text-red-500 · neutro: text-amber-600
  Métricas: Pedidos hoy / Pendientes / Listos / Ingresos hoy
```

### Gestión de Productos (`/admin/productos`)
```
Header panel: "Productos" + [input búsqueda] + [+ Nuevo producto]
Tabla:
  Columns: Producto (thumb + nombre + categoría) / Precio / Disponible (toggle) / Acciones
  Toggle: Headless UI Switch o input[type=checkbox] custom
    ON:  bg-pet-green
    OFF: bg-gray-300
  Acciones: botón editar (ícono lápiz, bg-[#E1F5EE]) + botón eliminar (ícono trash, bg-[#FCEBEB])

Modal/Drawer de edición:
  Campos: Nombre · Precio · Categoría · Subcategoría · Descripción · Recomendación médica
          Aviso legal (checkbox) · Destacado (checkbox) · Upload de imagen
  Upload: drag & drop + input file + preview 1:1 (600×600px)
  Botones: Cancelar (bg-gray-100) + Guardar cambios (bg-pet-green)
```

### Gestión de Pedidos (`/admin/pedidos`)
```
Tabla ordenada por fecha desc, paginación cada 10
Columns: # Pedido / Cliente + teléfono / Total / Pago / Estado (badge) / Acción (ver)

Badges de estado:
  pendiente  → bg-[#F1EFE8] text-[#5F5E5A]
  confirmado → bg-[#FAEEDA] text-[#633806]
  listo      → bg-[#E6F1FB] text-[#0C447C]
  entregado  → bg-[#E1F5EE] text-[#085041]
  cancelado  → bg-[#FCEBEB] text-[#A32D2D]

Drawer detalle del pedido:
  Datos cliente (nombre, teléfono)
  Tabla de ítems (nombre · cant · precio unit · subtotal)
  Total
  Dropdown para cambiar estado → trigger notificación WhatsApp automática
  Botón "WhatsApp directo al cliente" → wa.me/51XXXXXXXXX
```

---

## 10. Comportamientos y UX Rules

| Regla | Detalle |
|-------|---------|
| Carrito persistente | `localStorage` key: `petcenter_cart` |
| Búsqueda | Debounce 300ms, filtra nombre + descripción del producto actual |
| Paginación | 8 productos por página en catálogo |
| Imagen placeholder | `/images/placeholder.png` — 600×600px fondo gris claro |
| Aviso legal | Solo mostrar caja roja si `aviso_legal === true` |
| Botón agotado | Visible pero `disabled` + `opacity-50 cursor-not-allowed` |
| Toggle admin | Cambia `disponible` en Supabase sin modal de confirmación |
| Número de pedido | Generado por trigger PostgreSQL: `PET-YYYY-NNN` |
| Notificaciones WA | Al crear pedido (→ admin) y al cambiar estado (→ cliente) |
| FAB WhatsApp | `z-50 fixed bottom-6 right-6` — todas las páginas públicas |
| Mobile-first | Diseño base 375px, adaptar a tablet/desktop con `md:` breakpoints |

---

## 11. Animaciones y micro-interacciones

- Hover en tarjetas de producto: `transition-transform duration-150 hover:-translate-y-0.5`
- Botones primarios: `active:scale-[0.98] transition-transform`
- Stepper: transición de color en la línea conectora al avanzar
- Toast de confirmación al agregar al carrito (bottom, 2 segundos)
- Skeleton loaders en grid de productos mientras carga Supabase

---

## 12. Estructura de componentes sugerida

```
components/
  ui/
    Button.tsx          # Variantes: primary, secondary, ghost, danger
    Badge.tsx           # Variantes: available, sold-out, low-stock
    Toggle.tsx          # Switch de disponibilidad
    Skeleton.tsx        # Skeleton loader genérico
    Toast.tsx           # Notificación temporal
  store/
    Navbar.tsx          # Navbar público con carrito
    ProductCard.tsx     # Tarjeta de producto (catálogo + destacados)
    CategoryCard.tsx    # Card de categoría (home)
    SearchBar.tsx       # Input con debounce
    FilterChips.tsx     # Chips de subcategoría
    Pagination.tsx      # Paginación numérica
    CartDrawer.tsx      # Carrito lateral/página
    CheckoutStepper.tsx # Stepper 3 pasos
    ProductDetail.tsx   # Ficha de producto completa
    WhatsAppFAB.tsx     # Botón flotante WhatsApp
  admin/
    AdminLayout.tsx     # Layout con sidebar/topnav
    ProductTable.tsx    # Tabla CRUD productos
    OrderTable.tsx      # Tabla pedidos con estados
    ProductModal.tsx    # Modal edición/creación
    OrderDrawer.tsx     # Drawer detalle pedido
    StatsGrid.tsx       # Cards de métricas dashboard
```

---

## 13. Checklist de aceptación UX

- [ ] Navbar sticky en todas las páginas públicas
- [ ] Badge del carrito se actualiza en tiempo real
- [ ] Grid de categorías renderiza correcto en 375px
- [ ] Scroll horizontal de productos funciona sin barra visible en mobile
- [ ] Chips de subcategoría tienen scroll horizontal oculto
- [ ] Toggle de disponibilidad cambia sin recargar página
- [ ] Caja de aviso legal solo aparece si `aviso_legal = true`
- [ ] Stepper de checkout muestra paso correcto y bloquea saltar pasos
- [ ] Yape/Plin muestra número de cuenta al seleccionarse
- [ ] Página de confirmación vacía el localStorage del carrito
- [ ] FAB de WhatsApp visible en todas las páginas públicas
- [ ] Panel admin redirige a login si no hay sesión
- [ ] Skeleton loaders aparecen mientras se cargan productos
- [ ] Imágenes usan placeholder si `imagen_url` es null

---

## 14. Priorización de alcance (MVP vs Nice-to-have)

### MVP obligatorio (bloquea salida)
- Home con estructura base: hero + categorías + destacados + strip confianza.
- Catálogos con búsqueda (debounce 300ms), filtros/chips y paginación 8 por página.
- Ficha de producto con disponibilidad, precio, recomendación médica y aviso legal condicional.
- Carrito persistente en `petcenter_cart` y checkout funcional de 3 pasos.
- Confirmación con `numero_pedido` visible y CTA de WhatsApp.
- Admin con guard de sesión y cambio de estado de pedidos.
- Número de pedido generado por trigger PostgreSQL con formato `PET-YYYY-NNN`.

### Nice-to-have (no bloquea salida inicial)
- Animaciones extra y micro-interacciones avanzadas.
- Drawer de detalle en admin (si ya existe página de detalle funcional).
- Optimizaciones visuales finas en desktop por encima de 1200px.
- Variantes avanzadas de componentes UI reutilizables.

---

## 15. Trazabilidad PRD a rutas reales

| Bloque PRD | Ruta/archivo objetivo |
|---|---|
| Home | `app/page.tsx` |
| Catálogo Farmacia | `app/farmacia/page.tsx` |
| Catálogo Nutrición | `app/nutricion/page.tsx` |
| Catálogo Accesorios | `app/accesorios/page.tsx` |
| Filtros/chips | `components/store/Filtros.tsx` |
| Tarjeta de producto | `components/store/ProductCard.tsx` |
| Ficha de producto | `app/producto/[slug]/page.tsx` |
| Botón agregar ficha | `app/producto/[slug]/AddToCartButton.tsx` |
| Carrito | `app/carrito/CarritoClient.tsx` |
| Checkout | `app/checkout/CheckoutClient.tsx` |
| Confirmación | `app/checkout/confirmacion/page.tsx` |
| Layout público | `app/layout.tsx` |
| Admin layout | `app/admin/layout.tsx` |
| Admin productos | `app/admin/productos/page.tsx` |
| Admin pedidos | `app/admin/pedidos/page.tsx` |
| API crear pedido | `app/api/pedidos/route.ts` |
| API estado pedido | `app/api/admin/pedidos/[id]/estado/route.ts` |
| Carrito persistencia | `lib/CartContext.tsx` |
| Notificaciones | `lib/notifications.ts` |
| Migraciones SQL | `supabase/migrations/*.sql` |

---

## 16. Criterios medibles de aceptación (QA rápido)

- Búsqueda en catálogo: al escribir, el filtro se aplica en <= 300ms después del último input.
- Paginación: nunca muestra más de 8 productos por página.
- Aviso legal: solo aparece cuando `aviso_legal === true`.
- Agotado: botón de compra visible pero `disabled` y con estilo atenuado.
- Checkout: no permite confirmar pedido sin nombre y teléfono.
- Checkout 3 pasos: no permite saltar al paso 3 si el paso 1 está incompleto.
- Confirmación: muestra un número de pedido no vacío y CTA a WhatsApp operativo.
- Admin guard: cualquier `/admin/*` redirige a login sin sesión válida.
- Admin pedidos: cambio de estado persiste en DB y ejecuta notificación best-effort.
- Placeholder: cuando `imagen_url` es null/vacía, usa `/images/placeholder.png`.

---

*Diseño generado en base al PRD v1.1 de PET CENTER · Tacna, Perú*
