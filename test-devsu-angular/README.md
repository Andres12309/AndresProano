# BANCO — CRUD de productos financieros (Angular)

Aplicacion web para gestionar productos financieros (listar, buscar, paginar, crear, editar y eliminar).

**Stack:** Angular 21.

## Requisitos previos

- Node.js 20 o superior
- npm 10 o superior
- API REST del reto corriendo en el puerto **3002** (prefijo `/bp`)

## Instalacion

```bash
npm install
```

## Configuracion de la API

La base URL del cliente HTTP esta en `src/environments/environment.ts`:

```typescript
export const environment = {
  apiBase: 'http://localhost:3002/bp',
};
```

## Instrucciones de ejecucion

1. Levantar la API del reto en `http://localhost:3002`.
2. En este proyecto:

```bash
npm start
```

Equivalente a `ng serve`. La app queda en [http://localhost:4200](http://localhost:4200).

## Funcionalidades

- Listado de productos con logo, nombre, descripcion y fechas
- Busqueda por texto
- Paginacion (5, 10 o 20 registros por pagina)
- Formulario de registro con validaciones (ID, nombre minimo 6 caracteres, fechas)
- Edicion de producto existente
- Eliminacion con modal de confirmacion
- Estados de carga (skeleton) y mensajes de error en formulario

## Estructura del proyecto

```
src/
├── domain/           Modelos y contratos (ProductRepository)
├── application/      Casos de uso, validadores, Result<T>
├── infrastructure/   Cliente API (axios)
├── presentation/     Componentes, servicios, layout, UI compartida
├── app/              Bootstrap, rutas, configuracion DI
└── environments/     Configuracion de entorno
```

Arquitectura detallada: [ARCHITECTURE.md](./ARCHITECTURE.md).

## Pruebas unitarias

Ejecutar todos los tests:

```bash
npm test
```

```bash
npm test
npm run test:coverage
```

Equivalente manual:

```bash
npx ng test --watch=false --coverage
```

### Archivos de prueba

| Archivo | Capa |
|---------|------|
| `src/domain/dates.spec.ts` | Dominio |
| `src/application/result.spec.ts` | Aplicacion |
| `src/application/product.validators.spec.ts` | Validaciones |
| `src/application/product.use-cases.spec.ts` | Casos de uso |
| `src/infrastructure/product.api.spec.ts` | API (axios) |
| `src/presentation/services/product-list.service.spec.ts` | Estado del listado |
| `src/presentation/shared/ui/input-field/input-field.component.spec.ts` | Componente UI |
| `src/app/app.spec.ts` | Bootstrap |

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
