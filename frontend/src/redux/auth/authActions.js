import authTypes from "./authActionTypes";
import axios from 'axios';
import { showNotification } from "../notification/notificationActions";
import { hideModal } from "../modal/modalActions";

export const loginRequest = () => ({
   type: authTypes.LOGIN_REQUEST,
});

export const loginSuccess = (user) => ({
   type: authTypes.LOGIN_SUCCESS,
   payload: user
});

export const loginFailure = (error) => ({
   type: authTypes.LOGIN_FAILURE,
   payload: error,
});

// Action creators for registration
export const registerRequest = () => ({
   type: authTypes.REGISTER_REQUEST,
});

export const registerSuccess = () => ({
   type: authTypes.REGISTER_SUCCESS,
});

export const registerFailure = (error) => ({
   type: authTypes.REGISTER_FAILURE,
   payload: error,
});



// Action creators for verifying OTP
export const verifyOtpRequest = () => ({
   type: authTypes.VERIFY_OTP_REQUEST,
});

export const verifyOtpSuccess = () => ({
   type: authTypes.VERIFY_OTP_SUCCESS,
});

export const verifyOtpFailure = (error) => ({
   type: authTypes.VERIFY_OTP_FAILURE,
   payload: error,
});


// Action creators for changing password
export const changePasswordRequest = () => ({
   type: authTypes.CHANGE_PASSWORD_REQUEST,
});

export const changePasswordSuccess = () => ({
   type: authTypes.CHANGE_PASSWORD_SUCCESS,
});

export const changePasswordFailure = (error) => ({
   type: authTypes.CHANGE_PASSWORD_FAILURE,
   payload: error,
});

// Action to activate user with link
export const activateUserRequest = () => ({
   type: authTypes.ACTIVATE_USER_REQUEST,
});

export const activateUserSuccess = () => ({
   type: authTypes.ACTIVATE_USER_SUCCESS,
});

export const activateUserFailure = (error) => ({
   type: authTypes.ACTIVATE_USER_FAILURE,
   payload: error,
});

// Action creator for logout
export const logout = () => ({
   type: authTypes.LOGOUT,
});

//async action for registration
export const register = (userData) => async (dispatch) => {
   dispatch(registerRequest());
   try {
      await axios.post(`${import.meta.env.VITE_APP_BACKENDURI}/api/auth/register`, userData);
      dispatch(registerSuccess());
      dispatch(showNotification('Activeate your account check mail?'))
      return Promise.resolve()
   } catch (error) {
      let errMessage = error.response ? error.response.data.error : 'Something Went wrong'
      dispatch(registerFailure(errMessage));
      dispatch(showNotification(errMessage));
      return Promise.reject(errMessage)
   }
};

export const activateUser = (email, activationcode) => async (dispatch) => {
   dispatch(activateUserRequest());
   try {
      await axios.get(`${import.meta.env.VITE_APP_BACKENDURI}/api/auth/activateuser?email=${email}&activationcode=${activationcode}`);
      dispatch(activateUserSuccess());
      dispatch(showNotification('Account Activated Sucessfully'))
      return Promise.resolve()
   }
   catch (error) {
      let errMessage = error.response ? error.response.data.error : 'Something Went wrong'
      dispatch(activateUserFailure(errMessage));
      dispatch(showNotification(errMessage));
      return Promise.reject(errMessage)
   }
}

export const requestOtp = (email) => async (dispatch) => {
   try {
      await axios.post(`${import.meta.env.VITE_APP_BACKENDURI}/api/auth/requestOtp`, { email });
      dispatch(showNotification('Otp has been sent to mail'))
      return Promise.resolve();
   } catch (error) {
      let errMessage = error.response ? error.response.data.error : 'Something Went wrong';
      dispatch(showNotification(errMessage));
      return Promise.reject(errMessage);
   }
};

// Example async action for verifying OTP
export const verifyOtp = (email, otp) => async (dispatch) => {
   dispatch(verifyOtpRequest());
   try {
      await axios.post(`${import.meta.env.VITE_APP_BACKENDURI}/api/auth/verifyOtp`, { email, otp });
      dispatch(verifyOtpSuccess());
      return Promise.resolve()
   } catch (error) {
      let errMessage = error.response ? error.response.data.error : 'Something Went wrong';
      dispatch(verifyOtpFailure(errMessage));
      dispatch(showNotification(errMessage))
      return Promise.reject(errMessage)
   }
};

// Example async action for changing password
export const changePassword = (email, otp, password) => async (dispatch) => {
   dispatch(changePasswordRequest());
   try {
      await axios.post(`${import.meta.env.VITE_APP_BACKENDURI}/api/auth/changePassword`, { email, otp, password })
      dispatch(changePasswordSuccess());
      dispatch(showNotification('Password Changed Succesfully'))
      dispatch(hideModal())
   } catch (error) {
      console.log(error)
      let errMessage = error.response ? error.response.data.error : 'Something Went wrong';
      dispatch(changePasswordFailure(errMessage));
      dispatch(showNotification(errMessage))
      return Promise.reject(errMessage)
   }
};