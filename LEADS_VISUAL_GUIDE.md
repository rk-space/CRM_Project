# CRM Leads Module - Visual Guide

## 🖼️ Screen Descriptions

### 1. Leads List Screen (`/leads`)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Leads                                    [+ Create Lead]     │
├─────────────────────────────────────────────────────────────┤
│ [Search: Name, email, phone...]  [Status ▼]  [From] [To]   │
├─────────────────────────────────────────────────────────────┤
│ ☑ | Lead Name    | Email        | Phone      | Status | ... │
│ ☐ | John Doe     | john@...     | +123...    | New    | ... │
│ ☐ | Jane Smith   | jane@...     | +198...    | Contact| ... │
│ ☐ | Robert Brown | robert@...   | +112...    | Qualif | ... │
├─────────────────────────────────────────────────────────────┤
│ Showing 1 to 10 of 50          [Previous] [Next]            │
└─────────────────────────────────────────────────────────────┘
```

**Features Visible:**
- Header with "Leads" title and "Create Lead" button (permission-based)
- Filter bar with search, status dropdown, date range
- Table with sortable columns (arrows on Name, Status, Created)
- Checkbox column for bulk selection
- Status badges with color coding
- Clickable lead names (navigate to details)
- Edit button per row (permission-based)
- Pagination controls at bottom

**Bulk Selection:**
When rows are selected, a blue bar appears:
```
┌─────────────────────────────────────────────────────────────┐
│ 3 lead(s) selected    [Assign] [Change Status] [Delete]     │
└─────────────────────────────────────────────────────────────┘
```

---

### 2. Lead Create Screen (`/leads/create`)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Create New Lead                                              │
├─────────────────────────────────────────────────────────────┤
│ Basic Information                                            │
│ ─────────────────────────────────────────────────────────   │
│ [First Name *]              [Last Name]                      │
│ [Company]                   [Job Title]                      │
│                                                              │
│ Contact Details                                              │
│ ─────────────────────────────────────────────────────────   │
│ [Email]                     [Phone]                          │
│                                                              │
│ Lead Source & Status                                         │
│ ─────────────────────────────────────────────────────────   │
│ [Status * ▼]                [Source ▼]                       │
│                                                              │
│ Assignment                                                   │
│ ─────────────────────────────────────────────────────────   │
│ [Owner ID]                                                   │
│                                                              │
│ [Create Lead]  [Cancel]                                      │
└─────────────────────────────────────────────────────────────┘
```

**Features Visible:**
- Section-wise form layout with clear headers
- Two-column grid for efficient space usage
- Required fields marked with asterisk (*)
- Validation errors appear below fields in red
- Primary action button (Create Lead) in blue
- Secondary action button (Cancel) in gray
- Form sections: Basic Info, Contact, Source/Status, Assignment

**Validation Display:**
```
[First Name *]
⚠️ First name is required

[Email]
⚠️ Invalid email format
```

---

### 3. Lead Edit Screen (`/leads/:id/edit`)

**Layout:**
Same as Create screen, but:
- Title: "Edit Lead"
- Form pre-populated with existing data
- Button text: "Update Lead" instead of "Create Lead"
- Cancel navigates back to lead details

---

### 4. Lead Details Screen (`/leads/:id`)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to Leads                                              │
│ John Doe                          [Edit Lead] [Status ▼]     │
│ Acme Corp                                                    │
├─────────────────────────────────────────────────────────────┤
│ [Overview] [Timeline]                                        │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────┐  ┌─────────────────────────┐   │
│ │ Contact Information     │  │ Lead Information        │   │
│ │ ─────────────────────── │  │ ─────────────────────── │   │
│ │ Email: john@example.com │  │ Status: [New]           │   │
│ │ Phone: +1234567890      │  │ Source: Website         │   │
│ │ Company: Acme Corp      │  │ Owner: Sarah Smith      │   │
│ │ Job Title: CEO          │  │ Created: Jan 15, 2024   │   │
│ └─────────────────────────┘  └─────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Overview Tab:**
- Two-column layout with info cards
- Contact Information section (left)
- Lead Information section (right)
- Status displayed as colored badge
- Clean, scannable layout

