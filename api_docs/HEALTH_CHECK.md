# Health Check

## 🏥 Health Check

### Check Service Health
```
GET /health
```
Returns the health status of all services (PostgreSQL, OpenSearch, MinIO).

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-23T12:00:00.000Z",
  "services": {
    "postgres": "up",
    "opensearch": "up",
    "minio": "up"
  }
}
```
