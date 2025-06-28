# Quiz App - Frontend & Backend Integration

Đây là project Quiz App với backend Node.js/Express/MongoDB và frontend React/TypeScript/Vite.

## Cấu trúc project:

### Backend (QuizzApp/)

- **Node.js + Express + MongoDB**
- **Authentication**: JWT với bcrypt
- **Models**: User, Quiz, Question
- **Port**: 3000

### Frontend (Assigment4/quizApp/)

- **React + TypeScript + Vite**
- **State Management**: Redux Toolkit
- **UI**: Tailwind CSS + Radix UI
- **Port**: 5173

## Cách chạy project:

### 1. Backend (QuizzApp):

```bash
cd QuizzApp
npm install
npm start
```

**Lưu ý**: Cần tạo file `.env` với nội dung:

```
PORT=3000
DB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 2. Frontend (Assigment4/quizApp):

```bash
cd Assigment4/quizApp
npm install
npm run dev
```

## API Endpoints:

### User APIs:

- **POST** `/users/register` - Đăng ký (public)
- **POST** `/users/login` - Đăng nhập (public)
- **GET** `/users/me` - Lấy thông tin user hiện tại (auth required)
- **GET** `/users/` - Lấy tất cả users (admin only)

### Quiz APIs:

- **GET** `/quiz/` - Lấy tất cả quizzes (public)
- **GET** `/quiz/:id` - Lấy quiz theo ID (public)
- **GET** `/quiz/:id/populate` - Lấy quiz với câu hỏi có keyword "capital" (public)
- **POST** `/quiz/` - Tạo quiz mới (admin only)
- **PUT** `/quiz/:id` - Cập nhật quiz (admin only)
- **DELETE** `/quiz/:id` - Xóa quiz (admin only)
- **POST** `/quiz/:id/question` - Thêm câu hỏi vào quiz (admin only)
- **POST** `/quiz/:id/questions` - Thêm nhiều câu hỏi vào quiz (admin only)

### Question APIs:

- **GET** `/questions/` - Lấy tất cả câu hỏi (public)
- **GET** `/questions/:id` - Lấy câu hỏi theo ID (public)
- **POST** `/questions/` - Tạo câu hỏi mới (auth required)
- **PUT** `/questions/:id` - Cập nhật câu hỏi (chỉ author)
- **DELETE** `/questions/:id` - Xóa câu hỏi (chỉ author)

## Cấu trúc dữ liệu:

### User:

```javascript
{
  _id: ObjectId,
  username: String (optional),
  email: String (required, unique),
  password: String (hashed),
  admin: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Quiz:

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  questions: [ObjectId] (refs to Question),
  createdAt: Date,
  updatedAt: Date
}
```

### Question:

```javascript
{
  _id: ObjectId,
  text: String (required),
  author: ObjectId (ref to User),
  options: [String] (required),
  keywords: [String] (required),
  correctAnswerIndex: Number (required)
}
```

## Authentication:

- **JWT token** được lưu trong localStorage
- **Authorization header**: `Bearer <token>`
- **Admin role**: `user.admin = true`

## Tính năng đã cập nhật:

### Frontend:

✅ API service layer với axios interceptors
✅ Redux slices cho auth, quiz, question
✅ Updated User type với admin boolean
✅ Protected routes với admin check
✅ AuthProvider với auto login check
✅ CreateQuizPage với backend integration
✅ Dashboard với admin panel

### Backend:

✅ User authentication với JWT
✅ Admin middleware protection
✅ CORS configured cho frontend
✅ Question author verification
✅ Quiz management endpoints
✅ Capital questions filtering

## URL Frontend:

- **Login**: http://localhost:5173/login
- **Register**: http://localhost:5173/register
- **Dashboard**: http://localhost:5173/dashboard
- **Create Quiz** (admin): http://localhost:5173/admin/quiz/create

## Tài khoản test:

Tạo admin user qua API hoặc database:

```javascript
{
  email: "admin@test.com",
  password: "password123",
  admin: true
}
```
