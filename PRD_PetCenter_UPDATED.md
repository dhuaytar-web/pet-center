# PRD — E-commerce PET CENTER
**Versión:** 1.1 MVP (Actualizado)
**Fecha:** Marzo 2026  
**Estado:** Listo para desarrollo  
**Autor:** Proyecto Tacna, Perú

---

## 1. Visión del Producto

PET CENTER es una plataforma de e-commerce local para una veterinaria pequeña en Tacna, Perú. El objetivo del MVP es digitalizar las ventas del local físico, permitiendo a clientes de la ciudad comprar productos (medicamentos, alimentos, accesorios) y coordinar servicios directamente desde el celular, pagando con Yape/Plin o retirando en tienda.

**Propuesta de valor central:** La comodidad de comprar online con la confianza de tu veterinario de barrio.

**No es objetivo del MVP:** Vender fuera de Tacna, implementar delivery propio, ni construir un marketplace.

---

## 2. Stack Tecnológico

| Capa | Tecnología | Justificación |
|---|---|---|
| Frontend | Next.js 14 (App Router) | SSR para SEO local, rutas de API integradas, deploy automatizado |
| Estilos | Tailwind CSS | Velocidad de desarrollo, consistencia visual |
| Backend / DB | Supabase (PostgreSQL) | Auth admin, base de datos robusta, RLS segura |
| Storage | Supabase Storage | Almacenamiento de imágenes de productos |
| Deploy | Vercel | Integración nativa con Next.js, free tier, CDN global |
| Notificaciones | Twilio + Sendgrid | WhatsApp automático al admin y cliente; Email como fallback |
| Pagos | Manual (Yape/Plin) | Sin pasarela: la dueña verifica desde su app |

### Estructura de carpetas recomendada

```
pet-center/
├── app/
│   ├── (store)/               # Rutas públicas del e-commerce
│   │   ├── page.tsx           # Home
│   │   ├── farmacia/
│   │   ├── nutricion/
│   │   ├── accesorios/
│   │   ├── servicios/
│   │   └── producto/[slug]/
│   ├── checkout/
│   │   ├── page.tsx
│   │   └── confirmacion/
│   │       └── page.tsx
│   ├── admin/                 # Panel de administración (protegido)
│   │   ├── layout.tsx         # Guard de autenticación
│   │   ├── login/
│   │   ├── productos/
│   │   ├── pedidos/
│   │   └── page.tsx           # Dashboard
│   └── api/
│       ├── pedidos/           # Crear pedidos
│       ├── productos/         # Listar productos (público)
│       ├── notificaciones/    # Webhook para WhatsApp/Email
│       └── admin/
│           ├── productos/     # Editar productos
│           └── pedidos/       # Actualizar estado
├── components/
│   ├── ui/                    # Componentes base (Button, Card, Badge)
│   ├── store/                 # Componentes del e-commerce
│   └── admin/                 # Componentes del panel admin
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Cliente Supabase (cliente)
│   │   ├── server.ts          # Cliente Supabase (servidor)
│   │   └── types.ts           # Tipos de PostgreSQL
│   ├── constants.ts           # Variables globales
│   ├── utils.ts               # Funciones útiles
│   └── notifications.ts       # Twilio + Sendgrid
├── public/
│   └── images/
│       ├── placeholder.png    # Imagen por defecto
│       └── logo.png
└── .env.local                 # Variables de entorno
```

---

## 3. Base de Datos (Supabase / PostgreSQL)

### Esquema de tablas (ACTUALIZADO)

