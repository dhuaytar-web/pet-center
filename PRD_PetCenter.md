# PRD — E-commerce PET CENTER
**Versión:** 1.0 MVP  
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
| Frontend | Next.js 14 (App Router) | SSR para SEO local, rutas de API integradas |
| Estilos | Tailwind CSS | Velocidad de desarrollo, consistencia |
| Backend / DB | Supabase (PostgreSQL) | Auth, storage de comprobantes, tiempo real |
| Storage | Supabase Storage | Subida de capturas Yape/Plin y recetas |
| Deploy | Vercel | Integración nativa con Next.js, free tier |
| Pagos | Manual (Yape/Plin + confirmación) | Sin pasarela en MVP, proceso manual validado |

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
│   │   └── page.tsx
│   ├── admin/                 # Panel de administración (protegido)
│   │   ├── layout.tsx         # Guard de autenticación
│   │   ├── productos/
│   │   └── pedidos/
│   └── api/
│       ├── pedidos/
│       └── upload/
├── components/
│   ├── ui/                    # Componentes base (Button, Card, Badge)
│   ├── store/                 # Componentes del e-commerce
│   └── admin/                 # Componentes del panel admin
├── lib/
│   ├── supabase/              # Cliente y tipos de Supabase
│   └── utils.ts
└── public/
    └── images/
```

---

## 3. Base de Datos (Supabase / PostgreSQL)

### Esquema de tablas

```sql
-- Categorías del catálogo
CREATE TABLE categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,                   -- "Farmacia Veterinaria", "Nutrición", "Accesorios"
  slug TEXT UNIQUE NOT NULL,
  icono TEXT,                             -- Nombre del icono (Lucide)
  orden INT DEFAULT 0,
  activo BOOLEAN DEFAULT TRUE
);

-- Subcategorías (filtros dentro de Farmacia)
CREATE TABLE subcategorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id UUID REFERENCES categorias(id),
  nombre TEXT NOT NULL,                   -- "Antipulgas", "Vitaminas", "Cuidado de piel"
  slug TEXT UNIQUE NOT NULL
);

-- Productos
CREATE TABLE productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  categoria_id UUID REFERENCES categorias(id),
  subcategoria_id UUID REFERENCES subcategorias(id),
  imagen_url TEXT,
  requiere_receta BOOLEAN DEFAULT FALSE,  -- Activa el flujo de adjuntar receta
  recomendacion_medica TEXT,              -- Texto del recuadro "Recomendación Médica"
  aviso_legal BOOLEAN DEFAULT FALSE,      -- Activa el aviso de "Consulte a su veterinario"
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pedidos
CREATE TABLE pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_pedido TEXT UNIQUE NOT NULL,     -- PET-2026-001 (generado automáticamente)
  nombre_cliente TEXT NOT NULL,
  telefono TEXT NOT NULL,
  metodo_pago TEXT NOT NULL,             -- "yape", "plin", "efectivo_tienda"
  metodo_entrega TEXT NOT NULL,          -- "recojo_tienda"
  comprobante_url TEXT,                  -- URL del archivo en Supabase Storage
  receta_url TEXT,                       -- URL de la receta médica (si aplica)
  estado TEXT DEFAULT 'pendiente',       -- pendiente | confirmado | listo | entregado | cancelado
  total DECIMAL(10,2) NOT NULL,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Items de cada pedido
CREATE TABLE pedido_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID REFERENCES pedidos(id),
  producto_id UUID REFERENCES productos(id),
  nombre_producto TEXT NOT NULL,         -- Snapshot del nombre (por si cambia)
  precio_unitario DECIMAL(10,2) NOT NULL,
  cantidad INT NOT NULL
);
```

### Políticas de seguridad (RLS)

- Tabla `productos` y `categorias`: lectura pública, escritura solo con rol `admin`.
- Tabla `pedidos` y `pedido_items`: inserción pública (el cliente crea su pedido), lectura/actualización solo `admin`.
- Supabase Storage bucket `comprobantes`: subida pública, lectura solo `admin`.

---

## 4. User Persona

**"La dueña de mascota tacneña"**  
Mujer u hombre de 22–45 años, residente en Tacna ciudad. Tiene 1–2 mascotas (perro o gato). Usa Yape diariamente para todo tipo de pagos. Compra desde el celular, prefiere no llamar por teléfono pero sí escribe por WhatsApp. Busca productos conocidos (marcas que ya compra en el local físico) y valora la confianza de saber que el veterinario los recomienda. Le incomoda la incertidumbre del stock y el tiempo de espera.

**Frustración principal:** No saber si el producto que necesita está disponible sin ir físicamente a la veterinaria.

**Motivación de compra:** Comodidad + confianza médica + poder pagar con Yape sin salir de casa.

---

## 5. Arquitectura de Información

```
/ (Home)
├── /farmacia
│   ├── ?filtro=antipulgas
│   ├── ?filtro=vitaminas
│   └── ?filtro=cuidado-piel
├── /nutricion
│   └── (filtro por marca: 4 marcas máximo)
├── /accesorios
├── /servicios
│   └── (Enlace a WhatsApp para agendar)
└── /producto/[slug]
    └── (Ficha de producto)

