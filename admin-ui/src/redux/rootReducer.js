import { combineReducers } from "redux";

// import modalReducer from "./modal/modalReducer";
import notificationReducer from "./notification/notificationReducer";

const rootReducer = combineReducers({
   // modal: modalReducer,
   notification: notificationReducer,
})

export default rootReducer;
