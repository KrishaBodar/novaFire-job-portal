Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Starting NovaHire Microservices & Frontend" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$services = @(
  @{ name = "Auth Service";    dir = "services/auth";    port = 5000 },
  @{ name = "Utils Service";   dir = "services/utils";   port = 5001 },
  @{ name = "User Service";    dir = "services/user";    port = 5002 },
  @{ name = "Job Service";     dir = "services/job";     port = 5003 },
  @{ name = "Payment Service"; dir = "services/payment"; port = 5004 },
  @{ name = "Frontend (Next)"; dir = "frontend";         port = 3000 }
)

foreach ($s in $services) {
  Write-Host "Launching $($s.name) on port $($s.port)..." -ForegroundColor Green
  if ($s.dir -eq "frontend") {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot/frontend'; npm run dev"
  } else {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot/$($s.dir)'; npm run start"
  }
}

Write-Host "==========================================" -ForegroundColor Yellow
Write-Host " Everything is starting on localhost!" -ForegroundColor Yellow
Write-Host " Open in browser: http://localhost:3000" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow
