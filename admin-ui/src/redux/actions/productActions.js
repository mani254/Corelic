import { showNotification } from "./notificationActions";
import axios from 'axios'


// Add Product
export const addProduct = (productData) => async (dispatch) => {
   dispatch({ type: "PRODUCTS_REQUEST" });

   try {
      console.log("🚀 Sending FormData:", [...productData.entries()]);

      const response = await axios.post(`${import.meta.env.VITE_API_BACKEND_URI}/api/products`, productData, {
         headers: {
            "Content-Type": "multipart/form-data",
         },
      });

      dispatch({ type: "ADD_PRODUCT_SUCCESS", payload: response.data });
      dispatch(showNotification("Product Added Successfully", "success"));

      return Promise.resolve(response.data);
   } catch (error) {
      let errorMessage = error.response?.data?.message || "Failed to add product";
      dispatch(showNotification(errorMessage, "error"));
      return Promise.reject(errorMessage);
   }
};