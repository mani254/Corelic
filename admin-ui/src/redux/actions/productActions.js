import { showNotification } from "./notificationActions";
import axios from 'axios'


// Add Product
export const addProduct = (productData) => async (dispatch) => {
   dispatch({ type: "PRODUCTS_REQUEST" });

   try {
      const response = await axios.post(`${import.meta.env.VITE_API_BACKEND_URI}/api/products`, productData, {
         headers: {
            "Content-Type": "multipart/form-data",
         },
      });

      dispatch({ type: "ADD_PRODUCT_SUCCESS", payload: response.data });
      dispatch(showNotification("Product Added Successfully", "success"));

      return Promise.resolve(response.data);
   } catch (err) {
      let errorMessage = err.response?.data?.message || "Failed to add product";
      dispatch(showNotification(errorMessage, "error"));
      return Promise.reject(errorMessage);
   }
};

export const fetchProducts = (params) => async (dispatch) => {
   dispatch({ type: "PRODUCTS_REQUEST" });

   try {
      const response = await axios.get(`${import.meta.env.VITE_API_BACKEND_URI}/api/products`, {
         headers: {
            "Content-Type": "application/x-www-form-urlencoded",
         },
         params,
      });
      dispatch({ type: "FETCH_PRODUCTS_SUCCESS", payload: response.data.products });
      return Promise.resolve(response.data);
   }
   catch (err) {
      let errorMessage = err.response?.data?.message || "Failed to fetch Products";
      dispatch(showNotification(errorMessage, "error"));
      return Promise.reject(errorMessage);
   }

}