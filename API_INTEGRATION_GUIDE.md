# API Integration Guide - CRM Leads Module

## 📋 Overview
This document specifies the API endpoints required by the frontend Leads module. All endpoints should follow RESTful conventions and return JSON responses.

---

## 🔐 Authentication
All requests should include authentication credentials via cookies or headers.
```
Cookie: session_token=<token>
OR
Authorization: Bearer <token>
```

---

## 📡 API Endpoints

### 1. Get All Leads
**Endpoint:** `GET /api/leads`

**Query Parameters:**
```javascript
{
  search: string,        // Search in name, email, phone
  status: string,        // Filter by status
  ownerId: string,       // Filter by owner
  fromDate: string,      // ISO date string
  toDate: string,        // ISO date string
  sortBy: string,        // Field to sort by (name, status, createdAt)
  sortOrder: string,     // 'asc' or 'desc'
  page: number,          // Page number (default: 1)
  pageSize: number       // Items per page (default: 10)
}
```

**Response:**
```json
{
  "data": [
    {
      "id": "1",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "company": "Acme Corp",
      "jobTitle": "CEO",
      "status": "new",
      "source": "website",
      "ownerId": "user_123",
      "owner": "Sarah Smith",
      "notes": "Initial contact made",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 403: Forbidden (no permission)
- 500: Server error

---

### 2. Get Single Lead
**Endpoint:** `GET /api/leads/:id`

**Response:**
```json
{
  "id": "1",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "company": "Acme Corp",
  "jobTitle": "CEO",
  "status": "new",
  "source": "website",
  "ownerId": "user_123",
  "owner": "Sarah Smith",
  "notes": "Initial contact made",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 403: Forbidden
- 404: Lead not found
- 500: Server error

---

### 3. Create Lead
**Endpoint:** `POST /api/leads`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "company": "Acme Corp",
  "jobTitle": "CEO",
  "status": "new",
  "source": "website",
  "ownerId": "user_123",
  "notes": "Initial contact made"
}
```

**Validation Rules:**
- `firstName`: Required, string, max 100 chars
- `lastName`: Optional, string, max 100 chars
- `email`: Optional but required if phone is empty, valid email format
- `phone`: Optional but required if email is empty, valid phone format
- `company`: Optional, string, max 200 chars
- `jobTitle`: Optional, string, max 100 chars
- `status`: Required, enum (new, contacted, qualified, unqualified, converted)
- `source`: Optional, enum (website, referral, social_media, cold_call, event, other)
- `ownerId`: Optional, valid user ID
- `notes`: Optional, text

**Response:**
```json
{
  "id": "1",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "company": "Acme Corp",
  "jobTitle": "CEO",
  "status": "new",
  "source": "website",
  "ownerId": "user_123",
  "owner": "Sarah Smith",
  "notes": "Initial contact made",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Status Codes:**
- 201: Created
- 400: Validation error
- 401: Unauthorized
- 403: Forbidden
- 500: Server error

---

### 4. Update Lead
**Endpoint:** `PUT /api/leads/:id`

**Request Body:**
Same as Create Lead (all fields optional except those with validation rules)

**Response:**
Same as Get Single Lead

**Status Codes:**
- 200: Success
- 400: Validation error
- 401: Unauthorized
- 403: Forbidden
- 404: Lead not found
- 500: Server error

---

### 5. Delete Lead
**Endpoint:** `DELETE /api/leads/:id`

**Response:**
```json
{
  "message": "Lead deleted successfully"
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 403: Forbidden
- 404: Lead not found
- 500: Server error

---

### 6. Get Lead Timeline
**Endpoint:** `GET /api/leads/:id/timeline`

**Response:**
```json
[
  {
    "id": "event_1",
    "type": "created",
    "title": "Lead Created",
    "description": "Lead was created in the system",
    "timestamp": "2024-01-15T10:30:00Z",
    "userId": "user_123",
    "user": "Sarah Smith"
  },
  {
    "id": "event_2",
    "type": "note",
    "title": "Note Added",
    "description": "Initial contact made via email. Interested in enterprise plan.",
    "timestamp": "2024-01-15T14:20:00Z",
    "userId": "user_123",
    "user": "Sarah Smith"
  },
  {
    "id": "event_3",
    "type": "status_change",
    "title": "Status Changed",
    "description": "Status changed from New to Contacted",
    "timestamp": "2024-01-16T09:15:00Z",
    "userId": "user_123",
    "user": "Sarah Smith",
    "metadata": {
      "oldStatus": "new",
      "newStatus": "contacted"
    }
  },
  {
    "id": "event_4",
    "type": "assignment",
    "title": "Lead Assigned",
    "description": "Lead assigned to Mike Johnson",
    "timestamp": "2024-01-16T10:00:00Z",
    "userId": "user_123",
    "user": "Sarah Smith",
    "metadata": {
      "oldOwnerId": "user_123",
      "newOwnerId": "user_456"
    }
  }
]
```

**Event Types:**
- `created`: Lead creation
- `updated`: Lead information updated
- `note`: Note added
- `status_change`: Status changed
- `assignment`: Owner changed

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 403: Forbidden
- 404: Lead not found
- 500: Server error

---

### 7. Add Note to Lead
**Endpoint:** `POST /api/leads/:id/notes`

**Request Body:**
```json
{
  "note": "Follow-up call scheduled for next week"
}
```

**Response:**
```json
{
  "id": "event_5",
  "type": "note",
  "title": "Note Added",
  "description": "Follow-up call scheduled for next week",
  "timestamp": "2024-01-17T11:30:00Z",
  "userId": "user_123",
  "user": "Sarah Smith"
}
```

**Status Codes:**
- 201: Created
- 400: Validation error
- 401: Unauthorized
- 403: Forbidden
- 404: Lead not found
- 500: Server error

---

### 8. Change Lead Status
**Endpoint:** `PUT /api/leads/:id/status`

**Request Body:**
```json
{
  "status": "contacted"
}
```

**Response:**
```json
{
  "id": "1",
  "status": "contacted",
  "updatedAt": "2024-01-17T12:00:00Z"
}
```

**Status Codes:**
- 200: Success
- 400: Invalid status
- 401: Unauthorized
- 403: Forbidden
- 404: Lead not found
- 500: Server error

---

### 9. Assign Lead Owner
**Endpoint:** `PUT /api/leads/:id/assign`

**Request Body:**
```json
{
  "ownerId": "user_456"
}
```

**Response:**
```json
{
  "id": "1",
  "ownerId": "user_456",
  "owner": "Mike Johnson",
  "updatedAt": "2024-01-17T12:30:00Z"
}
```

**Status Codes:**
- 200: Success
- 400: Invalid user ID
- 401: Unauthorized
- 403: Forbidden
- 404: Lead not found
- 500: Server error

---

## 🔒 Permission Checks

Backend should verify these permissions before allowing operations:

| Operation | Permission Required |
|-----------|-------------------|
| List leads | `leads.view` |
| View lead details | `leads.view` |
| Create lead | `leads.create` |
| Update lead | `leads.edit` |
| Delete lead | `leads.delete` |
| Add note | `leads.edit` |
| Change status | `leads.changeStatus` |
| Assign owner | `leads.assign` |

---

## 🏢 Multi-Tenant Considerations

All endpoints should automatically scope data by:
- User's company/organization
- User's branch (if applicable)
- User's permissions

Example: User from Company A should never see leads from Company B.

---

## 📊 Performance Requirements

- List endpoint should support pagination (max 100 items per page)
- Filtering should be done at database level
- Sorting should be indexed
- Timeline should be limited to last 100 events (with "load more" option)

---

## 🚨 Error Response Format

All errors should follow this format:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

**Error Codes:**
- `VALIDATION_ERROR`: Input validation failed
- `UNAUTHORIZED`: Not authenticated
- `FORBIDDEN`: No permission
- `NOT_FOUND`: Resource not found
- `INTERNAL_ERROR`: Server error

---

## 🧪 Testing Endpoints

### Sample cURL Commands

**Get All Leads:**
```bash
curl -X GET "http://localhost:8000/api/leads?status=new&page=1&pageSize=10" \
  -H "Authorization: Bearer <token>"
```

**Create Lead:**
```bash
curl -X POST "http://localhost:8000/api/leads" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "status": "new"
  }'
