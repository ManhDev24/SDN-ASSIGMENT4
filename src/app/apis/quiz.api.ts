import api from "./auth.api";

// Quiz API endpoints
export const quizAPI = {
  // Get all quizzes (public)
  getAllQuizzes: async () => {
    const response = await api.get("/quiz/");
    return response.data;
  },

  // Get quiz by ID (public)
  getQuizById: async (id: string) => {
    const response = await api.get(`/quiz/${id}`);
    return response.data;
  },

  // Get quiz with capital questions (public)
  getQuizWithCapitalQuestions: async (id: string) => {
    const response = await api.get(`/quiz/${id}/populate`);
    return response.data;
  },

  // Create new quiz (admin only)
  createQuiz: async (quizData: {
    title: string;
    description: string;
    questions?: string[];
  }) => {
    const response = await api.post("/quiz/", quizData);
    return response.data;
  },

  // Update quiz (admin only)
  updateQuiz: async (
    id: string,
    quizData: {
      title: string;
      description: string;
      questions?: string[];
    }
  ) => {
    const response = await api.put(`/quiz/${id}`, quizData);
    return response.data;
  },

  // Delete quiz (admin only)
  deleteQuiz: async (id: string) => {
    const response = await api.delete(`/quiz/${id}`);
    return response.data;
  },

  // Add single question to quiz (admin only)
  addQuestionToQuiz: async (
    quizId: string,
    questionData: {
      text: string;
      options: string[];
      keywords: string[];
      correctAnswerIndex: number;
    }
  ) => {
    const response = await api.post(`/quiz/${quizId}/question`, questionData);
    return response.data;
  },

  // Add multiple questions to quiz (admin only)
  addMultipleQuestionsToQuiz: async (
    quizId: string,
    questions: Array<{
      text: string;
      options: string[];
      keywords: string[];
      correctAnswerIndex: number;
    }>
  ) => {
    const response = await api.post(`/quiz/${quizId}/questions`, { questions });
    return response.data;
  },
};
