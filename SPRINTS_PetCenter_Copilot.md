# Plan de Implementación — PET CENTER UX/UI
**Para:** GitHub Copilot / Cursor  
**Base:** Diagnóstico del 2026-04-19  
**Objetivo:** Alinear la base funcional existente con el PRD UX/UI v2.0

> Cada tarea indica el archivo exacto a modificar y qué hacer.  
> Completar en orden: Sprint 1 → 2 → 3.

---

## SPRINT 1 — Crítico (base visual + reglas de negocio)
> Sin esto el resto no tiene sentido. Estimado: 1 día de trabajo.

---

### S1-1 · Sistema visual global
**Archivos:** `app/globals.css` + `app/layout.tsx`

> Nota técnica: este proyecto usa `@import "tailwindcss"` y puede trabajar sin `tailwind.config.ts`.
> Priorizar definición en `globals.css` para no romper la compilación actual.

**app/globals.css** — Definir tokens visuales del nuevo modelo:
```css
:root {
   --pet-green: #1D9E75;
   --pet-green-light: #E1F5EE;
   --pet-green-dark: #085041;
   --pet-green-mid: #0F6E56;
   --pet-amber: #EF9F27;
   --pet-amber-light: #FAEEDA;
}

body { font-family: var(--font-nunito), sans-serif; background-color: #F9FAFB; }
h1, h2, h3, .font-display { font-family: var(--font-poppins), sans-serif; }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
```

**Uso en componentes**:
```tsx
// while migramos clases utilitarias:
className="bg-[var(--pet-green)] text-white"
```

**app/layout.tsx** — Cargar fuentes con next/font:
```tsx
import { Nunito, Poppins } from 'next/font/google'
const poppins = Poppins({ subsets: ['latin'], weight: ['500','600','700'], variable: '--font-poppins' })
const nunito  = Nunito({ subsets: ['latin'], weight: ['400','600','700','800'], variable: '--font-nunito' })
// Aplicar en <html>: className={`${poppins.variable} ${nunito.variable} font-nunito`}
```

**Resultado esperado**: nuevo sistema visual aplicado sin depender de archivo de config adicional.

---

### S1-2 · Separar layout admin del layout público
**Archivos:** `app/layout.tsx` + `app/admin/layout.tsx`

**app/layout.tsx** — El layout raíz NO debe renderizar Navbar, Footer ni FAB si la ruta empieza con `/admin`:
```tsx
// Opción A (recomendada): usar grupos de rutas
// Mover páginas públicas a app/(store)/  y admin a app/(admin)/
// Cada grupo tiene su propio layout.tsx

// Opción B (rápida): condicional con usePathname en un ClientWrapper
'use client'
import { usePathname } from 'next/navigation'
export function PublicShell({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const isAdmin = path.startsWith('/admin')
  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppFAB />}
    </>
  )
}
```

**app/admin/layout.tsx** — Debe tener su propio sidebar/topnav, sin herencia del público:
```tsx
// Renderizar: AdminSidebar (desktop) o AdminTopnav (mobile) + {children}
// Guard de auth: redirect a /admin/login si no hay sesión Supabase
```

---

### S1-3 · Trigger PostgreSQL para número de pedido
**Archivo:** `supabase/migrations/NUEVA_MIGRACIÓN.sql`

Crear nuevo archivo: `supabase/migrations/20260419_pedido_numero_trigger.sql`
```sql
CREATE OR REPLACE FUNCTION generar_numero_pedido()
RETURNS TRIGGER AS $$
DECLARE
   anio TEXT := TO_CHAR(NOW(), 'YYYY');
   seq INT;
BEGIN
   SELECT COALESCE(MAX(SUBSTRING(numero_pedido FROM 'PET-\d{4}-(\d+)$')::INT), 0) + 1
      INTO seq
   FROM pedidos
   WHERE numero_pedido LIKE ('PET-' || anio || '-%');

  NEW.numero_pedido := 'PET-' || anio || '-' || LPAD(seq::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_numero_pedido ON pedidos;
CREATE TRIGGER trigger_numero_pedido
  BEFORE INSERT ON pedidos
  FOR EACH ROW
  WHEN (NEW.numero_pedido IS NULL OR NEW.numero_pedido = '')
  EXECUTE FUNCTION generar_numero_pedido();
```

