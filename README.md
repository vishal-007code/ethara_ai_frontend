# HRMS Lite - Human Resource Management System

A lightweight, full-stack web application for managing employees and tracking their daily attendance. Built with React, Node.js, Express, and MongoDB.

## 📋 Project Overview

HRMS Lite is a professional HR management system that allows administrators to:
- **Manage Employee Records**: Add, view, and delete employee information
- **Track Attendance**: Mark and view daily attendance records for employees
- **View Statistics**: See attendance statistics (total days, present days, absent days) per employee

The application features a clean, modern UI with proper error handling, loading states, and empty states for a production-ready user experience.

## 🛠 Tech Stack

### Frontend
- **React 19.2.4** - UI library
- **Axios** - HTTP client for API calls
- **CSS3** - Custom styling with modern design patterns

### Backend
- **Node.js** - Runtime environment
- **Express.js 4.18.2** - Web framework
- **MongoDB** - Database (via Mongoose)
- **CORS** - Cross-origin resource sharing

### Deployment
- **Frontend**: Vercel / Netlify
- **Backend**: Render / Railway / Heroku
- **Database**: MongoDB Atlas (cloud) or local MongoDB

## 🚀 Features

### Employee Management
- ✅ Add new employees with unique Employee ID, Full Name, Email, and Department
- ✅ View list of all employees in a clean table format
- ✅ Delete employees with confirmation
- ✅ Server-side validation for all fields
- ✅ Duplicate employee ID and email prevention
- ✅ Email format validation

### Attendance Management
- ✅ Mark attendance for employees (Present/Absent)
- ✅ View attendance records filtered by employee
- ✅ Display attendance statistics (total days, present days, absent days)
- ✅ Date-based attendance tracking
- ✅ Prevent duplicate attendance entries for the same date

### UI/UX Features
- ✅ Responsive design (mobile-friendly)
- ✅ Loading states for async operations
- ✅ Empty states with helpful messages
- ✅ Error handling with user-friendly messages
- ✅ Success/error notifications
- ✅ Professional, modern interface
- ✅ Intuitive navigation with tab-based layout

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd ethara_ai_assignment_vishal
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API URL (for frontend)
REACT_APP_API_URL=http://localhost:5000/api

# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/hrms_lite
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hrms_lite

# Server Port (optional, defaults to 5000)
PORT=5000

# Node Environment
NODE_ENV=development
```

### Step 4: Start MongoDB

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is running locally
mongod
```

**Option B: MongoDB Atlas**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and get your connection string
- Update `MONGODB_URI` in `.env` file

### Step 5: Run the Application

**Development Mode (Frontend + Backend together):**
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

**Or run separately:**

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm start
```

### Step 6: Access the Application

Open your browser and navigate to:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`

## 📁 Project Structure

