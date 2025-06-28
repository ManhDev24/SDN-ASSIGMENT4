import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./ProtectedRoutes";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import QuizPage from "@/pages/QuizPage";
import CreateQuizPage from "@/pages/admin/CreateQuizPage";
import ManageQuestionsPage from "@/pages/admin/ManageQuestionsPage";

const Mainroutes = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:quizId"
          element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Only Routes */}
        <Route
          path="/admin/quiz/create"
          element={
            <ProtectedRoute adminOnly>
              <CreateQuizPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - All authenticated users */}
        <Route
          path="/questions"
          element={
            <ProtectedRoute>
              <ManageQuestionsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default Mainroutes;
