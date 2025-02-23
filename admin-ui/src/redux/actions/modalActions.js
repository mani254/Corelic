export const showModal = (props, component) => ({
   type: "SHOW_MODAL",
   payload: { props, component },
});

export const hideModal = () => ({
   type: "HIDE_MODAL",
});