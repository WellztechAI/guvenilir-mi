# General API Information

## 📋 Complete API Endpoints

All endpoints return JSON responses. Errors follow the format: `{ "error": "Error message" }`

---

## 📊 Pagination

All list endpoints support pagination with:
- `limit`: Items per page (default: 10)
- `offset`: Skip items (default: 0)

**Response format:**
```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "limit": 10,
    "offset": 0,
    "page": 1,
    "totalPages": 10
  }
}
```

---

## ❌ Error Responses

All errors return HTTP status codes and a JSON error message:

```json
{
  "error": "Error description"
}
```

**Common Status Codes:**
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Internal Server Error
