# 📖 GUÍA COMPLETA DE USUARIO - HUELLITAS QUITEÑAS

> **Manual de Usuario del Sistema**  
> Fecha: Enero 2026  
> Versión: 1.0

---

## 🎯 INTRODUCCIÓN

Bienvenido a **Huellitas Quiteñas**, el sistema integral para la gestión de adopciones responsables de mascotas en Quito. Esta guía detalla todas las funcionalidades disponibles para cada tipo de usuario del sistema.

### Tipos de Usuarios

El sistema cuenta con **4 roles principales**:

1. **👤 ADOPTANTE**: Personas interesadas en adoptar una mascota
2. **🏢 FUNDACIÓN**: Organizaciones que gestionan animales en adopción
3. **🏥 CLÍNICA**: Veterinarias que registran historiales médicos
4. **👑 ADMIN**: Administradores del sistema

---

## 📱 ACCESO AL SISTEMA

### Página de Inicio
- **URL**: `/` o `/home`
- **Acceso**: Público (no requiere login)

**Funcionalidades:**
- Ver información general del sistema
- Conocer el proceso de adopción
- Acceder a testimonios de adoptantes
- Navegar al catálogo público de animales
- Registrarse como nuevo usuario
- Iniciar sesión

### Registro de Usuarios

#### Para Adoptantes
**Ruta**: `/register`

**Proceso de Registro (2 Pasos):**

**Paso 1: Información Básica**
- Nombre completo
- Email (único en el sistema)
- Contraseña (mínimo 8 caracteres, debe incluir mayúsculas, minúsculas y números)
- Teléfono (opcional)
- Dirección (opcional)

**Paso 2: Preferencias de Adopción** (Onboarding integrado)
- **Tamaño preferido**: Pequeño, Mediano, Grande
- **Nivel de energía**: Bajo (Tranquilo), Medio (Moderado), Alto (Activo)
- **Grupo de edad**: Cachorro, Joven, Adulto, Senior
- **¿Tienes mascotas?**: Sí/No
- **¿Tienes niños?**: Sí/No
- **¿Tienes patio?**: Sí/No
- **Nivel de actividad**: Bajo, Medio, Alto
- **Experiencia con perros**: Primera vez, Con experiencia

**Validaciones:**
- Email único (no puede estar registrado previamente)
- Contraseña segura (8+ caracteres, mayúscula, minúscula, número)
- Todas las preferencias son opcionales pero recomendadas para mejores recomendaciones

#### Para Fundaciones y Clínicas
- El registro debe ser aprobado por un administrador
- Contactar al equipo de Huellitas Quiteñas para solicitar acceso

### Inicio de Sesión

#### Login Público (Adoptantes)
**Ruta**: `/login`

**Credenciales:**
- Email
- Contraseña

**Opciones:**
- Recordar sesión
- Recuperar contraseña olvidada

#### Login Administrativo (Fundación/Clínica/Admin)
**Ruta**: `/admin/login`

**Características:**
- Interfaz específica para usuarios con roles administrativos
- Redirección automática al panel correspondiente

### Recuperación de Contraseña
**Ruta**: `/olvide` o `/forgot-password`

**Proceso:**
1. Ingresar email registrado
2. Recibir enlace de reseteo por correo
3. Hacer click en el enlace
4. Establecer nueva contraseña

---

## 👤 GUÍA PARA ADOPTANTES

### Dashboard Principal
**Acceso automático tras login**: Redirige a `/catalog`

### 1. Catálogo de Animales
**Ruta**: `/catalog` o `/adoptar`

**Funcionalidades:**

#### Búsqueda y Filtros Avanzados
- **Búsqueda por texto**: Nombre o raza del animal
- **Filtros disponibles**:
  - **Tamaño**: Pequeño, Mediano, Grande
  - **Nivel de energía**: Tranquilo, Moderado, Activo
  - **Edad**: Cachorro (<1 año), Joven (1-3 años), Adulto (3-7 años), Senior (7+ años)
  - **Estado de salud**: Vacunado, Desparasitado, Esterilizado
  - **Compatibilidad**: Con niños, con gatos, con otros perros, apto para apartamento
  - **Características de personalidad**: Sociabilidad, Adaptabilidad, Nivel de entrenamiento

#### Vista de Cards
Cada tarjeta muestra:
- Foto principal del animal
- Nombre
- Edad (en meses/años)
- Raza
- Tamaño
- Nivel de energía
- Estado (Disponible/Reservado)
- Badge de compatibilidad si hay matching

#### Acciones por Animal
- **👁️ Ver detalles**: Click en la card para ver perfil completo
- **❤️ Adoptar**: Botón para iniciar solicitud de adopción

### 2. Detalle del Animal
**Ruta**: `/adoptar/:animalId`

**Información Completa:**

#### Galería de Fotos
- Carrusel de todas las imágenes del animal
- Zoom en imágenes

#### Información Básica
- Nombre
- Edad detallada (meses y años)
- Raza (principal y secundaria si es mestizo)
- Género (Macho/Hembra)
- Tamaño actual y tamaño adulto
- Colores (hasta 3)

#### Características Físicas
- Longitud de pelo (Corto, Medio, Largo)
- Estado de salud (Sano, Lesión menor, Lesión seria)
- Vacunado (Sí, No, No seguro)
- Desparasitado (Sí, No, No seguro)
- Esterilizado (Sí, No, No seguro)

#### Personalidad (si disponible)
- Sociabilidad (1-5 estrellas)
- Energía (1-5 estrellas)
- Nivel de entrenamiento (1-5 estrellas)
- Adaptabilidad (1-5 estrellas)

#### Compatibilidad
- ✅ Compatible con niños
- ✅ Compatible con gatos
- ✅ Compatible con otros perros
- ✅ Apto para apartamento

#### Historial Clínico
- Última vacunación
- Condiciones médicas (si las hay)
- Resumen clínico

#### Información de la Fundación
- Nombre de la fundación responsable
- Ubicación

#### Acciones
- **💚 Solicitar Adopción**: Inicia el proceso de solicitud
- **🔙 Volver al catálogo**

### 3. Recomendaciones Personalizadas (KNN)
**Ruta**: `/recommendations`

**Sistema de Matching Inteligente:**

#### Algoritmo KNN
El sistema utiliza **K-Nearest Neighbors (KNN)** para calcular compatibilidad:
- Analiza 15+ características del animal y tus preferencias
- Calcula distancia Manhattan entre tu perfil y cada animal
- Genera un **Score de Compatibilidad 0-100**
- Ordena por mejor match (mayor score = mejor compatibilidad)

