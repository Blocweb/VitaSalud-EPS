## Work (bitácora de entrega)

Este documento resume la verificación, correcciones y entregables generados para el proyecto **VitaSalud-EPS**.

### Verificación técnica (builds)

- **Backend**: `npm run build` (TypeScript `tsc`) ejecuta sin errores.
- **Frontend**: `npm run build` (Vite) ejecuta sin errores.

### Cambios funcionales confirmados (alto nivel)

- **Dashboard por roles**:
  - Paciente: se ocultan gráficas no requeridas.
  - Admin: el inicio muestra el **Panel Administrativo** en lugar del dashboard clínico.
- **Recetas por médico**: el rol `doctor` ve en recetas únicamente las asociadas a su `doctor_id`.
- **Creación de médicos**: panel admin permite crear médicos (crea `users` + `doctors`).
- **Correo (SMTP) persistente**:
  - Configuración SMTP se guarda en BD en `email_settings`.
  - Endpoint de prueba y endpoint de guardado disponibles.
- **Recuperación de contraseña**:
  - Envío de código OTP (6 dígitos) al correo.
  - Validez del código: **10 minutos**.
  - Correo HTML con diseño.

### Documentación entregada

- `docs/Documentacion_Tecnica_Academica.md`
- `docs/Manual_de_Usuario.md`

