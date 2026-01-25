# Companies

## 🏢 Companies

### 13. Get Company
```
GET /api/companies/:slug?trackView=true
```
Returns company details with sectors.

**Query Parameters:**
- `trackView` (optional): Track view count in statistics (default: true)

### 14. Get Company by ID
```
GET /api/companies/id/:companyId?trackView=true
```
**Query Parameters:**
- `trackView` (optional): Track view count in statistics (default: true)

### 15. List All Companies
```
GET /api/companies?status=active&sector=e-ticaret&sort=rating&order=DESC&limit=10&offset=0
```

### 16. Create Company
```
POST /api/companies
```
**Body:**
```json
{
  "name": "Example Company",
  "slug": "example-company",
  "description": "Company description",
  "phone": "08501234567",
  "sectors": ["e-ticaret", "teknoloji"]
}
```

### 17. Update Company (Modify company)
```
PUT /api/companies/:companyId
```
**Body:**
```json
{
  "name": "New Name",
  "description": "Updated description",
  "phone": "08509876543",
  "status": "active"
}
```

### 18. Get Company Comments (List comments of the company)
```
GET /api/companies/:companyId/comments?status=approved&limit=10&offset=0&rating=5&search=keyword&sortBy=created_at&sortOrder=DESC
```
**Pagination:** Default 10 items per page  
**Filters:**
- `status`: approved, pending, rejected, deleted, all
- `rating`: 1-5
- `search`: Search in message and product name
- `sortBy`: created_at, rating, likes_count
- `sortOrder`: ASC, DESC
