#!/usr/bin/env bash
set -e

echo "=== Creando Instalador Ejecutable Oficial (.exe) para Windows ==="
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="$ROOT_DIR/dist/windows-portable-build"
SOURCE_DIR="$BUILD_DIR/BIBLE"
DOWNLOADS_DIR="$ROOT_DIR/src/main/services/downloads"
OUTPUT_EXE="$DOWNLOADS_DIR/BIBLE-Instalador-Windows.exe"

if [ ! -d "$SOURCE_DIR" ]; then
  echo "Error: Primero se debe construir el directorio BIBLE con build-windows-portable.sh"
  exit 1
fi

echo "1. Creando script de configuración e instalación rápida con VBScript nativo..."
cat << 'EOF' > "$SOURCE_DIR/make-shortcuts.vbs"
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

cat << 'EOF' > "$SOURCE_DIR/setup-install.bat"
@echo off
setlocal
cd /d "%~dp0"
cscript //nologo make-shortcuts.vbs
start "" "%~dp0BIBLE.exe"
exit
EOF

echo "2. Creando archivo comprimido 7z..."
cd "$SOURCE_DIR"
rm -f "$BUILD_DIR/app.7z"
7z a -mx=5 -ms=on "$BUILD_DIR/app.7z" *

echo "3. Creando archivo de configuración SFX..."
cat << 'EOF' > "$BUILD_DIR/sfx-config.txt"
;!@Install@!UTF-8!
Title="Instalador BIBLE"
BeginPrompt="¿Desea instalar BIBLE en esta computadora?"
ExtractDialogText="Instalando BIBLE en su equipo..."
ExtractTitle="Instalando BIBLE..."
InstallPath="%LOCALAPPDATA%\\Programs\\BIBLE"
RunProgram="setup-install.bat"
;!@InstallEnd@!
EOF

echo "4. Obteniendo módulo GUI SFX de 7-Zip..."
SFX_BIN="$BUILD_DIR/7zSD.sfx"
if [ ! -f "$SFX_BIN" ]; then
  if [ -f "/tmp/sfx/7zSD.sfx" ]; then
    cp "/tmp/sfx/7zSD.sfx" "$SFX_BIN"
  else
    echo "Descargando 7zSD.sfx oficial..."
    curl -sL "https://www.7-zip.org/a/7z920_extra.7z" -o "$BUILD_DIR/7z_extra.7z"
    7z e -y "$BUILD_DIR/7z_extra.7z" 7zSD.sfx -o"$BUILD_DIR" > /dev/null
  fi
fi

echo "5. Uniendo módulo SFX ejecutable con el archivo 7z..."
cat "$SFX_BIN" "$BUILD_DIR/sfx-config.txt" "$BUILD_DIR/app.7z" > "$OUTPUT_EXE"
chmod +x "$OUTPUT_EXE"

echo "=== Instalador creado exitosamente ==="
ls -lh "$OUTPUT_EXE"
file "$OUTPUT_EXE"
