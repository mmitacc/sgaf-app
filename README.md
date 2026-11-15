# 🎓 TechUniversity — Frontend (Sistema de Gestión Académica y Financiera)

Aplicación web moderna para la administración integral de instituciones educativas superiores, desarrollada con **React 19**, **TypeScript**, **Tailwind CSS v4** y **Vite**. Permite gestionar procesos académicos, matrículas en línea, aula virtual, cobranzas, pasarela de pagos y reportes ejecutivos bajo una arquitectura modular orientada por roles.

---

## 🚀 Características Principales

* **Control de Acceso Basado en Roles (RBAC):**
  * **Administrador:** Panel ejecutivo, estadísticas globales por periodo, reportes financieros con exportación CSV, corte mensual de morosidad, gestión de usuarios (con reseteo seguro de claves) y estructura académica (periodos, grupos, horarios, materias y aulas).
  * **Recepcionista:** Activación de matrículas, cobros en ventanilla/caja, emisión de comprobantes y directorio de estudiantes.
  * **Profesor:** Gestión de secciones asignadas, publicación de materiales de clase, creación de tareas y registro de calificaciones ponderadas.
  * **Estudiante:** Matrícula en línea con validación de créditos y cupos, aula virtual con entrega de archivos, visualización de notas ponderadas y estado de cuenta con pago en línea.
* **Flujo de Acceso Restringido por Estado Financiero:** Los estudiantes con estado `PENDIENTE` (matrícula inicial sin abonar) o `SUSPENDIDO` (mora mensual) acceden exclusivamente a su **Estado de Cuenta** para regularizar sus pagos y reactivar su cuenta automáticamente.
* **Tema Claro / Oscuro Integral:** Sistema de diseño basado en variables semánticas de Tailwind CSS v4 con soporte dinámico para gráficos estadísticos en **Recharts v3**.
* **Arquitectura Modular:** Separación estricta por dominio (`features/`), custom hooks para lógica de negocio, componentes desacoplados y manejo de errores con notificaciones interactivas (**Sonner**).

---

## 🛠️ Stack Tecnológico

* **Core:** React 19 + TypeScript + Vite
* **Enrutamiento:** React Router v7
* **Estado Global:** Zustand
* **Estilos e Iconografía:** Tailwind CSS v4 + Lucide React
* **Visualización de Datos:** Recharts v3
* **Notificaciones y UX:** Sonner
* **Cliente HTTP:** Axios (con interceptores JWT y manejo centralizado de errores)
* **Backend Integrado:** NestJS + Prisma ORM + PostgreSQL + Cloudinary

---

## 📁 Estructura del Proyecto

```text
src/
├── components/          # Componentes globales reutilizables (Layout, ErrorBoundary, Footer)
├── config/              # Configuración de menús por rol y tema dinámico de Recharts
├── features/            # Módulos por rol/dominio (admin, auth, estudiante, profesor, recepcion, usuario)
│   └── <feature>/
│       ├── components/  # Tablas, tarjetas KPI, gráficos y modales independientes
│       ├── hooks/       # Custom hooks con lógica de estado y llamadas a servicios
│       ├── pages/       # Vistas ligeras (< 150 líneas)
│       ├── services/    # Peticiones HTTP hacia la API REST
│       └── types/       # Interfaces y contratos TypeScript
├── services/            # Instancia base de Axios y formateador de errores
└── utils/               # Utilidades (apertura de pasarela de pago, formateadores)
```

---

## ⚙️ Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone `https://github.com/mmitacc/sgaf-app`
   cd techuniversity-frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto tomando como base `.env.example`:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Iniciar servidor de desarrollo:**
   ```bash
   pnpm dev
   ```

5. **Compilar para producción (Vercel):**
   ```bash
   pnpm build
   ```
   *(El proyecto incluye `vercel.json` configurado con rewrites SPA para soportar recargas en rutas internas de React Router v7).*

---

## 👨‍💻 Autor

**@mmitacc** — *Full-Stack Developer*  
Especializado en el desarrollo de aplicaciones web escalables con **TypeScript, React, NestJS, Prisma y PostgreSQL**.

* **GitHub:** [@mmitacc](https://github.com/mmitacc)

---

## 🔐 Usuarios de Prueba (Demo)

Puedes explorar todos los flujos de la plataforma utilizando las siguientes credenciales de demostración:

| Rol | Correo Electrónico | Contraseña | Acceso Principal |
| **Administrador** | `admin@prisma.edu` | `Admin123` | Estadísticas, Finanzas, Usuarios y Gestión Académica |
| **Recepcionista** | `recepcion@prisma.edu` | `654321` | Caja, Cobros, Matrículas y Directorio |
| **Profesor** | `roberto.silva@prisma.edu` | `123456789` | Grupos Asignados, Materiales y Calificaciones |
| **Estudiante** | `alumno.sofia@prisma.edu` | `123456` | Aula Virtual, Notas, Matrícula y Estado de Cuenta |
