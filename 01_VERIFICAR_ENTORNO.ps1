# Ejecutar desde PowerShell normal, en el directorio del proyecto.
# No modifica el entorno, solo informa requisitos y ruta.
Write-Host '=== UCPS PRACTICA 8: DIAGNOSTICO ===' -ForegroundColor Cyan
Write-Host "Directorio: $PWD"
$cmds = @('node', 'npm', 'git', 'code')
foreach ($cmd in $cmds) {
    if (Get-Command $cmd -ErrorAction SilentlyContinue) {
        try {
            if ($cmd -eq 'code') { $result = 'Disponible (VS Code)' }
            else { $result = & $cmd --version 2>&1 | Select-Object -First 1 }
            Write-Host "[OK] $cmd : $result" -ForegroundColor Green
        } catch { Write-Host "[AVISO] $cmd : $($_.Exception.Message)" -ForegroundColor Yellow }
    } else {
        Write-Host "[FALTA] $cmd" -ForegroundColor Red
    }
}
if (Test-Path '.\src\components\BuscadorGitHub.jsx') { Write-Host '[OK] Estructura del proyecto' -ForegroundColor Green }
else { Write-Host '[FALTA] Ubicarse dentro de la carpeta del proyecto.' -ForegroundColor Red }
if (Test-Path '.\node_modules') { Write-Host '[OK] Dependencias presentes' -ForegroundColor Green }
else { Write-Host '[PENDIENTE] npm install' -ForegroundColor Yellow }
Write-Host '=== Siguiente paso: npm install ; npm test ; npm run dev ===' -ForegroundColor Cyan
