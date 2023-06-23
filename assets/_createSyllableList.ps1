# Get current script directory
$directory = $MyInvocation.MyCommand.Path.Substring(0, $MyInvocation.MyCommand.Path.LastIndexOf("\"))

# Get old and new entries
$oldEntries = Get-Content -Path $directory\_oldList.txt
$newEntries = Get-Content -Path $directory\_newList.txt
$differentEntries = ""
$outEntries = ""

$differentEntries = "In old entries but not in new entries:`n"
ForEach ($oldEntry in $oldEntries) {
    Write-Output "Checking $($oldEntry)"
    $foundMatch = $false
    forEach ($newEntry in $newEntries) {
        if ($oldEntry -eq $newEntry) {
            $foundMatch = $true
        }
    }

    if ($foundMatch -eq $false) {
        $differentEntries += $oldEntry + "`n"
    } else {
        $newEntries = $newEntries -ne $oldEntry
    }

    # Add to outEntries
    $outEntries += $oldEntry + "`n"
}

$differentEntries += "`nIn new entries but not in old entries:`n"
ForEach ($newEntry in $newEntries) {
    $differentEntries += $newEntry + "`n"
}

# Write to file
Out-File -FilePath $directory\_differentEntries.txt -InputObject $differentEntries

# Order alphabetically
$outEntries = $outEntries | Sort-Object
Out-File -FilePath $directory\_outEntries.txt -InputObject $outEntries
