# Deployment Guide for Render

## 🚀 **Deploying Multi-User Todo App to Render**

### **Step 1: Prepare Your Repository**
1. Push all your code to GitHub
2. Make sure your repository is public or connected to Render

### **Step 2: Create New Web Service on Render**
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Choose your todo-app repository

### **Step 3: Configure the Web Service**

#### **Basic Settings:**
- **Name**: `todo-app-multi-user` (or your preferred name)
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free (or your preferred plan)

#### **Environment Variables:**
Add these environment variables in Render dashboard:

| Variable | Value | Description |
|----------|-------|-------------|
| `MONGODB_URI` | `your_mongodb_atlas_connection_string` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | `your-super-secret-jwt-key-2024` | A secure random string for JWT tokens |
| `NODE_ENV` | `production` | Set to production mode |
| `PORT` | `10000` | Render's default port (optional) |

### **Step 4: MongoDB Atlas Setup**

#### **If you haven't set up MongoDB Atlas:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Add your IP to whitelist (or use 0.0.0.0/0 for all IPs)

#### **Connection String Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/todo-app?retryWrites=true&w=majority
```

### **Step 5: Deploy**
1. Click "Create Web Service"
2. Wait for the build to complete
3. Your app will be available at: `https://todo-app-q3ci.onrender.com/`

## 🔧 **Troubleshooting**

### **Common Issues:**

#### **1. Build Fails**
- Check that all dependencies are in `package.json`
- Ensure `start` script is correct
- Check build logs for specific errors

#### **2. MongoDB Connection Error**
- Verify your MongoDB Atlas connection string
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

#### **3. JWT Secret Error**
- Make sure `JWT_SECRET` is set
- Use a strong, random string
- Don't use default values in production

#### **4. CORS Issues**
- The app is configured to handle CORS automatically
- If issues persist, check the `FRONTEND_URL` environment variable

### **Environment Variables Checklist:**

✅ `MONGODB_URI` - Your MongoDB connection string  
✅ `JWT_SECRET` - Secure random string for JWT tokens  
✅ `NODE_ENV` - Set to `production`  
✅ `PORT` - Render will set this automatically  

## 🌐 **After Deployment**

### **Test Your App:**
1. Visit your Render URL
2. Register a new account
3. Create some todos
4. Test login/logout functionality
5. Verify todos are user-specific

### **Monitor Your App:**
- Check Render logs for any errors
- Monitor MongoDB Atlas for database activity
- Test with multiple user accounts

## 🔒 **Security Notes**

- ✅ Passwords are hashed with bcrypt
- ✅ JWT tokens are secure
- ✅ User data is isolated
- ✅ CORS is properly configured
- ✅ Session management is secure

## 📈 **Scaling**

Your app is ready to scale:
- MongoDB Atlas can handle multiple users
- JWT tokens are stateless
- Session data is stored in MongoDB
- No server-side session storage needed

---

**Your multi-user Todo app is now ready for production!** 🎉 