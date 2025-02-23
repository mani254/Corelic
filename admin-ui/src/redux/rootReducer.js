import { combineReducers } from "redux";

import notificationReducer from "./reducers/notificationReducer";
import productReducer from "./reducers/productReducer";
import modalReducer from "./reducers/modalReducer";

const rootReducer = combineReducers({
   notification: notificationReducer,
   product: productReducer,
   modal: modalReducer,
})

export default rootReducer;
