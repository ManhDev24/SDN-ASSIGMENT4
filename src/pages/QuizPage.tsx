import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  fetchQuizById,
  startQuizAttempt,
  setAnswer,
  nextQuestion,
  previousQuestion,
  finishQuizAttempt,
} from "@/store/slices/quizSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  Trophy,
  Target,
  Home,
  BookOpen,
  Send,
} from "lucide-react";

const QuizPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentQuiz, currentQuizAttempt, isLoading } = useAppSelector(
    (state) => state.quiz
  );
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<{
    score: number;
    correct: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    if (quizId) {
      dispatch(fetchQuizById(quizId));
    }
  }, [dispatch, quizId]);

  useEffect(() => {
    if (currentQuiz && !currentQuizAttempt) {
      dispatch(startQuizAttempt(currentQuiz));
    }
  }, [currentQuiz, currentQuizAttempt, dispatch]);

  useEffect(() => {
    if (currentQuizAttempt && currentQuiz) {
      const currentAnswer =
        currentQuizAttempt.answers[currentQuizAttempt.currentQuestionIndex];
      console.log(
        "Restoring answer for question",
        currentQuizAttempt.currentQuestionIndex,
        ":",
        currentAnswer
      );
      setSelectedAnswer(currentAnswer);
    }
  }, [currentQuizAttempt, currentQuiz]);

  const handleAnswerSelect = (answerIndex: number) => {
    console.log("Answer selected:", answerIndex);
    setSelectedAnswer(answerIndex);
    if (currentQuizAttempt) {
      console.log("Dispatching setAnswer:", {
        questionIndex: currentQuizAttempt.currentQuestionIndex,
        answer: answerIndex,
      });
      dispatch(
        setAnswer({
          questionIndex: currentQuizAttempt.currentQuestionIndex,
          answer: answerIndex,
        })
      );
    }
  };

  const handleNext = () => {
    dispatch(nextQuestion());
  };

  const handlePrevious = () => {
    dispatch(previousQuestion());
  };

  const handleSubmit = () => {
    if (currentQuizAttempt && currentQuiz) {
      console.log("Starting quiz submission...");
      console.log("Current quiz:", currentQuiz);
      console.log("Current answers:", currentQuizAttempt.answers);

      const answers = currentQuizAttempt.answers;

      // Calculate score locally
      let correct = 0;
      currentQuiz.questions.forEach((question, index) => {
        console.log(`Question ${index}:`, {
          question: question.text,
          userAnswer: answers[index],
          correctAnswer: question.correctAnswerIndex,
          isCorrect: answers[index] === question.correctAnswerIndex,
        });

        if (answers[index] === question.correctAnswerIndex) {
          correct++;
        }
      });

      const score = Math.round((correct / currentQuiz.questions.length) * 100);

      console.log("Final results:", {
        score,
        correct,
        total: currentQuiz.questions.length,
      });

      // Update states immediately
      const finalResults = {
        score,
        correct,
        total: currentQuiz.questions.length,
      };
      setResults(finalResults);
      setShowResults(true);

      // Don't dispatch finishQuizAttempt immediately to avoid clearing states
      // dispatch(finishQuizAttempt());

      console.log("States updated, should show results now");
    }
  };

  const handleBackToDashboard = () => {
    // Clear quiz state when going back to dashboard
    dispatch(finishQuizAttempt());
    navigate("/dashboard");
  };

  // Debug logging
  console.log("Render state:", {
    showResults,
    results,
    isLoading,
    hasCurrentQuiz: !!currentQuiz,
    hasCurrentQuizAttempt: !!currentQuizAttempt,
  });

  if (showResults && results) {
    const getScoreColor = (score: number) => {
      if (score >= 80) return "text-green-600";
      if (score >= 60) return "text-yellow-600";
      return "text-red-600";
    };

    const getScoreBg = (score: number) => {
      if (score >= 80) return "bg-green-50 border-green-200";
      if (score >= 60) return "bg-yellow-50 border-yellow-200";
      return "bg-red-50 border-red-200";
    };

    const getScoreMessage = (score: number) => {
      if (score >= 90) return "Outstanding! 🎉";
      if (score >= 80) return "Great job! 👏";
      if (score >= 70) return "Good work! 👍";
      if (score >= 60) return "Not bad! 🙂";
      return "Keep practicing! 💪";
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Congratulations Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-6 shadow-xl animate-bounce">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
              Quiz Completed!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {getScoreMessage(results.score)}
            </p>
          </div>

          {/* Main Results Card */}
          <Card className="mb-8 shadow-2xl border-0 overflow-hidden backdrop-blur-sm bg-white/95">
            <CardContent className="p-8 sm:p-10">
              {/* Score Display */}
              <div
                className={`text-center p-8 sm:p-10 rounded-2xl border-2 mb-8 ${getScoreBg(
                  results.score
                )} transform transition-all duration-500 hover:scale-[1.02]`}
              >
                <div
                  className={`text-6xl sm:text-7xl font-bold ${getScoreColor(
                    results.score
                  )} mb-3 animate-pulse`}
                >
                  {results.score}%
                </div>
                <div className="text-lg sm:text-xl text-gray-600 font-medium">
                  Your Final Score
                </div>
                <div className="mt-4 w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto"></div>
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <Target className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-blue-700 mb-2">
                    {results.correct}
                  </div>
                  <div className="text-sm text-blue-600 font-medium">
                    Correct Answers
                  </div>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <BookOpen className="w-10 h-10 text-purple-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-purple-700 mb-2">
                    {results.total}
                  </div>
                  <div className="text-sm text-purple-600 font-medium">
                    Total Questions
                  </div>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <Clock className="w-10 h-10 text-orange-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-orange-700 mb-2">
                    {Math.round((results.correct / results.total) * 100)}%
                  </div>
                  <div className="text-sm text-orange-600 font-medium">
                    Accuracy Rate
                  </div>
                </div>
              </div>

              {/* Motivational Message */}
              <div className="text-center mb-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {results.score >= 90
                    ? "Exceptional performance! You've mastered this topic completely."
                    : results.score >= 80
                    ? "Excellent work! You have a strong understanding of this material."
                    : results.score >= 70
                    ? "Good job! You're on the right track with solid knowledge."
                    : results.score >= 60
                    ? "Not bad! Consider reviewing the material to strengthen your understanding."
                    : "Keep studying! Practice makes perfect, and you'll improve with time."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleBackToDashboard}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                  size="lg"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Back to Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="px-8 py-4 text-lg border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 font-medium shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                  size="lg"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Retake Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading || !currentQuiz || !currentQuizAttempt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const currentQuestion =
    currentQuiz.questions[currentQuizAttempt.currentQuestionIndex];
  const progress =
    ((currentQuizAttempt.currentQuestionIndex + 1) /
      currentQuiz.questions.length) *
    100;
  const isLastQuestion =
    currentQuizAttempt.currentQuestionIndex ===
    currentQuiz.questions.length - 1;
  const isFirstQuestion = currentQuizAttempt.currentQuestionIndex === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Top Navigation Bar */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="h-6 border-l border-gray-300"></div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {currentQuiz.title}
                </h1>
                <p className="text-sm text-gray-500">
                  {currentQuiz.description}
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium"
            >
              {currentQuizAttempt.currentQuestionIndex + 1} of{" "}
              {currentQuiz.questions.length}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700">
              Quiz Progress
            </span>
            <span className="text-sm text-gray-500 font-medium">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-3 bg-gray-200" />
          <div className="mt-2 text-xs text-gray-500 text-center">
            {currentQuizAttempt.currentQuestionIndex + 1} questions answered out
            of {currentQuiz.questions.length}
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-8 shadow-xl border-0 overflow-hidden backdrop-blur-sm bg-white/95">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6">
            <div className="flex items-center justify-between text-white">
              <div className="flex-1">
                <h2 className="text-lg font-medium mb-1">
                  Question {currentQuizAttempt.currentQuestionIndex + 1}
                </h2>
                <p className="text-blue-100 text-sm">
                  Choose the best answer below
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold opacity-90">
                  {currentQuizAttempt.currentQuestionIndex + 1}
                </div>
                <div className="text-xs text-blue-200">
                  of {currentQuiz.questions.length}
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-8 leading-relaxed">
              {currentQuestion.text}
            </h3>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`
                    group relative cursor-pointer p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 
                    transform hover:scale-[1.01] active:scale-[0.99]
                    ${
                      selectedAnswer === index
                        ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg shadow-blue-100"
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50 hover:shadow-md"
                    }
                  `}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-4">
                      <div
                        className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                          ${
                            selectedAnswer === index
                              ? "border-blue-500 bg-blue-500 shadow-lg"
                              : "border-gray-300 group-hover:border-blue-400 group-hover:shadow-sm"
                          }
                        `}
                      >
                        {selectedAnswer === index && (
                          <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <span
                        className={`
                        text-base sm:text-lg font-medium transition-colors duration-300
                        ${
                          selectedAnswer === index
                            ? "text-blue-900"
                            : "text-gray-700 group-hover:text-gray-900"
                        }
                      `}
                      >
                        <span className="font-bold text-gray-500 mr-2">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        {option}
                      </span>
                    </div>
                    {selectedAnswer === index && (
                      <div className="flex-shrink-0 ml-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstQuestion}
            className="w-full sm:w-auto px-6 py-3 font-medium border-2 hover:bg-gray-50 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous Question
          </Button>

          <div className="flex gap-3 w-full sm:w-auto">
            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className={`
                  w-full sm:w-auto px-8 py-3 font-medium min-w-[160px] transition-all duration-300
                  ${
                    selectedAnswer === null
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  } text-white
                `}
              >
                <Send className="w-4 h-4 mr-2" />
                {selectedAnswer === null
                  ? "Select Answer First"
                  : "Submit Quiz"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={selectedAnswer === null}
                className={`
                  w-full sm:w-auto px-8 py-3 font-medium min-w-[160px] transition-all duration-300
                  ${
                    selectedAnswer === null
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  } text-white
                `}
              >
                {selectedAnswer === null
                  ? "Select Answer First"
                  : "Next Question"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Helper Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {selectedAnswer === null
              ? "Please select an answer to continue"
              : isLastQuestion
              ? "Ready to submit your quiz? Click Submit Quiz when you're confident with your answers."
              : "Click Next Question to proceed, or Previous to review your answers."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
