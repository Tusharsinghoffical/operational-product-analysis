# 🔐 Clerk Authentication Setup Guide

## Quick Start (5 minutes)

### Step 1: Create Clerk Account
1. Go to https://dashboard.clerk.com
2. Click "Add Application"
3. Name it "OpSense"
4. Select "Email" and "Google" as sign-in methods
5. Click "Create Application"

### Step 2: Get Your API Keys
1. In Clerk Dashboard, go to **API Keys** in the left sidebar
2. Copy the **Publishable Key** (starts with `pk_test_`)
3. Copy the **Secret Key** (starts with `sk_test_`)

### Step 3: Add Keys to Your Project
1. Open `frontend/.env.local`
2. Replace the placeholder keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY_HERE
```

### Step 4: Restart Frontend Server
```bash
# Stop the current frontend (Ctrl+C)
# Then restart
cd frontend
npm run dev
```

### Step 5: Test Authentication
1. Go to http://localhost:3000
2. Click **"Sign Up"** in the top right
3. Create an account with email
4. Verify your email (check inbox)
5. You'll see your profile picture in the top right! 🎉

---

## Features Enabled

✅ **Sign Up** - Users can create accounts  
✅ **Sign In** - Secure login with email/password  
✅ **User Profile** - Click avatar to manage profile  
✅ **Session Management** - Persistent login sessions  
✅ **Email Verification** - Secure account creation  
✅ **Social Login** - Add Google, GitHub, etc. (optional)  

---

## Customization (Optional)

### Add Google Sign-In
1. Go to Clerk Dashboard → **User & Authentication** → **Social Connections**
2. Enable **Google**
3. Follow the setup wizard

### Customize Branding
1. Go to Clerk Dashboard → **Branding**
2. Upload your logo
3. Set brand colors
4. Customize email templates

### Add More Sign-In Methods
- Phone/SMS
- Magic Links
- SSO/SAML
- Passkeys

---

## How It Works

### TopNav Component
- **Signed Out**: Shows "Sign In" and "Sign Up" buttons
- **Signed In**: Shows UserButton with profile avatar

### Protected Routes
Currently all routes are public. To protect routes:

```typescript
// In middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/settings(.*)'])

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect()
})
```

---

## Troubleshooting

### "Missing API Keys" Error
- Make sure `.env.local` has the correct keys
- Restart the frontend server after adding keys

### Sign-In Not Working
- Check browser console for errors
- Verify keys are from the same Clerk application
- Make sure `middleware.ts` exists in frontend root

### Modal Not Opening
- Check that `mode="modal"` is set on SignInButton/SignUpButton
- Verify ClerkProvider wraps the app in layout.tsx

---

## Next Steps

🎯 **Explore Clerk Dashboard**: https://dashboard.clerk.com  
📚 **Clerk Documentation**: https://clerk.com/docs  
🏢 **Organizations**: Add team/multi-user features  
🎨 **Custom Components**: Build custom auth UI  

---

## Security Notes

🔒 Never commit `.env.local` to git  
🔒 Use production keys for deployment  
🔒 Enable 2FA for enhanced security  
🔒 Regularly rotate secret keys  
