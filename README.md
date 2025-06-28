# Quiz Application - Frontend

A modern quiz application built with React, TypeScript, Redux Toolkit, and shadcn/ui.

## Features

### User Features

- **Authentication**: Login/Register with JWT tokens
- **Quiz Taking**: Interactive quiz interface with real-time feedback
- **Progress Tracking**: Track quiz attempts and scores
- **Responsive Design**: Works on desktop and mobile devices

### Admin Features

- **Quiz Management**: Create, edit, and delete quizzes
- **Question Management**: Add multiple-choice questions with explanations
- **User Management**: View user statistics and attempts

### Technical Features

- **Redux State Management**: Centralized state with Redux Toolkit
- **TypeScript**: Full type safety
- **Modern UI**: Beautiful components with shadcn/ui
- **Responsive**: Mobile-first design with Tailwind CSS
- **Protected Routes**: Role-based access control

## Technology Stack

- **Frontend Framework**: React 19.1.0
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Build Tool**: Vite

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see backend documentation)

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd quizApp
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**
   The app is configured to connect to `http://localhost:5000/api` by default.
   If your backend runs on a different port, update the `API_URL` in `src/store/slices/authSlice.ts`.

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Usage

### For Regular Users

1. **Register/Login**: Create an account or login with existing credentials
2. **Browse Quizzes**: View available quizzes on the dashboard
3. **Take Quizzes**: Click "Take Quiz" to start a quiz
4. **Answer Questions**: Select answers and navigate through questions
5. **View Results**: See your score and correct answers after completion

### For Admins

1. **Login**: Login with an admin account
2. **Create Quizzes**: Use the "Create New Quiz" button
3. **Add Questions**: Add multiple-choice questions with correct answers
4. **Manage Quizzes**: Edit or delete existing quizzes
5. **View Analytics**: Monitor user attempts and scores

## Building for Production

```bash
npm run build
```

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

This project is for educational purposes as part of the SDN302 assignment.
