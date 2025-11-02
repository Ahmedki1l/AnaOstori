# QR Code CRUD API - Complete Documentation

## Overview

Complete CRUD (Create, Read, Update, Delete) operations for QR Code management. All endpoints require Firebase authentication.

---

## Endpoints Summary

| Method | Endpoint | Route Name | Description |
|--------|----------|------------|-------------|
| POST | `/auth/route/post` | `generateQRCode` | Create a new QR code |
| GET | `/auth/route/fetch` | `getAllQRCodes` | Get all QR codes (paginated) |
| GET | `/auth/route/fetch` | `getQRCodeById` | Get a specific QR code |
| POST | `/auth/route/post` | `updateQRCode` | Update a QR code |
| POST | `/auth/route/post` | `deleteQRCode` | Delete a QR code |

---

## 1. CREATE - Generate QR Code

### Endpoint
```
POST /auth/route/post
```

### Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_FIREBASE_TOKEN"
}
```

### Request Body
```json
{
  "routeName": "generateQRCode",
  "bookName": "My Book Title",
  "url": "https://example.com/book/123",
  "regenerate": false
}
```

### Response (200)
```json
{
  "statusCode": 200,
  "body": {
    "success": true,
    "data": {
      "bookName": "My Book Title",
      "qrCodeCDNUrl": "https://phase2anaostori.s3.eu-central-1.amazonaws.com/qrcodes/my-book-title-1698796800000.png",
      "downloadUrl": "https://phase2anaostori.s3.eu-central-1.amazonaws.com/qrcodes/my-book-title-1698796800000.png",
      "targetUrl": "https://example.com/book/123",
      "createdAt": "2024-11-01T10:00:00.000Z",
      "updatedAt": "2024-11-01T10:00:00.000Z"
    }
  }
}
```

---

## 2. READ - Get All QR Codes

### Endpoint
```
GET /auth/route/fetch
```

### Headers
```json
{
  "Authorization": "Bearer YOUR_FIREBASE_TOKEN"
}
```

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `routeName` | string | Yes | - | Must be `getAllQRCodes` |
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 20 | Items per page (max 100) |
| `search` | string | No | - | Search by book name |

### Request Example
```
GET /auth/route/fetch?routeName=getAllQRCodes&page=1&limit=20&search=book
```

### Response (200)
```json
{
  "statusCode": 200,
  "body": {
    "success": true,
    "data": {
      "totalDocuments": 50,
      "page": 1,
      "limit": 20,
      "totalPages": 3,
      "qrCodes": [
        {
          "_id": "507f1f77bcf86cd799439011",
          "bookName": "Book Title 1",
          "targetUrl": "https://example.com/book/1",
          "qrCodeKey": "qrcodes/book-title-1-1698796800000.png",
          "qrCodeCDNUrl": "https://phase2anaostori.s3.eu-central-1.amazonaws.com/qrcodes/book-title-1-1698796800000.png",
          "createdAt": "2024-11-01T10:00:00.000Z",
          "updatedAt": "2024-11-01T10:00:00.000Z"
        }
      ]
    }
  }
}
```

---

## 3. READ - Get QR Code By ID

### Endpoint
```
GET /auth/route/fetch
```

### Headers
```json
{
  "Authorization": "Bearer YOUR_FIREBASE_TOKEN"
}
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `routeName` | string | Yes | Must be `getQRCodeById` |
| `qrCodeId` | string | Yes | MongoDB ObjectId |

### Request Example
```
GET /auth/route/fetch?routeName=getQRCodeById&qrCodeId=507f1f77bcf86cd799439011
```

### Response (200)
```json
{
  "statusCode": 200,
  "body": {
    "success": true,
    "data": {
      "_id": "507f1f77bcf86cd799439011",
      "bookName": "Book Title",
      "targetUrl": "https://example.com/book/123",
      "qrCodeKey": "qrcodes/book-title-1698796800000.png",
      "qrCodeCDNUrl": "https://phase2anaostori.s3.eu-central-1.amazonaws.com/qrcodes/book-title-1698796800000.png",
      "createdAt": "2024-11-01T10:00:00.000Z",
      "updatedAt": "2024-11-01T10:00:00.000Z"
    }
  }
}
```

### Response (404)
```json
{
  "statusCode": 404,
  "body": {
    "success": false,
    "message": "QR Code not found"
  }
}
```

---

## 4. UPDATE - Update QR Code

### Endpoint
```
POST /auth/route/post
```

### Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_FIREBASE_TOKEN"
}
```

### Request Body
```json
{
  "routeName": "updateQRCode",
  "qrCodeId": "507f1f77bcf86cd799439011",
  "bookName": "Updated Book Title",
  "url": "https://example.com/book/updated",
  "regenerateQRImage": false
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `routeName` | string | Yes | Must be `updateQRCode` |
| `qrCodeId` | string | Yes | MongoDB ObjectId |
| `bookName` | string | No | New book name |
| `url` | string | No | New target URL |
| `regenerateQRImage` | boolean | No | If true, generates new QR image |

### Response (200)
```json
{
  "statusCode": 200,
  "body": {
    "success": true,
    "data": {
      "_id": "507f1f77bcf86cd799439011",
      "bookName": "Updated Book Title",
      "targetUrl": "https://example.com/book/updated",
      "qrCodeKey": "qrcodes/updated-book-title-1698796900000.png",
      "qrCodeCDNUrl": "https://phase2anaostori.s3.eu-central-1.amazonaws.com/qrcodes/updated-book-title-1698796900000.png",
      "createdAt": "2024-11-01T10:00:00.000Z",
      "updatedAt": "2024-11-01T10:05:00.000Z"
    }
  }
}
```

---

## 5. DELETE - Delete QR Code

### Endpoint
```
POST /auth/route/post
```

### Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_FIREBASE_TOKEN"
}
```

### Request Body
```json
{
  "routeName": "deleteQRCode",
  "qrCodeId": "507f1f77bcf86cd799439011",
  "deleteFromS3": true
}
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `routeName` | string | Yes | - | Must be `deleteQRCode` |
| `qrCodeId` | string | Yes | - | MongoDB ObjectId |
| `deleteFromS3` | boolean | No | true | Delete file from S3 |

### Response (200)
```json
{
  "statusCode": 200,
  "body": {
    "success": true,
    "message": "QR Code deleted successfully"
  }
}
```

### Response (404)
```json
{
  "statusCode": 404,
  "body": {
    "success": false,
    "message": "QR Code not found"
  }
}
```

---

## Frontend Integration Examples

### React Complete Example

```jsx
import { useState, useEffect } from 'react';
import { useAuth } from './auth';

function QRCodeManager() {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { token } = useAuth();

  // Get all QR codes
  const fetchQRCodes = async (search = '') => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/auth/route/fetch?routeName=getAllQRCodes&page=${page}&limit=20&search=${search}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const result = await response.json();
      const data = JSON.parse(result.body);

      if (data.success) {
        setQrCodes(data.data.qrCodes);
        setTotalPages(data.data.totalPages);
      }
    } catch (err) {
      setError('Failed to fetch QR codes');
    } finally {
      setLoading(false);
    }
  };

  // Create QR code
  const createQRCode = async (bookName, url) => {
    try {
      const response = await fetch('/auth/route/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          routeName: 'generateQRCode',
          bookName,
          url
        })
      });

      const result = await response.json();
      const data = JSON.parse(result.body);

      if (data.success) {
        fetchQRCodes(); // Refresh list
        return data.data;
      }
    } catch (err) {
      setError('Failed to create QR code');
    }
  };

  // Update QR code
  const updateQRCode = async (qrCodeId, updates) => {
    try {
      const response = await fetch('/auth/route/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          routeName: 'updateQRCode',
          qrCodeId,
          ...updates
        })
      });

      const result = await response.json();
      const data = JSON.parse(result.body);

      if (data.success) {
        fetchQRCodes();
        return data.data;
      }
    } catch (err) {
      setError('Failed to update QR code');
    }
  };

  // Delete QR code
  const deleteQRCode = async (qrCodeId) => {
    if (!confirm('Are you sure you want to delete this QR code?')) {
      return;
    }

    try {
      const response = await fetch('/auth/route/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          routeName: 'deleteQRCode',
          qrCodeId,
          deleteFromS3: true
        })
      });

      const result = await response.json();
      const data = JSON.parse(result.body);

      if (data.success) {
        fetchQRCodes();
      }
    } catch (err) {
      setError('Failed to delete QR code');
    }
  };

  useEffect(() => {
    fetchQRCodes();
  }, [page]);

  return (
    <div className="qr-manager">
      <h2>QR Code Manager</h2>

      {/* Create Form */}
      <div className="create-form">
        <input type="text" placeholder="Book Name" id="bookName" />
        <input type="url" placeholder="Target URL" id="targetUrl" />
        <button onClick={() => {
          const bookName = document.getElementById('bookName').value;
          const url = document.getElementById('targetUrl').value;
          if (bookName && url) {
            createQRCode(bookName, url);
          }
        }}>
          Create QR Code
        </button>
      </div>

      {/* List */}
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}

      <div className="qr-list">
        {qrCodes.map(qr => (
          <div key={qr._id} className="qr-item">
            <h3>{qr.bookName}</h3>
            <img src={qr.qrCodeCDNUrl} alt="QR Code" />
            <p>URL: {qr.targetUrl}</p>
            <button onClick={() => deleteQRCode(qr._id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default QRCodeManager;
```

