import authTypes from './authActionTypes';


const initialState = {
   isLoggedIn: false,
   user: null,
   loading: false,
   error: null,
   verfyingOtp: false,
   changingPassword: false,
};

const authReducer = (state = initialState, action) => {
   switch (action.type) {
      case authTypes.LOGIN_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         };
      case authTypes.LOGIN_SUCCESS:
         return {
            ...state,
            isLoggedIn: true,
            user: action.payload,
            loading: false,
         };
      case authTypes.LOGIN_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         };
      case authTypes.REGISTER_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         };
      case authTypes.REGISTER_SUCCESS:
         return {
            ...state,
            loading: false,
         };
      case authTypes.REGISTER_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         };
      case authTypes.VERIFY_OTP_REQUEST:
         return {
            ...state,
            verifyingOtp: true,
            error: null,
         };
      case authTypes.VERIFY_OTP_SUCCESS:
         return {
            ...state,
            verifyingOtp: false,
            otp: null,
         };
      case authTypes.VERIFY_OTP_FAILURE:
         return {
            ...state,
            verifyingOtp: false,
            error: action.payload,
         };
      case authTypes.LOGOUT:
         return {
            ...initialState,
         };
      case authTypes.CHANGE_PASSWORD_REQUEST:
         return {
            ...state,
            changingPassword: true,
            error: null,
         };

      case authTypes.CHANGE_PASSWORD_SUCCESS:
         return {
            ...state,
            changingPassword: false,
         };

      case authTypes.CHANGE_PASSWORD_FAILURE:
         return {
            ...state,
            changingPassword: false,
            error: action.payload,
         };
      default:
         return state;
   }
}


export default authReducer;