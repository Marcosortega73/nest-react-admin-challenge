# Challenge Urbano – React · NestJS · Docker

## Punto de partida y análisis inicial

**Estado inicial**
- Proyecto con dependencias obsoletas y sin mantenimiento.
- Build roto en Node ≥18.
- Docker incompleto: sin healthchecks, redes mezcladas, secretos expuestos en `docker-compose.yml`.
- Frontend con CRA, PostCSS7-compat, React Router v5, errores de tipos y ESLint.
- Backend NestJS con TypeORM sin validación de variables de entorno y problemas de arranque de base de datos.
- Lógica UI acoplada, sin componentes reutilizables.

---

## Fase 1 – Estabilización de dependencias y entorno

- Actualización de dependencias para compatibilidad con Node 20:
  - `react-scripts@^5` + Webpack 5.
  - PostCSS 8 + Tailwind 3.
  - ESLint + eslint-config-prettier.
  - `bcrypt` actualizado por incompatibilidades de compilación.
- Separación de `dependencies` y `devDependencies` en `package.json`.
- Configuración `"engines": { "node": ">=20" }`.
- `.env` agregado a `.gitignore` para proteger credenciales.
- Variables sensibles (`POSTGRES_*`, JWT, etc.) movidas de Docker Compose a archivos `.env`.

---

## Fase 2 – Corrección de errores críticos

- **React Query**: eliminación de refetch automático cada segundo, uso de invalidación manual.
- **Auth/Refresh token**: flujo robusto para evitar expiraciones no controladas.
- **Estilos**: eliminación de estilos globales innecesarios; configuración de variables de marca en Tailwind.
- **Router**: migración a `AppRouter` centralizado con wrappers (`PrivateWrapper`, `AuthWrapper`).
- **Componentización**: extracción de modales, inputs y botones a componentes reutilizables.
- **Backend DB**:
  - Módulo `database` con `@nestjs/config` y `class-validator`.
  - Eliminación de `ormconfig.js`.
  - Validación de variables de entorno y arranque ordenado con Postgres.
- **Docker Compose**:
  - Versión 3.8 para compatibilidad con sintaxis actual.
  - Variables de entorno movidas a `backend/.env` (antes expuestas en el YAML).
  - Volumen `postgres_data_challenge` para persistir datos de la base.
  - Redes separadas (`frontend_net`, `backend_net`) para aislar servicios y limitar acceso de la DB.
  - Healthcheck en Postgres con `pg_isready` y `depends_on` con condición de salud para backend.
  - Eliminados `container_name` para evitar conflictos en despliegues múltiples o CI/CD.
- **Dockerfile backend – Cambios clave**:
  - Multi-stage build con `node:20-alpine` para compatibilidad y menor tamaño.
  - Instalación de toolchain (`python3`, `make`, `g++`) para compilar dependencias nativas como `bcrypt`.
  - Orden de copiado optimizado (`package.json`/`yarn.lock` antes que el código) para aprovechar cache.
  - Uso de `yarn install --frozen-lockfile` y limpieza de cache para builds reproducibles y más livianos.
  - Ejecución como usuario `node` y arranque directo con `node dist/main`, eliminando dependencia de Yarn en producción.
  - Eliminado `ormconfig.js` y movedo configuración a variables de entorno validadas.
- **Dockerfile frontend**:
  - Multi-stage build con `node:20-alpine` y `nginx:alpine` para compatibilidad y menor tamaño.
  - Instalación de dependencias con cache (`yarn install --frozen-lockfile`) copiando primero `package.json` y `yarn.lock`.
  - Solo se copian los archivos de `build` al runtime, evitando código fuente y `node_modules`.
  - Uso de la ruta estándar `/usr/share/nginx/html` en Nginx para servir el frontend.
- **nginx.conf – Cambios clave**:
  - Optimizado con `gzip`, caché larga para assets y control específico de `index.html`.  
  - Proxy `/api/` mejorado con headers, timeouts y soporte WebSockets.  
  - Uso de `upstream` y `root` estándar `/usr/share/nginx/html` para mejor rendimiento y compatibilidad.  
  - Manejo correcto de rutas SPA con `try_files`.
