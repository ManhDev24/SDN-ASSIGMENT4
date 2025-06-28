import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import quizReducer from "./slices/quizSlice";
import questionReducer from "./slices/questionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducer,
    question: questionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["quiz/startQuizAttempt"],
        ignoredPaths: ["quiz.currentQuizAttempt.startTime"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
