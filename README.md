# Vibe Notes 📝

> A modern, feature-rich note-taking application built with the MERN stack, offering intelligent note management, geolocation tagging, and secure local area network file sharing.

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green.svg)](https://www.mongodb.com/mern-stack)
[![Node Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org)

## 🚀 Project Overview

Vibe Notes is a comprehensive note-taking solution developed as part of the 10Pshine MERN Stack internship program. The application combines traditional note-taking capabilities with advanced features including AI-powered smart notes, geolocation-based notes, and a unique LAN file-sharing system.

**Internship Assignment:** `atif-mern-10pshine`

## ✨ Key Features

### 📱 Core Functionality

- **Multi-Type Notes System**
  - Quick Notes: Rapid text capture with voice-to-text support
  - Smart Notes: AI-integrated notes with custom prompts
  - Geo Notes: Location-tagged notes with interactive Leaflet maps
- **Rich Text Management**
  - Real-time note creation and editing
  - Tag-based organization
  - Favorite/bookmark functionality
  - Advanced search and filtering

### Security & Authentication

- JWT-based authentication with HTTP-only cookies
- Bcrypt password hashing
- End-to-end note encryption using AES-256-CBC
- Protected routes with middleware validation
- Rate limiting and helmet security headers

### Geolocation Integration

- Interactive map interface powered by Leaflet.js
- Click-to-add location markers
- Reverse geocoding for address resolution
- Coordinate-based note storage

### LAN File Sharing

- IP-based file sharing within local networks
- Multi-file upload support (up to 10MB total)
- Automatic file cleanup and management
- Secure path validation to prevent directory traversal

### User Experience

- Responsive design for mobile and desktop
- Real-time password strength indicators
- Toast notifications for user feedback
- Pagination for large note collections
- Dark-themed UI with emerald accent colors

## 🛠️ Technology Stack

### Backend

```json
{
  "runtime": "Node.js (v16+)",
  "framework": "Express.js",
  "database": "MongoDB with Mongoose ODM",
  "authentication": "JWT + bcrypt",
  "file_handling": "Multer",
  "security": "Helmet, express-rate-limit, CORS"
}
```

### Frontend

```json
{
  "library": "React 18",
  "state_management": "Redux Toolkit",
  "routing": "React Router v6",
  "styling": "Tailwind CSS",
  "maps": "Leaflet.js",
  "http_client": "Axios",
  "notifications": "React Hot Toast"
}
```

## 📦 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas cluster)
- npm or yarn package manager

### Backend Setup

1. **Clone the repository**

```bash
git clone https://github.com/atif-mern-10pshine/vibe-notes.git
cd vibe-notes/backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Configuration**

Create a `config.env` file in the root directory:

```env
# Server Configuration
PORT=3000
ENVIRONMENT=development

# Database
MONGODB_URI=mongodb://localhost:27017/vibe-notes
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/vibe-notes

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=90d
JWT_TOKEN_EXPIRES_IN=90

# Encryption (for note encryption)
ENCRYPTION_KEY=your-32-character-encryption-key
ENCRYPTION_IV=your-16-character-iv-key
```

4. **Start the server**

```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

### Frontend Setup

1. **Navigate to frontend directory**

```bash
cd ../frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Configuration**

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

4. **Start development server**

```bash
npm run dev
```

For now The application will be available at `http://localhost:5173`

## 🔌 API Documentation

### Authentication Endpoints

#### POST `/api/v1/auth/signup`

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "passwordConfirm": "SecurePass123!"
}
```

**Response:**

```json
{
  "status": "success",
  "token": "jwt-token-here",
  "user": {
    "_id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST `/api/v1/auth/login`

Authenticate existing user.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### GET `/api/v1/auth/check-auth`

Verify current authentication status.

**Headers:** `Authorization: Bearer <token>`

#### GET `/api/v1/auth/logout`

Clear authentication cookies and log out user.

---

### Notes Endpoints

#### POST `/api/v1/notes`

Create a new note.

**Request Body (Quick Note):**

```json
{
  "title": "Meeting Notes",
  "note": "Discuss Q4 roadmap",
  "type": "quick",
  "tags": ["work", "planning"],
  "favorite": false
}
```

**Request Body (Smart Note):**

```json
{
  "title": "AI Summary",
  "note": "Content to be processed",
  "type": "smart",
  "prompt": "Summarize the following text",
  "tags": ["ai", "summary"]
}
```

**Request Body (Geo Note):**

```json
{
  "title": "Office Location",
  "note": "Main headquarters",
  "type": "geo",
  "coordinates": {
    "lat": 40.7128,
    "lng": -74.006
  },
  "locationName": "New York, NY",
  "tags": ["location", "office"]
}
```

#### GET `/api/v1/notes`

Retrieve all notes for authenticated user.

**Query Parameters:**

- `type`: Filter by note type (quick, smart, geo)
- `favorite`: Filter favorites (true/false)
- `search`: Search in title and tags

#### GET `/api/v1/notes/:id`

Retrieve a specific note by ID.

#### PATCH `/api/v1/notes/:id`

Update an existing note.

**Request Body:**

```json
{
  "title": "Updated Title",
  "note": "Updated content",
  "tags": ["updated", "tags"]
}
```

#### DELETE `/api/v1/notes/:id`

Delete a note permanently.

---

### LAN Sharing Endpoints

#### GET `/api/v1/lan`

Retrieve shared data for current IP address.

**Query Parameters:**

- `filename`: Download specific file

**Response:**

```json
{
  "status": "success",
  "data": {
    "lan": {
      "text": "Shared text content",
      "files": [
        {
          "name": "document.pdf",
          "path": "/192_168_1_100/files/document.pdf",
          "size": 1048576
        }
      ],
      "ipAddress": "192.168.1.100"
    }
  }
}
```

#### PUT `/api/v1/lan`

Upload files and update shared content.

**Request:** `multipart/form-data`

- `text`: Shared text content
- `files`: Array of files (max 10MB total)
- `keepFiles`: JSON array of filenames to preserve

---

### User Endpoints

#### PATCH `/api/v1/users/updateImage/:id`

Update user profile picture.

**Request:** `multipart/form-data`

- `photo`: Image file (JPEG, PNG)

#### DELETE `/api/v1/users/delete/:id`

Delete user account and all associated data.

## Security Features

### Authentication Flow

1. User credentials validated against MongoDB
2. JWT token generated with 90-day expiration
3. Token stored in HTTP-only cookie (secure in production)
4. Middleware validates token on protected routes
5. Password change detection invalidates old tokens

### Data Protection

- **Note Encryption**: AES-256-CBC encryption for note content
- **Password Security**: Bcrypt with salt rounds
- **Rate Limiting**: 200 requests per hour per IP
- **CORS**: Configured for specific origins
- **Helmet**: Security headers automatically applied
- **Input Sanitization**: MongoDB injection prevention

### File Upload Security

- File size limits (10MB total)
- Filename sanitization (alphanumeric + underscore)
- Path traversal prevention
- IP-based isolation

## Usage Examples

### Creating Different Note Types

#### Quick Note

```javascript
// Frontend dispatch example
dispatch(
  createNoteThunk({
    title: "Shopping List",
    note: "Milk, Eggs, Bread",
    type: "quick",
    tags: ["personal", "shopping"],
  })
);
```

#### Smart Note with AI Prompt

```javascript
dispatch(
  createNoteThunk({
    title: "Article Summary",
    note: "Long article content...",
    type: "smart",
    prompt: "Extract key takeaways",
    tags: ["ai", "learning"],
  })
);
```

#### Geo Note with Location

```javascript
dispatch(
  createNoteThunk({
    title: "Favorite Restaurant",
    note: "Best pasta in town!",
    type: "geo",
    coordinates: { lat: 40.7589, lng: -73.9851 },
    locationName: "Times Square, NYC",
    tags: ["food", "travel"],
  })
);
```

### LAN File Sharing

#### Share Files on Network

```javascript
const formData = new FormData();
formData.append("text", "Check out these documents");
formData.append("files", fileInput.files[0]);
formData.append("keepFiles", JSON.stringify(["existing.pdf"]));

dispatch(updateLanThunk(formData));
```

## 🧪 Testing

### Backend Testing

```bash
# Run all tests
npm test
```

## 🚀 Deployment

### Backend Deployment (Example: Railway/Render)

1. **Environment Variables**

   - Set all `config.env` variables in platform dashboard
   - Ensure `ENVIRONMENT=production`
   - Update `MONGODB_URI` to production database

2. **Build Command**

```bash
npm install --production
```

3. **Start Command**

```bash
npm start
```

### Frontend Deployment (Example: Vercel/Netlify)

1. **Build Configuration**

```bash
npm run build
```

2. **Environment Variables**

   - `VITE_API_URL`: Production backend URL

3. **Output Directory**: `dist`

## 🤝 Contributing

This project was developed as part of an internship program. For educational purposes, feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/---`)
3. Commit changes (`git commit -m 'Add ---'`)
4. Push to branch (`git push origin feature/---`)
5. Open a Pull Request

## 📝 Development Notes

### Database Indexes

For optimal performance, ensure these indexes exist:

```javascript
// Users collection
db.users.createIndex({ email: 1 }, { unique: true });

// Notes collection
db.notes.createIndex({ user: 1, createdAt: -1 });
db.notes.createIndex({ tags: 1 });

// LAN collection
db.lans.createIndex({ ipAddress: 1 }, { unique: true });
db.lans.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

### Error Handling

The application implements centralized error handling:

- Development: Full error stack traces
- Production: User-friendly messages only
- Operational errors: Trusted and sent to client
- Programming errors: Logged server-side only

## 🐛 Known Issues & Limitations

- LAN file sharing requires same network connectivity
- File uploads limited to 10MB total per session
- Map functionality requires internet for tile loading
- Password reset functionality not yet implemented

## 👨‍💻 Author

**Atif Sheikh**

## Acknowledgments

- MongoDB team for excellent documentation
- React and Express communities for open-source contributions
- Leaflet.js for mapping capabilities

---

**Built with ❤️ using the MERN Stack**
