#!/usr/bin/env bash
set -e

echo "========================================================"
echo "    Instalando BIBLE en este computador (Linux Mint)   "
echo "========================================================"

APP_DIR="/home/ismadev/Escritorio/BIBLE"
ICON_PATH="$APP_DIR/src/renderer/shared/assets/bible-logo.png"
NODE_BIN_DIR="/home/ismadev/.nvm/versions/node/v20.20.2/bin"

mkdir -p "$HOME/.local/bin"
mkdir -p "$HOME/.local/share/applications"
mkdir -p "$HOME/Escritorio"

echo "1. Creando comando ejecutable 'bible'..."
cat << EOF > "$HOME/.local/bin/bible"
#!/usr/bin/env bash
export PATH="$NODE_BIN_DIR:\$PATH"
cd "$APP_DIR" || exit 1
exec npm start "\$@"
EOF
chmod +x "$HOME/.local/bin/bible"

echo "2. Creando soporte para el comando 'start bible'..."
cat << 'EOF' > "$HOME/.local/bin/start"
#!/usr/bin/env bash
if [ "$1" = "bible" ] || [ "$1" = "BIBLE" ]; then
    shift
    exec "$HOME/.local/bin/bible" "$@"
elif [ -n "$1" ]; then
    exec xdg-open "$@"
else
    echo "Uso: start bible"
fi
EOF
chmod +x "$HOME/.local/bin/start"

echo "3. Creando lanzador para el Menú de Aplicaciones..."
cat << EOF > "$HOME/.local/share/applications/bible.desktop"
[Desktop Entry]
Version=1.0
Type=Application
Name=BIBLE
GenericName=Sistema Multimedia y Proyección
Comment=Sistema Multimedia y Proyección para Iglesias Pentecostales
Exec=$HOME/.local/bin/bible
Icon=$ICON_PATH
Path=$APP_DIR
Terminal=false
Categories=AudioVideo;Audio;Video;Utility;
StartupNotify=true
StartupWMClass=BIBLE
EOF
chmod +x "$HOME/.local/share/applications/bible.desktop"

echo "4. Creando acceso directo en el Escritorio..."
cp "$HOME/.local/share/applications/bible.desktop" "$HOME/Escritorio/BIBLE.desktop"
chmod +x "$HOME/Escritorio/BIBLE.desktop"

if command -v gio >/dev/null 2>&1; then
    gio set "$HOME/Escritorio/BIBLE.desktop" metadata::trusted true 2>/dev/null || true
fi

echo "========================================================"
echo "   ¡BIBLE instalado con éxito en este computador!       "
echo "                                                        "
echo "  • Icono en el Escritorio: Haz doble clic en BIBLE     "
echo "  • En el Menú de Linux Mint: Búscalo como 'BIBLE'      "
echo "  • En la Terminal: Escribe 'bible' o 'start bible'     "
echo "========================================================"

