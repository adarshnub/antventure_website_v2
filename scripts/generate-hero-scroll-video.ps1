param([string]$SourceDirectory = ".generated", [string]$MediaDirectory = "public/media")

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"
$secureKey = Read-Host "ARK API key" -AsSecureString
$keyPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)

try {
  $apiKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($keyPointer)
  $headers = @{ Authorization = "Bearer $apiKey"; "Content-Type" = "application/json" }
  $baseUrl = "https://ark.ap-southeast.bytepluses.com/api/v3/contents/generations/tasks"
  $prompt = "One uninterrupted twelve-second adrenaline-driven premium 3D animation designed specifically for scroll scrubbing, with strong visual evolution and no cuts. Begin inside a deep midnight architectural void as hundreds of independent luminous signals surge past the camera at high speed with dramatic parallax: aqua data, warm-gold human judgement, cobalt process paths, and coral decision sparks. The camera accelerates smoothly forward through the streams. The separate signals discover each other and snap into precise transparent glass pathways, forming a vast coordinated operating system rather than a single object. Continue flying through this living structure as abstract messages, documents, calls, tables and approval tokens are read and routed by an invisible aqua intelligence layer; represent them only as elegant translucent shapes with absolutely no readable interface text. Five bright automated actions ignite in sequence, then motion suddenly becomes focused and controlled around one unmistakable warm coral human-decision node. Finish by bursting through that approved decision into an expanding organized lattice stretching toward the horizon, communicating real business growth and collective intelligence. Visceral speed, macro particles, glass refraction, volumetric light, dramatic depth, premium enterprise technology film, rich navy/aqua/gold/coral palette, smooth stable camera trajectory, continuous transformation. No sphere, globe, planet, brain, face, human body, robot, hand, code, charts, dashboards, readable words, letters, logos, watermark, or jump cuts. Keep important action mainly in the center and right so responsive website typography remains legible."
  $body = @{
    model = "dreamina-seedance-2-0-260128"
    content = @(@{ type = "text"; text = $prompt })
    resolution = "720p"
    ratio = "16:9"
    duration = 12
    generate_audio = $false
    watermark = $false
  } | ConvertTo-Json -Depth 8

  $response = Invoke-RestMethod -Method Post -Uri $baseUrl -Headers $headers -Body $body
  if (-not $response.id) { throw "The video API did not return a task id." }
  Write-Output "Submitted scroll hero: $($response.id)"
  $status = "queued"
  $result = $null
  $attempt = 0
  while ($status -notin @("succeeded", "failed", "cancelled", "expired") -and $attempt -lt 180) {
    Start-Sleep -Seconds 8
    $attempt += 1
    $result = Invoke-RestMethod -Method Get -Uri "$baseUrl/$($response.id)" -Headers $headers
    $status = $result.status
    Write-Output "Scroll hero: $status"
  }
  if ($status -ne "succeeded") {
    $message = if ($result.error.message) { $result.error.message } else { "Generation ended with status $status." }
    throw "Scroll hero generation failed: $message"
  }

  New-Item -ItemType Directory -Force -Path $SourceDirectory, $MediaDirectory | Out-Null
  $source = Join-Path $SourceDirectory "hero-scroll-system-source.mp4"
  Invoke-WebRequest -Uri $result.content.video_url -OutFile $source
  $mp4 = Join-Path $MediaDirectory "hero-scroll-system.mp4"
  $webm = Join-Path $MediaDirectory "hero-scroll-system.webm"
  $poster = Join-Path $MediaDirectory "hero-scroll-system-poster.webp"

  ffmpeg -loglevel error -y -i $source -an -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24" -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -g 6 -keyint_min 6 -sc_threshold 0 -bf 0 -refs 1 -force_key_frames "expr:gte(t,n_forced*0.25)" -movflags +faststart $mp4
  if ($LASTEXITCODE -ne 0) { throw "Scroll hero MP4 encoding failed." }
  ffmpeg -loglevel error -y -i $source -an -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24" -c:v libvpx-vp9 -crf 34 -b:v 0 -g 6 -lag-in-frames 0 -auto-alt-ref 0 $webm
  if ($LASTEXITCODE -ne 0) { throw "Scroll hero WebM encoding failed." }
  ffmpeg -loglevel error -y -ss 9 -i $source -frames:v 1 -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720" $poster
  if ($LASTEXITCODE -ne 0) { throw "Scroll hero poster generation failed." }
  Write-Output "Scroll hero prepared."
}
finally {
  $apiKey = $null
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($keyPointer)
}
