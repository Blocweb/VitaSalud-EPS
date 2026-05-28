## Documentación técnica (formato académico) — VitaSalud EPS

### 1) Información general

- **Proyecto**: VitaSalud EPS (Dashboard y API hospitalaria)
- **Arquitectura**: SPA (React + Vite) + API REST (Express + TypeScript) + PostgreSQL
- **Propósito**: gestionar usuarios/roles, pacientes, médicos, citas, historia clínica, recetas y administración del sistema.

### 2) Tecnologías utilizadas

- **Frontend**: React 18, React Router, Vite, TailwindCSS (componentes UI tipo shadcn/radix), Recharts.
- **Backend**: Node.js, Express, TypeScript, PostgreSQL (`pg`), autenticación JWT, `bcryptjs` para contraseñas, `nodemailer` para correos.
- **Persistencia**: PostgreSQL.

### 3) Diseño de solución (módulos principales)

#### 3.1 Frontend (SPA)

- **Autenticación**:
  - Login y registro.
  - Recuperación de contraseña por OTP (6 dígitos).
- **Panel por roles**:
  - `patient`: dashboard clínico simplificado (sin gráficas administrativas).
  - `doctor`: agenda, recetas filtradas por médico, acceso a historia clínica.
  - `admin`: Panel Administrativo (creación de médicos + configuración de correo).

#### 3.2 Backend (API REST)

- **Rutas por recurso**: `auth`, `users`, `patients`, `doctors`, `departments`, `appointments`, `medical-records`, `prescriptions`, etc.
- **Autorización**: middleware RBAC por rol.
- **Seguridad**:
  - Contraseñas hasheadas con `bcryptjs`.
  - JWT para sesión.
  - Recuperación: OTP se guarda como hash SHA-256 y expira.

### 4) Implementación clave: Recuperación de contraseña

#### 4.1 Envío de código (OTP)

- **Endpoint**: `POST /api/v1/auth/forgot-password`
- **Entrada**: `email`
- **Salida**: respuesta neutra (no revela si el correo existe).
- **Persistencia** (tabla `users`):
  - `reset_password_token`: hash SHA-256 del OTP
  - `reset_password_expires`: timestamp con \(now + 10\) minutos
- **Envío**: correo HTML mediante SMTP (config BD o `.env`).

#### 4.2 Restablecimiento

- **Endpoint**: `POST /api/v1/auth/reset-password`
- **Entrada**: `email`, `code`, `new_password`
- **Validación**:
  - OTP debe ser de 6 dígitos
  - No vencido (10 minutos)
  - Hash coincide
- **Efecto**:
  - Actualiza `password_hash`
  - Limpia token/expiración

### 5) Implementación clave: SMTP persistente

#### 5.1 Persistencia en BD

- **Tabla**: `email_settings` (creación automática `CREATE TABLE IF NOT EXISTS`)
- **Campos**: `host`, `port`, `secure`, `username`, `password`, `from_email`, `updated_at`, etc.

#### 5.2 Endpoints de configuración

- `GET /api/v1/settings/email` (admin) → lee config (sin exponer contraseña)
- `PUT /api/v1/settings/email` (admin) → guarda/actualiza config persistente
- `POST /api/v1/settings/email/test` (admin) → envía correo de prueba

> Nota: el envío real de recuperación de contraseña usa `sendEmail()` que prioriza BD, luego `.env`.

### 6) Implementación clave: Gestión de médicos

#### 6.1 Creación de médico (admin)

- **Endpoint**: `POST /api/v1/doctors`
- **Operación transaccional**:
  - Inserta en `users` con rol `doctor`
  - Inserta en `doctors` con `license_number`, `specialization`, `department_id`, etc.

### 7) Rutas relevantes (resumen)

- **Auth**:
  - `POST /auth/login`
  - `POST /auth/register`
  - `POST /auth/forgot-password`
  - `POST /auth/reset-password`
  - `GET /auth/verify`
- **Settings (admin)**:
  - `GET /settings/email`
  - `PUT /settings/email`
  - `POST /settings/email/test`
- **Doctors**:
  - `GET /doctors`
  - `POST /doctors` (admin)

### 8) Requisitos de ejecución

#### 8.1 Backend

- Crear `.env` con al menos:
  - `DB_PASSWORD`, `JWT_SECRET`
  - (Opcional si usas BD para SMTP): `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `SMTP_SECURE`
- Comandos:
  - `npm install`
  - `npm run dev`

#### 8.2 Frontend

- (Opcional) `VITE_API_URL=http://localhost:5000/api/v1`
- Comandos:
  - `npm install`
  - `npm run dev`

### 9) Pruebas manuales sugeridas (checklist)

- Login admin → Panel Admin → guardar SMTP → enviar prueba.
- Recuperar contraseña → recibir OTP → cambiar contraseña → login con nueva contraseña.
- Admin → crear médico → login como médico → ver recetas filtradas por médico.

