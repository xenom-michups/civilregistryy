# PowerShell script to copy GARCIA template to Sirnicks Documentation folder
$source = "C:\Users\Michael\OneDrive\Desktop\sirnicks\GARCIA TECHNO-DOCUMENT-TEMPLATE-FINAL.docx"
$destDir = "C:\Users\Michael\OneDrive\Desktop\sirnicks\Documentation"
$dest = Join-Path $destDir "ProjectDocumentation.docx"
if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
Copy-Item -Path $source -Destination $dest -Force
Write-Host "Template copied to $dest"
