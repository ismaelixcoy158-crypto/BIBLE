#!/usr/bin/env bash
set -e

echo "=== Construyendo BIBLE Portable para Windows (Sin dependencias ni Node) ==="
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="$ROOT_DIR/dist/windows-portable-build"
OUT_DIR="$BUILD_DIR/BIBLE"
DOWNLOADS_DIR="$ROOT_DIR/src/main/services/downloads"
ZIP_OUTPUT="$DOWNLOADS_DIR/BIBLE-Windows-Portable.zip"

mkdir -p "$BUILD_DIR"
mkdir -p "$DOWNLOADS_DIR"
rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

ELECTRON_URL="https://github.com/electron/electron/releases/download/v33.4.11/electron-v33.4.11-win32-x64.zip"
SQLITE_URL="https://github.com/WiseLibs/better-sqlite3/releases/download/v11.10.0/better-sqlite3-v11.10.0-electron-v130-win32-x64.tar.gz"

echo "1. Descargando Electron para Windows (x64)..."
if [ ! -f "$BUILD_DIR/electron-win32.zip" ]; then
  curl -L -o "$BUILD_DIR/electron-win32.zip" "$ELECTRON_URL"
fi

echo "2. Descargando better-sqlite3 compilado para Windows Electron 130..."
if [ ! -f "$BUILD_DIR/sqlite-win32.tar.gz" ]; then
  curl -L -o "$BUILD_DIR/sqlite-win32.tar.gz" "$SQLITE_URL"
fi

echo "3. Descomprimiendo Electron Windows..."
unzip -q "$BUILD_DIR/electron-win32.zip" -d "$OUT_DIR"
mv "$OUT_DIR/electron.exe" "$OUT_DIR/BIBLE.exe" 2>/dev/null || true

echo "4. Preparando resources/app..."
APP_DIR="$OUT_DIR/resources/app"
mkdir -p "$APP_DIR"
cp -r "$ROOT_DIR/src" "$APP_DIR/"
rm -rf "$APP_DIR/src/main/services/downloads"
mkdir -p "$APP_DIR/src/main/services/downloads"
cp "$ROOT_DIR/package.json" "$APP_DIR/"
if [ -d "$ROOT_DIR/userData" ]; then
  cp -r "$ROOT_DIR/userData" "$APP_DIR/"
fi

# Copiar dependencias de node_modules requeridas
mkdir -p "$APP_DIR/node_modules/better-sqlite3/build/Release"
mkdir -p "$APP_DIR/node_modules/bindings"
mkdir -p "$APP_DIR/node_modules/file-uri-to-path"

# Descomprimir binario de better_sqlite3.node para Windows
tar -xzf "$BUILD_DIR/sqlite-win32.tar.gz" -C "$BUILD_DIR"
cp "$BUILD_DIR/build/Release/better_sqlite3.node" "$APP_DIR/node_modules/better-sqlite3/build/Release/"
cp -r "$ROOT_DIR/node_modules/better-sqlite3/lib" "$APP_DIR/node_modules/better-sqlite3/"
cp "$ROOT_DIR/node_modules/better-sqlite3/package.json" "$APP_DIR/node_modules/better-sqlite3/"

cp -r "$ROOT_DIR/node_modules/bindings/"* "$APP_DIR/node_modules/bindings/"
cp -r "$ROOT_DIR/node_modules/file-uri-to-path/"* "$APP_DIR/node_modules/file-uri-to-path/"

# Copiar icono oficial
cp "$ROOT_DIR/src/renderer/shared/assets/icon.ico" "$OUT_DIR/BIBLE.ico"

echo "5. Creando instalador de acceso directo para Windows con VBScript nativo..."
cat << 'EOF' > "$OUT_DIR/make-shortcuts.vbs"
Option Explicit
Dim oWS, sDesktop, sPrograms, sAppDir, oLink, fso
Set oWS = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
sAppDir = fso.GetParentFolderName(WScript.ScriptFullName)
sDesktop = oWS.SpecialFolders("Desktop")
sPrograms = oWS.SpecialFolders("Programs")

' Crear acceso directo en el Escritorio
On Error Resume Next
Set oLink = oWS.CreateShortcut(sDesktop & "\BIBLE.lnk")
oLink.TargetPath = sAppDir & "\BIBLE.exe"
oLink.WorkingDirectory = sAppDir
oLink.IconLocation = sAppDir & "\BIBLE.ico,0"
oLink.Description = "BIBLE - Sistema Multimedia y Proyeccion"
oLink.Save

' Crear acceso directo en el Menú Inicio (Programas)
Set oLink = oWS.CreateShortcut(sPrograms & "\BIBLE.lnk")
oLink.TargetPath = sAppDir & "\BIBLE.exe"
oLink.WorkingDirectory = sAppDir
oLink.IconLocation = sAppDir & "\BIBLE.ico,0"
oLink.Description = "BIBLE - Sistema Multimedia y Proyeccion"
oLink.Save
EOF

cat << 'EOF' > "$OUT_DIR/Crear-Acceso-Directo.bat"
@echo off
setlocal
chcp 65001 > nul
cd /d "%~dp0"
cscript //nologo make-shortcuts.vbs
echo ========================================================
echo   Icono de BIBLE creado en tu Escritorio y Menu Inicio
echo ========================================================
pause
EOF

echo "6. Empaquetando en ZIP para distribución..."
rm -f "$ZIP_OUTPUT"
cd "$BUILD_DIR"
zip -q -r "$ZIP_OUTPUT" BIBLE/

echo "=== Empaquetado exitoso ==="
ls -lh "$ZIP_OUTPUT"