```sql
-- Categorías del catálogo
CREATE TABLE categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icono TEXT,
  descripcion TEXT,
  orden INT DEFAULT 0,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subcategorías (solo en Farmacia)
CREATE TABLE subcategorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id UUID REFERENCES categorias(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Productos (ACTUALIZADO: sin stock numérico, sin recetas)
CREATE TABLE productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  disponible BOOLEAN DEFAULT TRUE,        -- TRUE: disponible | FALSE: agotado
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  subcategoria_id UUID REFERENCES subcategorias(id) ON DELETE SET NULL,
  imagen_url TEXT,                        -- NULL: usar placeholder
  recomendacion_medica TEXT,              -- Texto informativo
  aviso_legal BOOLEAN DEFAULT FALSE,      -- Mostrar disclaimer
  destacado BOOLEAN DEFAULT FALSE,        -- Para home
  orden INT DEFAULT 0,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pedidos (ACTUALIZADO: sin comprobantes, sin recetas)
CREATE TABLE pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_pedido TEXT UNIQUE NOT NULL,     -- PET-2026-001
  nombre_cliente TEXT NOT NULL,
  telefono TEXT NOT NULL,
  metodo_pago TEXT NOT NULL,             -- "yape", "plin", "efectivo_tienda"
  metodo_entrega TEXT DEFAULT 'recojo_tienda',
  estado TEXT DEFAULT 'pendiente',       -- pendiente|confirmado|listo|entregado|cancelado
  total DECIMAL(10,2) NOT NULL,
  notas TEXT,                            -- Notas del cliente
  notificacion_enviada BOOLEAN DEFAULT FALSE,  -- Tracking de notificaciones
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Items de cada pedido
CREATE TABLE pedido_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id UUID NOT NULL REFERENCES productos(id),
  nombre_producto TEXT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  cantidad INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Configuración del admin (tienda)
CREATE TABLE config_tienda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  direccion TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT NOT NULL,
  numero_yape TEXT,
  numero_plin TEXT,
  horario_atencion TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Políticas de Seguridad (RLS)

```sql
-- Productos: lectura pública, escritura solo admin
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública productos" ON productos FOR SELECT USING (activo = true);
CREATE POLICY "Admin edita productos" ON productos FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Categorías: lectura pública, escritura admin
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública categorias" ON categorias FOR SELECT USING (activo = true);

-- Pedidos: crear público, leer/actualizar solo admin
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clientes crean pedidos" ON pedidos FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin ve pedidos" ON pedidos FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin actualiza pedidos" ON pedidos FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Pedido items: crear público, leer admin
ALTER TABLE pedido_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Crear items" ON pedido_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin lee items" ON pedido_items FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
```

---

## 4. User Persona

**"La dueña de mascota tacneña"**  
Mujer u hombre de 22–45 años, residente en Tacna. Tiene 1–2 mascotas. Usa Yape/Plin diariamente. Compra desde celular, prefiere WhatsApp antes que llamadas. Valora la confianza en el veterinario y la comodidad. Le importa saber si el producto está disponible sin ir al local.

---

## 5. Especificaciones de Imágenes

### Imagen de Producto

- **Formato:** JPG, PNG, WebP
- **Dimensiones recomendadas:** 600x600px (cuadrado, 1:1)
- **Peso máximo:** 200 KB (Supabase comprime automáticamente)
- **Fondo:** Blanco o gris muy claro (`#F9FAFB`)
- **Producto debe ocupar:** ~80% del frame
- **Placeholder por defecto:** `public/images/placeholder.png` (600x600px, fondo gris con icono)

### Imagen de Banner Home

- **Dimensiones:** 1200x400px (mobile: 750x300px)
- **Peso máximo:** 400 KB
- **Formato:** JPG con compresión

### Logo

- **Dimensiones:** 200x200px
- **Peso máximo:** 50 KB
- **Formato:** PNG (fondo transparente recomendado)

---

## 6. Funcionalidades de Búsqueda y Paginación

### Búsqueda Optimizada

- **Tipo:** Búsqueda en tiempo real con debounce (300ms)
- **Scope:** Nombre y descripción de productos
- **UI:** Input con icono de lupa en la cabecera de cada categoría
- **Resultados:** Se filtran los productos actuales (category + subcategory)
- **Implementación elegida:** 
  - Frontend: Input controlado → filter en cliente (para MVP con <500 productos)
  - Backend opcional: SQL LIKE con índice en `productos.nombre` si crece

### Paginación

- **Items por página:** 8 productos
- **Navigation:** Botones "Anterior" y "Siguiente" + indicador "Página X de Y"
- **Mobile:** Botones visibles en footer
- **Desktop:** Arriba y abajo del grid (UX estándar de e-commerce)
- **URL:** `/farmacia?page=2&filtro=antipulgas`

---

## 7. SEO Local Básico

### Estrategia implementada (MVP)

- **Meta tags dinámicos:** Título, descripción, keywords por página
- **Structured Data (JSON-LD):** 
  - LocalBusiness schema (página de contacto)
  - Product schema (cada producto)
- **Sitemap:** `sitemap.xml` autogenerado por Next.js
- **robots.txt:** Indexación configurada
- **Open Graph:** Imagen y descripción para compartir en redes
- **Canonical URLs:** Evitar duplicados

### Páginas con enfoque local

- Home: "Veterinaria PET CENTER en Tacna - Compra online"
- Categoría: "Medicamentos para mascotas en Tacna - PET CENTER"
- Producto: Nombre + marca + "en Tacna"

