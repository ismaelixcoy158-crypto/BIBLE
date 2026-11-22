@echo off
chcp 65001 > nul
title BIBLE - Instalador de Acceso Directo para Windows
echo ========================================================
echo        BIBLE — Sistema Multimedia para Iglesias
echo      Instalador de Escritorio y Menú Inicio Windows
echo ========================================================
echo.

REM 1. Verificar si Node.js esta instalado en la computadora
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ADVERTENCIA] No se detecto Node.js en esta computadora.
    echo BIBLE necesita Node.js para ejecutarse en Windows.
    echo.
    echo Abriendo la pagina oficial de Node.js en tu navegador...
    start https://nodejs.org/
    echo Descarga e instala la version recomendada LTS y vuelve a ejecutar este instalador.
    echo.
    pause
    exit /b 1
)

REM 2. Si no existe node_modules, ejecutar npm install
if not exist "node_modules\" (
    echo [1/3] Instalando librerias necesarias. Solo toma unos momentos...
    call npm install
    echo.
) else (
    echo [1/3] Librerias detectadas correctamente.
)

REM 3. Obtener ruta completa de la carpeta actual
set "APP_DIR=%~dp0"
set "APP_DIR=%APP_DIR:~0,-1%"
set "VBS_PATH=%APP_DIR%\iniciar-bible-windows.vbs"
set "ICON_PATH=%APP_DIR%\src\renderer\shared\assets\icon.ico"

echo [2/3] Creando accesos directos en Windows...

REM 4. Crear acceso directo en el Escritorio y en el Menu Inicio usando PowerShell
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$wsh = New-Object -ComObject WScript.Shell; " ^
    "$desktop = [Environment]::GetFolderPath('Desktop'); " ^
    "$programs = [Environment]::GetFolderPath('Programs'); " ^
    "$s1 = $wsh.CreateShortcut(\"$desktop\BIBLE.lnk\"); " ^
    "$s1.TargetPath = 'wscript.exe'; " ^
    "$s1.Arguments = \"`\"%VBS_PATH%`\"\"; " ^
    "$s1.WorkingDirectory = \"%APP_DIR%\"; " ^
    "$s1.IconLocation = \"%ICON_PATH%, 0\"; " ^
    "$s1.Description = 'BIBLE - Sistema Multimedia y Proyeccion'; " ^
    "$s1.Save(); " ^
    "$s2 = $wsh.CreateShortcut(\"$programs\BIBLE.lnk\"); " ^
    "$s2.TargetPath = 'wscript.exe'; " ^
    "$s2.Arguments = \"`\"%VBS_PATH%`\"\"; " ^
    "$s2.WorkingDirectory = \"%APP_DIR%\"; " ^
    "$s2.IconLocation = \"%ICON_PATH%, 0\"; " ^
    "$s2.Description = 'BIBLE - Sistema Multimedia y Proyeccion'; " ^
    "$s2.Save(); " ^
    "$s3 = $wsh.CreateShortcut(\"$programs\Actualizar BIBLE.lnk\"); " ^
    "$s3.TargetPath = \"`\"%APP_DIR%\actualizar-bible.bat`\"\"; " ^
    "$s3.WorkingDirectory = \"%APP_DIR%\"; " ^
    "$s3.IconLocation = \"%ICON_PATH%, 0\"; " ^
    "$s3.Description = 'Actualizar BIBLE a la ultima version'; " ^
    "$s3.Save();"

echo.
echo ========================================================
echo        ¡INSTALACION COMPLETADA EXITOSAMENTE!
echo ========================================================
echo.
echo  1. Ya tienes el icono de BIBLE en tu Escritorio.
echo  2. Ya quedo registrado en el Menu Inicio de Windows:
echo     puedes presionar la tecla Inicio y escribir BIBLE
echo     para abrir la app inmediatamente.
echo.
echo ========================================================
echo.
pause
