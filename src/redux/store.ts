import { configureStore } from "@reduxjs/toolkit";
import friendsReducer from "./friendsReducer";

export const store = configureStore({
  reducer: {
    friends: friendsReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch