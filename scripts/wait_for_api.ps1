param([string]$Url="http://localhost:5000/api/health",[int]$TimeoutSec=180)
$deadline=(Get-Date).AddSeconds($TimeoutSec)
while((Get-Date)-lt $deadline){
  try{$res=Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec 5;if($res.StatusCode -eq 200){Write-Host "API ready.";exit 0}}
  catch{Start-Sleep -Milliseconds 800}
}
Write-Error "Timed out waiting for API.";exit 1
