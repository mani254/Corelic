import { combineReducers } from "redux";

import modalReducer from "./modal/modalReducer";
import notificationReducer from "./notification/notificationReducer";
import authReducer from "./auth/authReducer";

const rootReducer = combineReducers({
   modal: modalReducer,
   notification: notificationReducer,
   auth: authReducer
})

export default rootReducer;