### JavaScript with Axios

```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://your-api-domain.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth interceptor
apiClient.interceptors.request.use((config) => {
  const token = getFirebaseToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// QR Code Service
const QRCodeService = {
  // CREATE
  create: async (bookName, url, regenerate = false) => {
    const response = await apiClient.post('/auth/route/post', {
      routeName: 'generateQRCode',
      bookName,
      url,
      regenerate
    });
    const result = JSON.parse(response.data.body);
    return result.data;
  },

  // READ ALL
  getAll: async (page = 1, limit = 20, search = '') => {
    const response = await apiClient.get('/auth/route/fetch', {
      params: {
        routeName: 'getAllQRCodes',
        page,
        limit,
        search
      }
    });
    const result = JSON.parse(response.data.body);
    return result.data;
  },

  // READ ONE
  getById: async (qrCodeId) => {
    const response = await apiClient.get('/auth/route/fetch', {
      params: {
        routeName: 'getQRCodeById',
        qrCodeId
      }
    });
    const result = JSON.parse(response.data.body);
    return result.data;
  },

  // UPDATE
  update: async (qrCodeId, updates) => {
    const response = await apiClient.post('/auth/route/post', {
      routeName: 'updateQRCode',
      qrCodeId,
      ...updates
    });
    const result = JSON.parse(response.data.body);
    return result.data;
  },

  // DELETE
  delete: async (qrCodeId, deleteFromS3 = true) => {
    const response = await apiClient.post('/auth/route/post', {
      routeName: 'deleteQRCode',
      qrCodeId,
      deleteFromS3
    });
    const result = JSON.parse(response.data.body);
    return result;
  }
};

// Usage
try {
  // Create
  const newQR = await QRCodeService.create('Book Name', 'https://example.com');
  
  // Get all
  const { qrCodes, totalPages } = await QRCodeService.getAll(1, 20, 'book');
  
  // Get one
  const qr = await QRCodeService.getById(newQR._id);
  
  // Update
  const updated = await QRCodeService.update(newQR._id, {
    bookName: 'Updated Name',
    url: 'https://updated.com'
  });
  
  // Delete
  await QRCodeService.delete(newQR._id);
} catch (error) {
  console.error('Error:', error);
}
```

---

## Error Handling

### Common Errors

| Status Code | Error Type | Description |
|-------------|------------|-------------|
| 400 | Validation Error | Invalid input data |
| 401 | Unauthorized | Missing or invalid Firebase token |
| 404 | Not Found | QR Code ID doesn't exist |
| 500 | Server Error | Internal server error |

### Error Response Format

```json
{
  "statusCode": 400,
  "body": {
    "success": false,
    "message": "Validation error",
    "errors": [
      {
        "message": "\"url\" must be a valid uri",
        "path": ["url"],
        "type": "string.uri"
      }
    ]
  }
}
```

---

## Best Practices

1. **Pagination**: Always use pagination when fetching lists to avoid performance issues
2. **Error Handling**: Implement proper error handling for all operations
3. **Loading States**: Show loading indicators during async operations
4. **Validation**: Validate input on the frontend before submitting
5. **Confirmation**: Ask for confirmation before delete operations
6. **Caching**: Consider caching QR code lists to reduce API calls
7. **Regeneration**: Only regenerate QR images when necessary

---

## Testing Examples

### cURL Examples

```bash
# CREATE
curl -X POST https://your-api-domain.com/auth/route/post \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "routeName": "generateQRCode",
    "bookName": "Test Book",
    "url": "https://example.com"
  }'

# GET ALL
curl -X GET "https://your-api-domain.com/auth/route/fetch?routeName=getAllQRCodes&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"

# GET BY ID
curl -X GET "https://your-api-domain.com/auth/route/fetch?routeName=getQRCodeById&qrCodeId=ID_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN"

# UPDATE
curl -X POST https://your-api-domain.com/auth/route/post \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "routeName": "updateQRCode",
    "qrCodeId": "ID_HERE",
    "bookName": "Updated Book"
  }'

# DELETE
curl -X POST https://your-api-domain.com/auth/route/post \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "routeName": "deleteQRCode",
    "qrCodeId": "ID_HERE"
  }'
```

---

## Technical Details

### QR Code Specifications
- **Format**: PNG
- **Size**: 300x300 pixels
- **Error Correction**: High (H level)
- **Storage**: AWS S3 (`phase2anaostori` bucket)
- **Path**: `qrcodes/{sanitized-bookname}-{timestamp}.png`
- **Access**: Public read

### MongoDB Structure
```javascript
{
  _id: ObjectId,
  bookName: String,
  targetUrl: String,
  qrCodeKey: String,
  qrCodeCDNUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

**API Version**: 1.0  
**Last Updated**: November 2024