```
ethara_ai_assignment_vishal/
├── public/                 # Static files
├── src/                    # React frontend source
│   ├── components/         # React components
│   │   ├── EmployeeForm.js
│   │   ├── EmployeeList.js
│   │   ├── AttendanceForm.js
│   │   └── AttendanceList.js
│   ├── services/           # API service layer
│   │   └── api.js
│   ├── App.js              # Main App component
│   ├── App.css
│   └── index.js            # React entry point
├── server/                 # Backend server
│   ├── models/             # MongoDB models
│   │   ├── Employee.js
│   │   └── Attendance.js
│   ├── routes/             # API routes
│   │   ├── employees.js
│   │   └── attendance.js
│   └── index.js            # Express server entry point
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `DELETE /api/employees/:id` - Delete employee

### Attendance
- `GET /api/attendance` - Get all attendance records (with optional query params: `employeeId`, `date`)
- `GET /api/attendance/employee/:employeeId` - Get attendance for specific employee
- `GET /api/attendance/stats/:employeeId` - Get attendance statistics for employee
- `POST /api/attendance` - Mark attendance

### Health Check
- `GET /api/health` - Server health status

## 🚢 Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Build the React app:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   - Install Vercel CLI: `npm i -g vercel`
   - Run: `vercel`
   - Set environment variable: `REACT_APP_API_URL` to your backend URL

3. **Deploy to Netlify:**
   - Connect your GitHub repository
   - Build command: `npm run build`
   - Publish directory: `build`
   - Add environment variable: `REACT_APP_API_URL`

### Backend Deployment (Render/Railway)

1. **Prepare for deployment:**
   - Ensure `MONGODB_URI` is set to MongoDB Atlas (cloud database)
   - Update `server/index.js` to serve static files in production

2. **Deploy to Render:**
   - Create a new Web Service
   - Connect your GitHub repository
   - Build command: `npm install`
   - Start command: `node server/index.js`
   - Add environment variables:
     - `MONGODB_URI`
     - `NODE_ENV=production`
     - `PORT` (auto-assigned by Render)

3. **Deploy to Railway:**
   - Connect your GitHub repository
   - Railway will auto-detect Node.js
   - Add environment variables in the dashboard
   - Deploy automatically

### Database Setup
- Use **MongoDB Atlas** (free tier available) for cloud database
- Update `MONGODB_URI` in your deployment platform's environment variables

## ✅ Assumptions & Limitations

### Assumptions
1. **Single Admin User**: No authentication system is implemented. The application assumes a single admin user accessing the system.
2. **Employee ID Format**: Employee IDs are stored as uppercase strings (e.g., "EMP001").
3. **Date Format**: Attendance dates are stored in ISO format. The frontend displays dates in a user-friendly format.
4. **Timezone**: All dates are stored in UTC. The application assumes the admin is in the same timezone or handles timezone conversion appropriately.

### Limitations
1. **No Authentication**: The application does not include user authentication or authorization. Anyone with access to the URL can manage employees and attendance.
2. **No Edit Employee**: The current implementation only supports adding and deleting employees. Editing employee information is not available.
3. **No Bulk Operations**: Attendance must be marked one record at a time. No bulk import functionality.
4. **No Reports/Export**: Attendance data cannot be exported or generated as reports.
5. **No Leave Management**: Leave requests, approvals, and leave types are not included.
6. **No Payroll Integration**: The system does not integrate with payroll or salary calculations.
7. **No Employee Photos**: Employee profile pictures are not supported.
8. **No Department Management**: Departments are entered as text fields. No separate department management.

### Future Enhancements (Out of Scope)
- User authentication and role-based access control
- Edit employee functionality
- Bulk attendance import
- Advanced reporting and analytics
- Leave management system
- Employee profile photos
- Department management module
- Email notifications
- Dashboard with charts and graphs

## 🧪 Testing

The application includes basic error handling and validation. For production use, consider adding:
- Unit tests for API routes
- Integration tests for frontend components
- End-to-end tests for critical user flows

## 📝 Notes

- The application uses MongoDB for data persistence. Ensure MongoDB is running before starting the server.
- In development, the frontend runs on port 3000 and backend on port 5000.
- CORS is enabled to allow frontend-backend communication.
- All API responses follow RESTful conventions with appropriate HTTP status codes.

## 👨‍💻 Development

### Available Scripts

- `npm start` - Start React development server
- `npm run server` - Start Express backend server
- `npm run dev` - Start both frontend and backend concurrently
- `npm run build` - Build React app for production
- `npm test` - Run tests

## 📄 License

This project is created for assessment purposes.

## 🤝 Support

For issues or questions, please refer to the repository or contact the development team.

---

**Built with ❤️ for HRMS Lite Assignment**
#   e t h a r a _ a i _ f r o o n t e n d  
 #   e t h a r a _ a i _ f r o o n t e n d  
 #   e t h a r a _ a i _ f r o o n t e n d  
 #   e t h a r a _ a i _ f r o n t e n d  
 #   e t h a r a _ a i _ f r o n t e n d  
 #   e t h a r a _ a i _ f r o n t e n d  
 