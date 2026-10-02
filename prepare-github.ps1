$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot
$exportRoot = Join-Path $projectRoot 'github-upload'
if (Test-Path -LiteralPath $exportRoot) {
    throw 'github-upload already exists. Keep it or rename it before preparing another export.'
}
Push-Location $projectRoot
try {
    $files = @(git -c core.quotePath=false ls-files --cached --others --exclude-standard)
    if ($LASTEXITCODE -ne 0) { throw 'Could not list project files.' }
    $ignored = @($files | git -c core.quotePath=false check-ignore --no-index --stdin)
    if ($LASTEXITCODE -gt 1) { throw 'Could not check ignore rules.' }
    $excluded = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
    foreach ($file in $ignored) { [void]$excluded.Add($file) }
    New-Item -ItemType Directory -Path $exportRoot | Out-Null
    foreach ($file in $files) {
        if ($excluded.Contains($file)) { continue }
        if ($file -match '(^|/)(github-upload[^/]*|\.venv[^/]*|node_modules|\.next|__pycache__|storage|validation_data|datasets)(/|$)' -or
            $file -match '(^|/)\.env($|\.)' -and $file -notmatch '\.example$' -or
            $file -match '\.(pt|db|sqlite|sqlite3|pyc|pyo|tsbuildinfo)(-|$)') { continue }
        $source = Join-Path $projectRoot $file
        if (-not (Test-Path -LiteralPath $source -PathType Leaf)) { continue }
        $destination = Join-Path $exportRoot $file
        New-Item -ItemType Directory -Force -Path (Split-Path $destination -Parent) | Out-Null
        Copy-Item -LiteralPath $source -Destination $destination
    }
    Set-Location $exportRoot
    git init -b main
    if ($LASTEXITCODE -ne 0) { throw 'Git initialization failed.' }
    Write-Host "Clean project prepared at $exportRoot"
    Write-Host 'Review this folder, then follow GITHUB-UPLOAD.md to commit and publish.'
} finally {
    Pop-Location
}
