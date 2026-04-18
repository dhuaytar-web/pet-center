# Revision de Modulos - PET CENTER
Fecha: 2026-03-20

## 1) Estado real detectado en el repo

Archivos implementados actualmente:
- `app/globals.css` (base limpia y variables iniciales)
- `app/layout.tsx` (Poppins + metadata + shell publico con Navbar/Footer/WhatsApp)
- `app/page.tsx` (Home de negocio implementado)
- `app/farmacia/page.tsx`
- `app/nutricion/page.tsx`
- `app/accesorios/page.tsx`
- `app/servicios/page.tsx`
- `app/producto/[slug]/page.tsx`
- `app/carrito/page.tsx` (placeholder funcional)
- `components/store/Navbar.tsx`
- `components/store/Footer.tsx`
- `components/store/WhatsAppButton.tsx`
- `components/store/ProductCard.tsx`
- `components/store/Filtros.tsx`
- `lib/store-products.ts` (consulta Supabase + paginacion)
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/types.ts` (ya ajustado a `disponible: boolean`, sin receta/comprobante)

No existen aun:
- Pruebas end-to-end mobile documentadas
- Configuracion final de Vercel y deploy productivo

## 2) Lo que esta bien de tu lista

La estructura general por fases es correcta:
- Base UI -> Catalogo -> Carrito/Checkout -> Admin -> Deploy
- Separacion entre componentes store/admin
- Flujo completo desde cliente hasta panel admin

## 3) Cambios obligatorios (alineados a tus decisiones)

Debes eliminar o reemplazar estos puntos de tu lista original:

1. Eliminar todo lo de recetas:
- Quitar `requiere_receta` en producto
- Quitar input de receta en producto/checkout
- Quitar validaciones de receta en pruebas

2. Eliminar todo lo de comprobantes:
- Quitar subida de captura Yape/Plin en checkout
- Quitar `app/api/upload/route.ts` para comprobantes
- Quitar visualizacion de comprobante en admin/pedidos

3. Cambiar stock numerico por disponibilidad:
- Reemplazar `stock` por `disponible` (toggle)
- Reemplazar "stock = 0" por "disponible = false"
- En admin: accion rapida Disponible <-> Agotado

4. Ajustar version objetivo:
- Tu proyecto corre en `Next 16`, no en 14
- Mantener Next 16 (recomendado), no es necesario downgrade

## 4) Backlog revisado (MVP correcto)

## Fase A - Base UI y layout
- [x] Limpiar `app/globals.css` y variables base
- [x] Configurar `app/layout.tsx` con Poppins y metadata
- [x] Crear `components/store/Navbar.tsx`
- [x] Crear `components/store/Footer.tsx`
- [x] Crear `components/store/WhatsAppButton.tsx`
- [x] Reemplazar `app/page.tsx` por Home real (banner, categorias, destacados, recojo)

## Fase B - Catalogo
- [x] Crear `components/store/ProductCard.tsx`
- [x] Crear `components/store/Filtros.tsx`
- [x] Crear `app/farmacia/page.tsx` (filtros subcategoria + paginacion + busqueda)
- [x] Crear `app/nutricion/page.tsx` (filtro marca + paginacion + busqueda)
- [x] Crear `app/accesorios/page.tsx` (paginacion + busqueda)
- [x] Crear `app/producto/[slug]/page.tsx` (sin receta)
- [x] Mostrar badge "Agotado" y deshabilitar boton cuando `disponible = false`

## Fase C - Carrito y checkout (sin archivos)
- [x] Crear `lib/CartContext.tsx` con `useReducer`
- [x] Envolver `app/layout.tsx` con `CartProvider`
- [x] Actualizar contador de carrito en Navbar
- [x] Crear `components/store/CartDrawer.tsx` o `/carrito`
- [x] Persistir carrito en `localStorage`
- [x] Crear `app/checkout/page.tsx` (nombre, telefono, notas)
- [x] Metodo pago: Yape / Plin / Efectivo
- [x] Mostrar numero Yape/Plin (sin upload)
- [x] Crear `app/api/pedidos/route.ts` (guardar pedido + items)
- [x] Crear `app/checkout/confirmacion/page.tsx`
- [x] Limpiar carrito tras confirmar

## Fase D - Admin
- [x] Crear `app/admin/login/page.tsx` (Supabase Auth)
- [x] Crear `proxy.ts` para proteger `/admin/*` (Next 16)
- [x] Crear `app/admin/layout.tsx` con sidebar
- [x] Crear `app/admin/productos/page.tsx` (tabla + disponibilidad)
- [x] Crear `app/admin/productos/[id]/page.tsx` (crear/editar producto)
- [x] Crear `app/admin/pedidos/page.tsx` (tabla)
- [x] Crear `app/admin/pedidos/[id]/page.tsx` (detalle + cambio estado + link WhatsApp)

## Fase E - Servicios, QA y deploy
- [x] Crear `app/servicios/page.tsx`
- [x] Boton "Agendar por WhatsApp" por servicio
- [ ] Prueba mobile end-to-end: catalogo -> carrito -> checkout -> confirmacion
- [ ] Verificar avisos legales
- [x] Preparar `.env.example` con variables requeridas
- [ ] Configurar env vars en Vercel
- [ ] Deploy y validacion en produccion
- [ ] Entregar URL de Vercel (y dominio opcional)

## 5) Mejoras recomendadas (alta prioridad)

1. Busqueda y paginacion desde el inicio:
- Debounce 300ms
- 8 productos por pagina
- URL con query params (`?page=2&q=proplan`)

2. Imagen por defecto:
- [x] Definir placeholder en `public/images/placeholder.svg`
- [x] Si `imagen_url` es null, usar placeholder

3. UX de agotado:
- Mantener ficha visible
- Boton deshabilitado con texto "Agotado"

4. SEO local minimo:
- [x] Metadata por ruta (producto)
- [x] JSON-LD LocalBusiness y Product
- [x] `sitemap.xml` + `robots.txt`

## 6) Conclusión

Tu plan esta bien armado, pero tenia 3 bloques que deben salir del MVP actual: recetas, comprobantes y stock numerico.
Con ese ajuste, el proyecto queda mas simple, mas rapido de desarrollar y 100% alineado a lo que tu cliente necesita.

Actualizacion de avance:
- Fase A completada.
- Fase B completada (catalogo base funcional con paginacion y busqueda por query).
- Fase C completada (carrito + checkout + API pedidos).
- Fase D completada (admin + auth + proteccion + APIs admin).
- SEO local minimo y placeholder de imagen completados.
- Notificaciones best-effort implementadas (Twilio WhatsApp + fallback email).

## 7) QA movil (ejecucion manual)

Checklist rapido para validar MVP antes de deploy:

1. Catalogo
- [ ] Home carga sin saltos visuales en 375px
- [ ] Navegacion movil funciona (`Inicio/Farmacia/Nutricion/Accesorios/Servicios`)
- [ ] Paginacion cambia correctamente por URL en categorias
- [ ] Producto agotado muestra boton deshabilitado

2. Carrito
- [ ] Agregar producto desde card y desde ficha
- [ ] Contador de carrito en navbar se actualiza
- [ ] Cambiar cantidad recalcula subtotal
- [ ] Aviso legal aparece en item de carrito cuando aplica

3. Checkout
- [ ] Validacion obliga nombre y telefono
- [ ] Metodo pago Yape/Plin/Efectivo cambia mensaje contextual
- [ ] Confirmar pedido redirige a `/checkout/confirmacion`
- [ ] Carrito se limpia luego de confirmar
- [ ] Aviso legal aparece en resumen de checkout cuando aplica

4. Admin
- [ ] `/admin` redirige a login sin sesion
- [ ] Login admin ingresa correctamente
- [ ] Crear/editar producto guarda cambios
- [ ] Cambio de estado de pedido persiste

5. SEO/tecnico
- [ ] `/robots.txt` responde
- [ ] `/sitemap.xml` responde
- [ ] `npm run lint` y `npm run build` en verde

## 8) Deploy Vercel (pasos)

1. Subir repo a GitHub.
2. En Vercel: New Project -> importar repo.
3. En `Project Settings > Environment Variables`, copiar valores de `.env.example`.
4. Variables minimas obligatorias para funcionar:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
5. Variables opcionales para notificaciones:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM`
- `SENDGRID_API_KEY`
6. Deploy production.
7. Validar rutas criticas: `/`, `/farmacia`, `/checkout`, `/admin/login`.
8. Entregar URL final (y dominio custom si aplica).
