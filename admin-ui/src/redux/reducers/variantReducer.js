const initialState = {
   variants: [],
   singleVariant: {},
   loading: false,
   error: null,
   triggerFetch: false
};

const variantReducer = (state = initialState, action) => {
   switch (action.type) {

      case "VARIANTS_REQUEST":
         return { ...state, loading: true };

      case "VARIANTS_FAILURE":
         return { ...state, loading: false, error: action.payload };

      case "TRIGGER_FETCH":
         return { ...state, triggerFetch: true };

      case "ADD_VARIANT_SUCCESS":
         // action.payload.image = action.payload.images[0]
         return { ...state, variants: [...state.variants], loading: false, error: null };

      case "FETCH_VARIANTS_SUCCESS":
         return { ...state, variants: action.payload, loading: false, error: null, triggerFetch: false };

      case "FETCH_VARIANT_SUCCESS":
         return { ...state, singleVariant: action.payload, loading: false, error: null };

      case "DELETE_VARIANT_SUCCESS":
         return {
            ...state,
            variants: state.variants.filter((variant) => variant._id !== action.payload),
            loading: false,
            error: null
         };

      case "DELETE_MULTIPLE_VARIANTS_SUCCESS":
         return {
            ...state,
            variants: state.variants.filter((variant) => !action.payload.includes(variant._id)),
            loading: false,
            error: null
         };

      default:
         return state;
   }
};

export default variantReducer;
