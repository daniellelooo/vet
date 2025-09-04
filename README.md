# 🏥 VetCare - Sistema Veterinario a Domicilio

![VetCare Banner](https://img.shields.io/badge/VetCare-Sistema%20Veterinario-orange?style=for-the-badge&logo=veterinary&logoColor=white)

Un sistema completo de gestión veterinaria que permite a los usuarios agendar citas veterinarias a domicilio, gestionar sus mascotas, procesar pagos y acceder a servicios veterinarios profesionales desde la comodidad de su hogar.

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
- **📅 Agendamiento de Citas**: Sistema intuitivo para reservar citas con confirmación
- **🐕 Gestión de Mascotas**: Registro, edición y seguimiento completo de mascotas
- **� Sistema de Pagos**: Simulador de pagos con tarjeta de crédito integrado
- **�🔬 Solicitud de Exámenes**: Petición de análisis clínicos y diagnósticos
- **👨‍⚕️ Veterinarios Certificados**: Profesionales con especialidades definidas
- **🚨 Emergencias 24/7**: Atención de urgencias las 24 horas
- **📱 Diseño Responsivo**: Optimizado para móviles, tablets y desktop
- **🎨 Interfaz Moderna**: Diseño minimalista con colores cálidos naranjas

### 🔧 Características Técnicas

- **Autenticación JWT**: Sistema seguro de login y registro
- **Base de Datos SQLite**: Almacenamiento eficiente con relaciones FK
- **API RESTful**: Endpoints bien estructurados con PATCH support
- **Validación de Datos**: Validación completa en frontend y backend
- **Encriptación de Contraseñas**: Usando bcrypt para seguridad
- **CORS Configurado**: Soporte completo para métodos HTTP
- **Hot Reload**: Desarrollo ágil con recarga automática
- **TypeScript**: Tipado estático para mayor robustez
- **Middleware de Seguridad**: Rate limiting y headers de seguridad

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19.1.1** - Framework de JavaScript moderno
- **TypeScript** - Tipado estático
- **Vite 7.1.4** - Build tool ultrarrápido
- **Tailwind CSS** - Framework de estilos utility-first
- **React Router Dom** - Navegación SPA
- **React Hooks** - Gestión de estado moderna

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web minimalista
- **TypeScript** - Tipado estático en backend
- **SQLite3 + better-sqlite3** - Base de datos embebida
- **JWT (jsonwebtoken)** - Autenticación con tokens
- **bcrypt** - Encriptación de contraseñas
- **cors** - Cross-Origin Resource Sharing
- **helmet** - Headers de seguridad
- **morgan** - HTTP request logger
- **dotenv** - Variables de entorno
- **nodemon** - Auto-restart en desarrollo

### Herramientas de Desarrollo
- **Concurrently** - Ejecutar múltiples scripts
- **ts-node** - Ejecutar TypeScript directamente
- **ESLint** - Linting de código
- **Prettier** - Formateo de código

## 📁 Estructura del Proyecto

```
vet-funcional/
├── 📁 frontend/                 # Aplicación React
│   ├── 📁 src/
│   │   ├── 📁 components/       # Componentes React
│   │   │   ├── AppointmentsPage.tsx    # Gestión de citas
│   │   │   ├── PetsPage.tsx            # Gestión de mascotas
│   │   │   ├── ServicesPage.tsx        # Catálogo de servicios
│   │   │   ├── LoginPage.tsx           # Autenticación
│   │   │   ├── RegisterPage.tsx        # Registro
│   │   │   └── HomePage.tsx            # Página principal
│   │   ├── 📁 hooks/            # Custom hooks
│   │   │   └── useAuth.tsx             # Hook de autenticación
│   │   ├── index.css            # Estilos globales
│   │   └── main.tsx             # Punto de entrada
│   ├── package.json
│   └── vite.config.ts
├── 📁 backend/                  # API REST con Express
│   ├── 📁 src/
│   │   ├── 📁 routes/           # Rutas de la API
│   │   │   ├── auth.ts                 # Autenticación
│   │   │   ├── appointments.ts         # Citas (con pagos)
│   │   │   ├── pets.ts                 # Mascotas (CRUD completo)
│   │   │   ├── services.ts             # Servicios
│   │   │   └── veterinarians.ts        # Veterinarios
│   │   ├── 📁 database/         # Configuración DB
│   │   │   ├── connection.ts           # Conexión SQLite
│   │   │   └── setup.ts                # Datos de ejemplo
│   │   ├── 📁 middleware/       # Middlewares
│   │   │   ├── auth.ts                 # JWT middleware
│   │   │   └── validation.ts           # Validaciones
│   │   └── index.ts             # Servidor principal
│   ├── 📁 database/             # Archivos de base de datos
│   │   └── veterinary.db              # Base de datos SQLite
│   ├── .env                     # Variables de entorno
│   └── package.json
├── package.json                 # Scripts principales
├── README.md                    # Documentación
└── .github/
    └── copilot-instructions.md  # Instrucciones para Copilot
```

## ⚙️ Instalación y Configuración

### Prerrequisitos

- **Node.js** (versión 18 o superior)
- **npm** (viene incluido con Node.js)
- **Git** (para clonar el repositorio)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/daniellelooo/vet.git
cd vet-funcional
```

2. **Instalar dependencias del proyecto principal**
```bash
npm install
```

3. **Instalar dependencias del frontend**
```bash
cd frontend
npm install
cd ..
```

4. **Instalar dependencias del backend**
```bash
cd backend
npm install
cd ..
```

5. **Configurar variables de entorno**
```bash
# Crear archivo .env en la carpeta backend
cd backend
cat > .env << EOL
PORT=3000
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
FRONTEND_URL=http://localhost:5173
DB_PATH=./database/veterinary.db
EOL
```

## 🚀 Cómo Ejecutar el Proyecto

### Desarrollo (Recomendado)

Ejecutar frontend y backend simultáneamente:

```bash
npm run dev
```

Este comando ejecuta:
- Backend en `http://localhost:3000`
- Frontend en `http://localhost:5173`

### Ejecutar por Separado

**Solo Backend:**
```bash
npm run dev:backend
```

**Solo Frontend:**
```bash
npm run dev:frontend
```

### Producción

**Build del Frontend:**
```bash
npm run build:frontend
```

**Iniciar Backend en Producción:**
```bash
npm run start:backend
```

## 👤 Credenciales de Demo

El sistema incluye datos de ejemplo para pruebas:

### Usuario Demo
- **Email**: `maria@demo.com`
- **Contraseña**: `demo123`
- **Mascotas**: Max (Perro) y Luna (Gato)
- **Citas**: 3 citas de ejemplo en diferentes estados

### Veterinarios Disponibles
- **Dr. Carlos Rodríguez** - Medicina General
- **Dra. Ana Martínez** - Cirugía Veterinaria

### Servicios Disponibles
- Consulta General a Domicilio ($80,000)
- Vacunación a Domicilio ($35,000)
- Desparasitación ($25,000)
- Cirugía Menor a Domicilio ($150,000)
- Eutanasia Humanitaria ($100,000)
- Exámenes de Laboratorio ($45,000)
- Consulta de Emergencia ($120,000)

## 📖 Manual de Usuario

### 🔐 Registro y Autenticación

1. **Registro**: Crea cuenta con email, nombre, teléfono y dirección
2. **Login**: Inicia sesión con email y contraseña
3. **Dashboard**: Accede a todas las funcionalidades

### 🐕 Gestión de Mascotas

1. **Ver Mascotas**: Lista todas tus mascotas registradas
2. **Agregar Mascota**: Formulario con campos obligatorios
3. **Editar Mascota**: Modifica información (nombre, especie, raza, género, fecha de nacimiento, peso, color, historial médico)
4. **Eliminar Mascota**: Solo si no tiene citas programadas

### 📅 Sistema de Citas

1. **Agendar Cita**:
   - Selecciona mascota, veterinario y servicio
   - Elige fecha y hora
   - Confirma la reserva

2. **Estados de Citas**:
   - **Programada**: Cita creada, lista para confirmar
   - **Confirmada**: Cita confirmada, lista para pagar
   - **En Progreso**: Veterinario en camino
   - **Completada**: Servicio finalizado
   - **Cancelada**: Cita cancelada

3. **Confirmar Cita**: Cambia estado de "Programada" a "Confirmada"

### 💳 Sistema de Pagos

1. **Botón de Pago**: Aparece en citas confirmadas
2. **Modal de Pago**: Formulario de tarjeta de crédito
3. **Campos Requeridos**:
   - Número de tarjeta (formato automático)
   - Fecha de vencimiento (MM/AA)
   - CVV (3-4 dígitos)
   - Nombre del titular
4. **Simulación**: Proceso de 2 segundos con confirmación
5. **Estado**: Cambia a "Pagado" automáticamente

### 🔍 Navegación

- **Inicio**: Dashboard principal con estadísticas
- **Servicios**: Catálogo de servicios disponibles
- **Agendar**: Formulario de nueva cita
- **Mis Citas**: Gestión de citas existentes
- **Mis Mascotas**: CRUD completo de mascotas
- **Perfil**: Información del usuario

## 🔧 API Documentation

### Endpoints de Autenticación

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Usuario Ejemplo",
  "email": "usuario@email.com",
  "password": "contraseña123",
  "phone": "+573001234567",
  "address": "Dirección ejemplo"
}
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "contraseña123"
}
```

```http
GET /api/auth/me
Authorization: Bearer <jwt_token>
```

### Endpoints de Mascotas

```http
GET /api/pets
Authorization: Bearer <jwt_token>
```

```http
POST /api/pets
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Mascota",
  "species": "Perro",
  "breed": "Golden Retriever",
  "gender": "macho",
  "date_of_birth": "2020-01-15",
  "weight": 25.5,
  "color": "Dorado",
  "medical_history": "Historial médico"
}
```

```http
PUT /api/pets/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

