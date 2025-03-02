const initialState = {
   brands: [],
   singleBrand: {},
   loading: false,
   error: null,
   triggerFetch: false,
};

const brandReducer = (state = initialState, action) => {
   switch (action.type) {

      case "BRANDS_REQUEST":
         return { ...state, loading: true };

      case "BRANDS_FAILURE":
         return { ...state, loading: false, error: action.payload };

      case "TRIGGER_FETCH":
         return { ...state, triggerFetch: true };

      case "ADD_BRAND_SUCCESS":
         return { ...state, brands: [...state.brands, action.payload], loading: false, error: null };

      case "FETCH_BRANDS_SUCCESS":
         return { ...state, brands: action.payload, loading: false, error: null, triggerFetch: false };

      case "DELETE_BRAND_SUCCESS":
         return { ...state, brands: state.brands.filter((brand) => brand._id !== action.payload), loading: false, error: null };

      case "DELETE_MULTIPLE_BRANDS_SUCCESS":
         return {
            ...state,
            brands: state.brands.filter((brand) => !action.payload.includes(brand._id)),
            loading: false,
            error: null
         };

      case "UPDATE_BRAND_STATUS_SUCCESS":
         return {
            ...state,
            brands: state.brands.map((brand) =>
               action.payload.ids.includes(brand._id) ? { ...brand, status: action.payload.status } : brand
            )
         };

      default:
         return state;
   }
};

export default brandReducer;
