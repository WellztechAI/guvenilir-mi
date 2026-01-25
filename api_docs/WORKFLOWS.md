# Workflows and Summary

## 🔄 Workflow Examples

### Complete User Registration + Avatar Upload
```bash
# 1. Upload avatar
curl -X POST http://localhost:3000/api/upload \
  -F "file=@avatar.jpg" \
  -F "bucket=avatars"
# Response: { "path": "avatars/123-abc.jpg" }

# 2. Create user with avatar
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "john_doe",
    "email": "john@example.com",
    "passwordHash": "$2b$10$...",
    "imageUrl": "avatars/123-abc.jpg"
  }'
```

### Company Verification Flow
```bash
# 1. Upload signatures
curl -X POST http://localhost:3000/api/upload \
  -F "file=@signature1.jpg" \
  -F "bucket=signatures"

# 2. Create company
curl -X POST http://localhost:3000/api/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Company",
    "slug": "my-company",
    "description": "..."
  }'

# 3. Submit verification
curl -X POST http://localhost:3000/api/verifications \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": "uuid-from-step-2",
    "requesterName": "John Doe",
    "requesterCompanyEmail": "john@company.com",
    "signatureUrls": ["signatures/sig.jpg"],
    "membership": "premium"
  }'

# 4. Admin approves (creates active company instance)
curl -X POST http://localhost:3000/api/verifications/{verificationId}/approve
```

### Comment Creation + Editing
```bash
# 1. Create comment
curl -X POST http://localhost:3000/api/comments \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": "uuid",
    "authorId": "uuid",
    "message": "Great service",
    "rating": 5
  }'

# 2. Edit comment
curl -X PUT http://localhost:3000/api/comments/{commentId} \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Updated: Great service!",
    "rating": 4
  }'

# 3. Company answers
curl -X PATCH http://localhost:3000/api/comments/{commentId}/answer \
  -H "Content-Type: application/json" \
  -d '{
    "answer": "Thank you for your feedback!"
  }'
```

---

## 🎯 Summary of All Functionalities

| # | Functionality | Endpoint | Method |
|---|---------------|----------|--------|
| 1 | Create user | `/api/users` | POST |
| 2 | Change user avatar | `/api/users/:userId` | PUT |
| 3 | Create company verification | `/api/verifications` | POST |
| 4 | Verify company | `/api/verifications/:id/approve` | POST |
| 5 | List waiting verifications | `/api/verifications?status=pending` | GET |
| 6 | Modify user | `/api/users/:userId` | PUT |
| 7 | Modify company | `/api/companies/:companyId` | PUT |
| 8 | Search company | `/api/search/companies?q=` | GET |
| 9 | List company comments (paginated) | `/api/companies/:id/comments` | GET |
| 10 | List user comments | `/api/users/:userId/comments` | GET |
| 11 | List user notifications | `/api/users/:userId/notifications` | GET |
| 12 | List user rewards | `/api/users/:userId/rewards` | GET |
| 13 | Get user | `/api/users/:userId` | GET |
| 14 | Get company | `/api/companies/:slug` | GET |
| 15 | Create comment | `/api/comments` | POST |
| 16 | Answer comment | `/api/comments/:id/answer` | PATCH |
| 17 | Edit comment | `/api/comments/:commentId` | PUT |
| 18 | **Login user** | `/api/auth/login` | POST |
| 19 | **Register user** | `/api/auth/register` | POST |
| 20 | **Get admin comments** | `/api/admin/comments` | GET |
