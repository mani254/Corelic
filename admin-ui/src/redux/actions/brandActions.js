import { showNotification } from "./notificationActions";
import axios from 'axios';

// Add Brand
export const addBrand = (brandData) => async (dispatch) => {
   dispatch({ type: "BRANDS_REQUEST" });

   try {
      const response = await axios.post(`${import.meta.env.VITE_API_BACKEND_URI}/api/brands`, brandData);

      dispatch({ type: "ADD_BRAND_SUCCESS", payload: response.data.brand });
      dispatch(showNotification("Brand Added Successfully", "success"));

      return Promise.resolve(response.data);
   } catch (err) {
      let errorMessage = err.response?.data?.message || "Failed to add brand";
      dispatch(showNotification(errorMessage, "error"));
      return Promise.reject(errorMessage);
   }
};

// Fetch Brands
export const fetchBrands = (params) => async (dispatch) => {
   dispatch({ type: "BRANDS_REQUEST" });

   try {
      const response = await axios.get(`${import.meta.env.VITE_API_BACKEND_URI}/api/brands`, {
         headers: {
            "Content-Type": "application/x-www-form-urlencoded",
         },
         params,
      });

      dispatch({ type: "FETCH_BRANDS_SUCCESS", payload: response.data.brands });
      return Promise.resolve(response.data);
   }
   catch (err) {
      let errorMessage = err.response?.data?.message || "Failed to fetch brands";
      dispatch(showNotification(errorMessage, "error"));
      return Promise.reject(errorMessage);
   }
};

// Delete Single Brand
export const deleteBrand = (id) => async (dispatch) => {
   try {
      dispatch({ type: "DELETE_BRAND_SUCCESS", payload: id });

      const response = await axios.delete(
         `${import.meta.env.VITE_API_BACKEND_URI}/api/brands/${id}`,
         {
            headers: {
               "Content-Type": "application/json",
            },
         }
      );

      dispatch({ type: "TRIGGER_FETCH" });
      dispatch(showNotification('Brand deleted successfully', "success"));

      return Promise.resolve(response.data);
   } catch (err) {
      let errorMessage = err.response?.data?.message || "Failed to delete brand";
      dispatch(showNotification(errorMessage, "error"));
      return Promise.reject(errorMessage);
   }
};

// Delete Multiple Brands
export const deleteMultipleBrands = (selectedBrands) => async (dispatch) => {
   try {
      dispatch({ type: "DELETE_MULTIPLE_BRANDS_SUCCESS", payload: selectedBrands });

      const response = await axios.delete(
         `${import.meta.env.VITE_API_BACKEND_URI}/api/brands`,
         {
            data: { ids: selectedBrands },
            headers: {
               "Content-Type": "application/json",
            },
         }
      );

      dispatch({ type: "TRIGGER_FETCH" });
      dispatch(showNotification('Brands deleted successfully', "success"));

      return Promise.resolve(response.data);
   } catch (err) {
      let errorMessage = err.response?.data?.message || "Failed to delete brands";
      dispatch(showNotification(errorMessage, "error"));
      return Promise.reject(errorMessage);
   }
};
