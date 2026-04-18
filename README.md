## PET CENTER MVP

E-commerce veterinario local (Tacna) construido con Next.js + Supabase.

Estado actual:
- Catalogo publico completo
- Carrito y checkout funcional
- Panel admin con login y gestion de productos/pedidos
- SEO minimo (`/robots.txt`, `/sitemap.xml`)
- Notificaciones WhatsApp/Email (best-effort)

## Requisitos

- Node.js 20+
- Proyecto Supabase con tablas `productos`, `pedidos`, `pedido_items`

## Variables de entorno

1. Copia `.env.example` como `.env.local`.
2. Completa las claves.

Variables criticas:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Opcionales para notificaciones:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM`
- `SENDGRID_API_KEY`

## Desarrollo local

Ejecuta:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Abre `http://localhost:3000` en el navegador.

Rutas principales:
- `/` home
- `/farmacia`, `/nutricion`, `/accesorios`
- `/carrito`, `/checkout`
- `/admin/login`, `/admin`

## Build de produccion

```bash
npm run build
```

## Deploy

Deploy recomendado: Vercel.

Configura primero las mismas variables de `.env.local` en Vercel Project Settings.

## Nota sobre notificaciones

Si Twilio/Sendgrid no estan configurados, el flujo de pedidos sigue funcionando.
Las notificaciones se envian en modo best-effort y no bloquean la compra.
