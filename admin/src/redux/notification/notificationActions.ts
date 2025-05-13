import { NotificationActionTypes, NotificationType } from "./notificationTypes";


export const showNotification = (notification:NotificationType) => ({
   type: NotificationActionTypes.SHOW_NOTIFICATION,
   payload: notification,
});

export const hideNotification = (id:number) => ({
   type: NotificationActionTypes.HIDE_NOTIFICATION,
   payload: id,
});