param(
  [string]$OutputPath = (Join-Path $PSScriptRoot '..\assets\campfiresms-social-card-v2.png')
)

Add-Type -AssemblyName System.Drawing

$width = 1200
$height = 630
$bitmap = [System.Drawing.Bitmap]::new($width, $height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$paper = [System.Drawing.ColorTranslator]::FromHtml('#F2E9D0')
$ink = [System.Drawing.ColorTranslator]::FromHtml('#123D31')
$ember = [System.Drawing.ColorTranslator]::FromHtml('#D8642D')
$rule = [System.Drawing.ColorTranslator]::FromHtml('#526B5C')
$faint = [System.Drawing.Color]::FromArgb(38, 18, 61, 49)

$graphics.Clear($paper)

$faintPen = [System.Drawing.Pen]::new($faint, 2)
$rulePen = [System.Drawing.Pen]::new($rule, 2)
$inkPen = [System.Drawing.Pen]::new($ink, 4)
$emberBrush = [System.Drawing.SolidBrush]::new($ember)
$inkBrush = [System.Drawing.SolidBrush]::new($ink)

# Technical border and registration marks.
$graphics.DrawRectangle($rulePen, 38, 28, 1124, 574)
foreach ($point in @(@(38,28), @(1162,28), @(38,602), @(1162,602))) {
  $x = $point[0]
  $y = $point[1]
  $graphics.DrawLine($rulePen, $x - 13, $y, $x + 13, $y)
  $graphics.DrawLine($rulePen, $x, $y - 13, $x, $y + 13)
  $graphics.DrawEllipse($rulePen, $x - 5, $y - 5, 10, 10)
}

# Quiet relay-interface traces keep the card recognizably technical.
for ($row = 0; $row -lt 4; $row++) {
  $y = 75 + ($row * 34)
  $graphics.DrawRectangle($faintPen, 685, $y, 300, 22)
  $graphics.DrawEllipse($faintPen, 1025, $y + 5, 12, 12)
}
for ($row = 0; $row -lt 3; $row++) {
  $y = 440 + ($row * 34)
  $graphics.DrawRectangle($faintPen, 690, $y, 290, 22)
  $graphics.DrawEllipse($faintPen, 1025, $y + 5, 12, 12)
}

$titleFont = [System.Drawing.Font]::new('Franklin Gothic Heavy', 98, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$subtitleFont = [System.Drawing.Font]::new('Georgia', 39, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$labelFont = [System.Drawing.Font]::new('Arial Narrow', 18, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)

$graphics.DrawString('CampfireSMS', $titleFont, $inkBrush, 92, 185)
$graphics.DrawLine($inkPen, 94, 321, 1018, 321)
$graphics.FillRectangle($emberBrush, 96, 348, 18, 60)
$graphics.DrawString('SMS bridge for Codex + Grok Build.', $subtitleFont, $inkBrush, 138, 352)
$graphics.DrawString('MONITOR  /  REPLY  /  KEEP MOVING', $labelFont, $inkBrush, 96, 482)

$graphics.Dispose()
$bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bitmap.Dispose()

Write-Output $OutputPath
