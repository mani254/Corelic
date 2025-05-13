import { UnknownAction } from "redux";
import {
  BrandAction,
  BrandActionTypes,
  BrandState,
  BrandType,
} from "./BrandTypes";

const initialState: BrandState = {
  brands: [],
  singleBrand: {},
  loading: false,
  error: null,
  triggerFetch: false,
};

const brandReducer = (
  state = initialState,
  action: BrandAction | UnknownAction
): BrandState => {
  switch (action.type) {
    case BrandActionTypes.REQUEST:
      return { ...state, loading: true };

    case BrandActionTypes.FAILURE:
      return { ...state, loading: false, error: action.payload };

    case BrandActionTypes.TRIGGER_FETCH:
      return { ...state, triggerFetch: true };

    case BrandActionTypes.FETCH_SUCCESS:
      return {
        ...state,
        brands: action.payload as BrandType[],
        loading: false,
        error: null,
        triggerFetch: false,
      };
    case BrandActionTypes.DELETE_SUCCESS:
       return {
         ...state,
         brands: state.brands.filter((brand) => brand._id !== action.payload),
         loading: false,
         error: null,
       };
       
    default:
      return state;
  }
};

export default brandReducer;

// case BrandActionTypes.ADD_SUCCESS:
//       return {
//         ...state,
//         brands: [...state.brands, action.payload],
//         loading: false,
//         error: null,
//       };



//     case BrandActionTypes.DELETE_MULTIPLE_SUCCESS:
//       return {
//         ...state,
//         brands: state.brands.filter(
//           (brand) => !action.payload.includes(brand._id)
//         ),
//         loading: false,
//         error: null,
//       };

//     case BrandActionTypes.UPDATE_STATUS_SUCCESS:
//       return {
//         ...state,
//         brands: state.brands.map((brand) =>
//           action.payload.ids.includes(brand._id)
//             ? { ...brand, status: action.payload.status }
//             : brand
//         ),
//       };
