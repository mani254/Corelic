export interface NotificationType{
  id?:number|string,
  type:"error"|"warning"|"success"|"default"
  message:string,
  subMessage?:string,
}


export interface NotificationState{
  notifications:NotificationType[]
}

export enum NotificationActionTypes{
  SHOW_NOTIFICATION = 'SHOW_NOTIFICATION',
  HIDE_NOTIFICATION='HIDE_NOTIFICATION'
}

export type NotificationAction=
|{type:NotificationActionTypes.HIDE_NOTIFICATION,payload:number}
|{type:NotificationActionTypes.SHOW_NOTIFICATION,payload:NotificationType}
