# Módulo 5: Spots Multimedia — Especificación Funcional

## 1. Objetivo y Problema que Resuelve
Permitir a la congregación importar y proyectar directamente anuncios audiovisuales, videos promocionales de actividades, campamentos, testimonios e imágenes informativas previamente preparadas, con soporte de hasta resolución 4K y reproducción con aceleración por hardware.
No requiere editar videos dentro de BIBLE: el operador simplemente importa el archivo y lo proyecta con un solo clic.

## 2. Formatos Multimedia Soportados
- **Imágenes:** PNG, JPG, JPEG, WEBP.
- **Videos:** MP4 (H.264 / AAC), WebM (VP8 / VP9 / AV1).
- **Rendimiento 4K:** Utiliza decodificación por hardware de Chromium/Electron para garantizar reproducción fluida sin consumo excesivo de CPU.

## 3. Biblioteca Visual y Funcionalidades
- Explorador nativo para importar imágenes y videos desde el equipo.
- Almacenamiento local seguro en `userData/media/spots/` y servicio a través del protocolo `bible-media://`.
- Mosaico visual de miniaturas con metadatos:
  - Formato (`VIDEO`, `IMAGEN`).
  - Tamaño de archivo.
  - Duración (para archivos de video).
- Control de Reproducción:
  - Iniciar proyección con un clic.
  - Reproducción continua / bucle (*Loop*).
  - Pausar / Reanudar video en la pantalla pública.
  - Silenciar / Activar audio en el sistema del templo.
- Atajo de teclado directo: `Ctrl + S`.
