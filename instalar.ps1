# BIBLE - Instalador Nativo PowerShell para Windows
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       BIBLE — Sistema Multimedia para Iglesias" -ForegroundColor White
Write-Host "     Instalador de Escritorio y Menú Inicio Windows" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar si Node.js está instalado
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ADVERTENCIA] Node.js no está instalado en esta computadora." -ForegroundColor Red
    Write-Host "BIBLE necesita Node.js para ejecutarse." -ForegroundColor Yellow
    Write-Host "Intentando instalar Node.js automáticamente con winget..." -ForegroundColor White
    winget install OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements
    Write-Host "Por favor cierra y vuelve a abrir PowerShell para que reconozca Node.js, y vuelve a ejecutar este comando." -ForegroundColor Yellow
    pause
    exit 1
}

# 2. Instalar dependencias si no existen
if (-not (Test-Path "node_modules")) {
    Write-Host "[1/2] Instalando librerías de BIBLE (toma solo unos momentos)..." -ForegroundColor Green
    npm install
} else {
    Write-Host "[1/2] Librerías detectadas correctamente." -ForegroundColor Green
}

# 3. Crear accesos directos
Write-Host "[2/2] Creando accesos directos en Windows..." -ForegroundColor Green
$appDir = $PWD.Path
$vbsPath = Join-Path $appDir "iniciar-bible-windows.vbs"
$iconPath = Join-Path $appDir "src\renderer\shared\assets\icon.ico"
$desktop = [Environment]::GetFolderPath('Desktop')
$programs = [Environment]::GetFolderPath('Programs')

$wsh = New-Object -ComObject WScript.Shell

# Acceso directo Escritorio
$s1 = $wsh.CreateShortcut((Join-Path $desktop "BIBLE.lnk"))
$s1.TargetPath = "wscript.exe"
$s1.Arguments = "`"$vbsPath`""
$s1.WorkingDirectory = $appDir
$s1.IconLocation = "$iconPath, 0"
$s1.Description = "BIBLE - Sistema Multimedia y Proyección"
$s1.Save()

# Acceso directo Menú Inicio
$s2 = $wsh.CreateShortcut((Join-Path $programs "BIBLE.lnk"))
$s2.TargetPath = "wscript.exe"
$s2.Arguments = "`"$vbsPath`""
$s2.WorkingDirectory = $appDir
$s2.IconLocation = "$iconPath, 0"
$s2.Description = "BIBLE - Sistema Multimedia y Proyección"
$s2.Save()

# Acceso directo para Actualizaciones
$updaterBat = Join-Path $appDir "actualizar-bible.bat"
$s3 = $wsh.CreateShortcut((Join-Path $programs "Actualizar BIBLE.lnk"))
$s3.TargetPath = $updaterBat
$s3.WorkingDirectory = $appDir
$s3.IconLocation = "$iconPath, 0"
$s3.Description = "Actualizar BIBLE a la última versión"
$s3.Save()

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "        ¡INSTALACIÓN COMPLETADA EXITOSAMENTE!" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  1. Ya tienes el ícono de 'BIBLE' en tu Escritorio." -ForegroundColor White
Write-Host "  2. Ya quedó registrado en el Menú Inicio de Windows:" -ForegroundColor White
Write-Host "     presiona la tecla Windows y escribe 'BIBLE' para abrirla." -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
