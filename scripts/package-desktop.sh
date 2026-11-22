#!/usr/bin/env bash
set -e

echo "=== Empaquetando BIBLE para Escritorio (Linux Portable) ==="
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="$ROOT_DIR/dist/bible-desktop-linux"
DOWNLOADS_DIR="$ROOT_DIR/src/main/services/downloads"
TAR_OUTPUT="$DOWNLOADS_DIR/bible-desktop-linux.tar.gz"

mkdir -p "$DIST_DIR/resources/app"
mkdir -p "$DOWNLOADS_DIR"

echo "1. Copiando motor de Electron precompilado..."
cp -r "$ROOT_DIR/node_modules/electron/dist/"* "$DIST_DIR/"
mv "$DIST_DIR/electron" "$DIST_DIR/bible-app" 2>/dev/null || true

echo "2. Copiando código fuente de la aplicación BIBLE..."
rm -rf "$DIST_DIR/resources/app/"*
cp -r "$ROOT_DIR/src" "$DIST_DIR/resources/app/"
cp "$ROOT_DIR/package.json" "$DIST_DIR/resources/app/"
if [ -d "$ROOT_DIR/userData" ]; then
  cp -r "$ROOT_DIR/userData" "$DIST_DIR/resources/app/"
fi

echo "3. Copiando dependencias nativas de producción (SQLite)..."
mkdir -p "$DIST_DIR/resources/app/node_modules"
cp -r "$ROOT_DIR/node_modules/better-sqlite3" "$DIST_DIR/resources/app/node_modules/"
cp -r "$ROOT_DIR/node_modules/bindings" "$DIST_DIR/resources/app/node_modules/"
cp -r "$ROOT_DIR/node_modules/file-uri-to-path" "$DIST_DIR/resources/app/node_modules/"

echo "4. Creando scripts de inicio rápido..."
cat << 'EOF' > "$DIST_DIR/iniciar-bible.sh"
#!/usr/bin/env bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"
exec "$DIR/bible-app" --no-sandbox "$@"
EOF
chmod +x "$DIST_DIR/iniciar-bible.sh"
chmod +x "$DIST_DIR/bible-app"

cat << 'EOF' > "$DIST_DIR/BIBLE.desktop"
[Desktop Entry]
Name=BIBLE
Comment=Sistema Multimedia y Proyección para Iglesias
Exec=bash -c "cd $(dirname %k) && ./iniciar-bible.sh"
Icon=resources/app/src/renderer/shared/assets/bible-logo.png
Terminal=false
Type=Application
Categories=AudioVideo;Utility;
EOF
chmod +x "$DIST_DIR/BIBLE.desktop"

echo "5. Creando archivo comprimido portable (.tar.gz)..."
cd "$ROOT_DIR/dist"
tar -czf "$TAR_OUTPUT" bible-desktop-linux/

echo "=== Empaquetado completado exitosamente ==="
ls -lh "$TAR_OUTPUT"

