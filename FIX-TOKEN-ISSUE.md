# 🔐 Fix: Invalid or Expired Token

## Problem
You're seeing "Upload Failed - Invalid or expired token" error.

## Why This Happens
The database system was recently upgraded to a multi-database architecture. Old authentication tokens stored in your browser are no longer valid.

## ✅ Quick Fix (30 seconds)

### Option 1: Logout & Login (Recommended)

1. **Click the "Logout" button** in the sidebar
2. **You'll be redirected to login page**
3. **Enter your credentials:**
   - Email: `utsabjc@gmail.com`
   - Password: (your password)
4. **Click "Login"**
5. **Try uploading again** - It will work! ✅

### Option 2: Clear Browser Storage

1. **Open browser DevTools** (Press F12)
2. **Go to Application tab**
3. **Click on "Local Storage"** → `http://localhost:3000`
4. **Delete these keys:**
   - `token`
   - `user`
5. **Refresh the page** (F5)
6. **Login again**
7. **Upload will work** ✅

## What Changed

### Before (Old System):
```
Single Database: opsense.db
├── All users mixed together
├── Old token format
└── No data isolation
```

### After (New System):
```
Multi-Database System:
├── users.db (authentication)
├── user_1.db (User 1's data)
├── user_2.db (User 2's data)
├── user_3.db (User 3's data)
└── user_4.db (YOUR data - utsav)
```

## Why New Token is Needed

Your old token was created with the previous database system. The new system:
- ✅ Uses separate databases per user
- ✅ Has enhanced security
- ✅ Requires fresh authentication
- ✅ Ensures data isolation

## Steps After Login

Once you login again:

1. **✅ Upload Data**
   - Go to Data Upload page
   - Select your CSV file
   - Click "Upload & Analyze"
   - Data saves to YOUR database only

2. **✅ View Insights**
   - Go to AI Insights
   - See only your insights
   - No other user's data visible

3. **✅ Complete Privacy**
   - Your data is in `user_4.db`
   - Other users cannot see it
   - Complete data isolation

## Available User Accounts

| User | Email | Database |
|------|-------|----------|
| Tushar | tusharsinghkumar02@gmail.com | user_1.db |
| Tushar | tusharsinghoffical@gmail.com | user_2.db |
| Tushar | tusharsinghkumar04@gmail.com | user_3.db |
| **Utsav** | **utsabjc@gmail.com** | **user_4.db** |

## Features Now Working

After re-login, all features will work:

✅ **Data Upload** - Upload CSV files  
✅ **AI Insights** - View AI-generated insights  
✅ **Risk Monitoring** - See risk analysis  
✅ **Reports** - Generate PDF reports  
✅ **Dashboard** - View business overview  
✅ **Data Privacy** - Only your data visible  

## Still Having Issues?

If you still see the error after logging in again:

1. **Hard refresh browser:** `Ctrl + Shift + R`
2. **Clear browser cache:** `Ctrl + Shift + Delete`
3. **Try incognito/private mode**
4. **Check backend is running:** `http://localhost:8000`

## Technical Details

### Token Storage:
```javascript
localStorage:
  - token: "eyJhbGci..." (JWT token)
  - user: {id: 4, name: "utsav", email: "..."}
```

### Authentication Flow:
```
Login → Get JWT Token → Store in localStorage
         ↓
Upload → Send token in header → Backend validates
         ↓
Success → Data saved to user_4.db
```

### API Headers:
```javascript
Authorization: Bearer <your-jwt-token>
```

---

## 🎯 Summary

**Just logout and login again!** 

This gives you a fresh token that works with the new multi-database system. The whole process takes 30 seconds.

**Click "Logout" → Login → Upload → Done! ✅**
