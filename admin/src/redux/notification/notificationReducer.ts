import { UnknownAction } from "redux";

import {
  NotificationAction,
  NotificationActionTypes,
  NotificationState,
  NotificationType,
} from "./notificationTypes";

const initialState: NotificationState = {
  notifications: [],
};

const notificationReducer = (
  state = initialState,
  action: NotificationAction | UnknownAction
): NotificationState => {
  if (!('type' in action)) return state;
  
  switch (action.type) {
    case NotificationActionTypes.SHOW_NOTIFICATION:
      const showAction = action as { type: typeof NotificationActionTypes.SHOW_NOTIFICATION; payload: NotificationType };
      return {
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            message: showAction.payload.message,
            subMessage: showAction.payload.subMessage,
            type: showAction.payload.type,
          },
        ],
      };
    case NotificationActionTypes.HIDE_NOTIFICATION:
      const hideAction = action as { type: typeof NotificationActionTypes.HIDE_NOTIFICATION; payload: number };
      return {
        notifications: state.notifications.filter(
          (notification) => notification.id !== hideAction.payload
        ),
      };
    default:
      return state;
  }
};

export default notificationReducer;
