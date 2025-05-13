import { combineReducers } from "redux";
import brandReducer from "./brand/BrandReducer";
import notificationReducer from "./notification/notificationReducer";

const rootReducer = combineReducers({
  brand: brandReducer,
  notification:notificationReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
