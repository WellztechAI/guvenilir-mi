# Search

## 🔍 Search

### 32. Search Company
```
GET /api/search/companies?q=search+term&sector=teknoloji&status=active&limit=20&offset=0
```

### 33. Search Comments
```
GET /api/search/comments?q=search+term&companySlug=trendyol&status=approved&limit=20&offset=0
```

### 34. Global Search
```
GET /api/search?q=search+term&limit=10
```
Searches both companies and comments.

### 35. Autocomplete Suggestions
```
GET /api/search/suggest?q=tre
```
Returns company suggestions for autocomplete.
