# Guía de Despliegue en cPanel - Maleiwa-site

Esta guía te ayudará a subir y configurar tu tienda Maleiwa en un entorno de hosting con cPanel utilizando el **Selector de Node.js**.

## 1. Preparación de Archivos
Ya hemos preparado los archivos necesarios:
- **`server.js`**: El núcleo de tu servidor.
- **`app.js`**: Un archivo "wrapper" que algunos cPanel requieren como punto de entrada.
- **`package.json`**: Contiene las dependencias necesarias.
- **Carpeta `store/`**: Contiene todo el frontend y las carpetas de datos/imágenes.

## 2. Pasos en cPanel

### A. Subir el código
1. Comprime todos los archivos de la carpeta del proyecto (excepto `node_modules`) en un archivo `.zip`.
2. En cPanel, ve a **Administrador de Archivos**.
3. Te recomendamos crear una carpeta llamada `maleiwa-app` en el directorio raíz de tu cuenta (fuera de `public_html`).
4. Sube el `.zip` allí y extráelo.

### B. Crear la Aplicación Node.js
1. En cPanel, busca **Setup Node.js App**.
2. Haz clic en **Create Application**.
3. Configura lo siguiente:
   - **Node.js version**: Selecciona **18.x** o superior.
   - **Application mode**: `Production`.
   - **Application root**: El nombre de la carpeta donde subiste los archivos (ej. `maleiwa-app`).
   - **Application URL**: El dominio o subdominio donde quieres que funcione la tienda.
   - **Application startup file**: `server.js` (o `app.js`).
4. Haz clic en **Create**.

### C. Instalar Dependencias
1. Una vez creada la aplicación, verás un botón que dice **Run NPM Install**. Haz clic en él.
2. Espera a que termine la instalación de los paquetes (`express`, `multer`, `cors`, etc.).

### D. Variables de Entorno (Opcional)
Si quieres separar tus datos de la carpeta del código, puedes añadir estas variables en la sección **Environment variables** del Selector de Node.js:
- `DATA_DIR`: Ruta absoluta a una carpeta de datos (ej. `/home/usuario/maleiwa-data`).
- `UPLOADS_DIR`: Ruta absoluta a una carpeta para imágenes subidas.
*Si no las configuras, la app usará automáticamente `store/data` y `store/uploads` dentro de tu carpeta del proyecto.*

## 3. Consideraciones Importantes
- **Permisos**: Asegúrate de que las carpetas `store/data` y `store/uploads` tengan permisos de escritura (generalmente 755).
- **HTTPS**: Te recomendamos activar un certificado SSL (AutoSSL de cPanel) para que tu tienda sea segura.
- **Reiniciar**: Cada vez que hagas un cambio manual en los archivos `.js` o `.json`, recuerda entrar al Selector de Node.js y darle al botón **Restart**.

---
¡Listo! Tu sitio debería estar funcionando en la URL que configuraste.
