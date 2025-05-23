import { configureStore, Reducer } from "@reduxjs/toolkit";
import brandReducer from "./brand/BrandReducer";
import { BrandState } from "./brand/BrandTypes";
import notificationReducer from "./notification/notificationReducer";
import { NotificationState } from "./notification/notificationTypes";

const store = configureStore({
  reducer: {
    notification: notificationReducer as Reducer<NotificationState>,
    brand: brandReducer as Reducer<BrandState>,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: {
    name: "Corelic Redux Store",
    trace: true,
    traceLimit: 25,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
