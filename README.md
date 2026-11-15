# 🎓 Frontend: TechUniversity — Sistema de Gestión Académica y Financiera (React 19 + TypeScript)

## Descripción

Aplicación web cliente desarrollada con **React 19**, **TypeScript**, **Tailwind CSS v4** y **Vite** para la administración integral de instituciones educativas (SGAF). Se integra directamente con la API RESTful de **NestJS** (`https://sgaf-funval.onrender.com/api`) bajo una arquitectura modular orientada por roles (**RBAC**), con soporte completo de **Modo Claro / Oscuro**, visualización de reportes estadísticos con **Recharts v3** y gestión de estado global con **Zustand**.

---

## ✨ Características Principales

* **Control de Acceso Basado en Roles (RBAC):**
  * **Administrador:** Panel ejecutivo, estadísticas globales filtrables por periodo académico, reportes financieros con exportación CSV, corte mensual de morosidad, gestión de usuarios (con reseteo seguro de claves temporales) y gestión académica integral (periodos, grupos, horarios, materias y aulas).
  * **Recepcionista:** Activación de matrículas iniciales, cobros en ventanilla/caja, emisión de comprobantes y directorio de estudiantes.
  * **Profesor:** Gestión de grupos asignados, publicación de materiales de clase, creación de tareas y registro de calificaciones ponderadas.
  * **Estudiante:** Matrícula en línea con validación de créditos y cupos, aula virtual con entrega de archivos, visualización de notas ponderadas y estado de cuenta con pasarela de pago en línea.
* **Flujo de Acceso Restringido por Estado Financiero:** Los estudiantes en estado `PENDIENTE` (matrícula inicial sin abonar) o `SUSPENDIDO` (mora mensual) acceden exclusivamente a su **Estado de Cuenta** para regularizar sus pagos y reactivar su cuenta automáticamente a `ACTIVO`.
* **Modo Oscuro Integral (Tailwind CSS v4):** Sistema de diseño basado en variables semánticas (`bg-bg-base`, `bg-bg-surface`, `text-text-base`, `text-text-muted`, `brand-primary`) adaptado en todas las vistas, tablas, modales y gráficos de **Recharts v3**.
* **Arquitectura Modular:** Separación estricta por dominio (`features/`), custom hooks para la lógica de negocio, componentes desacoplados y notificaciones interactivas con **Sonner**.

---

## 🛠️ Stack Tecnológico

* **Core:** React 19 + TypeScript + Vite 8
* **Enrutamiento:** React Router v7
* **Estado Global:** Zustand
* **Estilos e Iconografía:** Tailwind CSS v4 + Lucide React
* **Visualización de Datos:** Recharts v3
* **Notificaciones y UX:** Sonner
* **Cliente HTTP:** Axios (con interceptores JWT y manejo centralizado de errores)
* **Backend Integrado:** [API SGAF NestJS + Prisma + PostgreSQL](https://github.com/mmitacc/sgaf-funval)

---

## 📁 Estructura del Proyecto

```text
src/
├── components/          # Componentes globales reutilizables (Layout, ErrorBoundary, Footer)
├── config/              # Configuración de menús por rol y tema dinámico de Recharts
├── features/            # Módulos por dominio (admin, auth, estudiante, profesor, recepcion, usuario)
│   └── <feature>/
│       ├── components/  # Tablas, tarjetas KPI, gráficos y modales independientes
│       ├── hooks/       # Custom hooks con lógica de estado y llamadas a servicios
│       ├── pages/       # Vistas ligeras y modulares
│       ├── services/    # Peticiones HTTP hacia la API REST
│       └── types/       # Interfaces y contratos TypeScript
├── services/            # Instancia base de Axios y formateador de errores
└── utils/               # Utilidades (apertura de pasarela de pago, formateadores)
```

---

## ⚙️ Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/mmitacc/sgaf-app
   cd sgaf-funval-front
   ```
   *(Ajusta el nombre del repositorio si difiere en tu cuenta de GitHub).*

2. **Instalar las dependencias:**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno:**
   Crea o actualiza el archivo `.env` en la raíz del proyecto tomando como base `.env.example` (o `.env.ejemplo`):
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Levantar el servidor en modo desarrollo:**
   ```bash
   pnpm run dev
   ```

5. **Compilar para producción (Vercel):**
   ```bash
   pnpm run build
   ```
   *(El proyecto incluye `vercel.json` configurado con rewrites SPA para soportar recargas en rutas internas de React Router v7 y división optimizada de chunks en `vite.config.ts`).*

---

## 🔐 Usuarios de Prueba (Demo)

Puedes explorar todos los flujos y roles de la plataforma utilizando las siguientes credenciales de demostración:

| Rol | Correo Electrónico | Contraseña | Acceso Principal |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@prisma.edu` | `Admin123` | Estadísticas, Finanzas, Usuarios y Gestión Académica |
| **Recepcionista** | `recepcion@prisma.edu` | `654321` | Caja, Cobros, Matrículas y Directorio |
| **Profesor** | `roberto.silva@prisma.edu` | `123456789` | Grupos Asignados, Materiales y Calificaciones |
| **Estudiante** | `alumno.sofia@prisma.edu` | `123456` | Aula Virtual, Notas, Matrícula y Estado de Cuenta |

---

## 👨‍💻 Autor

**Manuel Mitacc** (`@mmitacc`) — *Full-Stack Developer*  
Para mayores detalles sobre el proyecto o consultas técnicas, puedes contactarme en:

* **GitHub:** [://github.com](https://github.com/mmitacc)
* **LinkedIn:** [://linkedin.com](https://www.linkedin.com/in/mmitacc/)
* **Teléfono:** +51 996 080 313 (Tacna - Perú)
* **Email:** manuelmitacc@hotmail.com

---

## 📄 Licencia

MIT License

Copyright (c) 2026 [Manuel Mitacc](https://github.com/mmitacc)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
