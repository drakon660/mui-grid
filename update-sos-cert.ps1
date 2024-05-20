# Get the current directory
$currentDir = Get-Location

# Path to the certificate file in the current directory
$certPath = Join-Path -Path $currentDir -ChildPath "certificate.pfx"

# Password for the certificate file
$certPassword = "#####"

# Load the certificate from the file
$cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2
$cert.Import($certPath, $certPassword, [System.Security.Cryptography.X509Certificates.X509KeyStorageFlags]::MachineKeySet)

# Add the certificate to the local machine's personal store
$store = New-Object System.Security.Cryptography.X509Certificates.X509Store "My", [System.Security.Cryptography.X509Certificates.StoreLocation]::LocalMachine
$store.Open([System.Security.Cryptography.X509Certificates.OpenFlags]::ReadWrite)
$store.Add($cert)
$store.Close()

Write-Output "Certificate successfully added to the local machine store."