import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { QuizState, Quiz } from "@/types";
import { quizAPI } from "@/app/apis";

export const fetchQuizzes = createAsyncThunk(
  "quiz/fetchQuizzes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await quizAPI.getAllQuizzes();
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch quizzes";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchQuizById = createAsyncThunk(
  "quiz/fetchQuizById",
  async (quizId: string, { rejectWithValue }) => {
    try {
      const response = await quizAPI.getQuizById(quizId);
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch quiz";
      return rejectWithValue(errorMessage);
    }
  }
);

export const createQuiz = createAsyncThunk(
  "quiz/createQuiz",
  async (
    quizData: { title: string; description: string; questions?: string[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await quizAPI.createQuiz(quizData);
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create quiz";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateQuiz = createAsyncThunk(
  "quiz/updateQuiz",
  async (
    {
      id,
      title,
      description,
      questions,
    }: { id: string; title: string; description: string; questions?: string[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await quizAPI.updateQuiz(id, {
        title,
        description,
        questions,
      });
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update quiz";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteQuiz = createAsyncThunk(
  "quiz/deleteQuiz",
  async (quizId: string, { rejectWithValue }) => {
    try {
      await quizAPI.deleteQuiz(quizId);
      return quizId;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete quiz";
      return rejectWithValue(errorMessage);
    }
  }
);

// Add question to quiz
export const addQuestionToQuiz = createAsyncThunk(
  "quiz/addQuestionToQuiz",
  async (
    {
      quizId,
      questionData,
    }: {
      quizId: string;
      questionData: {
        text: string;
        options: string[];
        keywords: string[];
        correctAnswerIndex: number;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await quizAPI.addQuestionToQuiz(quizId, questionData);
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to add question to quiz";
      return rejectWithValue(errorMessage);
    }
  }
);

// Add multiple questions to quiz
export const addMultipleQuestionsToQuiz = createAsyncThunk(
  "quiz/addMultipleQuestionsToQuiz",
  async (
    {
      quizId,
      questions,
    }: {
      quizId: string;
      questions: Array<{
        text: string;
        options: string[];
        keywords: string[];
        correctAnswerIndex: number;
      }>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await quizAPI.addMultipleQuestionsToQuiz(
        quizId,
        questions
      );
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to add questions to quiz";
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState: QuizState = {
  quizzes: null,
  currentQuiz: null,
  currentQuizAttempt: null,
  isLoading: false,
  error: null,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    startQuizAttempt: (state, action: PayloadAction<Quiz>) => {
      console.log("action: ", action);
      state.currentQuiz = action.payload;
      state.currentQuizAttempt = {
        answers: new Array(action.payload.questions.length).fill(null),
        currentQuestionIndex: 0,
        startTime: new Date(),
      };
    },
    setAnswer: (
      state,
      action: PayloadAction<{ questionIndex: number; answer: number }>
    ) => {
      if (state.currentQuizAttempt) {
        state.currentQuizAttempt.answers[action.payload.questionIndex] =
          action.payload.answer;
      }
    },
    nextQuestion: (state) => {
      if (state.currentQuizAttempt && state.currentQuiz) {
        const nextIndex = state.currentQuizAttempt.currentQuestionIndex + 1;
        if (nextIndex < state.currentQuiz.questions.length) {
          state.currentQuizAttempt.currentQuestionIndex = nextIndex;
        }
      }
    },
    previousQuestion: (state) => {
      if (state.currentQuizAttempt) {
        const prevIndex = state.currentQuizAttempt.currentQuestionIndex - 1;
        if (prevIndex >= 0) {
          state.currentQuizAttempt.currentQuestionIndex = prevIndex;
        }
      }
    },
    finishQuizAttempt: (state) => {
      state.currentQuiz = null;
      state.currentQuizAttempt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Quizzes
      .addCase(fetchQuizzes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Quiz by ID
      .addCase(
        fetchQuizById.fulfilled,
        (state, action: PayloadAction<{ quiz: Quiz }>) => {
          state.currentQuiz = action.payload.quiz;
        }
      )
      // Create Quiz
      .addCase(
        createQuiz.fulfilled,
        (state, action: PayloadAction<{ quiz: Quiz }>) => {
          if (state.quizzes) {
            state.quizzes.quizzes.push(action.payload.quiz);
          }
        }
      )
      // Update Quiz
      .addCase(
        updateQuiz.fulfilled,
        (state, action: PayloadAction<{ quiz: Quiz }>) => {
          if (state.quizzes) {
            const index = state.quizzes.quizzes.findIndex(
              (quiz) => quiz._id === action.payload.quiz._id
            );
            if (index !== -1) {
              state.quizzes.quizzes[index] = action.payload.quiz;
            }
          }
        }
      )
      // Delete Quiz
      .addCase(deleteQuiz.fulfilled, (state, action: PayloadAction<string>) => {
        if (state.quizzes) {
          state.quizzes.quizzes = state.quizzes.quizzes.filter(
            (quiz) => quiz._id !== action.payload
          );
        }
      })
      // Add Question to Quiz
      .addCase(addQuestionToQuiz.fulfilled, (_, action) => {
        // Optionally refresh the current quiz or update the question list
        console.log("Question added:", action.payload);
      })
      // Add Multiple Questions to Quiz
      .addCase(addMultipleQuestionsToQuiz.fulfilled, (_, action) => {
        // Optionally refresh the current quiz or update the question list
        console.log("Questions added:", action.payload);
      });
  },
});

export const {
  clearError,
  startQuizAttempt,
  setAnswer,
  nextQuestion,
  previousQuestion,
  finishQuizAttempt,
} = quizSlice.actions;

export default quizSlice.reducer;