**app/api/pedidos/route.ts** — Eliminar el fallback aleatorio de número de pedido. El campo `numero_pedido` ya no debe enviarse en el INSERT; el trigger lo genera solo.

---

### S1-4 · Corregir key de localStorage del carrito
**Archivo:** `lib/CartContext.tsx`

```tsx
// Cambiar:
const CART_KEY = 'pet-center-cart'
// Por:
const CART_KEY = 'petcenter_cart'
```

---

### S1-5 · Placeholder de imagen estándar
**Archivos:** `components/store/ProductCard.tsx` + `app/producto/[slug]/page.tsx`

1. Crear archivo `public/images/placeholder.png` — imagen 600×600px, fondo `#F1EFE8`, ícono de hueso centrado (puede ser generado con sharp o simplemente un PNG estático que el dev suba manualmente).
2. En `ProductCard.tsx` y en la ficha de producto, reemplazar el SVG inline por:
```tsx
import Image from 'next/image'
const imgSrc = producto.imagen_url ?? '/images/placeholder.png'
<Image src={imgSrc} alt={producto.nombre} width={600} height={600} className="w-full h-full object-cover" />
```

---

## SPRINT 2 — Visual (pantallas públicas)
> Alinear cada página con el diseño del PRD. Estimado: 2–3 días.

---

### S2-1 · Home (`app/page.tsx`)
Reescribir la estructura completa en este orden:

```
1. <HeroBanner>
   - Fondo: bg-gradient-to-br from-[#085041] via-[#1D9E75] to-[#5DCAA5]
   - Badge "Tacna, Perú" con punto verde
   - H1 con fuente Poppins: "Tu veterinaria de confianza, <span text-[#9FE1CB]>online</span>"
   - Subtítulo + 2 botones (Ver catálogo / WhatsApp)

2. <SearchBar> con input debounce 300ms → redirige a /buscar?q=...

3. <SeccionCategorias>
   - grid grid-cols-4 gap-2.5 px-4 py-3.5
   - 4 cards: Farmacia, Nutrición, Accesorios, Servicios
   - Cada card: ícono coloreado + label, link a /farmacia etc.

4. <SeccionDestacados>
   - overflow-x-auto flex gap-2.5 no-scrollbar px-4
   - Filtrar productos con destacado=true desde Supabase
   - Usar <ProductCard> existente en variante "compact"

5. <SeccionServicios>
   - flex flex-col gap-2 px-4
   - 3 ítems: Consulta, Peluquería, Vacunación
   - Cada uno: link a /servicios

6. <StripConfianza>
   - bg-[#E1F5EE] flex justify-around py-3.5
   - 3 ítems: ✅ Yape/Plin · 📦 Retiro en tienda · 💬 WhatsApp

7. <Footer>
   - bg-[#085041] con dirección, horario, botón WA, copyright
```

---

### S2-2 · Catálogo (`app/farmacia/page.tsx`, `nutricion`, `accesorios`)
**Archivos:** Los 3 archivos de categoría + `components/store/Filtros.tsx`

Cambios:
```
1. SearchBar con debounce 300ms
   - Usar useCallback + setTimeout en el handler
   - Estado: searchQuery con delay antes de filtrar

2. Chips de subcategoría (solo Farmacia):
   - overflow-x-auto flex gap-1.5 no-scrollbar
   - Estado activo: bg-[#E1F5EE] text-[#085041] border-[#9FE1CB]

3. Barra de resultados:
   - "N productos encontrados" + botón "Ordenar"

4. Grid de productos:
   - grid grid-cols-2 gap-2.5 p-3
   - Skeleton loaders mientras carga (ver S3-2)

5. Paginación:
   - 8 productos por página
   - Componente <Pagination> con flechas + números
   - Página activa: bg-pet-green text-white
```

---

### S2-3 · Ficha de producto (`app/producto/[slug]/page.tsx`)
**Archivos:** page.tsx + `app/producto/[slug]/AddToCartButton.tsx`

