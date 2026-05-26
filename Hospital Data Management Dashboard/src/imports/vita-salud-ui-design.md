Diseña un prototipo completo de aplicación web responsive para una EPS llamada "VitaSalud", orientada a la gestión de pacientes, citas médicas, historial clínico y tratamientos.

El diseño debe verse moderno, limpio, profesional y enfocado en el sector salud, con una interfaz clara, accesible y fácil de usar para pacientes, médicos y personal administrativo.

La interfaz debe parecer un dashboard médico profesional, similar a plataformas reales de salud digital.

🎨 Paleta de colores (UX médica profesional)

Utilizar la siguiente paleta:

Color primario:
Azul médico
#1E88E5

Azul secundario:
#64B5F6

Fondo secundario:
#E3F2FD

Fondo principal:
#FFFFFF

Fondo general de la aplicación:
#F5F7FA

Sidebar:
#0D47A1

Texto principal:
#212121

Texto secundario:
#616161

Texto deshabilitado:
#9E9E9E

Colores de estado

Éxito:
#43A047

Advertencia:
#FDD835

Error:
#E53935

Información:
#1E88E5

🎨 Estilo visual

Diseño moderno tipo medical dashboard.

Características:

Tipografía sans-serif moderna (Inter o Roboto)

Alto contraste para accesibilidad

Botones redondeados

Tarjetas con sombra suave

Interfaz minimalista

Iconografía médica

Espacios amplios entre elementos

Jerarquía visual clara

📐 Sistema de Layout Responsive

La aplicación debe ser responsive y adaptarse a:

Desktop
Tablet
Mobile

Desktop:

Sidebar fija a la izquierda

Dashboard con múltiples columnas

Tablet:

Sidebar colapsable

Layout simplificado

Mobile:

Navegación hamburguesa o inferior

Tarjetas apiladas verticalmente

Las tablas deben transformarse en cards en vista móvil.

📐 Design System (componentes reutilizables)

Crear un sistema de componentes reutilizables.

Botón primario

Uso: acciones principales.

Color fondo:
#1E88E5

Texto:
Blanco

Border radius:
8px

Estados:

Normal:
#1E88E5

Hover:
#1565C0

Activo:
#0D47A1

Disabled:
#90CAF9

Ejemplos de uso:

Iniciar sesión

Confirmar cita

Guardar diagnóstico

Botón secundario

Fondo:
Blanco

Borde:
1px #1E88E5

Texto:
#1E88E5

Border radius:
8px

Uso:

Cancelar

Ver detalles

Editar

Inputs (formularios)

Campos con estilo limpio.

Borde:
1px #DADADA

Border radius:
8px

Padding:
10px

Estados:

Normal:
#DADADA

Focus:
#1E88E5

Error:
#E53935

Campos comunes:

Correo
Contraseña
Motivo de consulta
Diagnóstico
Nombre del paciente

Cards (tarjetas)

Usadas para mostrar información rápida.

Estilo:

Fondo:
#FFFFFF

Border radius:
12px

Sombra suave

Contenido típico:

Cita médica
Doctor
Especialidad
Fecha
Hora

Tablas

Usadas para:

historial clínico

citas

administración

Header:

Fondo:
#E3F2FD

Texto:
#1E88E5

Filas alternadas:

blanco / gris muy claro.

Calendario de citas

Componente para seleccionar fechas.

Estados:

Disponible:
verde claro

Ocupado:
gris

Seleccionado:
azul

🧭 Sidebar de navegación

Ubicada a la izquierda.

Color fondo:
#0D47A1

Texto:
blanco

Iconos blancos.

Menú:

Inicio
Citas
Historial clínico
Tratamientos
Agenda médica
Reportes
Perfil
Cerrar sesión

Elemento activo resaltado.

👥 Roles del sistema

El sistema debe contemplar tres roles:

Paciente
Médico
Administrativo

Cada rol tendrá diferentes accesos, pero el mismo estilo visual.

🖥️ Pantallas del prototipo (12 pantallas)

Crear múltiples frames conectados que simulen navegación.

1 Pantalla Splash / Bienvenida

Logo VitaSalud
Mensaje:

"Tu salud en las mejores manos"

Botón:

"Ingresar"

2 Login

Campos:

Correo electrónico
Contraseña

Botones:

Iniciar sesión
Recuperar contraseña

Login exitoso → Dashboard.

3 Registro de usuario

Campos:

Nombre
Documento
Correo
Contraseña
Confirmar contraseña

Botón:

Registrarse.

4 Dashboard principal

Mostrar tarjetas con:

Próximas citas
Tratamientos activos
Notificaciones

Acciones rápidas:

Agendar cita
Ver historial clínico
Consultar tratamientos

5 Agendar cita

Formulario con:

Especialidad
Médico
Calendario
Hora disponible
Motivo de consulta

Botón:

Confirmar cita.

6 Confirmación de cita

Mostrar resumen:

Doctor
Fecha
Hora

Mensaje:

"Cita agendada correctamente".

7 Mis citas

Lista de citas.

Columnas:

Fecha
Médico
Especialidad
Estado

Botones:

Cancelar
Reprogramar

8 Historial clínico

Tabla con:

Fecha
Médico
Diagnóstico
Tratamiento

Botón:

Ver detalle.

9 Detalle de consulta médica

Mostrar:

Síntomas
Diagnóstico
Tratamiento
Medicamentos

10 Tratamientos

Tarjetas con:

Nombre del tratamiento
Duración
Estado
Médico responsable

11 Agenda del médico

Vista calendario con citas.

Información:

Paciente
Hora
Motivo

Acciones:

Atender paciente
Registrar diagnóstico
Registrar tratamiento

12 Panel administrativo

Dashboard con métricas:

Citas del día
Pacientes atendidos
Médicos activos

Tablas de gestión.

🔄 Flujo de navegación

Crear interacciones entre pantallas.

Login → Dashboard

Dashboard → Agendar cita

Agendar cita → Confirmación

Dashboard → Historial clínico

Historial → Detalle consulta

Dashboard → Tratamientos

Agenda médico → Registrar diagnóstico

Panel admin → Reportes

Instrucción final

Generate a responsive web UI with multiple frames representing each screen and a clean medical dashboard style, including navigation flows between screens, reusable components, and layouts optimized for desktop, tablet, and mobile devices.