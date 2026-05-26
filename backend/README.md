# Hospital Data Management Backend

Backend API para el Dashboard de Gestión de Datos del Hospital.

## 🚀 Características

- ✅ Autenticación JWT
- ✅ Control de acceso basado en roles (RBAC)
- ✅ Gestión de pacientes
- ✅ Gestión de citas médicas
- ✅ Historiales médicos
- ✅ Gestión de recetas
- ✅ Inventario de medicamentos
- ✅ Exámenes de laboratorio
- ✅ Facturación
- ✅ Gestión de habitaciones
- ✅ Gestión de departamentos
- ✅ Gestión de usuarios

## 📋 Requisitos Previos

- Node.js 16+
- PostgreSQL 12+
- npm o yarn

## 🔧 Instalación

1. **Instalar dependencias**

```bash
cd backend
npm install
```

2. **Configurar variables de entorno**

Copiar `.env.example` a `.env` y actualizar con tus credenciales:

```bash
cp .env.example .env
```

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/vitasalud
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=vitasalud
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

3. **Crear la base de datos**

```bash
createdb -U postgres vitasalud
```

4. **Ejecutar el script SQL**

```bash
psql -U postgres -d vitasalud -f database.sql
```

## 🏃 Ejecución

### Modo Desarrollo

```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:5000`

### Modo Producción

```bash
npm run build
npm start
```

## 📚 Documentación de la API

### Autenticación

#### Login

```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@hospital.com",
  "password": "Admin123!"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "email": "admin@hospital.com",
    "first_name": "Juan",
    "last_name": "Administrador",
    "role": "admin"
  }
}
```

#### Registrarse

```
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "patient@example.com",
  "password": "SecurePassword123!",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+573001234567"
}
```

#### Verificar Token

```
GET /api/v1/auth/verify
Authorization: Bearer {token}
```

### Pacientes

#### Listar Pacientes

```
GET /api/v1/patients
Authorization: Bearer {token}
```

#### Obtener Paciente por ID

```
GET /api/v1/patients/{id}
Authorization: Bearer {token}
```

#### Crear Paciente

```
POST /api/v1/patients
Authorization: Bearer {token}
Content-Type: application/json

{
  "first_name": "Sofía",
  "last_name": "Hernández",
  "date_of_birth": "1985-03-15",
  "gender": "female",
  "blood_type": "O+",
  "phone": "+573201234567",
  "email": "sofia@example.com",
  "address": "Calle 10 #20-30",
  "city": "Medellín",
  "state": "Antioquia",
  "insurance_provider": "Sura EPS"
}
```

#### Actualizar Paciente

```
PUT /api/v1/patients/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "phone": "+573201234567",
  "email": "updated@example.com",
  "insurance_provider": "Nueva EPS"
}
```

### Citas Médicas

#### Listar Citas

```
GET /api/v1/appointments
Authorization: Bearer {token}
```

#### Citas por Paciente

```
GET /api/v1/appointments/patient/{patientId}
Authorization: Bearer {token}
```

#### Citas por Doctor

```
GET /api/v1/appointments/doctor/{doctorId}
Authorization: Bearer {token}
```

#### Crear Cita

```
POST /api/v1/appointments
Authorization: Bearer {token}
Content-Type: application/json

{
  "patient_id": "uuid",
  "doctor_id": "uuid",
  "room_id": 1,
  "appointment_date": "2026-05-30",
  "appointment_time": "10:00",
  "appointment_type": "Consulta General",
  "priority": "medium",
  "chief_complaint": "Dolor en el pecho"
}
```

### Doctores

#### Listar Doctores

```
GET /api/v1/doctors
Authorization: Bearer {token}
```

#### Doctores por Especialidad

```
GET /api/v1/doctors/specialization/{specialization}
Authorization: Bearer {token}
```

### Departamentos

#### Listar Departamentos

```
GET /api/v1/departments
Authorization: Bearer {token}
```

#### Crear Departamento (Admin)

```
POST /api/v1/departments
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Cardiología",
  "description": "Departamento de enfermedades del corazón",
  "floor_number": 3,
  "phone": "+573001111111",
  "email": "cardiologia@hospital.com"
}
```