#### Visualización de Matches
Cada recomendación muestra:
- **Rank**: Posición en el ranking (ej: #1, #2, #3...)
- **Score de Compatibilidad**: Porcentaje y clasificación
  - 🌟 80-100%: "Excelente Match"
  - ⭐ 65-79%: "Buen Match"
  - ⭐ 50-64%: "Match Bueno"
  - ⭐ 35-49%: "Match Moderado"
  - ⭐ 0-34%: "Match Básico"

#### Factores de Compatibilidad
El sistema considera:
- Tamaño preferido vs tamaño del animal
- Nivel de energía preferido vs energía del animal
- Edad preferida vs edad del animal
- Compatibilidad con mascotas existentes
- Compatibilidad con niños
- Espacio disponible (patio)
- Experiencia del adoptante

#### Información Adicional por Animal
- Foto destacada
- Nombre y edad
- Raza y características
- Distancia de matching (técnica)
- Badge de "Top Match" para los mejores 3

#### Acciones
- **Ver Perfil**: Ir al detalle completo del animal
- **Adoptar**: Iniciar solicitud directamente

#### Requisito
⚠️ **Debes completar tu perfil de preferencias** durante el registro (Paso 2) para acceder a esta funcionalidad.

Si no completaste tus preferencias:
- El sistema te redirigirá a completar el perfil
- Se guardan automáticamente después del registro

### 4. Solicitud de Adopción
**Ruta**: `/adoptar/:animalId/aplicar`

**Formulario de Evaluación:**

El sistema presenta un **formulario completo de evaluación** para determinar tu idoneidad como adoptante.

#### Preguntas Obligatorias

**1. Decisión Familiar**
- ¿Todos en la familia están de acuerdo con adoptar?
  - ✅ Todos están de acuerdo
  - ⚠️ Aceptan pero no están convencidos
  - ⚠️ Son indiferentes
  - ❌ Están en desacuerdo

**2. Presupuesto Mensual**
- ¿Qué presupuesto destinarás para el cuidado?
  - 💰 Alto ($100+)
  - 💵 Medio ($50-100)
  - 💴 Bajo (<$50)

**3. Visitas de Seguimiento**
- ¿Permites visitas domiciliarias post-adopción?
  - ✅ Sí
  - ❌ No

**4. Tipo de Vivienda**
- Casa urbana
- Casa de campo
- Departamento
- Quinta
- Hacienda
- Otro

**5. Relación con Animales**
- ¿Cómo es tu relación con animales?
  - 😊 Positiva (amo a los animales)
  - 😐 Neutral
  - 😟 Negativa (me dan miedo o alergia)

**6. Planes de Viaje**
- ¿Qué harás con el animal durante vacaciones?
  - Viajará conmigo
  - Se quedará con familia
  - Se quedará con amigos
  - Contrataré cuidador
  - Lo dejaré en hotel para mascotas
  - Otro

**7. Respuesta ante Mal Comportamiento**
- ¿Cómo responderás si el animal se porta mal?
  - Lo entrenaré o aceptaré
  - Buscaré ayuda profesional
  - Lo castigaré
  - Lo abandonaría (❌ Descalifica)

**8. Compromiso de Cuidado**
- ¿Qué tan comprometido estás?
  - Cuidado completo (tiempo, dinero, amor)
  - Cuidado medio
  - Cuidado bajo

#### Pregunta Condicional

**9. Aceptación de Esterilización** (Solo para cachorros ≤ 1 año)
- ¿Aceptas esterilizar cuando alcance edad adecuada?
  - ✅ Sí
  - ❌ No

#### Sistema de Scoring Automático

Al enviar la solicitud:
1. El sistema **calcula automáticamente un score 0-100**
2. Evalúa cada respuesta con ponderaciones:
   - Decisión familiar: 15%
   - Presupuesto: 10%
   - Permitir visitas: 20%
   - Respuesta a mal comportamiento: 25%
   - Compromiso de cuidado: 20%
   - Otros factores: 10%

3. **Predicción ML**: El sistema usa un modelo de Machine Learning (KNN) para predecir la **propensión de adopción exitosa**:
   - Analiza 15+ características del animal
   - Compara con 15 vecinos más cercanos en el dataset de entrenamiento
   - Genera probabilidad 0-100% de éxito en la adopción
   - Proporciona explicación: "X de 15 vecinos similares fueron adoptados exitosamente"

4. Genera un **reporte detallado** para la fundación con:
   - Score total
   - Desglose por pregunta
   - Predicción ML
   - Recomendaciones

#### Validaciones
- Todas las preguntas son obligatorias
- No se puede enviar formulario incompleto
- Respuestas críticas (como "abandonaría") pueden resultar en score bajo automático

#### Después de Enviar
- Confirmación inmediata
- Email de confirmación
- Redirección a "Mis Solicitudes"
- La fundación recibe notificación

### 5. Mis Solicitudes
**Ruta**: `/mis-solicitudes`

**Vista de Todas tus Solicitudes:**

#### Estados Posibles

**🔵 RECIBIDA**
- Tu solicitud llegó correctamente
- La fundación aún no la ha revisado
- Descripción: "Tu solicitud llegó a la fundación y pronto será evaluada"

**🟡 EN EVALUACIÓN** (IN_REVIEW)
- La fundación está analizando tu perfil
- Revisan tu score y predicción ML
- Descripción: "El equipo está analizando tu perfil. Mantente atento a tu correo"

**🟣 VISITA DOMICILIARIA** (HOME_VISIT)
- ¡Pasaste la evaluación inicial!
- La fundación coordinará una visita a tu hogar
- Descripción: "Quieren conocerte mejor. Coordinarán una visita domiciliaria"

**🟢 APROBADA**
- ¡Felicidades! Tu adopción fue aprobada
- La fundación te contactará para los siguientes pasos
- Descripción: "¡Felicidades! Tu adopción fue aprobada. Te contactarán para continuar"

**🔴 RECHAZADA**
- Tu solicitud no cumplió con los criterios
- La fundación dejó un motivo de rechazo
- Puedes mejorar tu perfil y volver a aplicar
- Descripción: "La fundación dejó un comentario para que mejores tu postulación"

#### Información por Solicitud
- **Foto del animal**
- **Nombre del animal**
- **Estado actual** (badge de color)
- **Fecha de solicitud**
- **Score obtenido** (si está disponible)
- **Predicción ML** (probabilidad de éxito)
- **Motivo de rechazo** (si aplica)

#### Acciones Disponibles
- **👁️ Ver Detalles**: Ver información completa de la solicitud
- **📅 Agendar Cita**: Si el estado es "APPROVED" o "HOME_VISIT"
- **💬 Ver Comentarios**: Leer feedback de la fundación

#### Gestión de Citas
Si tu solicitud está aprobada o requiere visita:
- Botón **"Agendar Cita"** activo
- Redirige a formulario de agendamiento
- Coordina con la fundación o veterinaria

### 6. Mis Citas
**Ruta**: `/mis-citas`

**Gestión de Citas Agendadas:**

#### Tipos de Citas
1. **Visita Domiciliaria**: La fundación visita tu hogar
2. **Visita Veterinaria**: Revisión médica pre-adopción
3. **Entrega del Animal**: Cita final para llevar a tu nuevo amigo

#### Información de cada Cita
- **Fecha y hora**
- **Tipo de cita**
- **Animal relacionado** (foto y nombre)
- **Ubicación** (dirección)
- **Estado**: Pendiente, Confirmada, Completada, Cancelada
- **Notas adicionales**

#### Acciones
- **Confirmar asistencia**
- **Reagendar** (si está permitido)
- **Cancelar** (con motivo)
- **Ver en calendario**

### 7. Agendar Cita
**Ruta**: `/mis-solicitudes/:applicationId/agendar-cita`

**Formulario de Agendamiento:**

#### Campos
- **Tipo de cita**: Visita domiciliaria, Veterinaria, Entrega
- **Fecha preferida**: Selector de calendario
- **Hora preferida**: Selector de hora
- **Notas adicionales**: Campo de texto libre

#### Validaciones
- No se pueden agendar citas en el pasado
- Horarios disponibles según fundación/clínica
- Mínimo 24 horas de anticipación

#### Confirmación
- Email de confirmación
- La fundación/clínica recibe notificación
- Aparece en "Mis Citas"

### 8. Perfil de Usuario
**Ruta**: `/profile`

**Gestión de Cuenta:**

#### Información Personal (Editable)
- Nombre completo
- Email (no editable, es tu identificador único)
- Teléfono
- Dirección
- Foto de perfil (upload)

#### Preferencias de Adopción (Editable)
- Tamaño preferido
- Nivel de energía
- Grupo de edad
- ¿Tienes mascotas?
- ¿Tienes niños?
- ¿Tienes patio?
- Nivel de actividad
- Experiencia con perros

#### Cambio de Contraseña
- Contraseña actual
- Nueva contraseña
- Confirmar nueva contraseña

#### Estadísticas Personales
- Solicitudes enviadas
- Solicitudes aprobadas
- Citas agendadas
- Animales favoritos (futuro)

### 9. Información General

#### Sobre Nosotros
**Ruta**: `/about` o `/sobre-nosotros`
- Misión de Huellitas Quiteñas
- Equipo
- Historia
- Logros

#### Proceso de Adopción
**Ruta**: `/process` o `/proceso`
- Paso a paso del proceso
- Requisitos
- Tiempos estimados
- Consejos

#### Preguntas Frecuentes
**Ruta**: `/faq` o `/preguntas`
- FAQ sobre adopción
- FAQ sobre el sistema
- FAQ sobre seguimiento

#### Contacto
**Ruta**: `/contact` o `/contacto`

**Formulario de Contacto:**
- Nombre
- Email
- Asunto
- Mensaje
- Botón enviar

Los mensajes llegan al panel de administración.

#### Legal

**Términos y Condiciones**
**Ruta**: `/terms` o `/terminos`
- Términos de uso del sistema
- Derechos y obligaciones

**Política de Privacidad**
**Ruta**: `/privacy` o `/privacidad`
- Tratamiento de datos personales
- Cookies
- Seguridad

---

## 🏢 GUÍA PARA FUNDACIONES

### Dashboard Principal
**Ruta**: `/fundacion`

Al iniciar sesión, las fundaciones acceden a su panel de gestión completo.

### 1. Resumen (Dashboard)
**Ruta**: `/fundacion`

**Estadísticas en Tiempo Real:**

#### Cards de Métricas
1. **Perros Registrados** 🐕
   - Total de animales de la fundación
   - Gráfico de tendencia

2. **Solicitudes Pendientes** ⏳
   - Solicitudes que requieren revisión
   - Alerta si hay muchas pendientes

3. **Adopciones Exitosas** ✅
   - Total de animales adoptados
   - Porcentaje de éxito

4. **Visitas Programadas** 📅
   - Citas agendadas próximas
   - Calendario integrado

#### Vista Rápida de Animales
- **Tabla con últimos 10 animales**
- **Columnas**:
  - Foto miniatura
  - Nombre
  - Edad
  - Raza
  - Estado (Disponible/Reservado/Adoptado)
  - Fecha de registro
  - Acciones rápidas (Ver, Editar, Eliminar)

#### Búsqueda y Filtros
- Búsqueda por nombre o raza
- Filtro por estado (Todos, Disponibles, Reservados, Adoptados)
- Paginación (10 animales por página)

#### Acciones Rápidas
- **👁️ Ver**: Modal con vista rápida del animal
- **✏️ Editar**: Navega al CRUD de animales
- **🗑️ Eliminar**: Confirmación + eliminación

### 2. Gestión de Animales
**Ruta**: `/fundacion/animales`

**CRUD Completo de Animales:**

#### Crear Nuevo Animal

**Botón**: ➕ Nuevo Animal

**Formulario Completo (Paso a Paso):**

**Información Básica**
- **Nombre** (requerido)
- **Edad en años** (requerido, convierte automáticamente a meses)
- **Raza principal** (requerido, lista predefinida + opción "Otro")
- **Raza secundaria** (opcional, para mestizos)
- **Género**: Macho/Hembra (requerido)
- **Tamaño actual**: Pequeño/Mediano/Grande (requerido)
- **Tamaño adulto**: Small/Medium/Large/Extra Large (para cachorros)

**Características Físicas**
- **Color principal** (requerido): Black, Brown, White, Yellow, Gray, Cream, Golden
- **Color secundario** (opcional)
- **Color terciario** (opcional)
- **Longitud de pelo**: Corto/Medio/Largo (requerido)

**Estado de Salud**
- **Estado general**: Sano, Lesión menor, Lesión seria (requerido)
- **Vacunado**: Sí/No/No estoy seguro (requerido)
- **Desparasitado**: Sí/No/No estoy seguro (requerido)
- **Esterilizado**: Sí/No/No estoy seguro (requerido)
- **Resumen clínico** (opcional, texto libre)

**Personalidad (Opcional pero Recomendado)**
- **Sociabilidad** (1-5 estrellas): Qué tan sociable es
- **Energía** (1-5 estrellas): Nivel de actividad
- **Entrenamiento** (1-5 estrellas): Qué tan entrenado está
- **Adaptabilidad** (1-5 estrellas): Capacidad de adaptarse

**Compatibilidad**
- ✅ Compatible con niños
- ✅ Compatible con gatos
- ✅ Compatible con otros perros
- ✅ Apto para apartamento

**Fotos**
- **Upload múltiple** (hasta 10 fotos)
- **Arrastra y suelta** archivos
- **Preview inmediato**
- Las imágenes se suben a **Cloudinary** (CDN)
- Optimización automática

**Tarifa de Adopción**
- Monto en dólares (puede ser $0 para adopción gratuita)

**Estado del Animal**
- Disponible (default)
- Reservado
- Adoptado

#### Validaciones
- Nombre obligatorio
- Edad obligatoria y realista (0-20 años)
- Al menos 1 foto recomendada
- Características de salud obligatorias

#### Códigos ML Automáticos
El sistema **convierte automáticamente** campos legibles a códigos numéricos para el algoritmo ML:
- Breed1 → breed1Code
- Color1 → color1Code
- MaturitySize → maturitySizeCode
- Vaccinated → vaccinatedCode
- etc.

Esto permite que el sistema de matching funcione sin que la fundación tenga que preocuparse por códigos.

#### Editar Animal

**Acceso**: Click en botón "Editar" en tabla o dashboard

**Funcionalidad:**
- Formulario pre-cargado con datos existentes
- Todas las mismas opciones que crear
- Posibilidad de cambiar estado (Disponible → Reservado → Adoptado)
- Actualización de fotos (agregar/eliminar)

#### Eliminar Animal

**Confirmación requerida:**
- Modal de confirmación
- Muestra nombre del animal
- Advertencia: "Esta acción no se puede deshacer"
- Botones: Cancelar / Confirmar eliminación

**Efecto:**
- Elimina el animal de la base de datos
- Elimina las imágenes de Cloudinary
- Actualiza estadísticas

#### Lista de Animales
- Vista en tabla con paginación
- Búsqueda en tiempo real
- Filtros por estado
- Ordenamiento por columnas
- Acciones en línea

### 3. Gestión de Solicitudes
**Ruta**: `/fundacion/solicitudes`

**Vista Completa de Solicitudes:**

#### Panel de Control

**Filtros Disponibles:**
- **Por estado**: Todas, Recibidas, En evaluación, Visita domiciliaria, Aprobadas, Rechazadas
- **Por animal**: Dropdown con todos tus animales
- **Por fecha**: Rango de fechas
- **Por score**: Score alto (80+), medio (50-79), bajo (<50)

#### Vista Kanban (Opcional)
Tablero visual con columnas:
- **Recibidas**: Solicitudes nuevas
- **En Evaluación**: Siendo revisadas
- **Visita**: Requieren visita domiciliaria
- **Aprobadas**: Listas para adopción
- **Rechazadas**: No cumplen criterios

Arrastrar y soltar para cambiar estados.

#### Vista de Lista (Tabla)

**Columnas:**
1. **Adoptante**
   - Nombre
   - Email
   - Teléfono (si disponible)

2. **Animal**
   - Foto miniatura
   - Nombre
   - Características básicas

3. **Fecha de Solicitud**
   - Timestamp completo
   - "Hace X días"

4. **Score Automático**
   - Número 0-100
   - Badge de color según rango:
     - 🟢 80-100: Excelente
     - 🔵 65-79: Bueno
     - 🟡 50-64: Aceptable
     - 🟠 35-49: Bajo
     - 🔴 0-34: Muy Bajo

5. **Predicción ML**
   - Probabilidad de éxito 0-100%
   - "X de 15 vecinos adoptados exitosamente"
   - Badge de propensión

6. **Estado Actual**
   - Badge de color según estado

7. **Acciones**
   - Ver detalles
   - Cambiar estado
   - Rechazar
   - Aprobar

#### Detalle de Solicitud

**Modal o Página Completa:**

**Información del Adoptante**
- Datos personales
- Historial en el sistema
- Solicitudes previas (si las hay)

**Información del Animal**
- Perfil completo
- Fotos
- Características

**Respuestas del Formulario**
Visualización completa de todas las respuestas:
1. Decisión familiar
2. Presupuesto mensual
3. Permitir visitas
4. Tipo de vivienda
5. Relación con animales
6. Planes de viaje
7. Respuesta a mal comportamiento
8. Compromiso de cuidado
9. Aceptación de esterilización (si aplica)

**Score Detallado**
- **Score Total**: XX/100
- **Desglose por Pregunta**:
  - Pregunta 1: XX puntos (contribución: XX%)
  - Pregunta 2: XX puntos (contribución: XX%)
  - etc.

**Predicción ML**
- **Predicción**: Adoptado (1) o No adoptado (0)
- **Probabilidad**: XX%
- **Explicación**:
  - "De los 15 vecinos más cercanos en el dataset:"
  - "X fueron adoptados exitosamente"
  - "X no fueron adoptados"
  - Distancias a vecinos (técnico)

**Evaluación de Idoneidad**
- ✅ Factores positivos detectados
- ⚠️ Factores de riesgo detectados
- ❌ Factores críticos (si los hay)

**Historial de Estados**
Timeline:
- Recibida: DD/MM/YYYY HH:MM
- En evaluación: DD/MM/YYYY HH:MM (si aplica)
- Actualizado por: Usuario X

#### Acciones sobre Solicitudes

**1. Cambiar a "En Evaluación"**
- Click en botón
- Confirmación
- El adoptante recibe notificación

**2. Solicitar Visita Domiciliaria**
- Click en botón "Visita"
- Modal para programar cita
- Campos:
  - Fecha
  - Hora
  - Notas
- Envía notificación al adoptante

**3. Aprobar Solicitud**
- Botón verde "Aprobar"
- Modal de confirmación
- Opcional: Mensaje personalizado para el adoptante
- Acciones automáticas:
  - Cambia estado del animal a "RESERVED" (si aún no está adoptado)
  - Envía email de aprobación al adoptante
  - Registra en historial

**4. Rechazar Solicitud**
- Botón rojo "Rechazar"
- **Modal obligatorio con motivo**:
  - Campo de texto: "¿Por qué rechazas esta solicitud?"
  - Sugerencias predefinidas:
    - "Espacio insuficiente para el tamaño del animal"
    - "Falta de experiencia con esta raza"
    - "Incompatibilidad con mascotas existentes"
    - "Presupuesto insuficiente para cuidados"
    - "Respuestas preocupantes en evaluación"
    - Otro (texto libre)
- Envía email con feedback al adoptante
- Permite al adoptante mejorar y volver a aplicar

**5. Agregar Notas Internas**
- Campo de notas privadas
- Visible solo para la fundación
- Útil para coordinación entre equipo

**6. Contactar Adoptante**
- Botón de email directo
- Botón de llamada (si hay teléfono)
- Historial de comunicaciones

#### Sugerencias del Sistema

El sistema puede mostrar **alertas y sugerencias** basadas en ML:

🟢 **Alta Probabilidad de Éxito**
- "Este adoptante tiene 87% de probabilidad de adopción exitosa"
- "Los vecinos similares tuvieron adopciones positivas"

🟡 **Revisar con Cuidado**
- "El score es aceptable pero la predicción ML es baja (45%)"
- "Considerar visita domiciliaria para validar condiciones"

🔴 **Riesgo Alto**
- "Score bajo en factores críticos (comportamiento ante problemas)"
- "Predicción ML negativa (15% de éxito)"

### 4. Estadísticas y Analytics
**Ruta**: `/fundacion/estadisticas`

**Dashboards de Análisis:**

#### Métricas Generales
- **Animales Totales**: Histórico completo
- **Animales Disponibles**: Actualmente en adopción
- **Animales Reservados**: En proceso de adopción
- **Animales Adoptados**: Éxito total

#### Gráficos de Tendencias (Recharts)

**1. Adopciones por Mes**
- Gráfico de línea o barras
- Últimos 12 meses
- Comparación año anterior

**2. Solicitudes por Estado**
- Gráfico de pie/dona
- Distribución de estados actuales

**3. Tasa de Aprobación**
- Porcentaje de solicitudes aprobadas vs rechazadas
- Tendencia mensual

**4. Tiempo Promedio de Adopción**
- Desde solicitud hasta aprobación
- Por tipo de animal (tamaño, edad)

#### Análisis de Animales

**Animales Más Populares**
- Ranking por número de solicitudes
- Características en común

**Animales con Más Tiempo**
- Listado de animales disponibles hace más tiempo
- Sugerencias para mejorar perfil o promoción

**Características Más Buscadas**
- Tamaños más solicitados
- Edades preferidas
- Razas populares

#### Análisis de Adoptantes

**Perfil de Adoptantes**
- Distribución demográfica
- Experiencia promedio
- Tipo de vivienda común

**Scores Promedio**
- Score promedio de solicitudes
- Distribución de scores

**Predicciones ML**
- Tasa de predicciones positivas
- Correlación score vs predicción

#### Exportar Reportes
- **Formato PDF**: Resumen ejecutivo
- **Formato Excel**: Datos detallados
- **Rango de fechas personalizado**
- **Filtros aplicados**

### 5. Notificaciones
**Ruta**: `/notificaciones`

**Centro de Notificaciones:**

#### Tipos de Notificaciones
1. **Nueva Solicitud** 📬
   - "Nuevo adoptante interesado en [Nombre Animal]"
   - Link directo a la solicitud

2. **Solicitud Actualizada** 🔄
   - "El adoptante actualizó su perfil"
   - Cambios destacados

3. **Cita Agendada** 📅
   - "Cita programada con [Nombre Adoptante]"
   - Fecha, hora, tipo

4. **Mensaje de Adoptante** 💬
   - Mensajes del sistema de contacto

5. **Alerta de Sistema** ⚠️
   - "Animal sin foto hace 30 días"
   - "Solicitud sin revisar hace 7 días"

#### Gestión
- Marcar como leída
- Marcar todas como leídas
- Eliminar notificación
- Ir a detalle relacionado

#### Configuración
- Activar/desactivar tipos de notificación
- Frecuencia de emails
- Notificaciones push (futuro)

### 6. Header de Fundación

Todas las páginas del panel tienen un **Header personalizado**:

#### Navegación Principal
- 🏠 **Inicio**: Dashboard
- 🐕 **Animales**: CRUD de animales
- 📋 **Solicitudes**: Gestión de adopciones
- 📊 **Estadísticas**: Analytics

#### Barra Superior Derecha
- 🔔 **Notificaciones**: Badge con contador
- 👤 **Perfil**: Dropdown con:
  - Ver perfil
  - Configuración
  - Cerrar sesión

#### Indicador de Fundación
- Logo de la fundación (si lo tiene)
- Nombre de la fundación

---

## 🏥 GUÍA PARA CLÍNICAS VETERINARIAS

### Dashboard Principal
**Ruta**: `/clinica`

Las clínicas veterinarias tienen acceso a funciones especializadas para gestión médica.

### 1. Gestión de Historiales Médicos
**Ruta**: `/clinica`

**Vista Principal de Animales:**

#### Búsqueda de Animales
- **Búsqueda por**:
  - Nombre del animal
  - Raza
  - Fundación responsable

#### Lista de Animales
Cada card muestra:
- Foto del animal
- Nombre y edad
- Raza
- Tamaño y género
- Nivel de energía
- Fundación responsable
- Badge "ADÓPTAME"

#### Acciones por Animal
- **📋 Ver Historial Médico**: Ver registros completos
- **➕ Agregar Registro**: Nuevo registro médico

### 2. Historial Médico Detallado
**Ruta**: `/clinica/animals/:id/medical-history`

**Perfil Completo del Animal:**

#### Información General
- Foto y datos básicos del animal
- Estado actual de salud
- Fundación responsable
- Fecha de registro en el sistema

#### Registros Médicos

**Vista Cronológica (Timeline):**

Cada registro muestra:
- **Fecha del registro**
- **Veterinario responsable**
- **Tipo de visita**:
  - Consulta general
  - Vacunación
  - Desparasitación
  - Esterilización
  - Emergencia
  - Control
  - Otro

- **Diagnóstico/Observaciones**
- **Tratamiento aplicado**
- **Medicamentos recetados**
- **Próxima cita** (si aplica)
- **Archivos adjuntos** (radiografías, análisis, etc.)

#### Crear Nuevo Registro

**Formulario:**

**Información Básica**
- **Fecha de consulta** (default: hoy)
- **Tipo de visita** (dropdown)
- **Veterinario** (auto-completa con usuario actual)

**Evaluación Clínica**
- **Peso** (kg)
- **Temperatura** (°C)
- **Frecuencia cardíaca** (latidos/min)
- **Frecuencia respiratoria** (resp/min)

**Diagnóstico y Tratamiento**
- **Motivo de consulta** (texto)
- **Síntomas observados** (texto)
- **Diagnóstico** (texto)
- **Tratamiento aplicado** (texto)
- **Medicamentos**:
  - Nombre del medicamento
  - Dosis
  - Frecuencia
  - Duración

**Vacunas y Procedimientos**
- ✅ Vacuna aplicada (lista de vacunas disponibles)
- ✅ Desparasitación
- ✅ Esterilización
- ✅ Otro procedimiento

**Seguimiento**
- **Próxima cita recomendada** (fecha)
- **Observaciones para seguimiento**
- **Estado de salud general**: Excelente, Bueno, Regular, Preocupante

**Archivos**
- Upload de documentos:
  - Radiografías
  - Resultados de laboratorio
  - Recetas
  - Otros documentos

#### Editar Registro
- Solo se pueden editar registros del mismo día (seguridad)
- Historial de ediciones registrado

#### Imprimir/Exportar
- **PDF del historial completo**
- **PDF de registro específico**
- **Resumen para adopción**

### 3. Gestión de Solicitudes
**Ruta**: `/clinica/solicitudes`

**Revisión de Solicitudes de Adopción:**

Las clínicas pueden ver solicitudes para:
- Verificar historial médico del animal
- Agregar notas médicas relevantes
- Recomendar o desaconsejar adopción basado en salud

#### Vista de Solicitudes
- Lista de solicitudes activas
- Filtros por animal y estado
- Información del adoptante
- Información del animal

#### Acciones
- **Ver Detalle**: Información completa
- **Agregar Nota Médica**: 
  - "El animal requiere cuidados especiales"
  - "Recomendamos adoptante con experiencia"
  - "Animal en perfecto estado de salud"

### 4. Gestión de Citas
**Ruta**: `/clinica/citas`

**Calendario de Citas Veterinarias:**

#### Vista de Calendario
- Vista mensual/semanal/diaria
- Citas codificadas por color:
  - 🔵 Vacunación
  - 🟢 Control general
  - 🟡 Pre-adopción
  - 🔴 Emergencia

#### Información por Cita
- Fecha y hora
- Animal
- Tipo de cita
- Adoptante (si aplica)
- Fundación
- Estado: Pendiente, Confirmada, Completada

#### Acciones
- **Confirmar cita**
- **Completar cita**: Redirige a crear registro médico
- **Reagendar**
- **Cancelar**

#### Agregar Nueva Cita
**Formulario:**
- Animal (búsqueda)
- Fecha y hora
- Tipo de cita
- Duración estimada
- Notas

### 5. Notificaciones
**Ruta**: `/clinica/notificaciones`

**Alertas de Clínica:**

#### Tipos
- **Cita próxima** 📅: "Cita en 24 horas con [Animal]"
- **Vacuna vencida** 💉: "Vacuna de [Animal] vence en 7 días"
- **Seguimiento pendiente** 🔔: "Seguimiento programado para [Animal]"
- **Nueva solicitud** 📬: "Solicitud requiere validación médica"

### 6. Header de Clínica

#### Navegación
- 🏠 **Inicio**: Dashboard de animales
- 📋 **Solicitudes**: Solicitudes de adopción
- 📅 **Citas**: Calendario de citas
- 🔔 **Notificaciones**

#### Perfil
- Ver perfil de la clínica
- Configuración
- Cerrar sesión

---

## 👑 GUÍA PARA ADMINISTRADORES

### Dashboard Principal
**Ruta**: `/admin`

Los administradores tienen **acceso completo** a todas las funcionalidades del sistema.

### 1. Resumen del Sistema
**Ruta**: `/admin` (index)

**Vista General del Sistema:**

#### Métricas Principales

**1. Total de Usuarios** 👥
- Número total registrado
- Crecimiento mensual (+X%)
- Gráfico de tendencia

**2. Usuarios Activos** ✅
- Usuarios con actividad reciente
- Porcentaje de activación
- Comparación mes anterior

**3. Adopciones del Mes** 📈
- Total de adopciones completadas
- Comparación con mes anterior
- Tendencia

**4. Total de Animales** 🐕
- En todo el sistema
- Por estado (Disponibles/Reservados/Adoptados)

**5. Animales Disponibles** 💚
- Listos para adopción
- Por fundación

**6. Solicitudes Pendientes** ⏳
- Requieren revisión
- Por fundación

**7. Fundaciones Activas** 🏢
- Con animales publicados
- Con actividad reciente

**8. Clínicas Activas** 🏥
- Con citas programadas
- Con registros recientes

#### Alertas del Sistema

**Panel de Alertas:**
- 🔴 **Error**: Errores críticos del sistema
- 🟡 **Advertencia**: Situaciones que requieren atención
  - "Actualización de seguridad disponible"
  - "Espacio de almacenamiento bajo"
  - "Rendimiento degradado"
- 🔵 **Info**: Información general
  - "Backup automático completado"
  - "X nuevos usuarios hoy"

#### Actividad Reciente
Timeline de últimas acciones:
- Nuevos registros
- Adopciones aprobadas
- Usuarios creados
- Cambios en configuración

### 2. Gestión de Usuarios
**Ruta**: `/admin/usuarios`

**CRUD Completo de Usuarios:**

#### Vista de Usuarios

**Búsqueda y Filtros:**
- Búsqueda por nombre o email
- Filtro por rol:
  - Todos
  - Adoptantes
  - Fundaciones
  - Clínicas
  - Administradores
- Filtro por estado:
  - Activos
  - Inactivos
  - Verificados
  - No verificados

#### Tabla de Usuarios

**Columnas:**
1. **Avatar/Foto**
2. **Nombre**
3. **Email**
4. **Rol** (badge de color)
5. **Estado**:
   - ✅ Activo
   - ⏸️ Inactivo
   - ✉️ Email verificado
6. **Fecha de registro**
7. **Última actividad**
8. **Acciones**

#### Acciones por Usuario

**1. Ver Perfil**
- Información completa
- Historial de actividad
- Estadísticas personales

**2. Editar Usuario**
Modal/Página con:
- Cambiar nombre
- Cambiar email (validación)
- Cambiar teléfono
- Cambiar dirección
- **Cambiar Rol** ⚠️ (acción sensible)
  - Confirmación requerida
  - Registro en auditoría

**3. Cambiar Estado**
- **Activar**: Usuario puede acceder
- **Desactivar**: Bloquea acceso temporalmente
  - No elimina datos
  - Reversible
  - Motivo requerido

**4. Resetear Contraseña**
- Envía email de reseteo
- Fuerza cambio en próximo login

**5. Ver Actividad**
- Logins recientes
- Acciones realizadas
- Cambios importantes

**6. Eliminar Usuario** 🗑️
- **Confirmación doble** requerida
- Advertencia: "Esta acción elimina todos los datos"
- Solo disponible si:
  - No tiene animales activos (para fundaciones)
  - No tiene solicitudes en proceso (para adoptantes)
  - No tiene citas programadas (para clínicas)

#### Crear Nuevo Usuario

**Formulario:**
- Nombre completo
- Email
- Rol
- Contraseña temporal
- Enviar email de bienvenida
- Marcar como verificado

#### Estadísticas de Usuarios
- Total por rol
- Tasa de activación
- Usuarios más activos
- Nuevos registros (últimos 30 días)

### 3. Configuración del Sistema
**Ruta**: `/admin/sistema`

**Panel de Configuración Global:**

#### Configuración General

**Información del Sistema**
- Nombre del sistema
- Logo principal
- Logo secundario
- Colores del tema
- Email de contacto
- Teléfono de soporte

**Configuración de Email**
- Proveedor (SendGrid/Nodemailer/Resend)
- API Key
- Email remitente
- Nombre remitente
- Plantillas de email

**Configuración de Almacenamiento**
- Cloudinary settings
- Cloud name
- API key
- API secret
- Carpeta de almacenamiento

#### Parámetros de Adopción

**Scoring**
- **Peso de cada pregunta** (0-100%):
  - Decisión familiar: XX%
  - Presupuesto: XX%
  - Permitir visitas: XX%
  - Etc.
- **Umbral de aprobación**: XX puntos (recomendado: 65+)
- **Umbral de rechazo automático**: XX puntos (ej: <35)

**Matching KNN**
- **K (número de vecinos)**: Default 15
- **Métrica de distancia**: Manhattan (fijo)
- **Peso de características**:
  - Tamaño: XX%
  - Energía: XX%
  - Edad: XX%
  - Etc.

**Predicción ML**
- **URL del servicio ML**: http://ml-service:8001
- **Timeout**: XX segundos
- **Habilitar/Deshabilitar predicción ML**

#### Seguridad

**Autenticación**
- Tiempo de expiración de sesión
- Longitud mínima de contraseña
- Requerir mayúsculas/números/símbolos
- Intentos de login permitidos
- Tiempo de bloqueo tras intentos fallidos

**Rate Limiting**
- Límite global (requests/minuto)
- Límite de autenticación
- Límite de API

**CORS**
- Orígenes permitidos (whitelist)
- Métodos permitidos
- Headers permitidos

#### Mantenimiento

**Backups**
- Frecuencia de backup automático
- Retención de backups
- Última backup: DD/MM/YYYY HH:MM
- **Botón**: Ejecutar backup manual

**Logs**
- Nivel de logging (Debug, Info, Warning, Error)
- Retención de logs
- Ver logs recientes
- Descargar logs

**Limpieza**
- Limpiar sesiones expiradas
- Limpiar archivos temporales
- Limpiar notificaciones antiguas

#### Actualizaciones
- Versión actual del sistema
- Última actualización
- Actualizaciones disponibles
- Changelog

### 4. Mensajes de Contacto
**Ruta**: `/admin/contactos`

**Gestión de Mensajes:**

#### Lista de Mensajes

**Tabla:**
1. **Fecha**
2. **Remitente** (nombre + email)
3. **Asunto**
4. **Preview del mensaje** (primeras líneas)
5. **Estado**: Nuevo, Leído, Respondido
6. **Acciones**

#### Detalle de Mensaje
- Nombre completo del remitente
- Email
- Asunto
- Mensaje completo
- Fecha y hora de envío

#### Acciones
- **Marcar como leído**
- **Responder**: Abre cliente de email
- **Archivar**
- **Eliminar**

#### Filtros
- Por estado (Nuevos, Leídos, Respondidos)
- Por fecha
- Búsqueda por texto

### 5. Acceso a Otros Paneles

Los administradores pueden acceder a:

#### Panel de Fundación
- Ver como fundación
- Gestionar animales de cualquier fundación
- Ver/editar solicitudes de cualquier fundación

#### Panel de Clínica
- Ver como clínica
- Acceder a historiales médicos
- Gestionar citas de cualquier clínica

**Indicador de Rol:**
Banner en la parte superior:
- "Estás viendo como: FUNDACIÓN (Fundación X)"
- Botón "Volver al panel de Admin"

### 6. Analítica Global
**Ruta**: `/analitica`

**Dashboard de Métricas Avanzadas:**

#### KPIs Principales
- **Tasa de Adopción**: (Adoptados / Disponibles) × 100
- **Tiempo Promedio de Adopción**: Días desde registro hasta adopción
- **Tasa de Aprobación**: (Aprobadas / Total Solicitudes) × 100
- **Score Promedio de Solicitudes**
- **Predicción ML Promedio**

#### Gráficos Avanzados

**1. Embudo de Adopción**
Visualización de flujo:
- Animales disponibles: 100%
- Solicitudes recibidas: XX%
- En evaluación: XX%
- Aprobadas: XX%
- Adoptadas: XX%

**2. Distribución de Scores**
Histograma:
- Cuántas solicitudes por rango de score
- Identifica patrones

**3. Correlación Score vs Predicción ML**
Scatter plot:
- Eje X: Score manual
- Eje Y: Predicción ML
- Identifica discrepancias

**4. Performance de Fundaciones**
Ranking:
- Por número de adopciones
- Por tasa de aprobación
- Por tiempo promedio

**5. Características Más Exitosas**
- Qué tamaños se adoptan más rápido
- Qué edades tienen más solicitudes
- Qué razas son más populares

#### Reportes Personalizados
- Generador de reportes custom
- Selección de métricas
- Rango de fechas
- Filtros múltiples
- Exportación (PDF, Excel, CSV)

### 7. Auditoría
**Ruta**: `/admin/auditoria` (futuro)

**Registro de Acciones Críticas:**

#### Eventos Auditados
- Cambios de rol de usuario
- Eliminación de usuarios
- Eliminación de animales
- Cambios en configuración del sistema
- Aprobaciones/Rechazos de solicitudes importantes
- Accesos desde IPs inusuales

#### Log de Auditoría
**Columnas:**
- Timestamp
- Usuario que realizó la acción
- Tipo de acción
- Recurso afectado
- Detalles (antes/después)
- IP de origen

#### Búsqueda y Filtros
- Por usuario
- Por tipo de acción
- Por fecha
- Por recurso

---

## 🔐 CARACTERÍSTICAS COMUNES A TODOS LOS ROLES

### Seguridad

#### Autenticación
- **JWT (JSON Web Tokens)**: Sesiones seguras
- **Bcrypt**: Hash de contraseñas con 10 rounds
- **Expiración de tokens**: 7 días (configurable)
- **Refresh tokens**: Renovación automática

#### Protección de Rutas
- Rutas protegidas por autenticación
- Rutas protegidas por rol
- Redirección automática si no autorizado

#### Rate Limiting
- **Global**: 100 requests / 15 minutos por IP
- **Autenticación**: 10 intentos de login / 15 minutos
- Protección contra ataques de fuerza bruta

#### Validación de Datos
- **Zod schemas**: Validación en runtime
- Sanitización de inputs
- Prevención de inyección SQL/NoSQL
- Prevención de XSS

#### Headers de Seguridad (Helmet.js)
- Content Security Policy
- X-Frame-Options (anti-clickjacking)
- X-Content-Type-Options (anti-MIME sniffing)
- Strict-Transport-Security (force HTTPS)

### Notificaciones

#### Sistema de Toast (React Hot Toast)
- **Éxito**: ✅ Confirmación de acciones
- **Error**: ❌ Mensajes de error claros
- **Info**: ℹ️ Información general
- **Advertencia**: ⚠️ Advertencias importantes

#### Posición y Duración
- Top-center por defecto
- Duración personalizable
- Cierre manual o automático

### Estados de Carga

#### Loading States
- **Spinners**: Mientras carga información
- **Skeleton**: Placeholders durante carga
- **Texto descriptivo**: "Cargando animales..."

#### Estados Vacíos
- **EmptyState component**: Cuando no hay datos
- Mensajes amigables
- Call-to-action cuando aplica

### Responsividad

#### Mobile-First Design
- Optimizado para móviles
- Adaptable a tablets
- Full experience en desktop

#### Breakpoints (TailwindCSS)
- **sm**: 640px+
- **md**: 768px+
- **lg**: 1024px+
- **xl**: 1280px+

#### Menús Adaptables
- Hamburger menu en móvil
- Sidebar en desktop
- Touch-friendly

### Accesibilidad

#### Navegación por Teclado
- Tab navigation
- Focus visible
- Skip links

#### Semántica HTML
- Etiquetas correctas
- ARIA labels donde necesario

#### Contraste de Colores
- AA compliance
- Textos legibles

---

## 🎨 DISEÑO Y UX

### Paleta de Colores

#### Colores Primarios
- **Primary (Verde)**: #2E7D32
  - Botones principales
  - Links importantes
  - Badges de éxito

- **Accent (Naranja)**: #FB8C00
  - Llamados a la acción
  - Destacados
  - Badges de advertencia

- **Surface (Beige)**: #F2E9E4
  - Fondos suaves
  - Cards
  - Secciones

#### Colores de Estado
- **Success (Verde)**: Aprobado, Disponible
- **Warning (Amarillo)**: En revisión, Pendiente
- **Info (Azul)**: Información, Recibido
- **Danger (Rojo)**: Rechazado, Error
- **Neutral (Gris)**: Inactivo, Archivado

### Tipografía

#### Fuentes
- **Sans-serif**: Inter (UI, textos generales)
- **Serif**: Lora (Títulos destacados, branding)

#### Jerarquía
- **H1**: 3-4xl, bold
- **H2**: 2-3xl, bold
- **H3**: xl-2xl, semibold
- **Body**: base, regular
- **Caption**: sm, regular

### Componentes UI

#### Botones
- **Primario**: Fondo verde, texto blanco
- **Secundario**: Outline, texto verde
- **Outline**: Borde, fondo transparente
- **Ghost**: Sin borde, hover con fondo

#### Cards
- Fondo blanco
- Border sutil
- Shadow suave
- Hover: shadow elevado + border accent

#### Badges
- Tamaños: sm, md, lg
- Variantes: success, warning, info, default, danger
- Uppercase para estados

#### Inputs
- Border sutil
- Focus: ring accent
- Placeholder gris claro
- Error: border rojo + mensaje

### Iconografía

#### Lucide React
Iconos SVG modernos y escalables:
- **Heart**: Adopción, favoritos
- **Dog/PawPrint**: Animales
- **Users**: Adoptantes, equipo
- **Building**: Fundaciones
- **Stethoscope**: Clínica
- **Calendar**: Citas
- **Eye**: Ver detalles
- **Edit**: Editar
- **Trash**: Eliminar
- **Check**: Aprobar
- **X**: Rechazar
- **Star**: Rating, destacado

---

## 📱 NAVEGACIÓN

### Estructura de URLs

#### Públicas
- `/` - Home
- `/catalog` - Catálogo
- `/adoptar` - Alias de catálogo
- `/adoptar/:id` - Detalle animal
- `/login` - Login adoptantes
- `/register` - Registro
- `/about` - Sobre nosotros
- `/contact` - Contacto
- `/faq` - Preguntas frecuentes
- `/process` - Proceso de adopción
- `/terms` - Términos y condiciones
- `/privacy` - Política de privacidad

#### Adoptante (Autenticado)
- `/profile` - Perfil personal
- `/recommendations` - Recomendaciones KNN
- `/mis-solicitudes` - Mis solicitudes
- `/mis-citas` - Mis citas
- `/adoptar/:id/aplicar` - Formulario de solicitud
- `/mis-solicitudes/:id/agendar-cita` - Agendar cita

#### Fundación
- `/fundacion` - Dashboard
- `/fundacion/animales` - CRUD animales
- `/fundacion/solicitudes` - Gestión solicitudes
- `/fundacion/estadisticas` - Analytics
- `/notificaciones` - Notificaciones

#### Clínica
- `/clinica` - Dashboard animales
- `/clinica/animals/:id/medical-history` - Historial médico
- `/clinica/solicitudes` - Solicitudes
- `/clinica/citas` - Calendario citas
- `/clinica/notificaciones` - Notificaciones

#### Administrador
- `/admin` - Resumen sistema
- `/admin/usuarios` - Gestión usuarios
- `/admin/sistema` - Configuración
- `/admin/contactos` - Mensajes de contacto
- `/analitica` - Analytics global

### Breadcrumbs

Navegación contextual en rutas anidadas:
```
Home > Catálogo > Labrador Max > Solicitar Adopción
```

### Redirecciones Automáticas

#### Por Rol (tras login)
- **ADOPTANTE** → `/catalog`
- **FUNDACION** → `/fundacion`
- **CLINICA** → `/clinica`
- **ADMIN** → `/admin`

#### Protección de Rutas
- Sin autenticación → `/login`
- Sin permisos → Página de acceso denegado

---

## 🔄 FLUJOS COMPLETOS

### Flujo de Adopción Exitosa

1. **Adoptante se Registra**
   - Completa información personal
   - Define preferencias de adopción

2. **Explora el Catálogo**
   - Busca y filtra animales
   - Revisa recomendaciones KNN

3. **Encuentra un Match**
   - Ve perfil completo del animal
   - Lee sobre características y personalidad

4. **Solicita Adopción**
   - Llena formulario de evaluación
   - Sistema calcula score automático
   - ML predice propensión de éxito

5. **Fundación Revisa**
   - Analiza score y predicción ML
   - Revisa respuestas del formulario
   - Decide: aprobar, rechazar o solicitar visita

6. **Visita Domiciliaria** (opcional)
   - Fundación agenda cita
   - Valida condiciones del hogar
   - Actualiza estado

7. **Aprobación**
   - Fundación aprueba solicitud
   - Adoptante recibe confirmación
   - Animal pasa a estado "Reservado"

8. **Cita Veterinaria**
   - Revisión médica pre-entrega
   - Clínica registra estado de salud
   - Última vacunación si necesario

9. **Entrega**
   - Cita de entrega programada
   - Firma de contrato (offline)
   - Animal pasa a estado "Adoptado"

10. **Seguimiento Post-Adopción**
    - Visitas de seguimiento
    - Actualizaciones de estado
    - Soporte continuo

### Flujo de Solicitud Rechazada

1. **Fundación Rechaza**
   - Ingresa motivo detallado
   - Sistema envía notificación

2. **Adoptante Recibe Feedback**
   - Lee motivo de rechazo
   - Consejos para mejorar

3. **Mejora Perfil** (opcional)
   - Actualiza preferencias
   - Toma acciones sugeridas

4. **Nueva Solicitud**
   - Puede aplicar nuevamente
   - Con perfil mejorado

---

## ❓ PREGUNTAS FRECUENTES POR ROL

### Para Adoptantes

**Q: ¿Puedo aplicar a varios animales a la vez?**
A: Sí, puedes enviar múltiples solicitudes. Sin embargo, es recomendable enfocarte en los animales con los que tengas mejor compatibilidad (score alto en recomendaciones).

**Q: ¿Qué significa el score de matching?**
A: Es un porcentaje de 0-100 que indica qué tan compatible eres con el animal basado en tus preferencias y las características del animal. Calculado con algoritmo KNN.

**Q: ¿Por qué mi solicitud fue rechazada?**
A: La fundación siempre proporciona un motivo. Revísalo en "Mis Solicitudes" y mejora los aspectos señalados antes de volver a aplicar.

**Q: ¿Cuánto tiempo tarda la evaluación?**
A: Depende de cada fundación, pero típicamente entre 3-7 días. Recibirás notificaciones de cambios de estado.

### Para Fundaciones

**Q: ¿Cómo funciona el score automático?**
A: El sistema evalúa las respuestas del formulario con ponderaciones predefinidas. También incluye una predicción ML basada en datos históricos.

**Q: ¿Puedo modificar los parámetros de scoring?**
A: No directamente. Los administradores pueden ajustar los pesos de cada pregunta en la configuración del sistema.

**Q: ¿Qué pasa si elimino un animal que tiene solicitudes?**
A: Las solicitudes asociadas se mantienen, pero el animal se marcará como "Eliminado". Es mejor cambiar el estado a "Adoptado" si fue adoptado.

**Q: ¿Puedo ver solicitudes de otras fundaciones?**
A: No, solo ves solicitudes de tus propios animales por seguridad y privacidad.

### Para Clínicas

**Q: ¿Puedo editar historiales médicos antiguos?**
A: Solo puedes editar registros del mismo día por seguridad. Para correcciones posteriores, agrega un nuevo registro con la corrección.

**Q: ¿Las fundaciones ven los historiales médicos?**
A: Sí, las fundaciones pueden ver el historial de sus animales, pero no pueden editarlo. Solo clínicas pueden agregar/editar registros médicos.

### Para Administradores

**Q: ¿Cómo afectan los cambios en scoring a solicitudes existentes?**
A: Los cambios solo afectan nuevas solicitudes. Las solicitudes existentes mantienen su score original.

**Q: ¿Puedo recuperar un usuario eliminado?**
A: No, la eliminación es permanente. Se recomienda usar "Desactivar" en lugar de eliminar.

---

## 🆘 SOPORTE Y AYUDA

### Contacto con el Equipo
- **Email**: lets.crp@outlook.com
- **Formulario**: `/contact`
- **Teléfono**: (Disponible para fundaciones y clínicas)

### Recursos Adicionales
- **FAQ**: `/faq`
- **Proceso de Adopción**: `/process`
- **Términos**: `/terms`
- **Privacidad**: `/privacy`

### Reportar Problemas
- Usa el formulario de contacto
- Incluye screenshots si es posible
- Describe el problema paso a paso

---

## 📝 NOTAS TÉCNICAS

### Navegadores Soportados
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Requisitos de Sistema
- Conexión a Internet estable
- JavaScript habilitado
- Cookies habilitadas (para autenticación)

### Performance
- Lazy loading de imágenes
- Paginación en listas grandes
- Caching con React Query
- CDN para imágenes (Cloudinary)

### Privacidad y Datos
- Datos encriptados en tránsito (HTTPS)
- Contraseñas hasheadas (bcrypt)
- No se comparten datos con terceros
- Cumplimiento con políticas de privacidad

---

## 📅 ACTUALIZACIONES

### Versión Actual: 1.0
**Fecha**: Enero 2026

### Funcionalidades Principales
- ✅ Sistema de matching KNN
- ✅ Predicción ML de propensión de adopción
- ✅ CRUD completo para todos los roles
- ✅ Sistema de scoring automático
- ✅ Gestión de historiales médicos
- ✅ Analytics y reportes
- ✅ Notificaciones en tiempo real


**¡Gracias por usar Huellitas Quiteñas!** 🐾

*Ayudando a conectar familias con sus nuevos mejores amigos.*

---

© 2026 Huellitas Quiteñas. Todos los derechos reservados.
