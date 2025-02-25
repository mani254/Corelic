const initialState = {
   products: [],
   singleProduct: {},
   loading: false,
   error: null,
   triggerFetch: false,
};


const productReducer = (state = initialState, action) => {
   switch (action.type) {

      case "PRODUCTS_REQUEST":
         return { ...state, loading: true };
      case "PRODUCTS_FAILURE":
         return { ...state, loading: false, error: action.payload };
      case "TRIGGER_FETCH":
         return { ...state, triggerFetch: true }

      case "ADD_PRODUCT_SUCCESS":
         return { ...state, products: [...state.products, action.payload], loading: false, error: null };

      case "FETCH_PRODUCTS_SUCCESS":
         return { ...state, products: action.payload, loading: false, error: null, triggerFetch: false }

      case "DELETE_PRODUCT_SUCCESS":
         return { ...state, products: state.products.filter((product) => product._id !== action.payload), loading: false, error: null }

      case "DELETE_MULTIPLE_PRODUCTS_SUCCESS":
         return {
            ...state,
            products: state.products.filter((product) => !action.payload.includes(product._id)), loading: false, error: null
         };
      case "UPDATE_PRODUCT_STATUS_SUCCESS":
         return {
            ...state,
            products: state.products.map((product) => action.payload.ids.includes(product._id) ? { ...product, status: action.payload.status } : product)
         };

      default:
         return state;
   }
};

export default productReducer;