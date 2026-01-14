# 🌳 Complete File Tree - CRM Leads Module

## 📁 Full Project Structure

```
CRM_Project/
│
├── 📄 README.md                          (Original project readme)
├── 📄 README_LEADS_MODULE.md             ⭐ START HERE - Master index
├── 📄 QUICK_START.md                     🚀 Get running in 5 minutes
├── 📄 LEADS_MODULE_README.md             📖 Complete feature docs
├── 📄 LEADS_VISUAL_GUIDE.md              🎨 UI/UX guide
├── 📄 API_INTEGRATION_GUIDE.md           🔌 For backend developer
├── 📄 IMPLEMENTATION_SUMMARY.md          📊 Overview & stats
│
├── 📦 package.json                       (Dependencies)
├── 📦 package-lock.json                  (Lock file)
├── 🚫 .gitignore                         (Git ignore rules)
│
├── 📁 public/                            (Static assets)
│   ├── index.html
│   ├── favicon.ico
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
│
└── 📁 src/                               ⭐ SOURCE CODE
    │
    ├── 📄 index.js                       (App entry point)
    ├── 📄 App.js                         (Main app component)
    ├── 📄 App.css
    ├── 📄 index.css
    │
    ├── 📁 app/                           (Core app structure - Aditi's)
    │   ├── 📁 layout/
    │   │   ├── MainLayout.jsx            ✅ Aditi's - Sidebar + Topbar
    │   │   ├── ProtectedLayout.jsx       ✅ Aditi's - Route protection
    │   │   ├── Sidebar.jsx               ✅ Aditi's
    │   │   └── Topbar.jsx                ✅ Aditi's
    │   │
    │   ├── 📁 permissions/
    │   │   └── PermissionWrapper.jsx     ✅ Aditi's (Updated by Onkar)
    │   │
    │   └── 📁 routes/
    │       └── AppRoutes.jsx             ✅ Updated with lead routes
    │
    ├── 📁 components/                    (Reusable components)
    │   │
    │   ├── 📁 form/                      (Aditi's form components)
    │   │   ├── FormSection.jsx           ✅ Aditi's
    │   │   ├── Input.jsx                 ✅ Aditi's
    │   │   ├── Select.jsx                ✅ Aditi's
    │   │   └── TextArea.jsx              ✅ Aditi's
    │   │
    │   ├── 📁 modal/                     (Aditi's modal components)
    │   │   ├── ConfirmDialog.jsx         ✅ Aditi's
    │   │   └── Modal.jsx                 ✅ Aditi's
    │   │
    │   ├── 📁 table/                     (Aditi's table components)
    │   │   └── ERPTable.jsx              ✅ Aditi's
    │   │
    │   └── 📁 leads/                     ⭐ NEW - Onkar's components
    │       ├── index.js                  (Export file)
    │       ├── LeadsTable.jsx            ⭐ Enterprise table
    │       ├── LeadFilters.jsx           ⭐ Advanced filters
    │       ├── LeadForm.jsx              ⭐ Create/Edit form
    │       └── Timeline.jsx              ⭐ Activity timeline
    │
    ├── 📁 pages/                         (Page components)
    │   │
    │   ├── Dashboard.jsx                 ✅ Aditi's
    │   ├── Leads.jsx                     ✅ Aditi's (placeholder)
    │   │
    │   └── 📁 leads/                     ⭐ NEW - Onkar's pages
    │       ├── index.js                  (Export file)
    │       ├── LeadsList.jsx             ⭐ Main list page
    │       ├── LeadCreate.jsx            ⭐ Create page
    │       ├── LeadEdit.jsx              ⭐ Edit page
    │       └── LeadDetails.jsx           ⭐ Details page
    │
    ├── 📁 services/                      ⭐ NEW - API layer
    │   ├── api.js                        ⭐ Base API client
    │   └── leadsService.js               ⭐ Lead API calls
    │
    ├── 📁 hooks/                         ⭐ NEW - Custom hooks
    │   ├── usePermissions.js             ⭐ Permission checks
    │   └── useLeads.js                   ⭐ Data fetching
    │
    ├── 📁 utils/                         ⭐ NEW - Utilities
    │   └── validation.js                 ⭐ Form validation
    │
    └── 📁 theme/                         (Theme system - Aditi's)
        ├── ThemeProvider.jsx             ✅ Aditi's
        └── themes.js                     ✅ Aditi's
```

---

## 🎯 File Ownership

### ✅ Aditi's Files (Existing Framework)
```
src/app/layout/          → All layout components
src/app/permissions/     → Permission wrapper (updated)
src/components/form/     → Form components
src/components/modal/    → Modal components
src/components/table/    → Table components
src/theme/               → Theme system
src/pages/Dashboard.jsx  → Dashboard page
```

### ⭐ Onkar's Files (New Leads Module)
```
src/pages/leads/         → All lead pages (4 files)
src/components/leads/    → All lead components (4 files)
src/services/           → API layer (2 files)
src/hooks/              → Custom hooks (2 files)
src/utils/              → Validation (1 file)
```

