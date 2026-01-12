Day 1 – Backend Foundation (Login, Registration & 
RBAC) 
Module Owner: Vedant 
Project: CRM System 
1. Purpose of Day 1 
The purpose of Day 1 was to understand, plan, and document the backend foundation of 
the CRM system. 
As instructed, no heavy coding was done on Day 1. 
The focus was on: 
● User management understanding 
● Authentication flow (Login & Registration) 
● Role-Based Access Control (RBAC) 
● Database planning 
● Permission enforcement strategy 
2. User Management Understanding 
What is a User? 
A user is any individual who can log in to the CRM system and perform actions based on 
their assigned role and permissions. 
Users belong to a tenant (organization/company) and can be activated or blocked. 
Planned User Fields 
● id 
● name 
● email 
● password (hashed) 
● status (active / blocked) 
● tenant_id 
● created_at 
● updated_at 
This structure supports: 
● Multi-tenant architecture 
● Role-based access 
● User status control 
3. Registration Flow (Conceptual) 
1. User submits registration details 
2. Backend validates input 
3. Password is securely hashed 
4. User record is created 
5. Default role is assigned 
6. User is linked to a tenant 
Registration is fully controlled from the backend. 
4. Login Flow Using JWT 
1. User submits email and password 
2. Backend verifies credentials 
3. JWT token is generated 
4. Token is returned to frontend 
5. Token is sent with every API request 
JWT Token Contains: 
● userId 
● tenantId 
● roleIds / permissions 
● expiry time 
The JWT token acts as the authentication and authorization proof. 
5. RBAC (Role-Based Access Control) 
Role 
A role is a collection of permissions. 
Examples: 
● Admin 
● Sales Manager 
● Sales Executive 
Permission 
A permission defines a specific action. 
Examples: 
● lead:create 
● lead:view 
● lead:edit 
● settings:manage 
Access Control Flow 
1. User is assigned one or more roles 
2. Roles contain permissions 
3. API checks required permission 
4. Access is allowed or denied 
This ensures secure and scalable access control. 
6. Database Planning 
Planned Tables 
● users 
● roles 
● permissions 
● user_roles 
● role_permissions 
Relationships 
● One user → multiple roles 
● One role → multiple permissions 
● Permissions control API access 
This structure supports enterprise-level RBAC. 
7. API Permission Check Strategy 
1. Request includes JWT token 
2. Authentication middleware validates token 
3. User roles and permissions are extracted 
4. Permission middleware checks required permission 
5. API executes only if permission is granted 
8. Planned Backend Structure 
● auth/ 
● users/ 
● roles/ 
● permissions/ 
● middleware/ 
○ authMiddleware 
○ permissionMiddleware 
This structure will be used in implementation phases. 
