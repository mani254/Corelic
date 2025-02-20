const initialState = {
   products: [],
   singleProduct: {},
   loading: false,
   error: null,
};

const productReducer = (state = initialState, action) => {
   switch (action.type) {

      case "PRODUCTS_REQUEST":
         return { ...state, loading: true };
      case "PRODUCTS_FAILURE":
         return { ...state, loading: false, error: action.payload };

      case "ADD_PRODUCT_SUCCESS":
         return { ...state, products: [...state.products, action.payload], loading: false, error: null };

      default:
         return state;
   }
};

export default productReducer;