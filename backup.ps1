# Script de Respaldo Automático para KSFUN
$date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMessage = "Auto-backup: $date"

Write-Host "🚀 Iniciando respaldo automático..." -ForegroundColor Cyan

# 1. Agregar cambios
git add .
if ($?) { Write-Host "✅ Cambios agregados." -ForegroundColor Green } else { Write-Error "❌ Error al agregar cambios."; exit }

# 2. Commit
git commit -m "$commitMessage"
if ($?) { Write-Host "✅ Commit realizado: $commitMessage" -ForegroundColor Green } else { Write-Warning "⚠️ No hay cambios para commitear." }

# 3. Push
Write-Host "☁️ Subiendo a GitHub..." -ForegroundColor Cyan
git push origin main
if ($?) { 
    Write-Host "🎉 ¡Respaldo completado con éxito!" -ForegroundColor Green 
} else { 
    Write-Error "❌ Error al subir a GitHub. Verifica tu conexión o credenciales." 
}

Pause