```http
DELETE /api/pets/:id
Authorization: Bearer <jwt_token>
```

### Endpoints de Citas

```http
GET /api/appointments/my-appointments
Authorization: Bearer <jwt_token>
```

```http
POST /api/appointments
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "pet_id": 1,
  "veterinarian_id": 1,
  "service_id": 1,
  "appointment_date": "2025-09-05",
  "appointment_time": "14:30"
}
```

```http
PATCH /api/appointments/:id/status
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "status": "confirmada"
}
```

```http
PATCH /api/appointments/:id/payment
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "payment_status": "paid",
  "payment_method": "credit_card",
  "payment_amount": 80000
}
```

### Endpoints de Servicios y Veterinarios

```http
GET /api/services
```

```http
GET /api/veterinarians
```

## 🎨 Diseño y UI

### Paleta de Colores
- **Primary**: Naranja (`#ea580c`, `#fb923c`)
- **Success**: Verde (`#16a34a`)
- **Info**: Azul (`#2563eb`)
- **Warning**: Amarillo (`#eab308`)
- **Error**: Rojo (`#dc2626`)
- **Neutral**: Grises (`#374151`, `#6b7280`, `#9ca3af`)

### Componentes
- **Cards**: Diseño con sombras y bordes redondeados
- **Buttons**: Estados hover y focus con transiciones
- **Forms**: Validación visual y mensajes de error
- **Modals**: Overlays con backdrop blur
- **Navigation**: Menú responsivo con estados activos

