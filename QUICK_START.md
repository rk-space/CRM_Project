# Quick Start Guide - CRM Leads Module

## 🚀 Get Started in 5 Minutes

### Step 1: Navigate to Project
```bash
cd c:\Users\onkar\Desktop\crm\CRM_Project
```

### Step 2: Install Dependencies (if not already done)
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm start
```

The app will open at `http://localhost:3000`

### Step 4: Navigate to Leads Module
In your browser, go to:
```
http://localhost:3000/leads
```

---

## 🎮 Test the Features

### 1. View Leads List
- You'll see 3 mock leads
- Try sorting by clicking column headers
- Try filtering by status
- Try searching
- Select checkboxes to see bulk action bar

### 2. Create a Lead
- Click "+ Create Lead" button
- Fill in the form:
  - First Name: "Test Lead"
  - Email: "test@example.com"
  - Status: Select "New"
- Click "Create Lead"
- (Currently shows mock behavior - will work with backend)

### 3. View Lead Details
- Click on any lead name in the table
- See the Overview tab with lead information
- Click "Timeline" tab to see activity history
- Try adding a note (if you have edit permission)

### 4. Edit a Lead
- From details page, click "Edit Lead"
- Or from list page, click "Edit" button
- Modify any field
- Click "Update Lead"

### 5. Test Permissions
- All permissions are currently enabled in mock
- To test restricted access, edit:
  `src/app/permissions/PermissionWrapper.jsx`
- Remove a permission from the array
- See how UI changes

---

## 🔍 What to Look For

### ✅ Working Features
- Table displays correctly
- Sorting works (click column headers)
- Filters update the view
- Pagination controls appear
- Forms validate correctly
- Navigation works between pages
- Tabs switch in details view
- Timeline displays events
- Status badges show colors
- Permission buttons appear/hide

### ⚠️ Expected Behavior (Mock Mode)
- API calls will fail gracefully
- Mock data will be displayed instead
- Form submissions won't persist
- Changes won't be saved
- This is normal until backend is ready

---

## 📁 Key Files to Review

### Pages
```
src/pages/leads/LeadsList.jsx      → Main list page
src/pages/leads/LeadCreate.jsx     → Create page
src/pages/leads/LeadEdit.jsx       → Edit page
src/pages/leads/LeadDetails.jsx    → Details page
```

### Components
```
src/components/leads/LeadsTable.jsx   → Table component
src/components/leads/LeadFilters.jsx  → Filters component
src/components/leads/LeadForm.jsx     → Form component
src/components/leads/Timeline.jsx     → Timeline component
```

### Services
```
src/services/api.js              → Base API client
src/services/leadsService.js     → Lead API calls
```

### Hooks
```
src/hooks/usePermissions.js      → Permission checks
src/hooks/useLeads.js            → Data fetching
```

---

## 🎨 UI Elements to Notice

### Color Coding
- **Blue badges** = New status
- **Purple badges** = Contacted status
- **Green badges** = Qualified status
- **Red badges** = Unqualified status
- **Dark Green badges** = Converted status

### Interactive Elements
- **Column headers** = Click to sort
- **Lead names** = Click to view details
- **Checkboxes** = Select for bulk actions
- **Tabs** = Switch between Overview and Timeline
- **Buttons** = Permission-based visibility

---

## 🔧 Customization

### Change Mock Data
Edit the `getMockLeads()` function in:
```
src/pages/leads/LeadsList.jsx
```

### Add More Permissions
Edit:
```
src/app/permissions/PermissionWrapper.jsx
src/hooks/usePermissions.js
```

### Modify Validation Rules
Edit:
```
src/utils/validation.js
```

### Change Status Options
Edit:
```
src/utils/validation.js
```
Look for `LEAD_STATUSES` and `LEAD_SOURCES`

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill the process on port 3000
npx kill-port 3000

# Or use a different port
PORT=3001 npm start
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Changes Not Reflecting
```bash
# Hard refresh browser
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

---

## 📞 Need Help?

### Check Documentation
1. **IMPLEMENTATION_SUMMARY.md** - Overview
2. **LEADS_MODULE_README.md** - Detailed features
3. **LEADS_VISUAL_GUIDE.md** - UI descriptions
4. **API_INTEGRATION_GUIDE.md** - Backend specs

### Common Issues

**Q: Why aren't my changes saving?**  
A: Backend is not connected yet. Currently using mock data.

**Q: Why do I see "Request failed" errors?**  
A: Normal behavior. API calls fail gracefully and show mock data.

**Q: How do I test without permissions?**  
A: Edit `PermissionWrapper.jsx` and remove permissions from the array.

**Q: Can I add more fields to the form?**  
A: Yes! Edit `LeadForm.jsx` and add more Input/Select components.

---

## 🎯 Next Steps

### For Development
1. ✅ Test all features with mock data
2. ✅ Review code structure
3. ✅ Understand permission system
4. ⏳ Wait for backend integration
5. ⏳ Replace mock data with real API
6. ⏳ Test with real data
7. ⏳ Deploy to staging

### For Backend Integration
1. Share **API_INTEGRATION_GUIDE.md** with Rushikesh
2. Set up environment variable: `REACT_APP_API_URL`
3. Remove mock data fallbacks
4. Test each endpoint
5. Verify error handling
6. Test permission scenarios

---

## ✅ Verification Checklist

Test these before considering it complete:

- [ ] Leads list displays
- [ ] Sorting works on all columns
- [ ] Filters update the list
- [ ] Search works
- [ ] Pagination controls work
- [ ] Create lead form validates
- [ ] Edit lead form pre-populates
- [ ] Details page shows overview
- [ ] Timeline tab displays events
- [ ] Status badges show colors
- [ ] Permission buttons hide/show
- [ ] Navigation works between pages
- [ ] Cancel buttons work
- [ ] Error messages display
- [ ] Loading states show

---

## 🎉 You're All Set!

The CRM Leads module is ready to use. Start the server and explore the features!

```bash
npm start
```

Then navigate to: `http://localhost:3000/leads`

---

**Happy Coding! 🚀**
