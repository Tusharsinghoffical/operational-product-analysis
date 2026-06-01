# OpSense JWT Authentication System

## Overview

OpSense now uses a custom JWT-based authentication system with SQLite database, replacing the previous Clerk authentication. This provides full control over user management and data.

## Tech Stack

- **Backend**: Python FastAPI
- **Frontend**: Next.js 14 with TypeScript
- **Database**: SQLite (via SQLAlchemy)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt hashing

## Features

✅ User Registration (Signup)  
✅ User Login with JWT tokens  
✅ Protected routes (client-side)  
✅ Password hashing with bcrypt  
✅ JWT token validation  
✅ User profile management  
✅ Secure password requirements  
✅ Session persistence (localStorage)  
✅ Logout functionality  

## Project Structure

```
backend/
├── app/
│   ├── controllers/
│   │   └── auth_controller.py      # Authentication business logic
│   ├── models/
│   │   ├── user_model.py           # User SQLAlchemy model
│   │   └── auth_schemas.py         # Pydantic validation schemas
│   ├── routes/
│   │   └── auth_routes.py          # Authentication API endpoints
│   ├── utils/
│   │   └── auth.py                 # JWT & password utilities
│   └── main.py                     # FastAPI app with CORS config
│
frontend/
├── app/
│   ├── login/page.tsx              # Login page
│   ├── signup/page.tsx             # Signup page
│   └── ...                         # Protected pages
├── components/
│   ├── ProtectedRoute.tsx          # Route protection wrapper
│   └── TopNav.tsx                  # Updated with user menu
├── lib/
│   ├── auth-context.tsx            # React Auth Context Provider
│   └── api.ts                      # API functions with auth
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get current user profile | Yes |

### Request/Response Examples

#### Signup

**Request:**
```json
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-15T10:30:00"
  }
}
```

#### Login

**Request:**
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:** (Same as signup)

#### Get Profile

**Request:**
```
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2024-01-15T10:30:00"
}
```

## Security Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- Hashed with bcrypt before storage

### JWT Token
- Algorithm: HS256
- Expiration: 7 days
- Payload: `{ "sub": user_id, "exp": expiration_time }`
- Stored in localStorage (client-side)

### CORS Configuration
- Allows requests from: `http://localhost:3000`, `http://localhost:3001`
- Supports credentials
- All methods and headers allowed

## How to Run

### 1. Start Backend

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment (if not already done)
# On Windows:
.venv\Scripts\activate
# On Mac/Linux:
source .venv/bin/activate

# Install dependencies (if needed)
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

### 2. Start Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if needed)
npm install

# Run the development server
npm run dev
```

Frontend will be available at: `http://localhost:3000`

### 3. Access the Application

1. Open `http://localhost:3000` in your browser
2. You'll be redirected to `/login` if not authenticated
3. Create an account at `/signup` or login with existing credentials
4. After login, you'll be redirected to the dashboard

## User Flow

1. **New User**:
   - Visit `/signup`
   - Fill in name, email, and password
   - Password must meet requirements (shown in real-time)
   - Click "Create Account"
   - Automatically logged in and redirected to dashboard

2. **Existing User**:
   - Visit `/login`
   - Enter email and password
   - Click "Sign In"
   - Redirected to dashboard

3. **Authenticated User**:
   - Access all protected routes
   - View user menu in TopNav (top-right)
   - Click avatar to see dropdown
   - Click "Logout" to sign out

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

The database file is stored at: `backend/opsense.db`

## Configuration

### Backend (auth.py)

```python
# JWT Configuration
SECRET_KEY = "your-secret-key-change-in-production"  # TODO: Use environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days
```

**⚠️ IMPORTANT**: In production, change `SECRET_KEY` to a secure random string and store it in environment variables.

### Frontend

```typescript
// API base URL (in lib/api.ts)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```

You can set `NEXT_PUBLIC_API_URL` in `.env.local` for different environments.

## Testing

### Test with cURL

```bash
# Signup
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test1234"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'

# Get Profile (replace TOKEN with your actual token)
curl -X GET http://localhost:8000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

### Test with Swagger UI

1. Open `http://localhost:8000/docs`
2. Find the "Authentication" section
3. Click on any endpoint to test it
4. For protected endpoints, click "Authorize" and enter your token

## Error Handling

### Common Errors

| Status Code | Error Message | Solution |
|-------------|---------------|----------|
| 400 | "Email already registered" | Use different email or login |
| 401 | "Invalid email or password" | Check credentials |
| 401 | "Invalid or expired token" | Login again |
| 422 | Validation error | Check password requirements |

### Frontend Error Messages

- Login/Signup errors are displayed in red alert boxes
- Password validation shown in real-time with green checkmarks
- Loading states prevent double submissions

## Next Steps / TODO

- [ ] Move `SECRET_KEY` to environment variables
- [ ] Add email verification
- [ ] Add password reset functionality
- [ ] Add refresh token mechanism
- [ ] Implement rate limiting
- [ ] Add two-factor authentication (2FA)
- [ ] Store tokens in httpOnly cookies (more secure)
- [ ] Add user profile editing
- [ ] Add user roles/permissions

## Troubleshooting

### "Failed to fetch" error
- Make sure backend is running on port 8000
- Check CORS configuration in `main.py`
- Verify `NEXT_PUBLIC_API_URL` is correct

### Token not persisting
- Check browser localStorage is enabled
- Clear localStorage and try again
- Check for errors in browser console

### Database errors
- Delete `backend/opsense.db` and restart backend
- Check SQLAlchemy imports are correct
- Ensure all models are imported in `main.py`

## License

© 2024 OpSense. All rights reserved.