### 🔄 Updated Files
```
src/app/routes/AppRoutes.jsx           → Added lead routes
src/app/permissions/PermissionWrapper.jsx → Added lead permissions
```

---

## 📊 File Count by Category

| Category | Count | Owner |
|----------|-------|-------|
| Documentation | 6 | Onkar |
| Pages | 4 | Onkar |
| Components | 4 | Onkar |
| Services | 2 | Onkar |
| Hooks | 2 | Onkar |
| Utils | 1 | Onkar |
| **Total New Files** | **19** | **Onkar** |

---

## 🗺️ Navigation Guide

### Want to see the UI code?
```
src/pages/leads/          → Page components
src/components/leads/     → Reusable components
```

### Want to see the API integration?
```
src/services/api.js           → Base client
src/services/leadsService.js  → Lead APIs
```

### Want to see the business logic?
```
src/hooks/usePermissions.js   → Permission logic
src/hooks/useLeads.js         → Data fetching logic
src/utils/validation.js       → Validation logic
```

### Want to see the routing?
```
src/app/routes/AppRoutes.jsx  → All routes
```

### Want to understand the features?
```
📄 LEADS_MODULE_README.md     → Complete docs
📄 LEADS_VISUAL_GUIDE.md      → UI guide
```

---

## 🔍 Quick File Finder

### "I want to modify the leads list table"
→ `src/components/leads/LeadsTable.jsx`

### "I want to change the form fields"
→ `src/components/leads/LeadForm.jsx`

### "I want to add a new API endpoint"
→ `src/services/leadsService.js`

### "I want to change validation rules"
→ `src/utils/validation.js`

### "I want to add a new permission"
→ `src/app/permissions/PermissionWrapper.jsx`
→ `src/hooks/usePermissions.js`

### "I want to add a new route"
→ `src/app/routes/AppRoutes.jsx`

### "I want to modify the timeline"
→ `src/components/leads/Timeline.jsx`

### "I want to change the filters"
→ `src/components/leads/LeadFilters.jsx`

---

## 📝 File Descriptions

### Pages (src/pages/leads/)

**LeadsList.jsx** (Main list page)
- Displays table of all leads
- Filters, sorting, pagination
- Bulk selection
- Permission-based actions

**LeadCreate.jsx** (Create page)
- Form for creating new lead
- Validation
- Permission-protected

**LeadEdit.jsx** (Edit page)
- Form for editing existing lead
- Pre-populated data
- Permission-protected

**LeadDetails.jsx** (Details page)
- Overview tab with lead info
- Timeline tab with activity
- Quick actions
- Permission-based visibility

### Components (src/components/leads/)

**LeadsTable.jsx** (Enterprise table)
- Sortable columns
- Row selection
- Status badges
- Action buttons

**LeadFilters.jsx** (Advanced filters)
- Search input
- Status dropdown
- Date range
- Filter state management

**LeadForm.jsx** (Reusable form)
- Section-wise layout
- Validation
- Works for create & edit
- Error display

**Timeline.jsx** (Activity timeline)
- Vertical timeline
- Event cards
- Color-coded dots
- Chronological order

### Services (src/services/)

**api.js** (Base API client)
- HTTP methods (GET, POST, PUT, DELETE)
- Error handling
- Response parsing
- Credentials management

**leadsService.js** (Lead API calls)
- All CRUD operations
- Timeline operations
- Status change
- Owner assignment

### Hooks (src/hooks/)

**usePermissions.js** (Permission checks)
- hasPermission()
- hasAnyPermission()
- hasAllPermissions()
- Centralized logic

**useLeads.js** (Data fetching)
- useLeads() - List with filters
- useLead() - Single lead
- Loading states
- Error handling

### Utils (src/utils/)

**validation.js** (Form validation)
- validateLead() function
- LEAD_STATUSES constant
- LEAD_SOURCES constant
- Validation rules

---

## 🎨 Color-Coded Legend

- ✅ = Existing (Aditi's framework)
- ⭐ = New (Onkar's leads module)
- 🔄 = Updated (Modified by Onkar)
- 📄 = Documentation
- 📁 = Folder
- 📦 = Configuration

---

## 🚀 Quick Actions

### View a specific file
```bash
# Example: View the leads list page
code src/pages/leads/LeadsList.jsx
```

### Search for a term
```bash
# Example: Find all uses of "permission"
grep -r "permission" src/
```

### Count lines of code
```bash
# Count lines in leads module
find src/pages/leads src/components/leads src/services src/hooks src/utils -name "*.js*" | xargs wc -l
```

---

## 📚 Related Documentation

- **README_LEADS_MODULE.md** - Master index (start here)
- **QUICK_START.md** - Get running quickly
- **LEADS_MODULE_README.md** - Complete features
- **LEADS_VISUAL_GUIDE.md** - UI/UX guide
- **API_INTEGRATION_GUIDE.md** - Backend specs
- **IMPLEMENTATION_SUMMARY.md** - Overview

---

**This file tree helps you navigate the entire project structure at a glance!**
