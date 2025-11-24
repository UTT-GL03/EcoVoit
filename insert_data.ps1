# Configuration
$COUCHDB_USER = "admin"
$COUCHDB_PASSWORD = "password"
$COUCHDB_URL = "http://localhost:5984"

Write-Host "Insertion des donnees Ecovoit..." -ForegroundColor Blue

# Insertion des utilisateurs
Write-Host "`nInsertion des utilisateurs..." -ForegroundColor Cyan
curl.exe -X POST "http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@localhost:5984/users/_bulk_docs" -H "Content-Type: application/json" -d "@public/users_data.json"
Write-Host "Utilisateurs inseres" -ForegroundColor Green

# Insertion des trajets
Write-Host "`nInsertion des trajets..." -ForegroundColor Cyan
curl.exe -X POST "http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@localhost:5984/trips/_bulk_docs" -H "Content-Type: application/json" -d "@public/trips_data.json"
Write-Host "Trajets inseres" -ForegroundColor Green

# Insertion des reservations
Write-Host "`nInsertion des reservations..." -ForegroundColor Cyan
curl.exe -X POST "http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@localhost:5984/bookings/_bulk_docs" -H "Content-Type: application/json" -d "@public/bookings_data.json"
Write-Host "Reservations inserees" -ForegroundColor Green

Write-Host "`nToutes les donnees ont ete inserees!" -ForegroundColor Green