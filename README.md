# 🐾 Huellitas Quiteñas – Frontend

Frontend de la **WebApp Huellitas Quiteñas**, una plataforma tecnológica orientada a optimizar y transparentar el proceso de adopción responsable de animales, integrando adoptantes, fundaciones, clínicas veterinarias y administradores dentro de un único sistema web.

Este repositorio contiene la **capa de presentación (Frontend)** desarrollada como una **Single Page Application (SPA)** moderna, escalable y modular.

---

## 📌 Descripción general

El frontend de Huellitas Quiteñas fue diseñado para ofrecer:

* Una **experiencia de usuario clara y diferenciada por roles**
* Acceso seguro mediante **autenticación y control de permisos**
* Interacción fluida con el backend mediante **API REST**
* Visualización de información, formularios y dashboards analíticos
* Escalabilidad y mantenibilidad a nivel de código

La aplicación se encuentra preparada tanto para **entornos académicos (tesis)** como para un **despliegue real en producción**.

---

## 🧱 Arquitectura del Frontend

La aplicación sigue una **arquitectura modular basada en dominios (feature-based architecture)**, separando claramente:

* Presentación
* Lógica de negocio del frontend
* Gestión de estado
* Comunicación con el backend
* Infraestructura y utilidades

### 📁 Estructura principal del proyecto

```
src/
│
├── app/                # Configuración central de la aplicación
│   ├── routes.tsx      # Definición de rutas y control de acceso
│   ├── ProtectedRoute.tsx
│   └── queryClient.ts
│
├── layouts/            # Layouts por contexto (público, dashboard, admin)
├── pages/              # Páginas principales
├── features/           # Módulos por dominio funcional
│   ├── animals
│   ├── applications
│   ├── foundation
│   ├── clinic
│   ├── analytics
│   └── admin
│
├── components/         # Componentes reutilizables
├── lib/                # Infraestructura (API, auth, errores)
├── types/              # Tipos globales TypeScript
├── utils/              # Utilidades y helpers
├── main.tsx            # Punto de entrada de la aplicación
└── index.css           # Estilos globales (TailwindCSS)
```

---

## 🛠️ Stack Tecnológico

### Frontend Core

* **React + TypeScript**
* **Vite** (entorno de desarrollo y build)
* **TailwindCSS** (estilos)

### Navegación y Estado

* **React Router DOM** (rutas jerárquicas)
* **Zustand** (estado global de autenticación, persistido)
* **TanStack React Query** (gestión de estado del servidor)

### Formularios y Validación

* **React Hook Form**
* **Zod**

### Comunicación con Backend

* **Axios** con interceptores de autenticación

### UI y Experiencia de Usuario

* **react-hot-toast** (notificaciones)
* **Recharts** (gráficas y dashboards)
* **jsPDF** (generación de documentos PDF)

---

## 🔐 Autenticación y Control de Acceso

El sistema implementa un modelo **RBAC (Role-Based Access Control)**, controlando el acceso a vistas y funcionalidades según el rol del usuario.

### Roles soportados:

* **ADOPTANTE**
* **FUNDACION**
* **CLINICA**
* **ADMIN**

Las rutas protegidas se gestionan mediante un componente `ProtectedRoute`, que valida:

* Autenticación activa
* Rol autorizado
* Redirección automática al login correspondiente

El estado de sesión se gestiona mediante **Zustand**, persistiendo el token y la información del usuario.

---

## 🔄 Gestión de Datos (Server State)

La comunicación con el backend se realiza mediante **React Query**, lo que permite:

* Cacheo automático de datos
* Reintentos controlados ante errores
* Sincronización eficiente del estado remoto
* Optimización del rendimiento y reducción de llamadas innecesarias

Cada módulo funcional define sus propios hooks (`useQuery`, `useMutation`) de forma desacoplada.

---

## ⚠️ Manejo de Errores y Observabilidad

El frontend incorpora un sistema de manejo de errores en dos niveles:

### 1️⃣ Error Boundaries

* Captura errores de renderizado
* Muestra una interfaz amigable al usuario
* Reporta el error al backend para análisis técnico

### 2️⃣ Captura Global

* Manejo de errores no controlados (`window.onerror`)
* Captura de promesas rechazadas
* Envío de reportes automáticos a endpoints administrativos

Esto permite **mejorar la estabilidad y facilitar el mantenimiento del sistema**.

---

## 🎨 Interfaz de Usuario

* Diseño responsive y consistente mediante TailwindCSS
* Layouts diferenciados por tipo de usuario
* Feedback inmediato mediante notificaciones
* Dashboards visuales para analítica y gestión
* Formularios validados en tiempo real

---

## 🚀 Ejecución del proyecto

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/huellitas-quitenas-frontend.git
cd huellitas-quitenas-frontend
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Configurar variables de entorno

Crear un archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:3000
```

### 4️⃣ Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en:

```
http://localhost:5173
```

---

## 🌐 Despliegue

El proyecto está preparado para despliegue como **SPA**, incluyendo configuración de rewrite (`vercel.json`) para soportar rutas dinámicas en producción.

Puede desplegarse en plataformas como:

* Vercel
* Netlify
* Render
* Servidores propios con soporte SPA

---

## 🎓 Contexto Académico

Este frontend forma parte del desarrollo de una **tesis universitaria**, orientada a:

* Aplicar ingeniería de software moderna
* Integrar tecnología con impacto social
* Diseñar sistemas éticos y responsables
* Facilitar procesos de adopción animal mediante tecnología

---

## 👤 Autor

**Nombre del proyecto:** Huellitas Quiteñas
**Tipo:** WebApp – Frontend
**Tecnologías:** React, TypeScript, Vite
**Propósito:** Académico y social

* O hacerlo **más orientado a producto/startup**
* O crear también el **README del backend** para que ambos queden alineados 🔥
