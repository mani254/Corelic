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

      dispatch({ type: "ADD_PRODUCT_SUCCESS", payload: response.data.product });
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

export const deleteProduct = (id) => async (dispatch) => {
   try {
      dispatch({ type: "DELETE_PRODUCT_SUCCESS", payload: id });
      const response = await axios.delete(
         `${import.meta.env.VITE_API_BACKEND_URI}/api/products/${id}`,
         {
            headers: {
               "Content-Type": "application/json",
            },
         }
      );
      dispatch({ type: "TRIGGER_FETCH" })
      dispatch(showNotification('product deleted succesfully', "success"))
      return Promise.resolve(response.data);
   } catch (err) {
      console.log(err)
      let errorMessage = err.response?.data?.message || "Failed to delete Product";
      dispatch(showNotification(errorMessage, "error"));
      return Promise.reject(errorMessage);
   }
};

export const deleteMultipleProducts = (selectedProducts) => async (dispatch) => {
   try {
      dispatch({ type: "DELETE_MULTIPLE_PRODUCTS_SUCCESS", payload: selectedProducts });

      const response = await axios.delete(
         `${import.meta.env.VITE_API_BACKEND_URI}/api/products`,
         {
            data: { ids: selectedProducts },
            headers: {
               "Content-Type": "application/json",
            },
         }
      );

      dispatch({ type: "TRIGGER_FETCH" });
      dispatch(showNotification('products deleted succesfull', "success"))
      return Promise.resolve(response.data);
   } catch (err) {
      let errorMessage = err.response?.data?.message || "Failed to delete Products";
      dispatch(showNotification(errorMessage, "error"));
      return Promise.reject(errorMessage);
   }
};

export const updateProductStatus = (ids, status) => async (dispatch) => {
   try {
      dispatch({
         type: "UPDATE_PRODUCT_STATUS_SUCCESS",
         payload: { ids, status }
      });

      let response;
      if (ids.length == 1) {
         response = await axios.put(`${import.meta.env.VITE_API_BACKEND_URI}/api/products/status/${ids[0]}`, { status });
      }
      else {
         response = await axios.put(`${import.meta.env.VITE_API_BACKEND_URI}/api/products/status`, { ids, status });
      }
      dispatch(showNotification(response?.data?.message || "Status updated successfully", "success"));
      return Promise.resolve(response.data);
   } catch (err) {
      console.log(err)
      let errorMessage = err.response?.data?.message || "Failed to update product status";
      dispatch(showNotification(errorMessage, "error"));
      return Promise.reject(errorMessage);
   }
};

