# Statistics

## 📊 Statistics

Statistics are tracked using Redis for real-time counting and periodically flushed to PostgreSQL for persistence.

**Tracked Metrics:**
- **View Count**: Incremented when a company is fetched by slug or ID
- **Search Count**: Incremented when a company appears in search results

---

### 27. Get Company Statistics
```
GET /api/stats/company/:companyId
```
**Response:**
```json
{
  "data": {
    "totalViewCount": 15420,
    "totalSearchCount": 3250,
    "pendingViewCount": 45,
    "pendingSearchCount": 12,
    "lastUpdated": "2024-01-29T23:59:59.000Z"
  }
}
```
_Note: `pending*Count` shows counts in Redis not yet flushed to PostgreSQL._

---

### 28. Get All Company Statistics (Admin Dashboard)
```
GET /api/stats/companies?limit=50&sortBy=views
```
**Query Parameters:**
- `limit` (optional): Number of companies to return (default: 50)
- `sortBy` (optional): Sort by `views` or `searches` (default: views)

**Response:**
```json
{
  "data": [
    {
      "companyId": "uuid",
      "companyName": "Trendyol",
      "companySlug": "trendyol",
      "totalViewCount": 15420,
      "totalSearchCount": 3250,
      "pendingViewCount": 45,
      "pendingSearchCount": 12,
      "lastUpdated": "2024-01-29T23:59:59.000Z"
    }
  ],
  "count": 6
}
```

---

### 29. Record View Manually
```
POST /api/stats/view/:companyId
```
**Response:**
```json
{
  "recorded": true,
  "pendingCount": 46
}
```
_Note: Views are automatically tracked when fetching company by slug/ID. Use `?trackView=false` to disable._

---

### 30. Flush Stats to PostgreSQL (Admin)
```
POST /api/stats/flush
```
**Response:**
```json
{
  "message": "Stats flushed to PostgreSQL",
  "flushed": 6,
  "errors": 0
}
```
_Note: Stats are automatically flushed every 5 minutes. This endpoint triggers a manual flush._

---

### 31. Get Last Flush Time
```
GET /api/stats/last-flush
```
**Response:**
```json
{
  "lastFlush": "2024-01-30T10:00:00.000Z"
}
```

---

## Configuration

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `STATS_FLUSH_INTERVAL_MS` | 300000 (5 min) | Interval between automatic flushes |
| `REDIS_HOST` | redis | Redis server hostname |
| `REDIS_PORT` | 6379 | Redis server port |

---

## Database Tables

### company_statistics
Stores periodic snapshots of stats.
```sql
- id (UUID)
- company_id (UUID, FK)
- view_count (BIGINT)
- search_count (BIGINT)
- period_start (TIMESTAMP)
- period_end (TIMESTAMP)
- created_at (TIMESTAMP)
```

### company_statistics_total
Stores running totals for quick lookups.
```sql
- company_id (UUID, PK, FK)
- total_view_count (BIGINT)
- total_search_count (BIGINT)
- last_updated (TIMESTAMP)
```
