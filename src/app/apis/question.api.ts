import api from "./auth.api";

// Question API endpoints
export const questionAPI = {
  // Get all questions (public)
  getAllQuestions: async () => {
    const response = await api.get("/questions/");
    return response.data;
  },

  // Get question by ID (public)
  getQuestionById: async (id: string) => {
    const response = await api.get(`/questions/${id}`);
    return response.data;
  },

  // Create new question (authenticated users)
  createQuestion: async (questionData: {
    text: string;
    options: string[];
    keywords: string[];
    correctAnswerIndex: number;
  }) => {
    const response = await api.post("/questions/", questionData);
    return response.data;
  },

  // Update question (author only)
  updateQuestion: async (
    id: string,
    questionData: {
      text: string;
      options: string[];
      keywords: string[];
      correctAnswerIndex: number;
    }
  ) => {
    const response = await api.put(`/questions/${id}`, questionData);
    return response.data;
  },

  // Delete question (author only)
  deleteQuestion: async (id: string) => {
    const response = await api.delete(`/questions/${id}`);
    return response.data;
  },
};
