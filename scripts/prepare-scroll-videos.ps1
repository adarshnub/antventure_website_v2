param([string]$MediaDirectory = "public/media")

$ErrorActionPreference = "Stop"
$names = @("ai-system-journey", "role-x-invisible-layer")

foreach ($name in $names) {
  $source = Join-Path $MediaDirectory "$name-source.mp4"
  if (-not (Test-Path -LiteralPath $source)) { throw "Missing generated source: $source" }
  $mp4 = Join-Path $MediaDirectory "$name.mp4"
  $webm = Join-Path $MediaDirectory "$name.webm"
  $poster = Join-Path $MediaDirectory "$name-poster.webp"

  ffmpeg -loglevel error -y -i $source -an -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24" -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -g 6 -keyint_min 6 -sc_threshold 0 -bf 0 -refs 1 -force_key_frames "expr:gte(t,n_forced*0.25)" -movflags +faststart $mp4
  if ($LASTEXITCODE -ne 0) { throw "MP4 encoding failed for $name" }

  ffmpeg -loglevel error -y -i $source -an -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24" -c:v libvpx-vp9 -crf 34 -b:v 0 -g 6 -lag-in-frames 0 -auto-alt-ref 0 $webm
  if ($LASTEXITCODE -ne 0) { throw "WebM encoding failed for $name" }

  ffmpeg -loglevel error -y -ss 4.5 -i $source -frames:v 1 -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720" $poster
  if ($LASTEXITCODE -ne 0) { throw "Poster generation failed for $name" }
  Write-Output "Prepared $name"
}
