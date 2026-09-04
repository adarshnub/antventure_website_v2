param(
  [string]$SourceDirectory = ".generated",
  [string]$MediaDirectory = "public/media"
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"
$secureKey = Read-Host "ARK API key" -AsSecureString
$keyPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)

try {
  $apiKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($keyPointer)
  $headers = @{ Authorization = "Bearer $apiKey"; "Content-Type" = "application/json" }
  $baseUrl = "https://ark.ap-southeast.bytepluses.com/api/v3/contents/generations/tasks"
  $prompt = "Single continuous premium 3D design film, no cuts. On the RIGHT two-thirds of a vast deep-navy environment, hundreds of small independent luminous signals travel with purpose along transparent branching paths. Three visually distinct currents represent the operating system of a company: warm-gold human judgement, vivid-aqua process, and cobalt-blue machine intelligence. At first they move separately. They then recognize one another, interlock, and build a precise transparent architectural lattice of connected pathways and responsive nodes. Once coordinated, the structure grows upward and outward, becoming more capable while one warm coral decision node remains visibly human-controlled. The meaning is collective intelligence engineered into practical business growth. Sophisticated enterprise design, cinematic volumetric light, physical glass, macro detail, strong parallax, elegant slow forward camera drift, energetic but disciplined movement. Keep the LEFT 42 percent dark, atmospheric, uncluttered, and safe for large white website typography. Do not create a sphere, planet, globe, brain, face, person, robot, hand, code, dashboard, chart, interface, readable text, letters, logo, or watermark. No generic sci-fi object. Smooth continuous motion with an ending composition that can loop back naturally to the opening."
  $body = @{
    model = "dreamina-seedance-2-0-260128"
    content = @(@{ type = "text"; text = $prompt })
    resolution = "720p"
    ratio = "16:9"
    duration = 8
    generate_audio = $false
    watermark = $false
  } | ConvertTo-Json -Depth 8

  $response = Invoke-RestMethod -Method Post -Uri $baseUrl -Headers $headers -Body $body
  if (-not $response.id) { throw "The video API did not return a task id." }
  Write-Output "Submitted hero film: $($response.id)"
  $status = "queued"
  $result = $null
  $attempt = 0
  while ($status -notin @("succeeded", "failed", "cancelled", "expired") -and $attempt -lt 150) {
    Start-Sleep -Seconds 8
    $attempt += 1
    $result = Invoke-RestMethod -Method Get -Uri "$baseUrl/$($response.id)" -Headers $headers
    $status = $result.status
    Write-Output "Hero film: $status"
  }
  if ($status -ne "succeeded") {
    $message = if ($result.error.message) { $result.error.message } else { "Generation ended with status $status." }
    throw "Hero generation failed: $message"
  }

  New-Item -ItemType Directory -Force -Path $SourceDirectory, $MediaDirectory | Out-Null
  $source = Join-Path $SourceDirectory "collective-growth-hero-source.mp4"
  Invoke-WebRequest -Uri $result.content.video_url -OutFile $source
  $mp4 = Join-Path $MediaDirectory "collective-growth-hero.mp4"
  $webm = Join-Path $MediaDirectory "collective-growth-hero.webm"
  $poster = Join-Path $MediaDirectory "collective-growth-hero-poster.webp"

  ffmpeg -loglevel error -y -i $source -an -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24" -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -g 48 -keyint_min 48 -sc_threshold 0 -bf 2 -refs 2 -movflags +faststart $mp4
  if ($LASTEXITCODE -ne 0) { throw "Hero MP4 encoding failed." }
  ffmpeg -loglevel error -y -i $source -an -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24" -c:v libvpx-vp9 -crf 33 -b:v 0 -g 48 $webm
  if ($LASTEXITCODE -ne 0) { throw "Hero WebM encoding failed." }
  ffmpeg -loglevel error -y -ss 5 -i $source -frames:v 1 -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720" $poster
  if ($LASTEXITCODE -ne 0) { throw "Hero poster generation failed." }
  Write-Output "Hero film prepared."
}
finally {
  $apiKey = $null
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($keyPointer)
}
