# Todo App - Multi-User Edition

A modern, responsive Todo application with **multi-user authentication** built with HTML, CSS, JavaScript, Node.js, Express, and MongoDB.

## ✨ **New Multi-User Features**

- 🔐 **User Authentication** - Secure registration and login system
- 👤 **Individual Todo Lists** - Each user has their own private todos
- 🛡️ **JWT Token Security** - Secure session management
- 🔒 **Password Protection** - Encrypted passwords with bcrypt
- 🚪 **Session Management** - Automatic logout and session handling
- 👋 **User Welcome** - Personalized greeting with username
- 🔄 **Auto-login** - Remembers user sessions

## 🚀 **All Previous Features Still Included**

- ✨ **Modern UI/UX** - Beautiful gradient design with smooth animations
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ⚡ **Real-time Updates** - Instant feedback for all actions
- 🔄 **CRUD Operations** - Create, Read, Update, and Delete todos
- ✅ **Mark as Complete** - Toggle todo completion status
- ✏️ **Edit Todos** - Inline editing functionality
- 🗑️ **Delete Todos** - Remove todos with confirmation
- 📊 **Statistics** - View total, completed, and pending todos
- 🔍 **Filtering** - Filter todos by All, Pending, or Completed
- 💾 **Persistent Storage** - Data stored in MongoDB database
- 🌐 **Online Ready** - Can be deployed to any hosting platform

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens), bcrypt for password hashing
- **Session Management**: Express-session with MongoDB store
- **Styling**: Custom CSS with Flexbox and Grid
- **Icons**: Font Awesome
- **Deployment**: Ready for platforms like Render, Vercel, or Heroku

## Prerequisites

- Node.js (v14 or higher)
- MongoDB database (local or cloud)
- npm or yarn package manager

## Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd todo-webapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_jwt_secret_key_here
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## MongoDB Setup

### Option 1: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Replace `your_mongodb_connection_string_here` in `.env`

### Option 2: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/todo-app`

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Todo Endpoints (Require Authentication)
- `GET /api/todos` - Get all todos for current user
- `POST /api/todos` - Create a new todo for current user
- `PUT /api/todos/:id` - Update a todo (user-specific)
- `DELETE /api/todos/:id` - Delete a todo (user-specific)

## Project Structure

```
todo-webapp/
├── public/
│   ├── index.html      # Main HTML file with auth forms
│   ├── style.css       # Styles including auth UI
│   └── app.js          # Frontend JavaScript with auth logic
├── server.js           # Express server with auth middleware
├── package.json        # Dependencies including auth packages
├── .env               # Environment variables
└── README.md          # This file
```

## Usage

### First Time Setup
1. **Register** - Create a new account with username, email, and password
2. **Login** - Sign in with your credentials
3. **Start Managing** - Your personal todo list is ready!

### User Management
- **Registration**: Username (3-20 chars), email, password (min 6 chars)
- **Login**: Email and password
- **Session**: Automatically logged in for 24 hours
- **Logout**: Click the logout button to sign out

### Todo Management (Same as before, but now user-specific)
- **Adding**: Type and press Enter or click "+"
- **Completing**: Click the circle button
- **Editing**: Click the edit icon, modify, save
- **Deleting**: Click delete icon and confirm
- **Filtering**: Use All/Pending/Completed filters

## Security Features

- 🔐 **Password Hashing** - Passwords encrypted with bcrypt
- 🎫 **JWT Tokens** - Secure authentication tokens
- 🛡️ **User Isolation** - Users can only access their own todos
- 🔒 **Session Management** - Secure session handling
- 🚫 **Input Validation** - Server-side validation for all inputs
- 🛡️ **CORS Protection** - Cross-origin request protection

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/todo-app` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |

## Deployment

### Deploy to Render
1. Push your code to GitHub
2. Connect your repository to Render
3. Set environment variables in Render dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
4. Deploy!

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Set environment variables in Vercel dashboard
4. Follow the prompts

### Deploy to Heroku
1. Install Heroku CLI
2. Create a new Heroku app
3. Set environment variables
4. Deploy with `git push heroku main`

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, 3-20 chars),
  email: String (unique, lowercase),
  password: String (hashed, min 6 chars),
  createdAt: Date
}
```

### Todo Collection
```javascript
{
  _id: ObjectId,
  text: String (required),
  completed: Boolean (default: false),
  user: ObjectId (ref: User, required),
  createdAt: Date
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Happy Multi-User Todo-ing!** 🎉

---

**Happy Todo-ing!** 🎉 #   T o d o - a p p 
 
 