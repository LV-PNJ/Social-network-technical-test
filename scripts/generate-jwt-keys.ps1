# Generates RS256 keypair for local/demo. Keys are gitignored — never commit them.
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Certs = Join-Path $Root "certs"
$PostsKeys = Join-Path $Root "BackEnd\src\config\keys"
$IdentityMain = Join-Path $Root "services\identity-service\src\main\resources\certs"
$IdentityTest = Join-Path $Root "services\identity-service\src\test\resources\certs"

New-Item -ItemType Directory -Force -Path $Certs, $PostsKeys | Out-Null

Push-Location $Certs
try {
  openssl genrsa -out private.rsa.pem 2048 2>$null
  if ($LASTEXITCODE -ne 0) { throw "openssl genrsa failed. Install OpenSSL and ensure it is on PATH." }
  openssl pkcs8 -topk8 -nocrypt -in private.rsa.pem -out private.key
  openssl rsa -in private.rsa.pem -pubout -out public.key
  Remove-Item private.rsa.pem -Force
} finally {
  Pop-Location
}

Copy-Item (Join-Path $Certs "public.key") (Join-Path $PostsKeys "public.key") -Force

# Optional classpath copies for local Spring Boot / Maven without file: overrides
foreach ($dir in @($IdentityMain, $IdentityTest)) {
  if (Test-Path (Split-Path $dir -Parent)) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    Copy-Item (Join-Path $Certs "private.key") (Join-Path $dir "private.key") -Force
    Copy-Item (Join-Path $Certs "public.key") (Join-Path $dir "public.key") -Force
  }
}

Write-Host "OK: certs/private.key + certs/public.key (gitignored)"
Write-Host "Copied public.key -> BackEnd/src/config/keys/"
Write-Host "Next: cp .env.example .env  (set POSTGRES_PASSWORD)"
