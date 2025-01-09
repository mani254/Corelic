// notificationActions.js
import { SHOW_NOTIFICATION, HIDE_NOTIFICATION } from "./notificationActionTypes";


// types have to be success , error , warning 
export const showNotification = (message, type = "success") => ({
   type: SHOW_NOTIFICATION,
   payload: { message, type },
});

export const hideNotification = (id) => ({
   type: HIDE_NOTIFICATION,
   payload: id,
});