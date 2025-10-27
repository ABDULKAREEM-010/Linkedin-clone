# LinkedIn Clone

A full-stack LinkedIn clone application built with React.js, Node.js, Express.js, and MongoDB.

## Features

- **User Authentication**: Sign up, login, and JWT-based authentication
- **User Profiles**: View and edit user profiles with headline, location, about section
- **Posts & Feed**: Create posts, like posts, comment on posts with beautiful animations ✨
- **Image Upload**: Upload images with posts (Base64 encoding, 5MB limit)
- **Edit Posts**: Edit your own posts with inline editor
- **Delete Posts**: Delete your own posts with professional confirmation modal
- **Networking**: Send/accept/reject connection requests, view connections, manage network
- **Real-time Feed**: View posts from all users in chronological order
- **Toast Notifications**: Beautiful notification system for all user actions 🆕
- **Professional UI**: LinkedIn-like interface with smooth animations and transitions 🆕
- **Icon Integration**: Professional icons from react-icons library 🆕
- **Responsive Design**: Mobile-friendly UI design

### Bonus Features Implemented ✨
- ✅ Like and comment buttons on posts with animated feedback
- ✅ Edit and delete own posts with professional modals
- ✅ Profile page for each user with connections preview
- ✅ Image upload with posts (validation and preview)
- ✅ Toast notifications for all actions (success/error)
- ✅ Beautiful like button animation with bounce effect
- ✅ Professional Network page with stats, requests, and suggestions
- ✅ Grid layout for connection suggestions

## Tech Stack

### Frontend
- React.js 18.2.0
- React Router DOM 6.20.0 for navigation
- Axios 1.6.2 for API calls
- React Icons 5.5.0 for professional UI icons
- CSS3 for styling with animations

### Backend
- Node.js
- Express.js 4.18.2
- MongoDB with Mongoose 8.0.3
- JWT (jsonwebtoken 9.0.2) for authentication
- bcryptjs 2.4.3 for password hashing
- CORS 2.8.5 for cross-origin requests
- 50MB payload limit for image uploads

## Project Structure

```
LinkedIn-clone/
├── backend/
│   ├── models/
│   │   ├── User.js           → MongoDB User schema with connections
│   │   ├── Post.js           → MongoDB Post schema with likes/comments
│   │   └── Connection.js     → MongoDB Connection schema
│   ├── routes/
│   │   ├── auth.js           → Authentication endpoints (login/register)
│   │   ├── users.js          → User profile & search endpoints
│   │   ├── posts.js          → Post CRUD, like, comment endpoints
│   │   └── connections.js    → Network management endpoints
│   ├── middleware/
│   │   └── auth.js           → JWT authentication middleware
│   ├── .env                  → Environment variables
│   ├── .env.example          → Example environment file
│   ├── package.json          → Backend dependencies
│   └── server.js             → Express server setup
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx        → Login component
│   │   │   │   ├── Register.jsx     → Registration component
│   │   │   │   └── Auth.css
│   │   │   ├── Home/
│   │   │   │   ├── Home.jsx         → Feed with notifications
│   │   │   │   └── Home.css
│   │   │   ├── Layout/
│   │   │   │   ├── Navbar.jsx       → Navigation bar
│   │   │   │   └── Navbar.css
│   │   │   ├── Network/
│   │   │   │   ├── Network.jsx      → Network management page
│   │   │   │   └── Network.css
│   │   │   ├── Post/
│   │   │   │   ├── Post.jsx         → Post display with animations
│   │   │   │   ├── PostCreator.jsx  → Create post form
│   │   │   │   └── Post.css
│   │   │   └── Profile/
│   │   │       ├── Profile.jsx      → User profile page
│   │   │       └── Profile.css
│   │   ├── App.jsx              → Main React component
│   │   ├── App.css
│   │   ├── index.js             → React entry point
│   │   └── index.css
│   └── package.json             → Frontend dependencies
│
├── README.md
└── REACT_STRUCTURE.md           → React file structure documentation
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Local Development Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Open `.env` file
   - Update `MONGODB_URI` with your MongoDB connection string
   - Update `JWT_SECRET` with a secure random string

4. Start the backend server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Running the Application

### Method 1: Quick Start (Windows)
Run the provided batch file:
```bash
start.bat
```

Or use PowerShell:
```powershell
.\start.ps1
```

### Method 2: Manual Start

1. Make sure MongoDB is running (locally or on MongoDB Atlas)

2. Start the backend server (port 5000):
```bash
cd backend
npm start
```

3. In a new terminal, start the frontend development server (port 3000):
```bash
cd frontend
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

---

## 🚀 Deployment

