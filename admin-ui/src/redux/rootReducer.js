import { combineReducers } from "redux";

import notificationReducer from "./reducers/notificationReducer";
import productReducer from "./reducers/productReducer";
import modalReducer from "./reducers/modalReducer";
import collectionReducer from "./reducers/collectionReducer";
import brandReducer from "./reducers/brandReducer";

const rootReducer = combineReducers({
   notification: notificationReducer,
   product: productReducer,
   modal: modalReducer,
   collection: collectionReducer,
   brand: brandReducer
})

export default rootReducer;