Cambios:
```
1. Imagen grande: h-[200px] w-full object-cover, bg de categoría como fallback

2. Control de cantidad:
   - Estado local qty (default 1)
   - Botones [−] y [+] con validación min=1
   - AddToCartButton recibe qty y llama addToCart(producto, qty)

3. Caja recomendación médica (si producto.recomendacion_medica):
   bg-[#F1EFE8] rounded-xl p-3 border-l-[3px] border-[#888780]
   Ícono shield + label + texto italic

4. Caja aviso legal (si producto.aviso_legal === true):
   bg-[#FCEBEB] rounded-xl p-3 border-l-[3px] border-[#E24B4A]
   Ícono alerta + label + texto

5. Productos relacionados (misma categoría, excluir actual):
   overflow-x-auto flex gap-2 no-scrollbar
   Cards compactas 110px de ancho
```

---

### S2-4 · Carrito (`app/carrito/page.tsx`)
Cambios visuales:
```
- Ítems con imagen 46×46 rounded-xl
- Botón eliminar: w-6 h-6 rounded-lg bg-[#FCEBEB] con ícono X rojo
- Total: font-poppins font-bold text-[16px] text-[#085041]
- Botón CTA: bg-pet-green w-full rounded-xl py-3.5 font-bold
- Link "Seguir comprando" text-pet-green centrado
```

---

### S2-5 · Checkout (`app/checkout/CheckoutClient.tsx`)
Reemplazar el flujo actual por el stepper de 3 pasos:

```tsx
// Estado: step = 1 | 2 | 3
// Componente <CheckoutStepper step={step} /> — visual de los 3 puntos + líneas

// Paso 1: Datos
// - Campo Nombre completo (required)
// - Campo Teléfono con prefijo "+51" como span absoluto
// - Campo Notas (optional, textarea)
// - Botón "Continuar →" → setStep(2)

// Paso 2: Entrega (solo recojo en tienda)
// - Card verde bg-[#E1F5EE] border-[#9FE1CB]
// - Dirección: leer de process.env.NEXT_PUBLIC_STORE_ADDRESS
// - Botón "Continuar →" → setStep(3)

// Paso 3: Pago
// - 3 opciones radio card: Yape / Plin / Efectivo
// - Si Yape o Plin seleccionado:
//     Card ámbar con número y monto a enviar
//     Número: process.env.NEXT_PUBLIC_STORE_YAPE o PLIN
// - Si Efectivo: texto instrucción
// - Resumen de total
// - Botón "Confirmar pedido" → POST /api/pedidos → redirect confirmacion
```

**Nuevo componente:** `components/store/CheckoutStepper.tsx`
```tsx
// Props: step: 1 | 2 | 3
// Renderizar 3 puntos con líneas conectoras
// Completado: bg-pet-green con ícono check
// Activo: bg-[#085041] con número
// Pendiente: bg-gray-300 con número
```

---

### S2-6 · Confirmación (`app/checkout/confirmacion/page.tsx`)
```
- Círculo check: w-14 h-14 bg-[#E1F5EE] rounded-full + SVG check verde
- Título: "¡Pedido recibido!" font-poppins font-bold
- Mostrar numero_pedido en prominente: text-[#085041] font-bold
- Card mensaje bg-[#E1F5EE]: instrucción de enviar comprobante Yape
- Botón principal: bg-[#25D366] "Enviar comprobante por WhatsApp"
  href: https://wa.me/${NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hola!%20Mi%20pedido%20es%20%23${numeroPedido}
- Botón secundario: "Seguir comprando" → href="/"
```

---

### S2-7 · Servicio (`app/servicios/page.tsx`)
```
- Lista de servicios como cards con ícono, nombre, descripción
- Sin carrito — CTA único: "Agendar por WhatsApp"
- href: https://wa.me/${NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hola!%20Quiero%20agendar%20[servicio]
```

---

## SPRINT 3 — Cerrado (admin + micro-interacciones)
> Sprint completado y validado el 2026-04-19. Estimado original: 1–2 días.

Estado final: cerrado.

---

