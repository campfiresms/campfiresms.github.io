param(
  [string]$OutputPath = (Join-Path $PSScriptRoot '..\assets\campfiresms-social-card-v3.png')
)

# Render at twice the delivery resolution for smooth type and rounded edges.
# The site's palette and existing brand asset keep the card easy to maintain.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$width = 1200
$height = 630
$scale = 2
$siteRoot = Split-Path -Parent $PSScriptRoot
$styles = Get-Content -LiteralPath (Join-Path $siteRoot 'styles.css') -Raw
$resources = [System.Collections.Generic.List[System.IDisposable]]::new()

function Get-SiteColor([string]$Name) {
  $match = [regex]::Match($styles, "--${Name}:\s*(#[0-9a-fA-F]{6})\s*;")
  if (-not $match.Success) { throw "Missing site palette color: $Name" }
  return [System.Drawing.ColorTranslator]::FromHtml($match.Groups[1].Value)
}

function New-Brush([System.Drawing.Color]$Color) {
  $brush = [System.Drawing.SolidBrush]::new($Color)
  $resources.Add($brush)
  return $brush
}

function New-RoundedPath([single]$X, [single]$Y, [single]$W, [single]$H, [single]$Radius) {
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $diameter = $Radius * 2
  $path.AddArc($X, $Y, $diameter, $diameter, 180, 90)
  $path.AddArc($X + $W - $diameter, $Y, $diameter, $diameter, 270, 90)
  $path.AddArc($X + $W - $diameter, $Y + $H - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($X, $Y + $H - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function Draw-RoundedBox($Brush, [single]$X, [single]$Y, [single]$W, [single]$H, [single]$Radius) {
  $path = New-RoundedPath $X $Y $W $H $Radius
  try { $graphics.FillPath($Brush, $path) } finally { $path.Dispose() }
}

function Draw-Copy([string]$Text, [single]$Size, $Brush, [single]$X, [single]$Y, [string]$Family = 'Segoe UI') {
  $font = [System.Drawing.Font]::new($Family, $Size, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  try {
    $graphics.DrawString($Text, $font, $Brush, [System.Drawing.PointF]::new($X, $Y), $textFormat)
  } finally { $font.Dispose() }
}

function Draw-BrandIcon([single]$X, [single]$Y, [single]$Size) {
  $state = $graphics.Save()
  $clip = New-RoundedPath $X $Y $Size $Size ($Size / 4)
  try {
    $graphics.SetClip($clip)
    $graphics.DrawImage($logo, [System.Drawing.RectangleF]::new($X, $Y, $Size, $Size))
  } finally {
    $graphics.Restore($state)
    $clip.Dispose()
  }
}

$bitmap = [System.Drawing.Bitmap]::new(($width * $scale), ($height * $scale))
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$delivery = [System.Drawing.Bitmap]::new($width, $height, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$deliveryGraphics = [System.Drawing.Graphics]::FromImage($delivery)
$logo = [System.Drawing.Image]::FromFile((Join-Path $siteRoot 'assets\campfire-icon-512.png'))
$textFormat = [System.Drawing.StringFormat]::GenericTypographic.Clone()
$resources.Add($textFormat)

try {
  $graphics.ScaleTransform($scale, $scale)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $paper = Get-SiteColor 'manual-paper'
  $inkBrush = New-Brush (Get-SiteColor 'manual-ink')
  $greenBrush = New-Brush (Get-SiteColor 'manual-green')
  $emberBrush = New-Brush (Get-SiteColor 'manual-red')
  $mutedBrush = New-Brush (Get-SiteColor 'muted')
  $whiteBrush = New-Brush ([System.Drawing.ColorTranslator]::FromHtml('#fafaf7'))
  $bubbleBrush = New-Brush ([System.Drawing.ColorTranslator]::FromHtml('#e7e8e2'))
  $replyBrush = New-Brush ([System.Drawing.ColorTranslator]::FromHtml('#367c48'))
  $quietBrush = New-Brush ([System.Drawing.ColorTranslator]::FromHtml('#b5c9ba'))
  $ruleBrush = New-Brush ([System.Drawing.Color]::FromArgb(30, 255, 255, 255))

  $graphics.Clear($paper)

  # Brand and headline stay readable when a social feed halves the image size.
  Draw-BrandIcon 64 64 44
  Draw-Copy 'Campfire SMS' 28 $inkBrush 122 66 'Segoe UI Semibold'
  Draw-Copy 'Text your' 88 $inkBrush 62 187 'Segoe UI Semibold'
  Draw-Copy 'agent.' 88 $inkBrush 62 276 'Segoe UI Semibold'
  $graphics.FillRectangle($emberBrush, 68, 400, 52, 4)
  Draw-Copy 'Your agent texts you.' 27 $mutedBrush 68 421
  Draw-Copy 'You text back.' 27 $mutedBrush 68 457
  $graphics.FillEllipse($emberBrush, 68, 557, 7, 7)
  Draw-Copy 'campfiresms.com' 21 $inkBrush 88 544

  # A condensed version of the homepage's lead-verification SMS exchange.
  Draw-RoundedBox $greenBrush 666 64 470 502 28
  Draw-BrandIcon 696 97 38
  Draw-Copy 'Campfire SMS' 23 $whiteBrush 748 95 'Segoe UI Semibold'
  Draw-Copy 'Text Message' 15 $quietBrush 748 124
  $graphics.FillRectangle($ruleBrush, 696, 159, 410, 1)

  Draw-RoundedBox $bubbleBrush 696 186 353 128 20
  $graphics.FillRectangle($bubbleBrush, 696, 285, 20, 29)
  Draw-Copy 'A lead email includes a PDF.' 23 $inkBrush 720 203
  Draw-Copy "The domain doesn't match." 23 $inkBrush 720 234
  Draw-Copy 'Ask staff to verify?' 23 $inkBrush 720 265

  Draw-RoundedBox $replyBrush 765 334 341 95 20
  $graphics.FillRectangle($replyBrush, 1086, 400, 20, 29)
  Draw-Copy 'Verify it first. Leave the' 23 $whiteBrush 789 351
  Draw-Copy 'PDF unopened.' 23 $whiteBrush 789 382

  Draw-RoundedBox $bubbleBrush 696 449 344 68 20
  $graphics.FillRectangle($bubbleBrush, 696, 488, 20, 29)
  Draw-Copy 'Done. Staff is verifying.' 23 $inkBrush 720 466

  $deliveryGraphics.Clear($paper)
  $deliveryGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $deliveryGraphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $deliveryGraphics.DrawImage($bitmap, 0, 0, $width, $height)
  $delivery.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
} finally {
  foreach ($resource in $resources) { $resource.Dispose() }
  $logo.Dispose()
  $deliveryGraphics.Dispose()
  $delivery.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

Write-Output ([System.IO.Path]::GetFullPath($OutputPath))
