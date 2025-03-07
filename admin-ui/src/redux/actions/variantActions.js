import axios from "axios";
import { showNotification } from "./notificationActions";

export const addVariant = (products) => async (dispatch) => {
   dispatch({ type: "VARIANTS_REQUEST" });

   try {
      const response = await axios.post(`${import.meta.env.VITE_API_BACKEND_URI}/api/variants`, products);

      dispatch({ type: "ADD_VARIANT_SUCCESS", payload: response.data.variant });
      dispatch(showNotification("Variant added successfully", "success"));

      return Promise.resolve(response.data);
   } catch (err) {
      let errorMessage = err.response?.data?.message || "Failed to add variant";
      dispatch({ type: "VARIANTS_FAILURE", payload: errorMessage });
      dispatch(showNotification(errorMessage, "error"));

      return Promise.reject(errorMessage);
   }
};

export const fetchVariants = (params = {}) => async (dispatch) => {
   dispatch({ type: "VARIANTS_REQUEST" });

   try {
      const response = await axios.get(`${import.meta.env.VITE_API_BACKEND_URI}/api/variants`, { params });

      dispatch({ type: "FETCH_VARIANTS_SUCCESS", payload: response.data.variants });

      return Promise.resolve(response.data);
   } catch (err) {
      let errorMessage = err.response?.data?.message || "Failed to fetch variants";

      dispatch({ type: "VARIANTS_FAILURE", payload: errorMessage });
      dispatch(showNotification(errorMessage, "error"));

      return Promise.reject(errorMessage);
   }
};

export const deleteVariant = (id) => async (dispatch) => {
   try {
      dispatch({ type: "DELETE_VARIANT_SUCCESS", payload: id });

      const response = await axios.delete(
         `${import.meta.env.VITE_API_BACKEND_URI}/api/variants/${id}`
      );

      dispatch({ type: "TRIGGER_FETCH" });
      dispatch(showNotification("Variant deleted successfully", "success"));

      return Promise.resolve(response.data);
   } catch (err) {
      console.error("Error deleting variant:", err);

      let errorMessage = err.response?.data?.message || "Failed to delete variant";
      dispatch(showNotification(errorMessage, "error"));

      return Promise.reject(errorMessage);
   }
};

export const deleteMultipleVariants = (selectedVariants) => async (dispatch) => {
   try {
      dispatch({ type: "DELETE_MULTIPLE_VARIANTS_SUCCESS", payload: selectedVariants });

      const response = await axios.delete(
         `${import.meta.env.VITE_API_BACKEND_URI}/api/variants`,
         {
            data: { ids: selectedVariants },
            headers: {
               "Content-Type": "application/json",
            },
         }
      );

      dispatch({ type: "TRIGGER_FETCH" });
      dispatch(showNotification("Variants deleted successfully", "success"));

      return Promise.resolve(response.data);
   } catch (err) {
      let errorMessage = err.response?.data?.message || "Failed to delete variants";
      dispatch(showNotification(errorMessage, "error"));
      return Promise.reject(errorMessage);
   }
};



