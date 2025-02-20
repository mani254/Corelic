

export const showNotification = (message, type = "success") => ({
   type: "SHOW_NOTIFICATION",
   payload: { message, type },
});

export const hideNotification = (id) => ({
   type: "HIDE_NOTIFICATION",
   payload: id,
});