import { combineReducers } from "redux";
import brandReducer from "./brand/BrandReducer";

const rootReducer = combineReducers({
  brand: brandReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
