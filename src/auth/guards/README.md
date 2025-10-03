# Guía de Implementación de NestJS Passport con JWT

## Resumen de la Implementación

Esta implementación utiliza **NestJS Passport** con **JWT (JSON Web Tokens)** para manejar la autenticación y autorización en la aplicación.

## Componentes Principales

### 1. **AuthModule** (`auth.module.ts`)
- Configura `PassportModule` con JWT como estrategia por defecto
- Configura `JwtModule` de forma asíncrona para obtener el secreto desde variables de entorno
- Registra `JwtStrategy` como proveedor
- Exporta los servicios necesarios para otros módulos

### 2. **JwtStrategy** (`strategy/jwt-strategy.ts`)
- Extiende `PassportStrategy(Strategy)` de passport-jwt
- Define cómo extraer y validar tokens JWT
- Implementa el método `validate()` que se ejecuta después de verificar el token
- Retorna el usuario completo que se inyecta en `req.user`

### 3. **AuthService** (`auth.service.ts`)
- Utiliza `JwtService` para generar tokens JWT
- Incluye tokens en las respuestas de login y registro
- Método `getJwtToken()` para crear tokens con payload personalizado

### 4. **JwtPayload Interface** (`interfaces/jwt-payload.interface.ts`)
- Define la estructura del payload del token JWT
- Especifica qué datos se incluyen en el token (email, fullname)

## Flujo de Autenticación

### Registro/Login:
1. Usuario envía credenciales
2. `AuthService` valida credenciales
3. Si son válidas, genera un JWT con `JwtService.sign(payload)`
4. Retorna usuario + token

### Protección de Rutas:
1. Cliente envía token en header `Authorization: Bearer <token>`
2. `JwtStrategy` extrae el token del header
3. Passport verifica la firma del token con `JWT_SECRET`
4. Si es válido, llama a `JwtStrategy.validate(payload)`
5. `validate()` busca el usuario en BD y verifica que esté activo
6. Usuario se inyecta en `req.user` automáticamente

## Uso en Controladores

```typescript
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('protected')
export class ProtectedController {
  
  // Ruta protegida - requiere token JWT válido
  @Get('profile')
  @UseGuards(AuthGuard()) // Usa la estrategia por defecto (jwt)
  getProfile(@Request() req) {
    // req.user contiene el usuario completo retornado por JwtStrategy.validate()
    return req.user;
  }
  
  // También se puede especificar la estrategia explícitamente
  @Get('admin')
  @UseGuards(AuthGuard('jwt'))
  getAdminData(@Request() req) {
    return { message: 'Admin data', user: req.user };
  }
}
```

## Decorador Personalizado para Obtener Usuario

```typescript
// auth/decorators/get-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

// Uso en controlador
@Get('profile')
@UseGuards(AuthGuard())
getProfile(@GetUser() user: User) {
  return user;
}
```

## Variables de Entorno Requeridas

```env
# JWT Secret para firmar tokens
JWT_SECRET=tu_secreto_super_seguro_aqui
```

## Configuración de Seguridad

- **Secreto JWT**: Debe ser una cadena larga y segura
- **Expiración**: Configurada en 2 horas por defecto
- **Extracción**: Token extraído del header Authorization como Bearer token
- **Validación**: Verifica firma + existencia y estado activo del usuario

## Ventajas de esta Implementación

1. **Stateless**: No requiere sesiones en servidor
2. **Escalable**: Tokens pueden verificarse sin consultar BD
3. **Flexible**: Fácil agregar más estrategias (Google, Facebook, etc.)
4. **Seguro**: Verificación de firma + validación de usuario en BD
5. **Automático**: Integración transparente con guards de NestJS