### Responsive Design
- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid System**: CSS Grid y Flexbox para layouts
- **Typography**: Escalas responsivas con clamp()

## 🔒 Seguridad

### Medidas Implementadas

1. **Autenticación JWT**
   - Tokens seguros con expiración
   - Middleware de verificación en rutas protegidas

2. **Encriptación**
   - Contraseñas hasheadas con bcrypt (rounds: 10)
   - No almacenamiento de passwords en texto plano

3. **Headers de Seguridad**
   - Helmet.js para headers HTTP seguros
   - CORS configurado correctamente

4. **Rate Limiting**
   - Límite de 100 requests por 15 minutos
   - Protección contra ataques DDoS

5. **Validación de Datos**
   - Sanitización en frontend y backend
   - Verificación de tipos y formatos

6. **Autorización**
   - Verificación de ownership en recursos
   - Acceso controlado por usuario

### Variables de Entorno

```bash
# backend/.env
PORT=3000
JWT_SECRET=tu_jwt_secret_muy_seguro_de_al_menos_32_caracteres
FRONTEND_URL=http://localhost:5173
DB_PATH=./database/veterinary.db
```

## 📝 Scripts Disponibles

### Scripts Principales (desde raíz)

```bash
# Desarrollo completo (frontend + backend)
npm run dev

# Solo backend
npm run dev:backend

# Solo frontend  
npm run dev:frontend

# Build de producción
npm run build

# Solo build frontend
npm run build:frontend

# Iniciar backend en producción
npm run start:backend
```

### Scripts del Frontend

```bash
cd frontend

# Desarrollo
npm run dev

# Build
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

### Scripts del Backend

```bash
cd backend

# Desarrollo con nodemon
npm run dev

# Iniciar en producción
npm start

