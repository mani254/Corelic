import { combineReducers } from "redux";

// import modalReducer from "./modal/modalReducer";
import notificationReducer from "./reducers/notificationReducer";
import productReducer from "./reducers/productReducer";

const rootReducer = combineReducers({
   // modal: modalReducer,
   notification: notificationReducer,
   product: productReducer
})

export default rootReducer;
