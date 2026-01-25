# Admin

## 🔧 Admin

### 31. Get All Comments (Moderation)
```
GET /api/admin/comments?status=pending&limit=50&offset=0
```
**Pagination:** Default 50 items per page
**Filters:**
- `status`: approved, pending, rejected, deleted, all
