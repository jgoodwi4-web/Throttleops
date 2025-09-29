param([string]$Name="Admin",[string]$Email="admin@example.com",[SecureString]$Password="ChangeMe!123")
$body=@{name=$Name;email=$Email;password=$Password;role="admin"}|ConvertTo-Json
try{$res=Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/auth/register" -ContentType "application/json" -Body $body
Write-Host "Admin created: $($res.user.email)"}catch{
  if($_.Exception.Response.StatusCode.Value__ -eq 409){Write-Host "Admin already exists.";exit 0}else{Write-Error $_.Exception.Message;exit 1}
}
c:\Users\goodw\OneDrive\Documents\ThrottleOps_CrossPlatform_Full[1]\scripts\seed_admin.ps1