**Herramientas recomendadas (post-MVP):** 
- Google Search Console + Analytics 4
- Hotjar para heatmaps

---

## 8. Notificaciones y Comunicación

### WhatsApp (Primario)

**Usando Twilio:**

1. **Nuevo pedido → Dueña** (automático en confirmación)
   ```
   📦 Nuevo pedido #PET-2026-001
   Cliente: Juan Pérez
   Total: S/ 150.00
   Items: Alimento Royal Canin x2
   Pago: Yape
   Link admin: [URL]
   ```

2. **Cambio de estado → Cliente** (al cambiar en admin)
   ```
   ✅ Tu pedido #PET-2026-001 está CONFIRMADO
   Retira hoy de 3PM-6PM en Av. ..., Tacna
   ```

### Email (Fallback)

**Usando Sendgrid:**

1. Confirmación de pedido
2. Notificación de estado

---

## 9. Flujo de Compra (ACTUALIZADO)

### 7.1 Catálogo Público

**Home (`/`)**
- Banner principal con CTA
- Grid de categorías (4: Farmacia, Nutrición, Accesorios, Servicios)
- Sección "Productos destacados" (4-6 productos)
- Footer con dirección y WhatsApp

**Listado de categoría (`/farmacia`, `/nutricion`, `/accesorios`)**
- **Buscador:** Input con debounce
- **Filtros:** Subcategoría (solo Farmacia, accordion)
- **Grid:** Paginación cada 8 productos
- **Tarjeta:** Imagen (o placeholder), nombre, precio
- **Badge:** "Disponible" (verde) o "Agotado" (gris)
- **Botón:** "Agregar al carrito" (deshabilitado si agotado)

**Ficha de producto (`/producto/[slug]`)**
- Imagen grande (o placeholder)
- Nombre en H1, precio destacado
- Descripción
- Badge de disponibilidad
- Recuadro "Recomendación médica" (gris, italic)
- Aviso legal (rojo si aplica)
- Botón "Agregar al carrito" (deshabilitado si agotado)
- Productos relacionados abajo (misma categoría)

### 7.2 Carrito

- Persistencia en `localStorage` (sin login)
- Resumen: imagen chica, nombre, precio x cantidad
- Botón "Checkout"
- Link a seguir comprando

### 7.3 Checkout (`/checkout`)

**Paso 1: Datos**
- Nombre completo (required)
- Teléfono (required, con máscara +51)
- Notas (optional)

**Paso 2: Entrega**
- Solo "Recojo en tienda" (mostrar dirección)

**Paso 3: Pago**
- Radio button: Yape / Plin / Efectivo
- Si Yape/Plin: mostrar número de cuenta y monto
- Si Efectivo: mostrar instrucción

**Confirmación:**
- Crear pedido en Supabase
- **Generar número:** Trigger PostgreSQL `PET-YYYY-NNN`
- **Notificar Dueña:** WhatsApp automático(Twilio)
- **Mostrar cliente:** "Pedido #PET-2026-001 recibido. Te contactaremos por WhatsApp."
- localStorage se vacía

### 7.4 Botón Flotante WhatsApp

- Verde en `bottom-6 right-6`
- Visible en todas las páginas públicas
- Abre: `https://wa.me/51XXXXXXXXX?text=Hola!%20Tengo%20una%20consulta...`
- Badge de contador de items del carrito (opcional)

---

## 10. Panel de Administración (`/admin`)

### Login
- Email + contraseña (Supabase Auth)
- Un único usuario admin en MVP

### Dashboard (`/admin`)
- Cards resumen: pedidos hoy, nuevos, pendientes de confirmar
- Gráfico: estados de pedidos (semanal)
- Links rápidos a productos y pedidos

### Gestión de Productos (`/admin/productos`)

**Tabla:**
- Búsqueda por nombre
- Filtro por categoría
- Columns: Imagen chica, Nombre, Categoría, Precio, Disponibilidad (toggle), Acciones

**Acciones:**
- **Toggle Disponibilidad:** Cambia en tiempo real sin modal
- **Editar:** Modal/drawer con formulario (nombre, precio, descripción, recomendación, aviso legal, imagen, categoría, destacado)
- **Crear:** Mismo formulario
- **Activar/Desactivar:** Oculta del catálogo

**Upload de imagen:**
- Drag & drop ó input file
- Redimensiona a 600x600px automáticamente
- Preview antes de guardar

### Gestión de Pedidos (`/admin/pedidos`)

