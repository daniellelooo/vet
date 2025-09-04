# 🏥 VetCare - Sistema Veterinario a Domicilio

![VetCare Banner](https://img.shields.io/badge/VetCare-Sistema%20Veterinario-orange?style=for-the-badge&logo=veterinary&logoColor=white)

Un sistema completo de gestión veterinaria que permite a los usuarios agendar citas veterinarias a domicilio, gestionar sus mascotas y acceder a servicios veterinarios profesionales desde la comodidad de su hogar.

## 📋 Tabla de Contenidos

- [🌟 Características](#-características)
- [🛠️ Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [⚙️ Instalación y Configuración](#️-instalación-y-configuración)
- [🚀 Cómo Ejecutar el Proyecto](#-cómo-ejecutar-el-proyecto)
- [👤 Credenciales de Demo](#-credenciales-de-demo)
- [📖 Manual de Usuario](#-manual-de-usuario)
- [🔧 API Documentation](#-api-documentation)
- [🎨 Diseño y UI](#-diseño-y-ui)
- [🔒 Seguridad](#-seguridad)
- [📝 Scripts Disponibles](#-scripts-disponibles)
- [🤝 Contribución](#-contribución)
- [📄 Licencia](#-licencia)

## 🌟 Características

### ✨ Funcionalidades Principales

- **🏠 Servicios a Domicilio**: Atención veterinaria sin salir de casa
- **📅 Agendamiento de Citas**: Sistema intuitivo para reservar citas
- **🐕 Gestión de Mascotas**: Registro y seguimiento completo de mascotas
- **🔬 Solicitud de Exámenes**: Petición de análisis clínicos y diagnósticos
- **👨‍⚕️ Veterinarios Certificados**: Profesionales con años de experiencia
- **🚨 Emergencias 24/7**: Atención de urgencias las 24 horas
- **📱 Diseño Responsivo**: Optimizado para móviles, tablets y desktop
- **🎨 Interfaz Moderna**: Diseño minimalista con colores cálidos

### 🔧 Características Técnicas

- **Autenticación JWT**: Sistema seguro de login y registro
- **Base de Datos SQLite**: Almacenamiento eficiente y portable
- **API RESTful**: Endpoints bien estructurados y documentados
- **Validación de Datos**: Validación en frontend y backend
- **Encriptación de Contraseñas**: Usando bcrypt para seguridad
- **Hot Reload**: Desarrollo ágil con recarga automática
- **TypeScript**: Tipado estático para mayor robustez

## 🛠️ Tecnologías Utilizadas

### Frontend

- **React 19.1.1** - Framework de JavaScript
- **TypeScript 5.8.3** - Superset tipado de JavaScript
- **Vite 7.1.4** - Build tool y dev server ultra-rápido
- **Tailwind CSS 3.x** - Framework de CSS utilitario
- **React Router Dom 7.8.2** - Enrutamiento para React
- **Axios 1.11.0** - Cliente HTTP para APIs

### Backend

- **Node.js** - Entorno de ejecución de JavaScript
- **Express.js** - Framework web para Node.js
- **TypeScript** - Tipado estático
- **SQLite3** - Base de datos relacional ligera
- **better-sqlite3** - Driver rápido para SQLite
- **bcryptjs** - Encriptación de contraseñas
- **jsonwebtoken** - Autenticación JWT
- **cors** - Manejo de CORS
- **helmet** - Middleware de seguridad
- **morgan** - Logger de HTTP
- **nodemon** - Auto-restart en desarrollo

### Herramientas de Desarrollo

- **ESLint** - Linter de JavaScript/TypeScript
- **Prettier** - Formateador de código
- **PostCSS** - Procesador de CSS
- **Autoprefixer** - Prefijos CSS automáticos
- **Concurrently** - Ejecución simultánea de scripts

## 📁 Estructura del Proyecto

```
vet-funcional/
├── 📂 backend/                    # Servidor Node.js + Express
│   ├── 📂 src/
│   │   ├── 📂 database/          # Configuración de base de datos
│   │   │   ├── connection.ts     # Conexión y esquemas
│   │   │   └── setup.ts          # Datos iniciales y seeding
│   │   ├── 📂 middleware/        # Middlewares personalizados
│   │   │   └── auth.ts           # Autenticación JWT
│   │   ├── 📂 models/            # Tipos y interfaces
│   │   │   └── types.ts          # Definiciones TypeScript
│   │   ├── 📂 routes/            # Endpoints de la API
│   │   │   ├── auth.ts           # Autenticación (login/register)
│   │   │   ├── appointments.ts   # Gestión de citas
│   │   │   ├── pets.ts           # Gestión de mascotas
│   │   │   ├── services.ts       # Servicios veterinarios
│   │   │   └── veterinarians.ts  # Información de veterinarios
│   │   └── index.ts              # Archivo principal del servidor
│   ├── package.json              # Dependencias del backend
│   ├── tsconfig.json             # Configuración TypeScript
│   └── veterinaria.db            # Base de datos SQLite (auto-generada)
│
├── 📂 frontend/                   # Aplicación React
│   ├── 📂 public/                # Archivos estáticos
│   ├── 📂 src/
│   │   ├── 📂 components/        # Componentes React
│   │   │   ├── AppointmentsPage.tsx  # Página de citas
│   │   │   ├── ExamsPage.tsx         # Página de exámenes
│   │   │   ├── HomePage.tsx          # Página principal
│   │   │   ├── Layout.tsx            # Layout principal
│   │   │   ├── LoginPage.tsx         # Página de login
│   │   │   ├── Navbar.tsx            # Barra de navegación
│   │   │   ├── PetsPage.tsx          # Página de mascotas
│   │   │   ├── RegisterPage.tsx      # Página de registro
│   │   │   └── ServicesPage.tsx      # Página de servicios
│   │   ├── 📂 contexts/          # Contextos de React
│   │   │   └── AuthContext.tsx   # Contexto de autenticación
│   │   ├── 📂 hooks/             # Hooks personalizados
│   │   │   └── useAuth.ts        # Hook de autenticación
│   │   ├── App.tsx               # Componente principal
│   │   ├── main.tsx              # Punto de entrada
│   │   └── index.css             # Estilos globales + Tailwind
│   ├── package.json              # Dependencias del frontend
│   ├── tailwind.config.js        # Configuración Tailwind
│   ├── postcss.config.js         # Configuración PostCSS
│   ├── tsconfig.json             # Configuración TypeScript
│   └── vite.config.ts            # Configuración Vite
│
├── package.json                  # Scripts principales del proyecto
└── README.md                     # Este archivo
```

## ⚙️ Instalación y Configuración

### Prerrequisitos

Asegúrate de tener instalado:

- **Node.js** (versión 18.0 o superior)
- **npm** (versión 8.0 o superior)
- **Git** (para clonar el repositorio)

### 📥 Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/tu-usuario/vet-funcional.git
   cd vet-funcional
   ```

2. **Instalar dependencias del proyecto principal**

   ```bash
   npm install
   ```

3. **Instalar dependencias del backend**

   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Instalar dependencias del frontend**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### 🔧 Configuración

1. **Configurar variables de entorno del backend**

   Crear archivo `.env` en la carpeta `backend/`:

   ```env
   # Puerto del servidor backend
   PORT=3000

   # URL del frontend para CORS
   FRONTEND_URL=http://localhost:5173

   # Clave secreta para JWT (cambiar en producción)
   JWT_SECRET=tu_clave_secreta_super_segura

   # Configuración de base de datos
   DB_PATH=./veterinaria.db
   ```

2. **Configuración adicional (opcional)**

   - El proyecto está preconfigurado para funcionar en localhost
   - La base de datos SQLite se crea automáticamente
   - Los datos de demo se insertan automáticamente al iniciar

## 🚀 Cómo Ejecutar el Proyecto

### Opción 1: Ejecutar todo el proyecto (Recomendado)

```bash
# Desde el directorio raíz del proyecto
npm run dev
```

Este comando ejecuta:

- ✅ Backend en `http://localhost:3000`
- ✅ Frontend en `http://localhost:5173`
- ✅ Auto-reload en ambos servicios

### Opción 2: Ejecutar servicios por separado

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

### 🌐 Acceso a la Aplicación

Una vez ejecutado el proyecto:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

## 👤 Credenciales de Demo

Para probar el sistema, utiliza estas credenciales:

**📧 Email:** `maria@demo.com`  
**🔑 Contraseña:** `demo123`

### 🗄️ Datos Incluidos

El sistema incluye datos de demo:

- ✅ **1 Usuario demo** (María González)
- ✅ **1 Mascota demo** (Max - Golden Retriever)
- ✅ **6 Servicios veterinarios**
- ✅ **3 Veterinarios certificados**
- ✅ **Citas de ejemplo**

## 📖 Manual de Usuario

### 🏠 Página Principal

La página principal presenta:

- **Hero Section**: Introducción al servicio
- **Características**: Beneficios del servicio a domicilio
- **Servicios**: Vista previa de servicios disponibles
- **Call to Action**: Botones para agendar citas o registrarse

### 🔐 Autenticación

**Registro de Usuario:**

1. Hacer clic en "Crear Cuenta Gratis"
2. Llenar datos personales y de la mascota
3. Confirmar registro

**Inicio de Sesión:**

1. Hacer clic en "Iniciar Sesión"
2. Ingresar email y contraseña
3. Acceder al dashboard

### 📅 Agendamiento de Citas

1. **Navegar a Servicios**: Clic en "Agendar Cita" o "Servicios"
2. **Seleccionar Servicio**: Elegir el servicio deseado
3. **Llenar Formulario**:
   - Seleccionar mascota
   - Elegir veterinario
   - Seleccionar fecha y hora
   - Agregar notas (opcional)
4. **Confirmar Cita**: Revisar datos y confirmar

### 🐕 Gestión de Mascotas

**Ver Mascotas:**

- Lista de todas las mascotas registradas
- Información detallada de cada mascota

**Agregar Mascota:**

1. Clic en "Agregar Nueva Mascota"
2. Llenar formulario con datos de la mascota
3. Guardar cambios

**Editar Mascota:**

1. Clic en el ícono de editar
2. Modificar información necesaria
3. Guardar cambios

### 📋 Historial de Citas

- **Ver Citas**: Lista de citas programadas y pasadas
- **Estados**: Pendiente, Confirmada, Completada, Cancelada
- **Detalles**: Fecha, hora, servicio, veterinario, mascota

### 🔬 Solicitud de Exámenes

- **Solicitar Exámenes**: Petición de análisis específicos
- **Ver Resultados**: Acceso a resultados cuando estén listos
- **Historial**: Seguimiento de exámenes previos

## 🔧 API Documentation

### 🔐 Autenticación

**POST /api/auth/register**

```json
{
  "user": {
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "password": "string",
    "phone": "string?",
    "address": "string?",
    "date_of_birth": "string?"
  },
  "pet": {
    "name": "string",
    "species": "string",
    "breed": "string?",
    "gender": "string?",
    "date_of_birth": "string?",
    "weight": "number?",
    "color": "string?",
    "medical_history": "string?"
  }
}
```

**POST /api/auth/login**

```json
{
  "email": "string",
  "password": "string"
}
```

### 🐕 Mascotas

**GET /api/pets** - Obtener mascotas del usuario autenticado  
**POST /api/pets** - Crear nueva mascota  
**PUT /api/pets/:id** - Actualizar mascota  
**DELETE /api/pets/:id** - Eliminar mascota

### 📅 Citas

**GET /api/appointments** - Obtener citas del usuario  
**POST /api/appointments** - Crear nueva cita  
**PUT /api/appointments/:id** - Actualizar cita  
**DELETE /api/appointments/:id** - Cancelar cita

### 🏥 Servicios

**GET /api/services** - Obtener todos los servicios disponibles

### 👨‍⚕️ Veterinarios

**GET /api/veterinarians** - Obtener lista de veterinarios

## 🎨 Diseño y UI

### 🎨 Paleta de Colores

El sistema utiliza una paleta de **colores cálidos** para crear una experiencia acogedora:

- **Primario**: Naranja (#F97316) - Energía y calidez
- **Secundario**: Ámbar (#F59E0B) - Profesionalismo
- **Accent**: Amarillo (#EAB308) - Optimismo
- **Neutros**: Grises suaves para texto y fondos

### ✨ Características de Diseño

- **Minimalista**: Interfaz limpia sin elementos distractivos
- **Responsive**: Adaptable a todos los tamaños de pantalla
- **Accesible**: Contraste adecuado y navegación clara
- **Moderno**: Componentes con esquinas redondeadas y sombras suaves
- **Interactivo**: Animaciones suaves y efectos hover
- **Consistente**: Patrones de diseño unificados

### 🎭 Componentes UI

- **Botones**: Gradientes y estados hover
- **Tarjetas**: Sombras y efectos de elevación
- **Formularios**: Campos con bordes redondeados
- **Navegación**: Barra superior responsive
- **Iconos**: Emojis para mayor expresividad

## 🔒 Seguridad

### 🛡️ Medidas Implementadas

- **Encriptación de Contraseñas**: bcrypt con salt de 10 rounds
- **JWT Tokens**: Autenticación segura con expiración
- **Helmet.js**: Headers de seguridad HTTP
- **CORS**: Configurado para origen específico
- **Validación de Datos**: En frontend y backend
- **SQL Injection Prevention**: Prepared statements
- **Sanitización**: Limpieza de inputs de usuario

### 🔐 Buenas Prácticas

- Tokens JWT con expiración de 7 días
- Validación de autorización en rutas protegidas
- Ocultación de información sensible en respuestas
- Manejo seguro de errores sin exposición de datos

## 📝 Scripts Disponibles

### 🎯 Scripts Principales

```bash
# Ejecutar todo el proyecto (frontend + backend)
npm run dev

# Ejecutar solo el backend
npm run dev:backend

# Ejecutar solo el frontend
npm run dev:frontend

# Construir para producción
npm run build

# Ejecutar tests (cuando estén implementados)
npm test
```

### 🔧 Scripts del Backend

```bash
cd backend

# Desarrollo con hot reload
npm run dev

# Construir TypeScript
npm run build

# Ejecutar versión compilada
npm start

# Linting
npm run lint
```

### 🎨 Scripts del Frontend

```bash
cd frontend

# Desarrollo con hot reload
npm run dev

# Construir para producción
npm run build

# Vista previa de build
npm run preview

# Linting
npm run lint
```

## 🚨 Solución de Problemas

### ❌ Errores Comunes

**1. Puerto en uso**

```bash
Error: listen EADDRINUSE: address already in use :::3000
```

**Solución:** Cambiar puerto en `.env` o cerrar proceso existente

**2. Tailwind no se aplica**

```bash
# Reinstalar Tailwind CSS
cd frontend
npm uninstall tailwindcss
npm install -D tailwindcss@3
npx tailwindcss init -p
```

**3. Base de datos no se crea**

```bash
# Verificar permisos de escritura en directorio backend
# Eliminar veterinaria.db y reiniciar servidor
```

**4. Error de CORS**

```bash
# Verificar FRONTEND_URL en .env del backend
# Asegurar que coincida con puerto del frontend
```

### 🔧 Comandos de Diagnóstico

```bash
# Verificar versiones
node --version
npm --version

# Verificar puertos ocupados
netstat -ano | findstr :3000
netstat -ano | findstr :5173

# Limpiar node_modules
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contribución

### 🌟 Cómo Contribuir

1. **Fork del proyecto**
2. **Crear rama de feature** (`git checkout -b feature/AmazingFeature`)
3. **Commit de cambios** (`git commit -m 'Add some AmazingFeature'`)
4. **Push a la rama** (`git push origin feature/AmazingFeature`)
5. **Abrir Pull Request**

### 📋 Convenciones

- **Commits**: Usar [Conventional Commits](https://www.conventionalcommits.org/)
- **Código**: Seguir las reglas de ESLint configuradas
- **Ramas**: Usar nombres descriptivos (feature/, fix/, docs/)

### 🎯 Areas de Mejora

- [ ] Implementar tests unitarios y de integración
- [ ] Agregar sistema de notificaciones
- [ ] Implementar chat en tiempo real
- [ ] Agregar pasarela de pagos
- [ ] Optimizar para PWA
- [ ] Implementar sistema de calificaciones

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👨‍💻 Información del Desarrollador

**Proyecto:** Sistema Veterinario VetCare  
**Universidad:** UPB (Universidad Pontificia Bolivariana)  
**Curso:** Plataformas de Programación Empresarial  
**Semestre:** 6  
**Año:** 2025

### 📞 Contacto

- **Email**: [tu-email@upb.edu.co](mailto:tu-email@upb.edu.co)
- **GitHub**: [tu-usuario](https://github.com/tu-usuario)
- **LinkedIn**: [tu-perfil](https://linkedin.com/in/tu-perfil)

---

## 🎉 Agradecimientos

- **Tailwind CSS** por el framework de CSS
- **React** por la librería de UI
- **Node.js** por el entorno de ejecución
- **SQLite** por la base de datos
- **Universidad UPB** por la formación académica

---

<div align="center">

**¡Gracias por usar VetCare! 🐕❤️**

_Cuidando a tu mascota con amor y profesionalismo_

![VetCare Footer](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)
![UPB](https://img.shields.io/badge/UPB-Universidad%20Pontificia%20Bolivariana-blue?style=for-the-badge)

</div>
