import { configureStore } from "@reduxjs/toolkit";
import brandReducer from "./brand/BrandReducer";

// import productReducer from "./products/ProductReducer";

const store = configureStore({
  reducer: {
    brand: brandReducer,
    // products: productReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
