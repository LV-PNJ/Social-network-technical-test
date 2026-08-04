# Manual de usuario — DEVEXP Social Network

**Versión:** 2.0  
**URL:** http://localhost:3000  
**Usuario demo:** alias `demo` / password `Demo123!`

## 1. ¿Qué es?

Aplicación tipo red social donde puedes registrarte, ver tu perfil, publicar mensajes y dar likes que se actualizan en tiempo real.

## 2. Primer acceso

1. Abre el navegador en http://localhost:3000  
2. Si ves un aviso amarillo arriba, algún servicio (Identity o Posts) aún no está listo: espera o avisa al administrador.  
3. Entra con el usuario demo o crea una cuenta nueva.

### 2.1 Iniciar sesión

- Campo: email **o** alias  
- Contraseña  
- Botón **Log In**

### 2.2 Registrarse

Completa:

- Nombres  
- Apellidos  
- Alias (letras, números y `_`)  
- Email  
- Fecha de nacimiento  
- Contraseña y confirmación  

Tras el registro quedarás autenticado automáticamente.

## 3. Inicio (feed)

- Verás las publicaciones más recientes.  
- Arriba puedes abrir el formulario para **crear una publicación** (texto hasta 280 caracteres).  
- En cada post:  
  - **Corazón:** like / quitar like  
  - Menú (solo tus posts): editar o eliminar  

Los likes de otros usuarios pueden actualizarse solos (WebSocket).

## 4. Perfil

Desde el menú / navegación accede a tu perfil. Verás:

- Nombre completo (nombres + apellidos)  
- Alias  
- Email  
- Fecha de nacimiento  
- Tus publicaciones  

## 5. Cerrar sesión

Usa la opción de logout en la barra / menú. Se borrará el token local y volverás a la pantalla de login.

## 6. Mensajes de error habituales

| Mensaje | Qué hacer |
|---------|-----------|
| No se pudo contactar Identity | El login no está disponible; reintenta en unos segundos |
| Credenciales inválidas | Revisa alias/email y contraseña |
| Alias o email ya registrado | Elige otros datos |
| Feed temporalmente no disponible | Posts caído; Identity puede seguir ok |

## 7. Buenas prácticas

- No compartas tu token ni contraseña.  
- No publiques datos sensibles en el contenido del post.  
- Si la sesión “caduca”, vuelve a iniciar sesión.
