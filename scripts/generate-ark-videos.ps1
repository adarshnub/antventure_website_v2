param(
  [string]$OutputDirectory = "public/media"
)

$ErrorActionPreference = "Stop"
$secureKey = Read-Host "ARK API key" -AsSecureString
$keyPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)

try {
  $apiKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($keyPointer)
  $headers = @{
    Authorization = "Bearer $apiKey"
    "Content-Type" = "application/json"
  }
  $baseUrl = "https://ark.ap-southeast.bytepluses.com/api/v3/contents/generations/tasks"
  $clips = @(
    @{
      Name = "ai-system-journey"
      Prompt = "Single continuous cinematic shot, no cuts. A vast dark architectural space made of translucent glass and deep midnight blue. Thousands of warm amber data fragments drift independently in three-dimensional depth, then flow around the camera and assemble into an elegant luminous teal intelligence organism: layered neural filaments, precise nodes, and one radiant coral decision core. The camera performs a very slow smooth forward dolly through the system with strong parallax, macro depth of field, volumetric light, premium futuristic design film, sophisticated and restrained, photoreal 3D animation, crisp details, seamless motion. No people, no robots, no brains, no text, no logos, no interface, no letters, no abrupt camera movement. Composition leaves clean dark space on the left for website typography."
    },
    @{
      Name = "role-x-invisible-layer"
      Prompt = "Single continuous cinematic macro animation, no cuts. An ordinary working environment is represented as floating layers of glass: an email envelope, document sheets, table cells, chat signals and approval tokens, all abstract and without readable text. A silent ribbon of aqua light moves through each layer, reads it, connects it, and prepares five glowing actions. At the end one warm human decision node remains distinct and pulses once in coral. Deep navy environment, amber and aqua highlights, physically realistic glass, elegant soft shadows, subtle particles, premium enterprise technology film, controlled smooth orbital camera, high depth and parallax. No humans, no robot, no text, no logo, no watermark, no jump cuts."
    }
  )

  New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
  $tasks = @()
  foreach ($clip in $clips) {
    $body = @{
      model = "dreamina-seedance-2-0-260128"
      content = @(@{ type = "text"; text = $clip.Prompt })
      resolution = "720p"
      ratio = "16:9"
      duration = 8
      generate_audio = $false
      watermark = $false
    } | ConvertTo-Json -Depth 8
    $response = Invoke-RestMethod -Method Post -Uri $baseUrl -Headers $headers -Body $body
    if (-not $response.id) { throw "The video API did not return a task id for $($clip.Name)." }
    Write-Output "Submitted $($clip.Name): $($response.id)"
    $tasks += @{ Name = $clip.Name; Id = $response.id }
  }

  foreach ($task in $tasks) {
    $status = "queued"
    $result = $null
    $attempt = 0
    while ($status -notin @("succeeded", "failed", "cancelled", "expired") -and $attempt -lt 150) {
      Start-Sleep -Seconds 8
      $attempt += 1
      $result = Invoke-RestMethod -Method Get -Uri "$baseUrl/$($task.Id)" -Headers $headers
      $status = $result.status
      Write-Output "$($task.Name): $status"
    }
    if ($status -ne "succeeded") {
      $message = if ($result.error.message) { $result.error.message } else { "Video generation ended with status $status." }
      throw "$($task.Name) failed: $message"
    }
    $downloadUrl = $result.content.video_url
    if (-not $downloadUrl) { throw "No video URL was returned for $($task.Name)." }
    $sourcePath = Join-Path $OutputDirectory "$($task.Name)-source.mp4"
    Invoke-WebRequest -Uri $downloadUrl -OutFile $sourcePath
    Write-Output "Downloaded $sourcePath"
  }
}
finally {
  $apiKey = $null
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($keyPointer)
}
