import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Users, Trophy, ArrowRight } from "lucide-react";

const LandingPage: React.FC = () => {
  const { user, token } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (token && user) {
      navigate("/dashboard");
    }
  }, [token, user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">QuizApp</h1>
            </div>
            <div className="space-x-4">
              <Button variant="outline" onClick={() => navigate("/login")}>
                Sign In
              </Button>
              <Button onClick={() => navigate("/register")}>Sign Up</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-6xl">
            Master Your Knowledge with
            <span className="text-primary"> Interactive Quizzes</span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Test your knowledge, track your progress, and compete with others.
            Create custom quizzes or take existing ones to enhance your learning
            experience.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" onClick={() => navigate("/register")}>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Interactive Quizzes</CardTitle>
              <CardDescription>
                Take engaging quizzes with instant feedback and detailed
                explanations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Multiple choice questions</li>
                <li>• Real-time scoring</li>
                <li>• Detailed explanations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Role-Based Access</CardTitle>
              <CardDescription>
                Different experiences for admins and regular users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Admin quiz creation</li>
                <li>• User quiz taking</li>
                <li>• Progress tracking</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Trophy className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Track Progress</CardTitle>
              <CardDescription>
                Monitor your learning journey with detailed analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Score tracking</li>
                <li>• Performance analytics</li>
                <li>• Achievement badges</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="py-12">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Start Learning?
              </h3>
              <p className="text-lg opacity-90 mb-6">
                Join thousands of learners improving their knowledge every day
              </p>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/register")}
              >
                Create Your Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 QuizApp. Built with React, Redux, and shadcn/ui.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