### Quick Deployment Guide

This app can be deployed for **FREE** using:
- **Frontend**: Vercel
- **Backend**: Render  
- **Database**: MongoDB Atlas

See the complete **[DEPLOYMENT.md](./DEPLOYMENT.md)** guide for step-by-step instructions.

### Deployment URLs
- Frontend: Deploy to Vercel
- Backend: Deploy to Render
- Database: MongoDB Atlas (free tier)

**Total Cost: $0/month** for basic usage! 🎉

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user profile
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/search/:query` - Search users
- `GET /api/users` - Get all users (suggestions)

### Posts
- `POST /api/posts` - Create new post (with image support)
- `GET /api/posts` - Get all posts (feed)
- `GET /api/posts/user/:userId` - Get posts by user
- `PUT /api/posts/:id` - Edit post
- `PUT /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Add comment to post
- `DELETE /api/posts/:id` - Delete post

### Connections
- `POST /api/connections/request` - Send connection request
- `GET /api/connections/requests` - Get pending requests
- `PUT /api/connections/:id/accept` - Accept connection request
- `PUT /api/connections/:id/reject` - Reject connection request
- `GET /api/connections` - Get user's connections
- `DELETE /api/connections/:userId` - Remove connection

## Usage

1. **Sign Up**: Create a new account with your details
2. **Login**: Sign in with your email and password
3. **Create Posts**: Share updates on your feed with optional images
4. **Interact**: Like and comment on posts with animated feedback
5. **Edit/Delete**: Manage your own posts with professional UI modals
6. **Connect**: Send connection requests to other users
7. **Network**: View connection stats, manage requests, and discover suggestions
8. **Profile**: View and edit your profile information with connections preview
9. **Notifications**: Receive toast notifications for all actions

## UI Features

### Toast Notifications
- ✅ Success notifications (green) for successful actions
- ❌ Error notifications (red) for failed operations
- ⏱️ Auto-dismiss after 3 seconds
- 🎨 Smooth slide-in animation from right

### Like Button Animation
- 💙 Beautiful bounce and rotate effect on click
- 📈 Icon scales to 1.5x during animation
- 🎯 Visual feedback with 0.6s smooth transition
- 🔵 Blue color for liked state

### Professional Modals
- ✨ Blur backdrop for focus
- 📋 Dropdown menus for post actions
- ⚠️ Confirmation dialogs for destructive actions
- 🎨 Consistent LinkedIn-style design

### Network Page
- 📊 Statistics cards showing connection counts
- 👥 Organized tabs: Connections, Requests, Suggestions
- 🔔 "Pending" state for sent requests
- 🎴 Grid layout for connection suggestions
- 💬 Empty states with helpful messages

## Default MongoDB Connection

The application is configured to connect to MongoDB at:
```
mongodb://localhost:27017/linkedin-clone
```

To use MongoDB Atlas, update the `MONGODB_URI` in `.env`:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/linkedin-clone
```

## Security Notes

- Change the `JWT_SECRET` in `.env` before deploying to production
- Never commit `.env` file to version control
- Use environment-specific configuration for production

## Future Enhancements

- Real-time notifications with WebSocket
- Direct messaging between users
- Job postings and applications
- Skills endorsements
- Advanced search with filters
- Email verification
- Password reset functionality
- Post sharing/reposting
- Video upload support
- Multiple image uploads per post
- Rich text editor for posts
- User recommendations algorithm

## Troubleshooting

### Frontend won't start
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Backend connection errors
1. Make sure MongoDB is running
2. Check the `MONGODB_URI` in `backend/.env`
3. For MongoDB Atlas, ensure your IP is whitelisted

### Port already in use
- Backend: Change `PORT` in `backend/.env`
- Frontend: Set `PORT=3001` before running `npm start`

### CORS errors
- Ensure backend is running on port 5000
- Check `proxy` setting in `frontend/package.json`

### Image upload fails
- Check if image is under 5MB
- Verify backend payload limit is set to 50MB
- Check browser console for detailed errors

### Animations not working
- Clear browser cache
- Check if react-icons is installed: `npm list react-icons`
- Restart development server

## Performance Notes

- Image uploads use Base64 encoding (increases payload size by ~33%)
- Frontend has 5MB limit, backend supports up to 50MB
- Toast notifications auto-dismiss after 3 seconds
- Like animations run for 0.6 seconds without blocking UI

## Author

Mohammed Abdul Kareem

## License

This project is open source and available for educational purposes.

## Acknowledgments

- Built following React.js, Node.js, Express.js, and MongoDB best practices
- UI inspired by LinkedIn's professional design
- Icons from react-icons library
