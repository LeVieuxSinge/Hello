# for every entry, try with 1,2,3,4,5
# for every correct, feed syllablesWithTones string/file
# Get current script directory
$directory = $MyInvocation.MyCommand.Path.Substring(0, $MyInvocation.MyCommand.Path.LastIndexOf("\"))

$client = New-Object System.Net.WebClient
$file = Get-Content -Path $directory\_outEntries.txt
$syllablesWithTones = ""
$wrongEntry = ""
ForEach ($entry in $file) {
    Write-Output "Fetching $($entry)"
    # For every entry, try with 1,2,3,4,5
    For ($i=0; $i -le 5; $i++) {
        $tone = $i
        if ($i -eq 0) {
            $tone = ""
        }
        $notFound = $false
        $output = "C:\Users\Cyberpunk\Downloads\" + $entry + $tone + ".mp3"
        try {
            $url = "https://www.archchinese.com/audio/" + $entry + $tone + ".mp3"
            $client.DownloadFile($url, $output)
        } catch {
            try {
                $url = "https://www.archchinese.com/swf/" + $entry + $tone + ".mp3"
                $client.DownloadFile($url, $output)
            } catch {
                Write-Output "Unable to fetch file $($entry)$($tone).mp3"
                $wrongEntry += "$($entry)$($tone)`n"
                $notFound = $true
            }
        }

        if ($notFound -eq $false) {
            $syllablesWithTones += $entry + $tone + "`n"
        }
    }
}

if ($wrongEntry -eq "") {
    $wrongEntry = "none"
}

Out-File -FilePath $directory\_wrongSyllables.txt -InputObject $wrongEntry

# Order alphabetically
$syllablesWithTones = $syllablesWithTones | Sort-Object
Out-File -FilePath $directory\_syllablesWithTones.txt -InputObject $syllablesWithTones
