import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchQuizzes } from "@/store/slices/quizSlice";
import { logoutUser } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Users, Plus, LogOut } from "lucide-react";

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { quizzes, isLoading } = useAppSelector((state) => state.quiz);
  console.log("quizzes: ", quizzes);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const handleTakeQuiz = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleCreateQuiz = () => {
    navigate("/admin/quiz/create");
  };

  const handleManageQuestions = () => {
    navigate("/questions");
  };

  const handleManageQuizzes = () => {
    // Scroll to quiz list section in the same page
    const quizListElement = document.getElementById("quiz-list-section");
    if (quizListElement) {
      quizListElement.scrollIntoView({ behavior: "smooth" });
      // Add a temporary highlight effect
      quizListElement.classList.add(
        "ring-2",
        "ring-blue-500",
        "ring-opacity-50"
      );
      setTimeout(() => {
        quizListElement.classList.remove(
          "ring-2",
          "ring-blue-500",
          "ring-opacity-50"
        );
      }, 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Quiz Dashboard</h1>{" "}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Welcome,{" "}
                <span className="font-medium">
                  {user?.username || user?.email}
                </span>
                <Badge
                  variant={user?.admin ? "default" : "secondary"}
                  className="ml-2"
                >
                  {user?.admin ? "admin" : "user"}
                </Badge>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Question Bank - Available for all users */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Question Bank</CardTitle>
              <CardDescription>
                Browse and manage quiz questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={handleManageQuestions}
                className="cursor-pointer bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Browse Questions
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Admin Controls */}
        {user?.admin && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Admin Panel</CardTitle>
                <CardDescription>
                  Manage quizzes and view analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button onClick={handleCreateQuiz} className="cursor-pointer">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Quiz
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleManageQuizzes}
                    className="cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Manage Quizzes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quiz Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Quizzes
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quizzes?.quizzes?.length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Available Quizzes
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quizzes?.quizzes?.length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Role</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {user?.admin ? "admin" : "user"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quizzes Grid */}
        <div
          className="space-y-6 rounded-lg transition-all duration-300"
          id="quiz-list-section"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Available Quizzes
            </h2>
            {user?.admin && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Admin View
              </Badge>
            )}
          </div>
          {!quizzes?.quizzes || quizzes.quizzes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No quizzes available
                </h3>
                <p className="text-muted-foreground text-center">
                  {user?.admin
                    ? "Create your first quiz to get started."
                    : "Check back later for new quizzes."}
                </p>
                {user?.admin && (
                  <Button
                    className="mt-4 cursor-pointer"
                    onClick={handleCreateQuiz}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Quiz
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.quizzes.map((quiz) => (
                <Card
                  key={quiz._id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{quiz.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {quiz.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        {quiz.questions.length} questions
                      </div>
                      <Badge variant="secondary">
                        {quiz.questions.length * 2} min
                      </Badge>
                    </div>
                    <Button
                      className="w-full cursor-pointer"
                      onClick={() => handleTakeQuiz(quiz._id)}
                    >
                      Take Quiz
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
