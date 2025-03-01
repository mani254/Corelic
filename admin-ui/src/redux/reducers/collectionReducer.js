const initialState = {
   collections: [],
   singleCollection: {},
   loading: false,
   error: null,
   triggerFetch: false,
};

const collectionReducer = (state = initialState, action) => {
   switch (action.type) {

      case "COLLECTIONS_REQUEST":
         return { ...state, loading: true };

      case "COLLECTIONS_FAILURE":
         return { ...state, loading: false, error: action.payload };

      case "TRIGGER_FETCH":
         return { ...state, triggerFetch: true };

      case "ADD_COLLECTION_SUCCESS":
         return { ...state, collections: [...state.collections, action.payload], loading: false, error: null };

      case "FETCH_COLLECTIONS_SUCCESS":
         return { ...state, collections: action.payload, loading: false, error: null, triggerFetch: false };

      case "DELETE_COLLECTION_SUCCESS":
         return { ...state, collections: state.collections.filter((collection) => collection._id !== action.payload), loading: false, error: null };

      case "DELETE_MULTIPLE_COLLECTIONS_SUCCESS":
         return {
            ...state,
            collections: state.collections.filter((collection) => !action.payload.includes(collection._id)),
            loading: false,
            error: null
         };

      case "UPDATE_COLLECTION_STATUS_SUCCESS":
         return {
            ...state,
            collections: state.collections.map((collection) =>
               action.payload.ids.includes(collection._id) ? { ...collection, status: action.payload.status } : collection
            )
         };

      default:
         return state;
   }
};

export default collectionReducer;
