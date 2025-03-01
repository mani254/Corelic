import { combineReducers } from "redux";

import notificationReducer from "./reducers/notificationReducer";
import productReducer from "./reducers/productReducer";
import modalReducer from "./reducers/modalReducer";
import collectionReducer from "./reducers/collectionReducer";

const rootReducer = combineReducers({
   notification: notificationReducer,
   product: productReducer,
   modal: modalReducer,
   collection: collectionReducer
})

export default rootReducer;
