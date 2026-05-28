## Manual de usuario — VitaSalud EPS

### 1) Acceso al sistema

1. Abrir la aplicación web.
2. Ingresar **correo** y **contraseña**.
3. Presionar **Iniciar sesión**.

> El menú y las pantallas disponibles cambian según el **rol** (paciente, médico, admin, etc.).

---

### 2) Recuperar contraseña (OTP por correo)

1. En la pantalla de inicio de sesión, presionar **“Recuperar contraseña”**.
2. Escribir tu correo y presionar **“Enviar código”**.
3. Revisar el correo: llegará un **código de 6 dígitos**.
4. Ingresar el código en las casillas (OTP) y presionar **Verificar código**.
5. Crear la nueva contraseña (mínimo 8 caracteres) y confirmar.
6. Presionar **Restablecer contraseña**.

#### Reglas importantes

- El código OTP **vence a los 10 minutos**.
- Si no llega el correo, usar **Reenviar código**.

---

### 3) Panel Administrativo (rol admin)

Al ingresar como **admin**, el inicio muestra el **Panel Administrativo**.

#### 3.1 Crear médicos

1. Ir a la pestaña **Médicos**.
2. Completar: nombres, apellidos, email, contraseña, licencia, especialidad y (opcional) departamento.
3. Presionar **Crear médico**.

#### 3.2 Configurar correo (SMTP) para códigos y notificaciones

1. Ir a la pestaña **Correo**.
2. Completar los campos SMTP:
   - Host
   - Port
   - User
   - Pass
   - From
3. Presionar **Guardar** (queda persistente).
4. (Opcional) escribir un correo destino en “Enviar prueba a”.
5. Presionar **Enviar correo de prueba**.

> Esta configuración es la que utiliza el sistema para enviar el **código de verificación** en la recuperación de contraseña.

---

### 4) Rol médico (recetas)

- En la sección de **Recetas**, el médico visualiza únicamente los tratamientos/recetas **asociados a su usuario** (doctor logueado).

---

### 5) Buenas prácticas y recomendaciones

- Mantener contraseñas seguras y no compartir credenciales.
- Validar que el correo SMTP configurado sea una cuenta institucional o autorizada.
- Verificar que la bandeja de entrada no esté filtrando correos (spam/no deseado).

