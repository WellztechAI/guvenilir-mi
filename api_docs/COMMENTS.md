# Comments

## 💬 Comments

### 19. Create Comment
```
POST /api/comments
```
**Body:**
```json
{
  "companyId": "uuid",
  "authorId": "uuid",
  "message": "Great service!",
  "rating": 5,
  "productName": "Laptop",
  "contactMethod": "phone"
}
```
_contactMethod options: phone, email, website, in_person, social_media_

### 20. Get Comment
```
GET /api/comments/:commentId
```

### 21. Edit Comment
```
PUT /api/comments/:commentId
```
**Body:**
```json
{
  "message": "Updated message",
  "rating": 4,
  "productName": "Updated product",
  "contactMethod": "email"
}
```

### 22. Update Comment Status (Approve/Reject)
```
PATCH /api/comments/:commentId/status
```
**Body:**
```json
{
  "status": "approved"
}
```
_Status options: pending, approved, rejected, deleted_

### 23. Answer Comment
```
PATCH /api/comments/:commentId/answer
```
**Body:**
```json
{
  "answer": "Thank you for your feedback!"
}
```

### 24. Like Comment
```
POST /api/comments/:commentId/like
```
**Body:**
```json
{
  "userId": "uuid"
}
```
**Response:**
```json
{
  "data": { /* comment object */ },
  "liked": true
}
```
_Note: Each user can only like a comment once. Returns 409 if already liked._

### 25. Unlike Comment
```
DELETE /api/comments/:commentId/like
```
**Body:**
```json
{
  "userId": "uuid"
}
```
**Response:**
```json
{
  "data": { /* comment object */ },
  "liked": false
}
```
_Note: Returns 400 if user hasn't liked the comment._

### 26. Check User Like
```
GET /api/comments/:commentId/like/:userId
```
**Response:**
```json
{
  "liked": true,
  "likedAt": "2024-01-15T12:00:00.000Z"
}
```
