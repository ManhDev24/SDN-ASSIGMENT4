import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  fetchQuestions,
  deleteQuestion,
  createQuestion,
  updateQuestion,
} from "@/store/slices/questionSlice";
import { fetchQuizzes } from "@/store/slices/quizSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Search,
  ArrowLeft,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { Question } from "@/types";

interface QuestionFormData {
  text: string;
  options: string[];
  keywords: string[];
  correctAnswerIndex: number;
}

const ManageQuestionsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { questions, isLoading } = useAppSelector((state) => state.question);
  const { quizzes } = useAppSelector((state) => state.quiz);
  const { user } = useAppSelector((state) => state.auth);

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKeyword, setSelectedKeyword] = useState("");

  // State for create/edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState<QuestionFormData>({
    text: "",
    options: ["", "", "", ""],
    keywords: [],
    correctAnswerIndex: 0,
  });

  useEffect(() => {
    dispatch(fetchQuestions());
    dispatch(fetchQuizzes());
  }, [dispatch]);

  // Function to check if current user can edit/delete a question
  const canEditQuestion = (question: Question) => {
    if (!user) return false;

    // Only the author can edit/delete their questions
    const questionAuthorId =
      typeof question.author === "object"
        ? question.author._id
        : question.author;

    return user._id === questionAuthorId;
  };

  // Function to find quizzes that contain a specific question
  const getQuizzesContainingQuestion = (questionId: string) => {
    if (!quizzes?.quizzes) return [];

    return quizzes.quizzes.filter((quiz) =>
      quiz.questions.some((q) =>
        typeof q === "string" ? q === questionId : q._id === questionId
      )
    );
  };

  // Filter questions based on search and keyword
  const filteredQuestions =
    questions?.filter((question: Question) => {
      const matchesSearch = question.text
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesKeyword =
        selectedKeyword === "" || question.keywords.includes(selectedKeyword);
      return matchesSearch && matchesKeyword;
    }) || [];

  // Get all unique keywords
  const allKeywords = Array.from(
    new Set(questions?.flatMap((q: Question) => q.keywords) || [])
  ) as string[];

  const handleCreateQuestion = () => {
    setEditingQuestion(null);
    setFormData({
      text: "",
      options: ["", "", "", ""],
      keywords: [],
      correctAnswerIndex: 0,
    });
    setIsModalOpen(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      text: question.text,
      options: [...question.options],
      keywords: [...question.keywords],
      correctAnswerIndex: question.correctAnswerIndex,
    });
    setIsModalOpen(true);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    const usedInQuizzes = getQuizzesContainingQuestion(questionId);

    let confirmMessage = "Are you sure you want to delete this question?";
    if (usedInQuizzes.length > 0) {
      const quizTitles = usedInQuizzes.map((q) => q.title).join(", ");
      confirmMessage = `⚠️ WARNING: This question is currently used in ${
        usedInQuizzes.length
      } quiz${
        usedInQuizzes.length > 1 ? "es" : ""
      }: ${quizTitles}\n\nDeleting this question will remove it from these quizzes and may affect existing quiz attempts.\n\nAre you sure you want to continue?`;
    }

    if (window.confirm(confirmMessage)) {
      try {
        await dispatch(deleteQuestion(questionId)).unwrap();
        toast.success("Question deleted successfully!");
        dispatch(fetchQuestions());
        dispatch(fetchQuizzes()); // Refresh quizzes to update the relationship
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to delete question";
        toast.error(errorMessage);
      }
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.text.trim()) {
      toast.error("Question text is required");
      return;
    }

    if (formData.options.some((option) => !option.trim())) {
      toast.error("All options must be filled");
      return;
    }

    try {
      if (editingQuestion) {
        await dispatch(
          updateQuestion({
            id: editingQuestion._id,
            questionData: formData,
          })
        ).unwrap();
        toast.success("Question updated successfully!");
      } else {
        await dispatch(createQuestion(formData)).unwrap();
        toast.success("Question created successfully!");
      }

      setIsModalOpen(false);
      dispatch(fetchQuestions());
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create/update question";
      toast.error(editingQuestion ? "Failed to update question" : errorMessage);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleKeywordsChange = (value: string) => {
    const keywords = value
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k);
    setFormData({ ...formData, keywords });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You need to be logged in to access this page.
            </p>
            <Button onClick={() => navigate("/login")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="h-6 border-l border-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Question Bank
                </h1>
                <p className="text-sm text-gray-500">
                  Browse, create, and manage your quiz questions
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {filteredQuestions.length} Questions
              </Badge>
              {(() => {
                const usedQuestions = filteredQuestions.filter(
                  (q) => getQuizzesContainingQuestion(q._id).length > 0
                );
                return (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    {usedQuestions.length} Used in Quizzes
                  </Badge>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={selectedKeyword}
                onChange={(e) => setSelectedKeyword(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Keywords</option>
                {allKeywords.map((keyword) => (
                  <option key={keyword} value={keyword}>
                    {keyword}
                  </option>
                ))}
              </select>

              <Button
                onClick={handleCreateQuestion}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Question
              </Button>
            </div>
          </div>
        </div>

        {/* Questions Grid */}
        {filteredQuestions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No questions found</h3>
              <p className="text-gray-500 text-center mb-4">
                {searchTerm || selectedKeyword
                  ? "Try adjusting your search criteria."
                  : "Create your first question to get started."}
              </p>
              {!searchTerm && !selectedKeyword && (
                <Button onClick={handleCreateQuestion}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Question
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuestions.map((question: Question) => (
              <Card
                key={question._id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-medium line-clamp-2">
                      {question.text}
                    </CardTitle>
                    <div className="flex gap-1 ml-2">
                      {canEditQuestion(question) ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditQuestion(question)}
                            className="h-8 w-8 p-0"
                            title="Edit question (Author only)"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteQuestion(question._id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            title="Delete question (Author only)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <div className="text-xs text-gray-400 px-2 py-1">
                          Author only
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Options */}
                  <div className="space-y-1">
                    {question.options.map((option: string, index: number) => (
                      <div
                        key={index}
                        className={`text-xs p-2 rounded border ${
                          index === question.correctAnswerIndex
                            ? "bg-green-50 border-green-200 text-green-800"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <span className="font-medium">
                          {String.fromCharCode(65 + index)}.
                        </span>{" "}
                        {option}
                        {index === question.correctAnswerIndex && (
                          <CheckCircle className="inline w-3 h-3 ml-1" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Keywords */}
                  {question.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {question.keywords.map(
                        (keyword: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {keyword}
                          </Badge>
                        )
                      )}
                    </div>
                  )}

                  {/* Author */}
                  <div className="text-xs text-gray-500">
                    By:{" "}
                    {question.author &&
                    typeof question.author === "object" &&
                    question.author.username
                      ? question.author.username
                      : question.author && typeof question.author === "string"
                      ? question.author
                      : "Unknown"}
                  </div>

                  {/* Used in Quizzes */}
                  {(() => {
                    const usedInQuizzes = getQuizzesContainingQuestion(
                      question._id
                    );
                    return usedInQuizzes.length > 0 ? (
                      <div className="mt-2 p-2 bg-green-50 rounded-md border border-green-200">
                        <div className="flex items-center text-xs text-green-700 mb-1">
                          <FileText className="w-3 h-3 mr-1" />
                          Used in {usedInQuizzes.length} quiz
                          {usedInQuizzes.length > 1 ? "es" : ""}:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {usedInQuizzes.map((quiz) => (
                            <Badge
                              key={quiz._id}
                              variant="outline"
                              className="text-xs bg-green-100 border-green-300 text-green-800 hover:bg-green-200 cursor-pointer"
                              title={`Click to view quiz: ${quiz.title}`}
                              onClick={() => navigate(`/quiz/${quiz._id}`)}
                            >
                              {quiz.title.length > 20
                                ? `${quiz.title.substring(0, 20)}...`
                                : quiz.title}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 p-2 bg-yellow-50 rounded-md border border-yellow-200">
                        <div className="flex items-center text-xs text-yellow-700">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Not used in any quiz yet
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {editingQuestion ? "Edit Question" : "Create New Question"}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmitForm} className="space-y-6">
                {/* Question Text */}
                <div>
                  <Label htmlFor="questionText" className="text-sm font-medium">
                    Question Text *
                  </Label>
                  <textarea
                    id="questionText"
                    value={formData.text}
                    onChange={(e) =>
                      setFormData({ ...formData, text: e.target.value })
                    }
                    className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Enter your question..."
                    required
                  />
                </div>

                {/* Options */}
                <div>
                  <Label className="text-sm font-medium">
                    Answer Options *
                  </Label>
                  <div className="mt-2 space-y-3">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={formData.correctAnswerIndex === index}
                            onChange={() =>
                              setFormData({
                                ...formData,
                                correctAnswerIndex: index,
                              })
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="ml-2 text-sm font-medium">
                            {String.fromCharCode(65 + index)}.
                          </span>
                        </div>
                        <Input
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(index, e.target.value)
                          }
                          placeholder={`Option ${String.fromCharCode(
                            65 + index
                          )}`}
                          className="flex-1"
                          required
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Select the radio button for the correct answer
                  </p>
                </div>

                {/* Keywords */}
                <div>
                  <Label htmlFor="keywords" className="text-sm font-medium">
                    Keywords (comma-separated)
                  </Label>
                  <Input
                    id="keywords"
                    value={formData.keywords.join(", ")}
                    onChange={(e) => handleKeywordsChange(e.target.value)}
                    placeholder="e.g., javascript, programming, frontend"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Add keywords to help categorize this question
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingQuestion ? "Update Question" : "Create Question"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuestionsPage;
