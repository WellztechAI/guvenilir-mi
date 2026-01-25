# File Upload

## 📁 File Upload

### Upload File (Avatar/Signature/Logo)
```
POST /api/upload
```
**Headers:**
```
Content-Type: multipart/form-data
```
**Form Data:**
```
file: <file>
bucket: avatars|logos|signatures|uploads
```

**Response:**
```json
{
  "success": true,
  "path": "avatars/1234567890-abc123.jpg",
  "url": "http://localhost:9000/avatars/1234567890-abc123.jpg",
  "filename": "1234567890-abc123.jpg",
  "bucket": "avatars",
  "size": 12345,
  "mimeType": "image/jpeg"
}
```

**Supported file types:** JPEG, PNG, GIF, WebP, PDF  
**Max file size:** 10MB

### Get File
```
GET /api/files/:bucket/:filename
```

### Delete File
```
DELETE /api/files/:bucket/:filename
```

### List Files in Bucket
```
GET /api/files/:bucket?prefix=optional-prefix
```