```

**Get Lead Timeline:**
```bash
curl -X GET "http://localhost:8000/api/leads/1/timeline" \
  -H "Authorization: Bearer <token>"
```

---

## 📝 Notes for Backend Developer (Rushikesh)

1. **Database Schema**: Ensure leads table has all required fields
2. **Indexes**: Add indexes on status, ownerId, createdAt for filtering/sorting
3. **Timestamps**: Use ISO 8601 format for all dates
4. **Validation**: Implement server-side validation matching frontend rules
5. **Permissions**: Integrate with existing RBAC system
6. **Audit Log**: Timeline events should be stored in separate table
7. **Soft Delete**: Consider soft delete for leads (deleted_at column)
8. **Rate Limiting**: Implement rate limiting on all endpoints
9. **CORS**: Configure CORS for frontend domain
10. **Environment**: Use environment variables for configuration

---

## 🔄 Frontend Integration Points

The frontend uses these files for API integration:
- `src/services/api.js` - Base API client
- `src/services/leadsService.js` - Lead-specific API calls

To switch from mock to real API:
1. Set `REACT_APP_API_URL` environment variable
2. Remove mock data fallbacks in page components
3. Test all CRUD operations
4. Verify error handling

---

## ✅ Integration Checklist

- [ ] All endpoints implemented
- [ ] Authentication working
- [ ] Permission checks in place
- [ ] Validation rules match frontend
- [ ] Error responses follow format
- [ ] Pagination working correctly
- [ ] Filtering and sorting functional
- [ ] Timeline events being created
- [ ] Multi-tenant scoping verified
- [ ] Performance tested with large datasets

---

**Contact:** Onkar (Frontend) | Rushikesh (Backend)
**Last Updated:** January 2024