### Historiales Médicos

#### Listar Historiales

```
GET /api/v1/medical-records
Authorization: Bearer {token}
```

#### Historiales por Paciente

```
GET /api/v1/medical-records/patient/{patientId}
Authorization: Bearer {token}
```

#### Crear Historial

```
POST /api/v1/medical-records
Authorization: Bearer {token}
Content-Type: application/json

{
  "patient_id": "uuid",
  "doctor_id": "uuid",
  "diagnosis": "Hipertensión",
  "symptoms": "Dolor de cabeza, mareos",
  "treatment_plan": "Medicamentos y dieta",
  "vital_signs": {
    "blood_pressure": "140/90",
    "heart_rate": 85,
    "temperature": 37.2
  }
}
```

### Recetas

#### Listar Recetas

```
GET /api/v1/prescriptions
Authorization: Bearer {token}
```

#### Crear Receta

```
POST /api/v1/prescriptions
Authorization: Bearer {token}
Content-Type: application/json

{
  "patient_id": "uuid",
  "doctor_id": "uuid",
  "diagnosis": "Infección",
  "items": [
    {
      "inventory_id": 2,
      "medication_name": "Amoxicilina 500mg",
      "dosage": "500mg",
      "frequency": "Cada 8 horas",
      "duration": "7 días",
      "quantity": 21
    }
  ]
}
```

### Inventario

#### Listar Inventario

```
GET /api/v1/inventory
Authorization: Bearer {token}
```

#### Artículos con Stock Bajo

```
GET /api/v1/inventory/low-stock/list
Authorization: Bearer {token}
```

### Exámenes de Laboratorio

#### Listar Exámenes

```
GET /api/v1/lab-tests
Authorization: Bearer {token}
```

#### Crear Examen

```
POST /api/v1/lab-tests
Authorization: Bearer {token}
Content-Type: application/json

{
  "patient_id": "uuid",
  "doctor_id": "uuid",
  "test_name": "Hemograma",
  "test_type": "Laboratorio",
  "test_date": "2026-05-30",
  "sample_type": "Sangre",
  "cost": 50000
}
```

### Facturación

#### Listar Facturas

```
GET /api/v1/billing
Authorization: Bearer {token}
```

#### Facturas Pendientes

```
GET /api/v1/billing/pending/list
Authorization: Bearer {token}
```

#### Crear Factura

```
POST /api/v1/billing
Authorization: Bearer {token}
Content-Type: application/json

{
  "patient_id": "uuid",
  "subtotal": 150000,
  "tax_amount": 19000,
  "discount_amount": 0,
  "items": [
    {
      "description": "Consulta Médica",
      "item_type": "service",
      "quantity": 1,
      "unit_price": 150000,
      "total_price": 150000
    }
  ]
}
```

### Habitaciones

#### Listar Habitaciones

```
GET /api/v1/rooms
Authorization: Bearer {token}
```

#### Habitaciones Disponibles

```
GET /api/v1/rooms/available/list
Authorization: Bearer {token}
```

## 🔒 Roles y Permisos

| Rol | Permisos |
|-----|----------|
| admin | Acceso total |
| doctor | Ver/editar pacientes, citas, historiales, crear recetas |
| nurse | Ver pacientes, citas, historiales |
| receptionist | Gestionar citas, pacientes, facturación |
| lab_technician | Gestionar exámenes de laboratorio |
| pharmacist | Gestionar recetas, inventario |

## 🧪 Testing

Usa Postman, Insomnia o cURL para probar los endpoints.

## 📝 Credenciales de Prueba

```
Email: admin@hospital.com
Password: Admin123!
Role: admin

Email: maria.gomez@hospital.com
Password: Doctor123!
Role: doctor
```

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

- Verifica que PostgreSQL esté ejecutándose
- Comprueba las credenciales en `.env`
- Verifica que la base de datos exista

### Error: "EADDRINUSE: address already in use"

- El puerto 5000 ya está en uso
- Cambia PORT en `.env` o usa otro puerto

## 📞 Contacto

Para soporte, contacta al equipo de desarrollo.

## 📄 Licencia

Este proyecto está bajo licencia ISC.
