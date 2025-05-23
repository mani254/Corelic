import { BrandActions, BrandActionTypes, BrandState } from "./BrandTypes";

const initialState: BrandState = {
  brands: [],
  singleBrand: {},
  fetchLoading: false,
  addLoading: false,
  updateLoading: false,
  deleteLoading: false,
  error: null,
};

const brandReducer = (
  state = initialState,
  action: BrandActions
): BrandState => {
  switch (action.type) {
    case BrandActionTypes.FETCH_REQUEST:
      return { ...state, fetchLoading: true, error: null };

    case BrandActionTypes.ADD_REQUEST:
      return { ...state, addLoading: true, error: null };

    case BrandActionTypes.UPDATE_REQUEST:
      return { ...state, updateLoading: true, error: null };

    case BrandActionTypes.DELETE_REQUEST:
    case BrandActionTypes.DELETE_MULTIPLE_REQUEST:
      return { ...state, deleteLoading: true, error: null };

    case BrandActionTypes.FETCH_SUCCESS:
      return {
        ...state,
        brands: action.payload,
        fetchLoading: false,
        error: null,
      };

    case BrandActionTypes.ADD_SUCCESS:
      return {
        ...state,
        brands: [...state.brands, action.payload],
        singleBrand: action.payload,
        addLoading: false,
        error: null,
      };

    case BrandActionTypes.UPDATE_SUCCESS:
      return {
        ...state,
        brands: state.brands.map((brand) =>
          brand._id === action.payload._id ? action.payload : brand
        ),
        singleBrand: action.payload,
        updateLoading: false,
        error: null,
      };

    case BrandActionTypes.DELETE_SUCCESS:
      return {
        ...state,
        brands: state.brands.filter((brand) => brand._id !== action.payload),
        singleBrand: {},
        deleteLoading: false,
        error: null,
      };

    case BrandActionTypes.DELETE_MULTIPLE_SUCCESS:
      return {
        ...state,
        brands: state.brands.filter(
          (brand) => !action.payload.includes(brand._id)
        ),
        singleBrand: {},
        deleteLoading: false,
        error: null,
      };

    case BrandActionTypes.UPDATE_STATUS_SUCCESS:
      return {
        ...state,
        brands: state.brands.map((brand) =>
          action.payload.ids.includes(brand._id)
            ? { ...brand, status: action.payload.status }
            : brand
        ),
        updateLoading: false,
        error: null,
      };

    default:
      return state;
  }
};

export default brandReducer;
