# Users

## 👤 Users

### 1. Create User
```
POST /api/users
```
**Body:**
```json
{
  "userName": "john_doe",
  "email": "john@example.com",
  "passwordHash": "$2b$10$...",
  "phoneNumber": "+905551234567",
  "country": "Turkiye"
}
```

### 2. Get User
```
GET /api/users/:userId
```
Returns user details with favourite companies.

### 3. Get User by Email
```
GET /api/users/email/:email
```

### 4. List All Users
```
GET /api/users?status=active&limit=10&offset=0
```

### 5. Update User (Modify User)
```
PUT /api/users/:userId
```
**Body:**
```json
{
  "userName": "new_name",
  "phoneNumber": "+905551234567",
  "country": "Turkiye",
  "imageUrl": "avatars/user-123.jpg",
  "status": "active"
}
```

### 6. Change User Avatar
```
PUT /api/users/:userId
```
**Body:**
```json
{
  "imageUrl": "avatars/new-avatar.jpg"
}
```
_Note: Upload avatar first using `/api/upload` with `bucket=avatars`_

### 7. Add Favourite Company
```
POST /api/users/:userId/favourites
```
**Body:**
```json
{
  "companyId": "uuid"
}
```

### 8. Remove Favourite Company
```
DELETE /api/users/:userId/favourites/:companyId
```

### 9. Get User Notifications (List notifications of the user)
```
GET /api/users/:userId/notifications?unreadOnly=true&limit=10
```

### 10. Mark Notifications as Read
```
PATCH /api/users/:userId/notifications/read
```
**Body (optional):**
```json
{
  "notificationIds": ["uuid1", "uuid2"]
}
```
_Omit body to mark all as read_

### 11. Get User Rewards (List rewards of the user)
```
GET /api/users/:userId/rewards?unusedOnly=true
```

### 12. Get User Comments (List comments of the user)
```
GET /api/users/:userId/comments?limit=10&offset=0
```
