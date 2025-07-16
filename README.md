# 📚 VirtualBiblio - Plataforma de Biblioteca Digital

Una plataforma completa de biblioteca digital desarrollada con .NET 9 y React, diseñada para gestionar libros, usuarios, donaciones y contenido educativo.

## 🚀 Características Principales

### Backend (.NET 9)
- **API RESTful** con Entity Framework Core
- **Autenticación JWT** con roles de usuario
- **Base de datos PostgreSQL** con migraciones
- **Gestión de libros** con categorías y autores
- **Sistema de donaciones** integrado
- **Panel administrativo** con estadísticas
- **Blog y contenido educativo**

### Frontend (React + TypeScript)
- **Interfaz moderna** con Tailwind CSS
- **Autenticación completa** con Context API
- **Panel administrativo** con gráficos
- **Gestión de usuarios** y roles
- **Sistema de donaciones** para usuarios
- **Blog y novedades** dinámicas

## 🛠️ Tecnologías Utilizadas

### Backend
- **.NET 9** - Framework principal
- **Entity Framework Core** - ORM
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **BCrypt** - Encriptación de contraseñas
- **CORS** - Configuración de seguridad

### Frontend
- **React 18** - Framework de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos
- **Vite** - Build tool
- **React Router** - Navegación
- **Context API** - Estado global

## 📋 Requisitos Previos

- **.NET 9 SDK**
- **Node.js 18+**
- **PostgreSQL 14+**
- **Git**

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/secretosparacontar.git
cd secretosparacontar
```

### 2. Configurar Base de Datos
```bash
# Crear base de datos PostgreSQL
createdb virtualbiblio

# Configurar connection string en appsettings.Development.json
```

### 3. Configurar Backend
```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```

### 4. Configurar Frontend
```bash
cd frontend/Katrina
npm install
npm run dev
```

## 🔧 Configuración de Variables de Entorno

### Backend (.NET)
Crear `appsettings.Development.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=virtualbiblio;Username=postgres;Password=tu_password"
  },
  "JwtSettings": {
    "SecretKey": "tu_clave_secreta_super_larga_y_segura_aqui_minimo_32_caracteres",
    "Issuer": "VirtualBiblio",
    "Audience": "VirtualBiblioUsers",
    "ExpirationHours": 24
  }
}
```

## 📊 Estructura del Proyecto

```
secretosparacontar/
├── backend/
│   ├── VirtualBiblio/              # API Principal
│   ├── VirtualBiblio.Business/     # Lógica de Negocio
│   ├── VirtualBiblio.Data/         # Capa de Datos
│   └── VirtualBiblio.Testing/      # Pruebas
├── frontend/
│   └── Katrina/                    # Aplicación React
└── docs/                          # Documentación
```

## 🔐 Roles de Usuario

- **admin**: Acceso completo al panel administrativo
- **usuario**: Usuario regular con acceso a biblioteca
- **donador**: Usuario con capacidad de donar

## 📚 Funcionalidades

### Para Usuarios
- Registro e inicio de sesión
- Explorar biblioteca de libros
- Sistema de donaciones
- Perfil personalizable
- Acceso a blogs y novedades

### Para Administradores
- Panel administrativo completo
- Gestión de usuarios y roles
- Estadísticas y gráficos
- Gestión de libros y autores
- Control de donaciones
- Creación de contenido

## 🗄️ Base de Datos

### Tablas Principales
- **Users**: Usuarios del sistema
- **Books**: Libros de la biblioteca
- **Authors**: Autores de los libros
- **Categories**: Categorías de libros
- **Donations**: Sistema de donaciones
- **Blogs**: Contenido educativo

## 🚀 Despliegue

### Desarrollo Local
```bash
# Backend
cd backend
dotnet run

# Frontend
cd frontend/Katrina
npm run dev
```

### Producción
```bash
# Backend
dotnet publish -c Release
dotnet run --environment Production

# Frontend
npm run build
```

## 📝 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/me` - Obtener perfil

### Libros
- `GET /api/books` - Listar libros
- `POST /api/books` - Crear libro
- `PUT /api/books/{id}` - Actualizar libro

### Administración
- `GET /api/admin/dashboard` - Estadísticas
- `GET /api/admin/users` - Listar usuarios
- `PUT /api/admin/users/{id}/role` - Cambiar rol

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Autores

- **Fabio Torres** - *Desarrollo inicial* - [fitorres1607@gmail.com]

## 🙏 Agradecimientos

- Fundación Secretos para Contar
- Comunidad de desarrolladores .NET
- Contribuidores del proyecto

## 📞 Contacto

- **Email**: fitorres1607@gmail.com
- **Proyecto**: [https://github.com/tu-usuario/secretosparacontar](https://github.com/tu-usuario/secretosparacontar)

---

⭐ Si este proyecto te ayuda, por favor dale una estrella en GitHub! 