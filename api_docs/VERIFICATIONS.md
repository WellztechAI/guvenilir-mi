# Company Verifications

## ✅ Company Verifications

### 25. Create Company Verification
```
POST /api/verifications
```
**Body:**
```json
{
  "companyId": "uuid",
  "requesterName": "John Doe",
  "requesterTitle": "CEO",
  "requesterCompanyEmail": "john@company.com",
  "requesterPhoneNumber": "+905551234567",
  "panelUserName": "johndoe",
  "mernisNo": "12345678901",
  "signatureUrls": ["signatures/sig-1.jpg", "signatures/sig-2.jpg"],
  "address": "123 Main St",
  "city": "Istanbul",
  "district": "Kadikoy",
  "postalCode": "34710",
  "membership": "premium"
}
```
_membership options: free, basic, premium, enterprise_  
_Note: Upload signatures first using `/api/upload` with `bucket=signatures`_

### 26. List Waiting to be Verified Companies
```
GET /api/verifications?status=pending&limit=10&offset=0
```
**Status options:**
- `pending` (default) - waiting for approval
- `approved` - already verified
- `rejected` - rejected verifications
- `all` - all verifications

### 27. Get Verification Details
```
GET /api/verifications/:verificationId
```

### 28. Verify Company (Approve)
```
POST /api/verifications/:verificationId/approve
```
This will:
1. Update verification status to "approved"
2. Create/activate the company instance
3. Set company status to "active"

### 29. Reject Verification
```
POST /api/verifications/:verificationId/reject
```
**Body (optional):**
```json
{
  "reason": "Incomplete documentation"
}
```

### 30. Get Company Verifications
```
GET /api/companies/:companyId/verifications
```
Lists all verification attempts for a company.
