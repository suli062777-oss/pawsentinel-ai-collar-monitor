param(
  [string]$Keyword = "pet home alone office pet camera",
  [int]$Port = 9222,
  [string]$Browser = "chrome"
)

$ErrorActionPreference = "Stop"
$root = Resolve-Path "."
$profile = Join-Path $root "tmp\xhs-browser-profile"
New-Item -ItemType Directory -Force $profile | Out-Null

$browserPath = $null
if ($Browser -eq "edge") {
  $candidates = @(
    "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
  )
} else {
  $candidates = @(
    "C:\Program Files\Google\Chrome\Application\chrome.exe",
    "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
  )
}

foreach ($candidate in $candidates) {
  if (Test-Path $candidate) {
    $browserPath = $candidate
    break
  }
}

if (-not $browserPath) {
  throw "Chrome or Edge was not found."
}

Add-Type -AssemblyName System.Web
$encoded = [System.Web.HttpUtility]::UrlEncode($Keyword, [System.Text.Encoding]::UTF8)
$url = "https://www.xiaohongshu.com/search_result?keyword=$encoded"
$args = @(
  "--remote-debugging-port=$Port",
  "--user-data-dir=$profile",
  "--no-first-run",
  "--new-window",
  $url
)

Start-Process -FilePath $browserPath -ArgumentList $args
Write-Host "Opened browser for Xiaohongshu research."
Write-Host "1. Log in if Xiaohongshu asks."
Write-Host "2. Keep the search result or note page visible."
Write-Host "3. Run: python scripts\xhs_cdp_capture.py --port $Port"
Write-Host "Search URL: $url"
