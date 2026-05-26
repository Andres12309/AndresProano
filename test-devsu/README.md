# BANCO — CRUD de productos financieros (React - NextJs)

Aplicacion web para gestionar productos financieros (listar, buscar, paginar, crear, editar y eliminar).

**Stack:** React 19, Next.js 16.

## Requisitos previos

- Node.js 20 o superior
- npm 10 o superior
- API REST del reto corriendo en el puerto **3002** (prefijo `/bp`)

## Instalacion

```bash
npm install
```

## Variables de entorno

Crear el archivo `.env.development` en la raiz del proyecto:

```env
NEXT_PUBLIC_API_BASE=http://localhost:3002/bp
```

## Instrucciones de ejecucion

1. Levantar la API del reto en `http://localhost:3002`.
2. En este proyecto:

```bash
npm run dev
```

3. Abrir en el navegador: [http://localhost:3000](http://localhost:3000)

## Funcionalidades

- Listado de productos con logo, nombre, descripcion y fechas
- Busqueda por texto
- Paginacion (5, 10 o 20 registros por pagina)
- Formulario de registro con validaciones (ID, nombre minimo 6 caracteres, fechas)
- Edicion de producto existente
- Eliminacion con modal de confirmacion
- Estados de carga (skeleton) y mensajes de error

## Estructura del proyecto

```
src/
├── domain/           Modelos y contratos (ProductRepository)
├── application/      Esquema Zod, casos de uso, Result<T>
├── infrastructure/   Cliente API (axios)
├── presentation/     Componentes, hooks, layout, UI compartida
└── pages/            Rutas (/, /products/new, /products/:id/edit)
```

## Pruebas unitarias

Ejecutar todos los tests:

```bash
npm test
npm run test:coverage
```

Los archivos de prueba usan el sufijo `.test.ts` / `.test.tsx` junto al codigo fuente.

## Rutas de la aplicacion

| Ruta | Descripcion |
|------|-------------|
| `/` | Listado de productos |
| `/products/new` | Crear producto |
| `/products/:id/edit` | Editar producto |

## Endpoints consumidos

| Metodo | Ruta |
|--------|------|
| GET | `/products` |
| GET | `/products/:id` |
| GET | `/products/verification/:id` |
| POST | `/products` |
| PUT | `/products/:id` |
| DELETE | `/products/:id` |