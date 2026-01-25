# Authentication

## 🔐 Authentication

### Login User
```
POST /api/auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "userName": "john_doe",
    "email": "john@example.com",
    "phoneNumber": "+905551234567",
    "country": "Turkiye",
    "imageUrl": "avatars/user-001.jpg",
    "status": "active",
    "createdAt": "2024-01-23T12:00:00.000Z",
    "favouriteCompanies": [
      {
        "id": "uuid",
        "name": "Company Name",
        "slug": "company-slug",
        "image_url": "logos/company.jpg"
      }
    ]
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid email or password"
}
```

### Register User
```
POST /api/auth/register
```
**Body:**
```json
{
  "userName": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": "+905551234567",
  "country": "Turkiye"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "uuid",
    "userName": "john_doe",
    "email": "john@example.com",
    "phoneNumber": "+905551234567",
    "country": "Turkiye",
    "status": "active",
    "createdAt": "2024-01-23T12:00:00.000Z"
  }
}
```

### Check Email Availability
```
POST /api/auth/check-email
```
**Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "exists": true
}
```

### Change Password
```
POST /api/auth/change-password
```
**Body:**
```json
{
  "userId": "uuid",
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```
