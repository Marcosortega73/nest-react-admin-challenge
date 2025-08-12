# Changelog

All notable changes to this project will be documented in this file.

This project follows [Conventional Commits](https://www.conventionalcommits.org/) and [Semantic Versioning](https://semver.org/).

---

## [1.0.0] - 2025-08-12

### Added

**feat: implement course modules domain**
- Add CourseModule entity with positioning and soft delete
- Add CRUD operations with reordering and publish/unpublish
- Add unique constraints for courseId + position

**feat: implement course lessons domain**  
- Add CourseLesson entity with lesson types (VIDEO, PDF, TEXT, LINK)
- Add conditional validation based on lesson type
- Add nested routes under modules

**feat: implement course resources domain**
- Migrate Content to CourseResources with enhanced metadata
- Add ResourceType enum (VIDEO, PDF, DOCUMENT, etc.)
- Add download counter and active/inactive states
- Add filtering by resource type

**feat: add advanced course filtering**
- Add role-based filters: all, my-courses, published, draft
- Add unified search across course name and description
- Add security logic: users only see published courses with content

**feat: redesign dashboard**
- Add modern UI with gradient cards and skeleton loading
- Add new metrics: Active Enrollments, Published Courses
- Add responsive mobile-first design

**feat: add course view page**
- Add tabbed interface: Content, Members, Settings, Analytics
- Add navigation from course cards
- Add dynamic lesson icons by type

### Changed

**refactor: move seed logic & enhance validation**
- Move hardcoded seed creation from `main.ts` to `database/seeds/seed.service` with `SEED_ON_BOOT` env toggle.
- Enhance global `ValidationPipe` with `whitelist`, `forbidNonWhitelisted`, and `transform`.
- Use `ConfigService` for `PORT` and env variable loading.

**refactor: modernize TypeORM syntax**
- Update `findOne(id)` to `findOne({ where: { id } })`
- Update `delete(object)` to `remove()` or `delete(id)`
- Update `update(object, data)` to `update(id, data)`

**refactor: migrate to React Router v6**
- Replace Switch with Routes, component with element
- Replace useHistory with useNavigate
- Rewrite route components for v6 API

**perf: optimize React Query usage**
- Remove unnecessary `refetchInterval: 1000` (99.7% reduction in requests)
- Add manual cache invalidation after mutations
- Optimize authenticated user context usage

**refactor: enhance TypeORM configuration**
- Migrate from ormconfig.js to enterprise AppModule configuration
- Add environment variable validation with class-validator
- Add dedicated database module with typed configuration

### Security

**fix: improve JWT authentication security**
- Remove sensitive fields from login response (password, refresh tokens)
- Add robust logout with authentication validation
- Configure secure cookies (httpOnly, secure, sameSite)

**feat: enhance role-based authorization**
- Add JwtGuard and RolesGuard protection
- Add @Roles() decorator for granular access control
- Add backend security logic for filtering

### Fixed

**fix: resolve TypeORM driver undefined error**
- Fix database configuration loading
- Add proper environment variable handling

**fix: correct React Router v6 wrapper components**
- Fix "not a Route component" error
- Convert to proper wrapper pattern

**fix: update web-vitals deprecated API**
- Replace `onFID` with `onINP` for v5.1.0 compatibility

**fix: resolve TypeScript compatibility issues**
- Add index signature to CourseQuery interface
- Fix UserQuery role type to use Role enum

**fix: clean compiled files causing phantom tables**
- Remove obsolete .js files from dist/ directory
- Prevent TypeORM from reading old entity files

### Removed

**refactor: remove Content domain**
- Delete content entity, service, controller, and tests
- Remove references from Course entity and Stats service
- Migrate functionality to CourseResources

### Database

**feat: add new database tables**
- `course_modules` with positioning and soft delete
- `course_lessons` with lesson types and validation
- `course_resources` with enhanced metadata

**feat: add database constraints and indexes**
- `uq_course_module_position`: unique courseId + position
- `uq_course_lesson_position`: unique moduleId + position
- Add performance indexes for course and module queries

### Testing

**test: add comprehensive unit test coverage**
- Add 100% test coverage for new domains
- Add repository and service mocks
- Add edge case validation tests

**fix: update existing test suites**
- Fix TypeORM syntax in existing tests
- Add DataSource.transaction mocks
- Update repository method expectations

---

## [0.0.2] - 2025-08-10

### Changed

**chore: improve ESLint configuration**
- Add ormconfig.js to ignorePatterns
- Fix TypeScript parser conflicts with JS files

**style: enhance Prettier configuration**
- Set printWidth to 120 characters
- Add singleAttributePerLine rule
- Configure arrowParens to avoid

---

## [0.0.1] - 2025-08-08

### CORE

**feat: implement JWT authentication system**
- Add access token (15 min) and refresh token (1 year) 
- Add httpOnly cookie for refresh token
- Add default admin user (admin/admin123)

**feat: implement role-based authorization**
- Add Admin, Editor, User roles with different permissions
- Add JwtGuard and RolesGuard
- Add role-based CRUD restrictions

**feat: create core domain entities**
- Add User management with roles
- Add Course management system
- Add Content management for courses

**feat: build React frontend**
- Add dashboard with basic statistics
- Add CRUD pages for Users, Courses, Contents
- Add authentication context and routing
- Add responsive design with Tailwind CSS

**feat: setup NestJS backend**
- Add REST API with Swagger documentation
- Add TypeORM with PostgreSQL integration
- Add input validation with class-validator
- Add comprehensive error handling

**feat: add Docker support**
- Add docker-compose.yml for development
- Add PostgreSQL containerization
- Add environment variable configuration

**test: implement testing framework**
- Add Jest unit tests for services and controllers
- Add Postman collection for E2E API testing
- Add repository mocks and test utilities
