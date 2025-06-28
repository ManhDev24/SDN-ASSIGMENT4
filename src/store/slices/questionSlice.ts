import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Question } from "@/types";
import { questionAPI } from "@/app/apis";

interface QuestionsResponse {
  message: string;
  statusCode: number;
  questions: Question[];
}

interface QuestionResponse {
  message: string;
  statusCode: number;
  question: Question;
}

interface QuestionState {
  questions: Question[];
  currentQuestion: Question | null;
  isLoading: boolean;
  error: string | null;
}

// Get all questions
export const fetchQuestions = createAsyncThunk(
  "question/fetchQuestions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await questionAPI.getAllQuestions();
      return response as QuestionsResponse;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch questions";
      return rejectWithValue(errorMessage);
    }
  }
);

// Get question by ID
export const fetchQuestionById = createAsyncThunk(
  "question/fetchQuestionById",
  async (questionId: string, { rejectWithValue }) => {
    try {
      const response = await questionAPI.getQuestionById(questionId);
      return response as QuestionResponse;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch question";
      return rejectWithValue(errorMessage);
    }
  }
);

// Create new question
export const createQuestion = createAsyncThunk(
  "question/createQuestion",
  async (
    questionData: {
      text: string;
      options: string[];
      keywords: string[];
      correctAnswerIndex: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await questionAPI.createQuestion(questionData);
      return response as QuestionResponse;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create question";
      return rejectWithValue(errorMessage);
    }
  }
);

// Update question
export const updateQuestion = createAsyncThunk(
  "question/updateQuestion",
  async (
    {
      id,
      questionData,
    }: {
      id: string;
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
      const response = await questionAPI.updateQuestion(id, questionData);
      return response as QuestionResponse;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update question";
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete question
export const deleteQuestion = createAsyncThunk(
  "question/deleteQuestion",
  async (questionId: string, { rejectWithValue }) => {
    try {
      await questionAPI.deleteQuestion(questionId);
      return questionId;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete question";
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState: QuestionState = {
  questions: [],
  currentQuestion: null,
  isLoading: false,
  error: null,
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentQuestion: (state, action: PayloadAction<Question>) => {
      state.currentQuestion = action.payload;
    },
    clearCurrentQuestion: (state) => {
      state.currentQuestion = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Questions
      .addCase(fetchQuestions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.questions = action.payload.questions;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Question by ID
      .addCase(fetchQuestionById.fulfilled, (state, action) => {
        state.currentQuestion = action.payload.question;
      })
      // Create Question
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.questions.push(action.payload.question);
      })
      // Update Question
      .addCase(updateQuestion.fulfilled, (state, action) => {
        const index = state.questions.findIndex(
          (question) => question._id === action.payload.question._id
        );
        if (index !== -1) {
          state.questions[index] = action.payload.question;
        }
        if (
          state.currentQuestion &&
          state.currentQuestion._id === action.payload.question._id
        ) {
          state.currentQuestion = action.payload.question;
        }
      })
      // Delete Question
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.questions = state.questions.filter(
          (question) => question._id !== action.payload
        );
        if (
          state.currentQuestion &&
          state.currentQuestion._id === action.payload
        ) {
          state.currentQuestion = null;
        }
      });
  },
});

export const { clearError, setCurrentQuestion, clearCurrentQuestion } =
  questionSlice.actions;
export default questionSlice.reducer;