/checkout
/admin (protegido con Supabase Auth)
├── /admin/productos
└── /admin/pedidos
```

---

## 6. Diseño Visual

### Identidad propuesta (abierta a ajustes del cliente)

| Elemento | Decisión |
|---|---|
| Tipografía display | Poppins (Bold 700) |
| Tipografía cuerpo | Poppins (Regular 400) |
| Color primario | `#0891B2` (Cyan 600) — Turquesa médico |
| Color secundario | `#164E63` (Cyan 950) — Azul marino profundo |
| Color acento | `#F0FDFA` (Cyan 50) — Fondos de secciones |
| Color alerta | `#EF4444` (Red 500) — Avisos legales |
| Fondo | `#FFFFFF` |
| Bordes | `rounded-2xl` — estilo amigable y moderno |

### Principios de UI

- Fondo blanco predominante, limpio y sin ruido visual.
- Botones de acción en turquesa sólido (`bg-cyan-600`).
- Tarjetas de producto con `rounded-2xl` y sombra suave (`shadow-sm`).
- Imágenes de productos sobre fondo blanco o gris muy claro (`bg-gray-50`).
- Botón flotante de WhatsApp fijo en la esquina inferior derecha.
- Mobile-first: diseñado primero para pantallas de 375px.

---

## 7. Funcionalidades del MVP

### 7.1 Catálogo Público

**Home (`/`)**
- Banner principal con CTA ("Ver productos" / "Agendar servicio").
- Sección de categorías con iconos (Farmacia, Nutrición, Accesorios, Servicios).
- Sección "Productos destacados" (selección manual desde el admin).
- Banner secundario con aviso de Recojo en Tienda.

**Listado de categoría**
- Grid de productos (2 columnas mobile, 3–4 desktop).
- Filtros por subcategoría (solo en Farmacia).
- Indicador de stock: "Disponible" / "Últimas unidades" / "Agotado".
- Tarjeta de producto: imagen, nombre, precio, botón "Agregar al carrito".

**Ficha de producto (`/producto/[slug]`)**
- Imagen principal.
- Nombre, precio en negrita.
- Descripción del producto.
- Recuadro de "Recomendación Médica" (gris claro, texto configurado por el admin): _"Ideal para mascotas de [condición/edad]"_.
- Aviso legal (si `aviso_legal = TRUE`): _"Consulte a su veterinario antes de administrar."_
- Si `requiere_receta = TRUE`: botón de "Adjuntar receta médica" que abre un input de archivo antes de poder agregar al carrito.
- Botón "Agregar al carrito".

### 7.2 Carrito

- Carrito persistente en `localStorage` (sin login requerido para el cliente).
- Resumen de ítems, cantidades y total.
- Botón para ir al Checkout.

### 7.3 Checkout (`/checkout`)

**Datos del cliente:**
- Nombre completo (requerido).
- Teléfono / WhatsApp (requerido).
- Notas adicionales (opcional).

**Método de entrega:**
- Solo "Recojo en local" (MVP). Mostrar dirección de la veterinaria.

**Método de pago:**
- Opciones: Yape / Plin / Efectivo en tienda.
- Si elige Yape o Plin: mostrar número de cuenta y monto a transferir. Input para subir captura de pantalla del pago (subida a Supabase Storage).
- Si elige Efectivo: instrucción de pagar al recoger.

**Si algún producto del carrito requiere receta:** mostrar input para subir la receta médica antes de confirmar el pedido.

**Confirmación:**
- Al confirmar, crear registro en tabla `pedidos` + `pedido_items` en Supabase.
- Mostrar pantalla de confirmación con número de pedido generado (ej. `PET-2026-001`).
- Instrucción: _"Te contactaremos por WhatsApp para confirmar tu pedido."_

### 7.4 Botón Flotante de WhatsApp

- Fijo en `bottom-6 right-6`, visible en todas las páginas públicas.
- Abre WhatsApp Web / App con mensaje predefinido: _"Hola! Tengo una consulta sobre un producto de PET CENTER."_
- Número de teléfono configurable en variable de entorno.

### 7.5 Página de Servicios (`/servicios`)

- Listado de servicios (Consulta veterinaria, Baño y corte, Vacunación, etc.).
- Precio referencial de cada servicio (opcional).
- Botón "Agendar por WhatsApp" que abre WhatsApp con mensaje predefinido.
- No hay sistema de agenda online en el MVP.

---

## 8. Panel de Administración (`/admin`)

Acceso protegido con Supabase Auth (email + contraseña). Solo un usuario administrador en el MVP.

### 8.1 Gestión de Productos (`/admin/productos`)

- Tabla con todos los productos: nombre, categoría, precio, stock, estado (activo/inactivo).
- Acción **Editar stock**: input numérico para actualizar el stock manualmente (actualización diaria).
- Acción **Editar producto**: formulario completo (nombre, precio, descripción, recomendación médica, aviso legal, requiere receta, imagen).
- Acción **Crear producto**: mismo formulario.
- Acción **Activar / Desactivar**: ocultar producto del catálogo sin eliminarlo.