- **Seed**: removido del `main.ts` y movido a `database/seeds/seed.service`, ejecutado solo si `SEED_ON_BOOT=true`.  
- **Validación**: configuración reforzada del `ValidationPipe` global (`whitelist`, `forbidNonWhitelisted`, `transform`) para mayor seguridad y consistencia de datos.

---

## Fase 3 – Implementación de mejoras críticas (MVP)

### Por qué se decidió esta mejora
El dominio de **Cursos, Módulos y Lecciones** no existía de forma completa y era una de las piezas clave para que el producto tuviera valor real.  
Implementarlo permitía:
- Dar estructura académica real al sistema (jerarquía: curso → módulos → lecciones).
- Generar una base escalable para agregar funcionalidades futuras como subida de recursos, evaluaciones, seguimiento de progreso o certificaciones.
- Ofrecer un flujo de inscripción controlado y validado, mejorando la experiencia del usuario.
- Demostrar que el sistema podía evolucionar de un simple gestor a una plataforma de aprendizaje más completa.

### Dominio de Cursos, Módulos y Lecciones
- **Course**: título, descripción, estado (publicado/no publicado).
- **Module**: asociado a un curso, título, orden configurable.
- **Lesson**: asociada a un módulo, tipo (`video`, `pdf`, `link`, `quiz`), orden y contenido.

**Funcionalidades**
- CRUD completo para cursos, módulos y lecciones.
- Reordenamiento dinámico de módulos y lecciones.
- Validaciones de negocio (no agregar lecciones a cursos no publicados).
- Arquitectura escalable para futuras funcionalidades como:
  - Subida de contenidos y recursos adicionales.
  - Extensión de tipos de lecciones.
  - Gestión avanzada de usuarios y roles.

### Vista de Cursos e Inscripciones
- Página de cursos con listado y acceso a detalles.
- Vista de curso con módulos y lecciones ordenadas.
- Inscripción de usuarios:
  - Endpoint `POST /courses/:courseId/enroll`.
  - Idempotente: no duplica inscripciones.
  - Validación: solo cursos publicados aceptan inscripciones.
  - Requiere JWT.
- Actualización de la vista después de la inscripción sin recarga completa.

---

## Propuestas de mejora tecnológica (futuro)
**Frontend**
- Evaluar migración a **Vite** para mejorar tiempos de build.
- Actualización y limpieza continua de dependencias.
- Migrar todos los módulos a arquitectura **FSD** (Feature-Sliced Design) hasta lograr una arquitectura escalable y mantenible parecida a clean architecture.
- Refactor de módulos legacy para unificar patrones.

**Backend**
- **Swagger/OpenAPI**: actualizar la documentación de endpoints con ejemplos y esquemas.
- Mejoras de seguridad backend: `helmet`, rate limiting y CSP.
- Paginación: implementar paginación en todos los módulos y listados para mejorar rendimiento y UX.
- Seeds/Migraciones por CLI: nest-commander con comandos seed run/reset y factories con faker.
- Seguridad extra: helmet + CSP, throttling por IP/ruta, rotación de JWT/COOKIE_SECRET.
- Subida de archivos: S3 con presigned URLs, validación de MIME y antivirus opcional.

---

## Estado actual

- Proyecto estable y funcional en Node 20.
- Contenedores Docker con redes separadas, healthchecks y persistencia de datos.
- MVP implementado con cursos, módulos, lecciones e inscripciones.
- Base lista para continuar con refactors, subida de recursos y mejoras de escalabilidad.

---

## Conclusión  

El proyecto pasó de un estado obsoleto y con errores críticos a una base estable, segura y lista para escalar.  
Se corrigieron problemas estructurales en Docker, backend y frontend, se modernizaron dependencias y se incorporó una funcionalidad clave (cursos con módulos y lecciones).  
Aunque queda trabajo de refactor y mejoras pendientes, la arquitectura actual permite seguir creciendo de forma ordenada y segura.  
