import { configureStore } from "@reduxjs/toolkit";
import brandReducer from "./brand/BrandReducer";
import notificationReducer from "./notification/notificationReducer";
// import productReducer from "./products/ProductReducer";

const store = configureStore({
  reducer: {
    brand: brandReducer,
    notification: notificationReducer, 
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