### 8.2 Gestión de Pedidos (`/admin/pedidos`)

- Tabla de pedidos ordenados por fecha (más recientes primero).
- Columnas: N° pedido, cliente, teléfono, total, método de pago, estado, fecha.
- Al hacer clic en un pedido: ver detalle completo (ítems, comprobante de pago, receta si aplica).
- Cambiar estado del pedido: `pendiente → confirmado → listo → entregado`.
- Link directo a WhatsApp del cliente para contacto rápido.

---

## 9. Reglas de Negocio

1. **Medicamentos con aviso legal:** Todo producto con `aviso_legal = TRUE` debe mostrar el texto _"Consulte a su veterinario antes de administrar"_ en la ficha y en el resumen del carrito.

2. **Productos con receta:** Si `requiere_receta = TRUE`, el cliente no puede finalizar el checkout sin subir un archivo de receta. El admin verá el archivo antes de confirmar el pedido.

3. **Stock cero:** Un producto con `stock = 0` se muestra como "Agotado" y el botón "Agregar al carrito" se deshabilita. No se elimina del catálogo.

4. **Confirmación de pago manual:** El admin es responsable de verificar la captura de Yape/Plin antes de cambiar el estado del pedido a "confirmado". No hay validación automática.

5. **Numeración de pedidos:** Generada automáticamente en formato `PET-YYYY-NNN` (ej. PET-2026-001). Se incrementa por función de Supabase o trigger de PostgreSQL.

6. **Solo recojo en tienda:** No se gestiona delivery en el MVP. La dirección del local se muestra en el checkout y en el footer.

---

## 10. Variables de Entorno

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=51XXXXXXXXX

# Negocio
NEXT_PUBLIC_STORE_NAME=PET CENTER
NEXT_PUBLIC_STORE_ADDRESS=Av. ..., Tacna, Perú
NEXT_PUBLIC_STORE_PHONE=51XXXXXXXXX
```

---

## 11. Páginas y Rutas — Resumen

| Ruta | Tipo | Descripción |
|---|---|---|
| `/` | Pública | Home con banner y destacados |
| `/farmacia` | Pública | Catálogo con filtros |
| `/nutricion` | Pública | Catálogo por marca |
| `/accesorios` | Pública | Catálogo general |
| `/servicios` | Pública | Listado de servicios + CTA WhatsApp |
| `/producto/[slug]` | Pública | Ficha de producto |
| `/checkout` | Pública | Proceso de compra |
| `/checkout/confirmacion` | Pública | Confirmación de pedido |
| `/admin` | Protegida | Dashboard / resumen |
| `/admin/productos` | Protegida | Gestión de catálogo |
| `/admin/pedidos` | Protegida | Gestión de pedidos |
| `/admin/login` | Pública | Login del administrador |

---

## 12. Criterios de Aceptación del MVP

El MVP se considera completo cuando:

- [ ] Un cliente puede navegar el catálogo completo desde mobile sin crear cuenta.
- [ ] Un cliente puede agregar productos al carrito y completar el checkout con Yape/Plin.
- [ ] Un cliente puede subir su comprobante de pago y receta médica (si aplica).
- [ ] El cliente recibe un número de pedido al confirmar.
- [ ] El admin puede ver todos los pedidos y cambiar su estado.
- [ ] El admin puede editar stock de cualquier producto en menos de 30 segundos.
- [ ] El botón de WhatsApp es visible en todas las páginas.
- [ ] Los productos con aviso legal muestran el disclaimer correctamente.
- [ ] El sitio carga en menos de 3 segundos en mobile con conexión 4G.
- [ ] La URL está desplegada en Vercel con dominio personalizado (o subdominio de Vercel para el MVP).

---

## 13. Fuera del Alcance del MVP (Roadmap Futuro)

- Sistema de delivery con cálculo de costo por zona.
- Pasarela de pago automatizada (Culqi, MercadoPago).
- Sistema de agenda online para servicios.
- Programa de suscripción para alimentos (compra recurrente).
- Blog de salud animal (SEO local).
- Sistema de cupones o descuentos.
- Perfil de cliente con historial de pedidos.
- Notificaciones por email o SMS.
- Integración con Instagram Shopping.

---

## 14. Dependencias y Tiempo Estimado

| Fase | Tarea | Estimado |
|---|---|---|
| Setup | Proyecto Next.js + Supabase + Vercel | 0.5 día |
| DB | Esquema SQL + RLS en Supabase | 0.5 día |
| UI base | Design system: colores, tipografía, componentes base | 1 día |
| Catálogo | Home + listados + ficha de producto | 2 días |
| Checkout | Carrito + formulario + subida de archivos | 2 días |
| Admin | Login + gestión de productos + pedidos | 2 días |
| QA + Deploy | Pruebas en mobile + deploy Vercel | 1 día |
| **Total estimado** | | **~9 días hábiles** |

---

*PRD preparado para desarrollo en Visual Studio Code con Next.js 14, Supabase y Tailwind CSS.*
