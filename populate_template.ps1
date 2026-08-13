# PowerShell script to overwrite the GARCIA template with project documentation
# This script opens the existing .docx, clears its content, then inserts chapters 1‑6 with images.

$TemplatePath = "C:\Users\Michael\OneDrive\Desktop\sirnicks\GARCIA TECHNO-DOCUMENT-TEMPLATE-FINAL.docx"
$ImgFolder    = "C:\Users\Michael\OneDrive\Desktop\sirnicks\diagrams"

# Verify template exists
if (-Not (Test-Path $TemplatePath)) {
    Write-Error "Template not found at $TemplatePath"
    exit 1
}

# Start Word COM automation (requires Microsoft Word)
$Word = New-Object -ComObject Word.Application
$Word.Visible = $false
$Doc = $Word.Documents.Open($TemplatePath)

# Helper to clear all existing content
function Clear-Document {
    $range = $Doc.Content
    $range.Delete()
}

function Add-Heading($text, $level) {
    $range = $Doc.Content
    $range.Collapse([Microsoft.Office.Interop.Word.WdCollapseDirection]::wdCollapseEnd)
    $para = $Doc.Paragraphs.Add($range)
    $para.Range.Text = $text
    $para.Range.set_Style("Heading $level")
    $para.Range.InsertParagraphAfter()
}

function Add-Paragraph($text) {
    $range = $Doc.Content
    $range.Collapse([Microsoft.Office.Interop.Word.WdCollapseDirection]::wdCollapseEnd)
    $para = $Doc.Paragraphs.Add($range)
    $para.Range.Text = $text
    $para.Range.InsertParagraphAfter()
}

function Add-Image($path, $caption) {
    if (-Not (Test-Path $path)) { Write-Host "Image not found: $path"; return }
    $range = $Doc.Content
    $range.Collapse([Microsoft.Office.Interop.Word.WdCollapseDirection]::wdCollapseEnd)
    $inline = $Doc.InlineShapes.AddPicture($path, $false, $true, $range)
    $inline.Width = 500
    $range.InsertParagraphAfter()
    if ($caption) {
        $capRange = $Doc.Content
        $capRange.Collapse([Microsoft.Office.Interop.Word.WdCollapseDirection]::wdCollapseEnd)
        $capPara = $Doc.Paragraphs.Add($capRange)
        $capPara.Range.Text = $caption
        $capPara.Range.set_Style('Caption')
        $capPara.Range.InsertParagraphAfter()
    }
}

Clear-Document

# Chapter 1 – Project Overview
Add-Heading -text 'Chapter 1 – Project Overview' -level 1
Add-Paragraph -text 'Brief introduction of the Sirnicks civil registry system, its purpose and key features.'
Add-Image -path (Join-Path $ImgFolder 'extension of business canvas.png') -caption 'Figure 1.1 – Business Canvas'

# Chapter 2 – System Architecture
Add-Heading -text 'Chapter 2 – System Architecture' -level 1
Add-Paragraph -text 'Description of backend, database and frontend components.'
Add-Image -path (Join-Path $ImgFolder 'sample business canvas.png') -caption 'Figure 2.1 – Architecture Diagram'

# Chapter 3 – UI Prototypes
Add-Heading -text 'Chapter 3 – UI Prototypes' -level 1
Add-Paragraph -text 'Landing page and login/register mockups.'
Add-Image -path (Join-Path $ImgFolder 'landing page prototype.png') -caption 'Figure 3.1 – Landing Page'
Add-Image -path (Join-Path $ImgFolder 'login register prototype.png') -caption 'Figure 3.2 – Login & Register'

# Chapter 4 – Functional Modules
Add-Heading -text 'Chapter 4 – Functional Modules' -level 1
Add-Paragraph -text 'Core modules such as birth certificate, marriage certificate, user management.'
Add-Image -path (Join-Path $ImgFolder 'sample Project Cash Flow .png') -caption 'Figure 4.1 – Module Flow'

# Chapter 5 – Financial Overview
Add-Heading -text 'Chapter 5 – Financial Overview' -level 1
Add-Paragraph -text 'Projected cash flow and financial metrics.'
Add-Image -path (Join-Path $ImgFolder 'sample financial aspects.png') -caption 'Figure 5.1 – Financial Aspects'

# Chapter 6 – Marketing Materials
Add-Heading -text 'Chapter 6 – Marketing Materials' -level 1
Add-Paragraph -text 'Sample brochure and additional graphics.'
Add-Image -path (Join-Path $ImgFolder 'sample brochure.png') -caption 'Figure 6.1 – Brochure'
Add-Image -path (Join-Path $ImgFolder 'sample prototype.png') -caption 'Figure 6.2 – Additional Prototype'

# Save changes (overwrites the template)
$Doc.Save()
$Doc.Close()
$Word.Quit()

Write-Host "Template updated in place: $TemplatePath"
