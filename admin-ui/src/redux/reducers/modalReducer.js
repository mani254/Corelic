// modalReducer.js

const initialState = {
   showModal: false,
   modalProps: null,
   modalComponent: null,
};

const modalReducer = (state = initialState, action) => {
   switch (action.type) {
      case "SHOW_MODAL":
         return {
            ...state,
            showModal: true,
            modalProps: action.payload.props,
            modalComponent: action.payload.component,
         };
      case "HIDE_MODAL":
         return {
            ...state,
            showModal: false,
            modalProps: null,
            modalComponent: null,
         };
      default:
         return state;
   }
};

export default modalReducer;