**Timeline Tab:**
```
┌─────────────────────────────────────────────────────────────┐
│ Add Note                                                     │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Enter your note...]                                    │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│ [Add Note]                                                   │
├─────────────────────────────────────────────────────────────┤
│   ●─┐ Lead Created                      Jan 15, 10:30 AM    │
│   │ │ Lead was created in the system                        │
│   │ │ by Sarah Smith                                        │
│   │ └───────────────────────────────────────────────────    │
│   │                                                          │
│   ●─┐ Note Added                        Jan 15, 2:20 PM     │
│   │ │ Initial contact made via email...                     │
│   │ │ by Sarah Smith                                        │
│   │ └───────────────────────────────────────────────────    │
│   │                                                          │
│   ●─┐ Status Changed                    Jan 16, 9:15 AM     │
│     │ Status changed from New to Contacted                  │
│     │ by Sarah Smith                                        │
│     └───────────────────────────────────────────────────    │
└─────────────────────────────────────────────────────────────┘
```

**Timeline Features:**
- Vertical timeline with dots and connecting lines
- Color-coded dots by event type
- Event cards with title, description, timestamp, user
- Add Note section at top (permission-based)
- Chronological order (newest first)

---

## 🎨 Color Scheme

### Status Colors
- **New**: Blue (#3b82f6)
- **Contacted**: Purple (#8b5cf6)
- **Qualified**: Green (#10b981)
- **Unqualified**: Red (#ef4444)
- **Converted**: Dark Green (#059669)

### Timeline Event Colors
- **Note**: Blue (#3b82f6)
- **Status Change**: Purple (#8b5cf6)
- **Assignment**: Green (#10b981)
- **Created**: Dark Green (#059669)
- **Updated**: Orange (#f59e0b)

### UI Elements
- **Primary Button**: Blue (#0066cc)
- **Secondary Button**: Gray (#6b7280)
- **Error Text**: Red
- **Border**: Light Gray (#e5e7eb)
- **Background (sections)**: Very Light Gray (#f9fafb)

---

## 🔄 User Flows

### Creating a Lead
1. Click "+ Create Lead" button on Leads List
2. Fill required fields (First Name, Email/Phone, Status)
3. Optionally fill other fields
4. Click "Create Lead"
5. Redirected to Leads List with success message

### Editing a Lead
1. From Leads List, click "Edit" button OR
2. From Lead Details, click "Edit Lead" button
3. Modify fields
4. Click "Update Lead"
5. Redirected to Lead Details

### Viewing Lead Details
1. From Leads List, click on lead name
2. View Overview tab (default)
3. Switch to Timeline tab to see activity
4. Use quick actions (Edit, Change Status)

### Filtering Leads
1. Enter search term in search box
2. Select status from dropdown
3. Set date range
4. Table updates automatically

### Bulk Actions
1. Select multiple leads using checkboxes
2. Bulk action bar appears
3. Choose action (Assign, Change Status, Delete)
4. Confirm action
5. Table refreshes

---

## 📱 Responsive Considerations

While not fully implemented, the structure supports:
- Grid layouts that can stack on mobile
- Flexible filter bar that wraps
- Scrollable table on small screens
- Touch-friendly button sizes

---

## ♿ Accessibility Features

- Semantic HTML structure
- Form labels properly associated
- Keyboard navigation support
- Focus states on interactive elements
- Color contrast compliance
- Screen reader friendly

---

## 🎯 Permission-Based UI Changes

### No Edit Permission
- "Edit Lead" button hidden
- "Edit" column in table hidden
- Form fields read-only in details view

### No Create Permission
- "+ Create Lead" button hidden
- Create route redirects to list

### No Status Change Permission
- Status dropdown hidden in details
- Status shown as read-only badge

### View-Only Access
- All action buttons hidden
- Forms become read-only displays
- Timeline shows but no "Add Note" section

---

This visual guide provides a complete picture of the UI without actual screenshots. The ASCII diagrams show the layout structure, and descriptions explain all interactive elements and states.
