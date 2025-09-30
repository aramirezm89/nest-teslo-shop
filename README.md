<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Teslo Shop - NestJS E-commerce API

Una API REST completa para un e-commerce desarrollada con NestJS, TypeScript y PostgreSQL.

## Descripción

Este proyecto es una aplicación de e-commerce backend desarrollada con el framework NestJS. Incluye funcionalidades como gestión de productos, autenticación de usuarios, manejo de archivos y más.

## Tecnologías utilizadas

- **NestJS** - Framework de Node.js
- **TypeScript** - Lenguaje de programación
- **PostgreSQL** - Base de datos
- **Docker** - Containerización
- **TypeORM** - ORM para base de datos

## Requisitos previos

- Node.js (v18 o superior)
- Docker y Docker Compose
- Git

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd 04-teslo-shop
```

### 2. Instalar dependencias

```bash
yarn install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` y renómbralo a `.env`:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
PORT=3000
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=teslo_shop_db
DB_HOST=localhost
DB_PORT=5432
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
HOST_API=http://localhost:3000/api
```

### 4. Levantar la base de datos con Docker

```bash
# Levantar solo la base de datos PostgreSQL
docker-compose up -d postgres-db

# O levantar todos los servicios
docker-compose up -d
```

### 5. Ejecutar la aplicación

```bash
# Modo desarrollo
yarn run start:dev

# Modo producción
yarn run start:prod
```

## Comandos disponibles

### Desarrollo

```bash
# Instalar dependencias
yarn install

# Ejecutar en modo desarrollo
yarn run start:dev

# Ejecutar en modo producción
yarn run start:prod

# Construir la aplicación
yarn run build
```

### Docker

```bash
# Levantar todos los servicios
docker-compose up -d

# Levantar solo la base de datos
docker-compose up -d postgres-db

# Ver logs de los contenedores
docker-compose logs -f

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

## Estructura del proyecto

```
04-teslo-shop/
├── src/
│   ├── app.module.ts          # Módulo principal
│   ├── configuration/         # Configuraciones
│   └── ...                    # Otros módulos y servicios
├── public/                    # Archivos estáticos
│   ├── index.html            # Página de bienvenida ("Server on!!")
│   └── css/                  # Estilos CSS
├── docker-compose.yaml        # Configuración de Docker
├── .env.example              # Variables de entorno de ejemplo
└── README.md                 # Este archivo
```

## Configuración de Docker

El proyecto incluye un archivo `docker-compose.yaml` que configura:

- **PostgreSQL**: Base de datos en el puerto 5432
- **Nombre del proyecto**: `nest-teslo-shop`
- **Nombre del contenedor**: `nest_teslo_db`

### Variables de entorno requeridas

Asegúrate de configurar estas variables en tu archivo `.env`:

```env
PORT=3000                                      # Puerto de la aplicación
DB_HOST=localhost                              # Host de la base de datos
DB_PORT=5432                                   # Puerto de la base de datos
DB_USER=your_user                              # Usuario de la base de datos
DB_PASSWORD=your_password                      # Contraseña de la base de datos
DB_NAME=your_database_name                     # Nombre de la base de datos
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name  # URL de conexión a Cloudinary
HOST_API=http://localhost:3000/api             # URL base de la API para servir archivos
```

#### Configuración de Cloudinary

Para el manejo de imágenes de productos, necesitas configurar una cuenta en [Cloudinary](https://cloudinary.com/):

1. Crea una cuenta gratuita en Cloudinary
2. Ve a tu dashboard y copia la "Cloudinary URL"
3. Pégala en la variable `CLOUDINARY_URL` de tu archivo `.env`

#### HOST_API

La variable `HOST_API` se utiliza para generar URLs completas para servir imágenes de productos almacenadas localmente. Debe apuntar a la URL base de tu API seguida de `/api`.

## Acceso a la aplicación

Una vez que la aplicación esté ejecutándose:

- **API**: `http://localhost:3000`
- **Página de bienvenida**: `http://localhost:3000` (muestra "Server on!!")
- **Base de datos**: `localhost:5432`

### Contenido estático

La aplicación está configurada para servir contenido estático desde el directorio `public/`. Al acceder a la ruta raíz (`http://localhost:3000`), se mostrará la página `index.html` que contiene un mensaje de bienvenida "Server on!!" confirmando que el servidor está funcionando correctamente.

Esta funcionalidad es útil para:
- Verificar rápidamente que la aplicación está ejecutándose
- Servir archivos estáticos como imágenes, CSS, JavaScript
- Proporcionar una página de inicio o documentación básica

## Poblar la base de datos (Seed)

Para poblar la base de datos con datos iniciales de productos, utiliza el endpoint de seed:

### Ejecutar el seed

```bash
# Método 1: Usando curl
curl -X GET http://localhost:3000/api/seed

# Método 2: Acceder directamente desde el navegador
http://localhost:3000/api/seed
```

### ¿Qué hace el seed?

- **Limpia la base de datos**: Elimina todos los productos e imágenes existentes
- **Inserta productos de prueba**: Agrega una colección de productos predefinidos con sus respectivas imágenes
- **Confirma la operación**: Retorna un mensaje indicando cuántos productos fueron insertados

### Respuesta esperada

```json
"Seed ejecutado. Productos insertados: [número de productos]"
```

**Nota importante**: Este endpoint eliminará todos los productos existentes en la base de datos antes de insertar los nuevos datos. Úsalo solo en entornos de desarrollo o cuando necesites resetear completamente los datos de productos.

## Solución de problemas

### Error de conexión a la base de datos

1. Verifica que Docker esté ejecutándose
2. Asegúrate de que el contenedor de PostgreSQL esté activo:
   ```bash
   docker ps
   ```
3. Verifica las variables de entorno en el archivo `.env`

### Puerto ya en uso

Si el puerto 3000 está ocupado, cambia la variable `PORT` en tu archivo `.env`.

## Ejecutar tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
