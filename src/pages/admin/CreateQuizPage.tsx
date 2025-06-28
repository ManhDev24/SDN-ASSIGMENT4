import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/redux";
import {
  createQuiz,
  addMultipleQuestionsToQuiz,
} from "@/store/slices/quizSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

interface QuestionForm {
  text: string;
  options: string[];
  keywords: string[];
  correctAnswerIndex: number;
}

const CreateQuizPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<QuestionForm[]>([
    {
      text: "",
      options: ["", "", "", ""],
      keywords: [],
      correctAnswerIndex: 0,
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        options: ["", "", "", ""],
        keywords: [],
        correctAnswerIndex: 0,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (
    index: number,
    field: keyof QuestionForm,
    value: string | number | string[]
  ) => {
    const updatedQuestions = [...questions];
    if (field === "correctAnswerIndex") {
      updatedQuestions[index][field] = value as number;
    } else if (field === "text") {
      updatedQuestions[index][field] = value as string;
    } else if (field === "keywords") {
      updatedQuestions[index][field] = value as string[];
    }
    setQuestions(updatedQuestions);
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // First create the quiz without questions
      const quizResult = await dispatch(
        createQuiz({
          title,
          description,
        })
      );

      if (createQuiz.fulfilled.match(quizResult)) {
        const quizId = quizResult.payload.quiz._id;

        // Then add questions to the quiz if there are any valid questions
        const validQuestions = questions.filter(
          (q) =>
            q.text.trim() &&
            q.options.every((opt) => opt.trim()) &&
            q.correctAnswerIndex >= 0 &&
            q.correctAnswerIndex < 4
        );

        if (validQuestions.length > 0) {
          await dispatch(
            addMultipleQuestionsToQuiz({
              quizId,
              questions: validQuestions,
            })
          );
        }

        toast.success("Quiz created successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Failed to create quiz:", error);
      toast.error("Failed to create quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    title.trim() &&
    description.trim() &&
    questions.every(
      (q) =>
        q.text.trim() &&
        q.options.every((opt) => opt.trim()) &&
        q.correctAnswerIndex >= 0 &&
        q.correctAnswerIndex < 4
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Create New Quiz</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Quiz Basic Info */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quiz Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Quiz Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter quiz title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter quiz description"
                  className="w-full p-3 border border-input rounded-md resize-none h-24"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <div className="space-y-6">
            {questions.map((question, questionIndex) => (
              <Card key={questionIndex}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">
                    Question {questionIndex + 1}
                  </CardTitle>
                  {questions.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeQuestion(questionIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Question Text</Label>
                    <Input
                      value={question.text}
                      onChange={(e) =>
                        updateQuestion(questionIndex, "text", e.target.value)
                      }
                      placeholder="Enter your question"
                      required
                    />
                  </div>

                  <div>
                    <Label>Answer Options</Label>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="radio"
                            name={`question-${questionIndex}-correct`}
                            checked={
                              question.correctAnswerIndex === optionIndex
                            }
                            onChange={() =>
                              updateQuestion(
                                questionIndex,
                                "correctAnswerIndex",
                                optionIndex
                              )
                            }
                            className="w-4 h-4 text-primary"
                          />
                          <Input
                            value={option}
                            onChange={(e) =>
                              updateOption(
                                questionIndex,
                                optionIndex,
                                e.target.value
                              )
                            }
                            placeholder={`Option ${optionIndex + 1}`}
                            required
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Select the radio button next to the correct answer
                    </p>
                  </div>

                  <div>
                    <Label>Keywords (comma-separated)</Label>
                    <Input
                      value={question.keywords.join(", ")}
                      onChange={(e) =>
                        updateQuestion(
                          questionIndex,
                          "keywords",
                          e.target.value
                            .split(",")
                            .map((k) => k.trim())
                            .filter((k) => k)
                        )
                      }
                      placeholder="e.g., history, capital, geography"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Question Button */}
          <div className="mt-8 flex justify-center">
            <Button type="button" variant="outline" onClick={addQuestion}>
              <Plus className="w-4 h-4 mr-2" />
              Add Another Question
            </Button>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? "Creating Quiz..." : "Create Quiz"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuizPage;