## SPRINT 4 — Abierto (experiencia de compra)
> Enfocado en conversión de catálogo y navegabilidad compartible.

### S4-1 · Ordenamiento real en catálogos
- [x] Implementado `sort` real en farmacia, nutrición y accesorios.
- [x] Opciones activas: destacados, precio mayor/menor y más vendidos.
- [x] El orden se persiste en URL para compartir filtros.
- [x] Compatible con búsqueda con debounce y reseteo de página.

---

### S3-1 · Toggle inline en tabla de productos admin
**Archivo:** `app/admin/productos/page.tsx`

```tsx
// En cada fila de la tabla, reemplazar badge de disponibilidad por toggle:
<button
  onClick={() => handleToggleDisponible(producto.id, !producto.disponible)}
  className={`w-9 h-5 rounded-full relative transition-colors ${
    producto.disponible ? 'bg-pet-green' : 'bg-gray-300'
  }`}
>
  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${
    producto.disponible ? 'left-[18px]' : 'left-0.5'
  }`} />
</button>

// Handler (alineado al backend actual):
// Opcion A: PATCH /api/admin/productos con payload completo (incluye id + disponible)
// Opcion B: crear /api/admin/productos/[id]/route.ts para actualizar solo disponible
// Recomendado: Opcion B para evitar enviar datos no relacionados
// Optimistic update: actualizar estado local antes de confirmar en Supabase
```

---

### S3-2 · Skeleton loaders en catálogos
**Nuevo componente:** `components/store/Skeleton.tsx`
```tsx
// <ProductCardSkeleton />
// Mismas dimensiones que ProductCard
// animate-pulse en todos los bloques
// bg-gray-200 para imagen, bg-gray-100 para textos
// Mostrar 6 skeletons mientras isLoading === true
```

**Aplicar en:** `app/farmacia/page.tsx`, `nutricion`, `accesorios`
```tsx
// Como son Server Components, usar loading.tsx por ruta o Suspense con fallback.
// Ejemplo en app/farmacia/loading.tsx
export default function LoadingFarmacia() {
   return <div className="grid grid-cols-2 gap-2.5 p-3">
      {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
   </div>
}
```

---

### S3-3 · Toast al agregar al carrito
**Nuevo componente:** `components/ui/Toast.tsx`
```tsx
// Estado global (o Context): toastMessage + toastVisible
// Aparece en la parte inferior: fixed bottom-24 left-1/2 -translate-x-1/2
// z-50, bg-[#085041] text-white rounded-xl px-4 py-2.5 text-[13px] font-bold
// Se oculta automáticamente después de 2000ms
// Trigger: cada vez que se llama addToCart()
// Mensaje: "✓ [Nombre del producto] agregado"
```

**Modificar:** `lib/CartContext.tsx` — llamar showToast() dentro de addToCart()

---

### S3-4 · Micro-interacciones
**Archivo:** `app/globals.css`
```css
/* Hover en cards de producto */
.product-card { transition: transform 150ms ease; }
.product-card:hover { transform: translateY(-2px); }

/* Botones primarios */
.btn-primary:active { transform: scale(0.98); }

/* Transición en toggle admin */
.admin-toggle span { transition: left 150ms ease, right 150ms ease; }
```

---

### S3-5 · Layout admin — Sidebar/Topnav
**Nuevo componente:** `components/admin/AdminSidebar.tsx`
```tsx
// Desktop (md:): sidebar fijo izquierda, 200px ancho
//   - Logo PET CENTER + badge "Admin"  
//   - Links: Dashboard, Productos, Pedidos (con íconos)
//   - Link logout abajo
// Mobile: topnav horizontal con links y hamburger opcional
// Colores: bg-[#085041] texto blanco, link activo bg-[#0F6E56]
```

**Modificar:** `app/admin/layout.tsx`
```tsx
// Solo renderizar <AdminSidebar> + <main>{children}</main>
// Sin Navbar público, sin Footer, sin FAB WhatsApp
// Guard: si !session → redirect('/admin/login')
```

---

### S3-6 · Drawer de detalle de pedido (admin)
**Archivo:** `app/admin/pedidos/page.tsx`

```tsx
// Al hacer click en un pedido, abrir drawer lateral (o modal)
// Contenido:
//   - Datos cliente (nombre, teléfono)
//   - Tabla de ítems: nombre | cant | precio unitario | subtotal
//   - Total en prominente
//   - Dropdown <select> para cambiar estado
//     Al cambiar → PATCH /api/admin/pedidos/[id]/estado
//     → trigger notificación WhatsApp al cliente (ya implementado en lib/notifications.ts)
//   - Botón "WhatsApp directo":
//     href="https://wa.me/51{telefono}?text=Hola%20{nombre}..."
```

---

## Orden de commits sugerido

```
feat: add pet color palette and Poppins/Nunito fonts (S1-1)
fix: separate admin layout from public layout (S1-2)
feat: add PostgreSQL trigger for pedido number generation (S1-3)
fix: align localStorage cart key to petcenter_cart (S1-4)
fix: use standard placeholder.png instead of inline SVG (S1-5)
feat: redesign home page following PRD structure (S2-1)
feat: add debounce search and horizontal chips to catalogs (S2-2)
feat: add qty control, medical box and related products to detail (S2-3)
feat: redesign cart page (S2-4)
feat: implement 3-step checkout stepper (S2-5)
feat: redesign confirmation page with WhatsApp CTA (S2-6)
feat: redesign servicios page with WhatsApp CTAs (S2-7)
feat: add inline availability toggle to admin product table (S3-1)
feat: add skeleton loaders to catalog pages (S3-2)
feat: add toast notification on add to cart (S3-3)
feat: add micro-interactions and transitions (S3-4)
feat: implement admin sidebar layout (S3-5)
feat: add order detail drawer to admin pedidos (S3-6)
```

---

## Variables de entorno que deben existir en `.env.local`
```env
NEXT_PUBLIC_STORE_ADDRESS=Av. Bolognesi 123, Tacna, Perú
NEXT_PUBLIC_WHATSAPP_NUMBER=51912345678
NEXT_PUBLIC_STORE_YAPE=912345678
NEXT_PUBLIC_STORE_PLIN=912345678
NEXT_PUBLIC_STORE_NAME=PET CENTER
```

---

## Definición de aprobado (por sprint)

### Sprint 1 aprobado si:
- Navegación admin no muestra Navbar/Footer/FAB públicos.
- `numero_pedido` sale como `PET-YYYY-NNN` sin fallback aleatorio en API.
- Carrito persiste en `petcenter_cart`.
- Placeholder único aplicado en tarjeta y ficha.

### Sprint 2 aprobado si:
- Home, catálogo, ficha, carrito, checkout y confirmación reflejan el modelo UX v2.0.
- Debounce, paginación y estados visuales se comportan como en PRD.
- Checkout de 3 pasos bloquea avance inválido y confirma pedido correctamente.

### Sprint 3 aprobado si:
- Toggle admin responde inmediato (optimistic) y persiste en backend.
- Skeletons y toast funcionan en móvil y desktop.
- Micro-interacciones no degradan accesibilidad ni legibilidad.

---

## Notas para Copilot

- **No romper** lógica crítica existente de `CartContext`, `api/pedidos` ni `lib/notifications.ts`.
- **Alcance mixto permitido**: además de UI, este plan incluye ajustes controlados de API/DB (trigger, endpoints, persistencia).
- **Respetar** el sistema de colores definido: usar clases Tailwind `pet-green`, `pet-green-dark`, etc. una vez configurado en `tailwind.config.ts`.
- **Debounce** implementar con `useCallback` + `useEffect` + `clearTimeout`, sin librería externa.
- **Optimistic updates** en el toggle de disponibilidad del admin para que la UI responda inmediatamente.
- **No mezclar** `'use client'` con fetch de Server Components — mantener el patrón actual del proyecto.
- El **trigger SQL** debe ejecutarse en Supabase (dashboard > SQL editor o mediante la migración).

---

*Plan generado a partir del diagnóstico de Copilot del 2026-04-19 y el PRD UX/UI v2.0 de PET CENTER.*
