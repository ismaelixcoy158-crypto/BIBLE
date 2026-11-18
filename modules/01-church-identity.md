# Módulo 1: Identidad de la Iglesia — Especificación Funcional

## 1. Objetivo y Problema que Resuelve
Permitir a cada congregación personalizar el sistema BIBLE con su nombre y logotipo oficial, sin depender de cuentas en la nube, servidores remotos ni registros obligatorios con correos electrónicos o contraseñas.
Los datos y archivos se almacenan 100% de forma local en el equipo.

## 2. Funcionalidades Principales
1. **Registro y Edición del Nombre:**
   - Campo para ingresar o modificar el nombre de la congregación (ej. *Iglesia Evangélica Pentecostal Central*).
   - Guardado inmediato con validación de longitud (máximo 120 caracteres, mínimo 2).
2. **Carga de Logotipo Local:**
   - Selección mediante el explorador de archivos nativo del sistema operativo.
   - Formatos autorizados: PNG, JPG, JPEG, WEBP, SVG.
   - Límite de tamaño: hasta 10 MB.
   - Copia segura del archivo en el directorio local de medios (`userData/media/branding/`).
3. **Carga de Logotipo por URL:**
   - Permite al usuario pegar una dirección HTTP o HTTPS de una imagen.
   - BIBLE descarga la imagen y la guarda localmente para que funcione permanentemente sin Internet.
   - Validación estricta: solo protocolos `http:` / `https:`, tiempo límite de descarga (10s), verificación de tipo MIME de imagen.
4. **Visualización y Previsualización:**
   - Muestra en tiempo real cómo se verá el logo sobre fondo oscuro y sobre fondo claro.
5. **Eliminación y Restablecimiento:**
   - Botón para eliminar exclusivamente el logotipo manteniendo el nombre.
   - Botón para restablecer la identidad completa a los valores por defecto.
6. **Integración con Proyección:**
   - El botón de pánico maestro **[LOGO]** de la cabina del operador proyecta el logotipo y el nombre configurados en la pantalla congregacional.

## 3. Reglas de Negocio
- La tabla `church_identity` en SQLite mantiene un registro único (`id = 1`).
- Los logotipos antiguos se eliminan del disco al cargar uno nuevo para no acumular basura digital.
- Si no hay logo configurado, la pantalla de proyección mostrará el nombre de la iglesia con tipografía destacada.