# Build TypeScript
npm run build
```

## 🗄️ Base de Datos

### Esquema de Tablas

**users**
- id (INTEGER PRIMARY KEY)
- first_name, last_name (VARCHAR)
- email (UNIQUE), password (VARCHAR)
- phone, address (VARCHAR)
- created_at, updated_at (DATETIME)

**pets**
- id (INTEGER PRIMARY KEY)
- user_id (FOREIGN KEY)
- name, species, breed (VARCHAR)
- gender, date_of_birth (VARCHAR)
- weight (DECIMAL), color (VARCHAR)
- medical_history (TEXT)
- created_at, updated_at (DATETIME)

**veterinarians**
- id (INTEGER PRIMARY KEY)
- first_name, last_name (VARCHAR)
- specialization, phone, email (VARCHAR)
- years_of_experience (INTEGER)
- created_at, updated_at (DATETIME)

**services**
- id (INTEGER PRIMARY KEY)
- name, description (VARCHAR/TEXT)
- price (DECIMAL)
- duration_minutes (INTEGER)
- created_at, updated_at (DATETIME)

**appointments**
- id (INTEGER PRIMARY KEY)
- user_id, pet_id, veterinarian_id, service_id (FOREIGN KEYS)
- appointment_date, appointment_time (VARCHAR)
- status (programada|confirmada|en_progreso|completada|cancelada)
- payment_status (pending|paid|refunded)
- notes (TEXT)
- created_at, updated_at (DATETIME)

### Relaciones
- users 1:N pets
- users 1:N appointments
- pets 1:N appointments
- veterinarians 1:N appointments
- services 1:N appointments

## 🧪 Testing

### Funcionalidades Probadas
- ✅ Registro y login de usuarios
- ✅ CRUD completo de mascotas
- ✅ Creación y listado de citas
- ✅ Confirmación de citas (PATCH)
- ✅ Simulador de pagos completo
- ✅ Navegación entre páginas
- ✅ Responsive design
- ✅ Validación de formularios
- ✅ Autenticación JWT
- ✅ Middleware de seguridad

### Casos de Prueba
1. **Flujo completo**: Registro → Login → Crear Mascota → Agendar Cita → Confirmar → Pagar
2. **Edición de mascotas**: Modificar todos los campos disponibles
3. **Manejo de errores**: Campos vacíos, datos inválidos
4. **Seguridad**: Acceso a rutas protegidas sin token
5. **Responsive**: Pruebas en diferentes resoluciones

## 🤝 Contribución

### Cómo Contribuir

1. **Fork** el proyecto
2. **Clone** tu fork
3. **Crea** una rama para tu feature
4. **Commit** tus cambios
5. **Push** a tu rama
6. **Abre** un Pull Request

### Estándares de Código

- **TypeScript**: Tipado estricto
- **ESLint**: Linting configurado
- **Prettier**: Formateo consistente
- **Commits**: Mensajes descriptivos
- **Testing**: Pruebas para nuevas features

### Estructura de Commits

```
tipo(alcance): descripción

feat(auth): agregar autenticación con JWT
fix(pets): corregir validación de formulario
docs(readme): actualizar documentación
style(ui): mejorar diseño responsive
```

## 🚀 Despliegue

### Frontend (Netlify/Vercel)
1. Build: `npm run build:frontend`
2. Deploy carpeta `frontend/dist`
3. Configurar redirects para SPA

### Backend (Railway/Heroku)
1. Variables de entorno en producción
2. Base de datos persistente
3. CORS configurado para dominio de producción

### Variables de Producción
```bash
PORT=3000
JWT_SECRET=secret_produccion_muy_seguro
FRONTEND_URL=https://tu-dominio.com
DB_PATH=./database/veterinary.db
NODE_ENV=production
```

## 📄 Licencia

Este proyecto está bajo la licencia **MIT License**.

```
MIT License

Copyright (c) 2025 VetCare Team

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
```

---

## 📞 Contacto

- **Proyecto**: [VetCare en GitHub](https://github.com/daniellelooo/vet)
- **Email**: daniellelo063@gmail.com
- **Universidad**: Universidad Pontificia Bolivariana (UPB)
- **Materia**: Plataformas de Programación Empresarial
- **Semestre**: 6to Semestre
- **Año**: 2025

---

> **Nota**: Este es un proyecto educativo desarrollado como parte del curso de Plataformas de Programación Empresarial. El simulador de pagos es solo para fines demostrativos y no procesa transacciones reales.

---

⭐ **¡Dale una estrella al repositorio si te gustó el proyecto!** ⭐
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
