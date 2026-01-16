# CRM Leads API

## Authentication
All endpoints require:
Header:
Authorization: Bearer <JWT | dev-token>

## Create Lead
POST /api/leads

Permissions:
LEADS_CREATE or LEADS_WRITE

Body:
{
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "phone": "string",
  "lead_source": "string"
}

Responses:
201 - Created
400 - Duplicate lead
401 - Unauthorized
403 - Forbidden
