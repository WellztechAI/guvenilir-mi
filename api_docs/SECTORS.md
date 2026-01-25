# Sectors

## 🏷️ Sectors

### Get All Sectors
```
GET /api/sectors
```

### Get Sector Details
```
GET /api/sectors/:slug
```

### Get Companies in Sector
```
GET /api/sectors/:slug/companies?limit=50&offset=0
```

### Create Sector
```
POST /api/sectors
```
**Body:**
```json
{
  "name": "E-Ticaret",
  "slug": "e-ticaret"
}
```