**Tabla:**
- Ordenar por fecha (reciente primero)
- Paginación cada 10 pedidos
- Columns: # Pedido, Cliente, Teléfono, Total, Pago, Estado, Fecha, Acciones

**Estados:** Badge color diferente
- Gris: pendiente
- Amarillo: confirmado
- Azul: listo
- Verde: entregado

**Detalle (modal/drawer):**
- Datos cliente
- Items (tabla)
- Total
- Botón WA directo al cliente
- Dropdown para cambiar estado

**Al cambiar estado:**
- `confirmado` → Enviar WA al cliente: "✅ Tu pedido está confirmado"
- `listo` → Enviar WA: "📦 Tu pedido está listo para recoger"
- `entregado` → Enviar WA: "✔️ Gracias por tu compra!"

---

## 11. Reglas de Negocio

1. **Disponibilidad:** `disponible = TRUE/FALSE`. Si FALSE, botón deshabilitado pero producto visible.
2. **Aviso legal:** Si `aviso_legal = TRUE`, mostrar disclaimer rojo en ficha y carrito.
3. **Stock manual:** Solo toggle en admin (ni números, ni reservas automáticas).
4. **Pago verificado:** La dueña revisa Yape/Plin desde su app. Admin cambia a "confirmado" manualmente.
5. **Número de pedidos:** Generado automáticamente (trigger PostgreSQL).
6. **Recojo:** El cliente retira en tienda según indicación del admin.

---

## 12. Variables de Entorno

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# Twilio (WhatsApp)
TWILIO_ACCOUNT_SID=ACxxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_WHATSAPP_FROM=whatsapp:+51XXXXXXXXX  # Número de Twilio

# Sendgrid (Email)
SENDGRID_API_KEY=SG.xxxxx

# WhatsApp (botón flotante - link a chat)
NEXT_PUBLIC_WHATSAPP_NUMBER=51XXXXXXXXX
NEXT_PUBLIC_WHATSAPP_MESSAGE=Hola!%20Tengo%20una%20consulta%20sobre%20un%20producto%20de%20PET%20CENTER

# Negocio
NEXT_PUBLIC_STORE_NAME=PET CENTER
NEXT_PUBLIC_STORE_ADDRESS=Av. Bolognesi 123, Tacna, Perú
NEXT_PUBLIC_STORE_PHONE=51912345678
NEXT_PUBLIC_OWNER_EMAIL=duena@petcenter.pe
NEXT_PUBLIC_OWNER_PHONE_DISPLAY=+51 912 345 678
```

---

## 13. Páginas y Rutas

| Ruta | Tipo | Descripción |
|---|---|---|
| `/` | Pública | Home |
| `/farmacia` | Pública | Listado Farmacia con filtros + paginación |
| `/nutricion` | Pública | Listado Nutrición + paginación |
| `/accesorios` | Pública | Listado Accesorios + paginación |
| `/servicios` | Pública | Listado servicios + CTA WhatsApp |
| `/producto/[slug]` | Pública | Ficha de producto |
| `/checkout` | Pública | Formulario de compra |
| `/checkout/confirmacion` | Pública | Confirmación + número de pedido |
| `/admin/login` | Pública | Login |
| `/admin` | Protegida | Dashboard |
| `/admin/productos` | Protegida | CRUD productos |
| `/admin/pedidos` | Protegida | CRUD pedidos |

---

## 14. Criterios de Aceptación del MVP

- [ ] Cliente navega catálogo sin login (mobile OK)
- [ ] Búsqueda con debounce funciona
- [ ] Paginación funciona
- [ ] Agregar al carrito y checkout funciona
- [ ] Pedido se crea en Supabase
- [ ] Admin recibe WhatsApp automático con resumen
- [ ] Admin puede cambiar disponibilidad con toggle
- [ ] Admin puede editar producto en <30 segundos
- [ ] Al cambiar estado, cliente recibe WhatsApp
- [ ] Botón flotante WhatsApp visible en todas las páginas
- [ ] Placeholder funciona si no hay imagen
- [ ] Avisos legales se muestran correctamente
- [ ] Deploy en Vercel OK
- [ ] Mobile responsive OK

---

## 15. Roadmap Post-MVP

- Pasarela de pago automática (Culqi, Stripe)
- Delivery con cálculo de zonas
- Sistema de suscripción
- Perfil de cliente con historial
- Blog veterinario

---

*PRD v1.1 - Actualizado con cambios del cliente: sin recetas, stock booleano, notificaciones WhatsApp, búsqueda optimizada, paginación, placeholder de imagen, SEO básico.*
