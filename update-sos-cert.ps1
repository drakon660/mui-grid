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

# Define the path to the PFX file and the password
$pfxFilePath = "C:\path\to\your\certificate.pfx"
$pfxPassword = "yourPFXpassword"

# Load the PFX certificate
$pfxCert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2
$pfxCert.Import($pfxFilePath, $pfxPassword, [System.Security.Cryptography.X509Certificates.X509KeyStorageFlags]::PersistKeySet)

# Get the thumbprint of the certificate
$thumbprint = $pfxCert.Thumbprint

# Open the certificate store
$store = New-Object System.Security.Cryptography.X509Certificates.X509Store "My", "LocalMachine"
$store.Open("ReadWrite")

# Find and remove the certificate
$cert = $store.Certificates | Where-Object { $_.Thumbprint -eq $thumbprint }
if ($cert) {
    $store.Remove($cert)
    Write-Host "Certificate removed successfully."
} else {
    Write-Host "Certificate not found."
}

# Close the store
$store.Close()
