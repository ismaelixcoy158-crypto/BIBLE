@echo off
chcp 65001 > nul
title BIBLE - Actualizador Oficial del Sistema
echo ========================================================
echo        BIBLE — Sistema Multimedia para Iglesias
echo             Buscando Actualizaciones...
echo ========================================================
echo.

:: 1. Verificar si git está instalado
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ADVERTENCIA] No se detectó Git en esta computadora.
    echo Para actualizar automáticamente con un clic, se necesita Git.
    echo Puedes descargarlo gratis desde: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [1/2] Descargando las últimas actualizaciones desde el repositorio...
git pull
if %errorlevel% neq 0 (
    echo.
    echo [AVISO] No se pudo actualizar. Verifica que la computadora tenga internet.
    echo.
    pause
    exit /b 1
)

echo.
echo [2/2] Actualizando componentes...
call npm install --omit=dev

echo.
echo ========================================================
echo       ¡BIBLE HA SIDO ACTUALIZADO EXITOSAMENTE!
echo ========================================================
echo Todas las nuevas funciones y mejoras ya están listas.
echo Tus coritos y configuraciones se mantuvieron intactos.
echo.
pause

