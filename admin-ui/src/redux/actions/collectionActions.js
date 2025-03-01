import { showNotification } from "./notificationActions";
import axios from 'axios';

// Add Collection
export const addCollection = (collectionData) => async (dispatch) => {
   dispatch({ type: "COLLECTIONS_REQUEST" });

   try {
      const response = await axios.post(`${import.meta.env.VITE_API_BACKEND_URI}/api/collections`, collectionData, {
         headers: {
            "Content-Type": "multipart/form-data",
         },
      });

      dispatch({ type: "ADD_COLLECTION_SUCCESS", payload: response.data.collection });
      dispatch(showNotification("Collection Added Successfully", "success"));

      return Promise.resolve(response.data);
   } catch (err) {
      let errorMessage = err.response?.data?.message || "Failed to add collection";
      dispatch(showNotification(errorMessage, "error"));
      return Promise.reject(errorMessage);
   }
};

// Fetch Collections
export const fetchCollections = (params) => async (dispatch) => {
   dispatch({ type: "COLLECTIONS_REQUEST" });

   try {
      const response = await axios.get(`${import.meta.env.VITE_API_BACKEND_URI}/api/collections`, {
         headers: {
            "Content-Type": "application/x-www-form-urlencoded",
         },
         params,
      });
      dispatch({ type: "FETCH_COLLECTIONS_SUCCESS", payload: response.data.collections });
      return Promise.resolve(response.data);
   }
   catch (err) {
      let errorMessage = err.response?.data?.message || "Failed to fetch collections";
      dispatch(showNotification(errorMessage, "error"));
      return Promise.reject(errorMessage);
   }
};

// Delete Single Collection
export const deleteCollection = (id) => async (dispatch) => {
   try {
      dispatch({ type: "DELETE_COLLECTION_SUCCESS", payload: id });
      const response = await axios.delete(
         `${import.meta.env.VITE_API_BACKEND_URI}/api/collections/${id}`,
         {
            headers: {
               "Content-Type": "application/json",
            },
         }
      );
      dispatch({ type: "TRIGGER_FETCH" });
      dispatch(showNotification('Collection deleted successfully', "success"));
      return Promise.resolve(response.data);
   } catch (err) {
      console.log(err);
      let errorMessage = err.response?.data?.message || "Failed to delete collection";
      dispatch(showNotification(errorMessage, "error"));
      return Promise.reject(errorMessage);
   }
};

// Delete Multiple Collections
export const deleteMultipleCollections = (selectedCollections) => async (dispatch) => {
   try {
      dispatch({ type: "DELETE_MULTIPLE_COLLECTIONS_SUCCESS", payload: selectedCollections });

      const response = await axios.delete(
         `${import.meta.env.VITE_API_BACKEND_URI}/api/collections`,
         {
            data: { ids: selectedCollections },
            headers: {
               "Content-Type": "application/json",
            },
         }
      );

      dispatch({ type: "TRIGGER_FETCH" });
      dispatch(showNotification('Collections deleted successfully', "success"));
      return Promise.resolve(response.data);
   } catch (err) {
      let errorMessage = err.response?.data?.message || "Failed to delete collections";
      dispatch(showNotification(errorMessage, "error"));
      return Promise.reject(errorMessage);
   }
};

// Update Collection Status
export const updateCollectionStatus = (ids, status) => async (dispatch) => {
   try {
      dispatch({
         type: "UPDATE_COLLECTION_STATUS_SUCCESS",
         payload: { ids, status }
      });

      let response;
      if (ids.length === 1) {
         response = await axios.put(`${import.meta.env.VITE_API_BACKEND_URI}/api/collections/status/${ids[0]}`, { status });
      }
      else {
         response = await axios.put(`${import.meta.env.VITE_API_BACKEND_URI}/api/collections/status`, { ids, status });
      }
      dispatch(showNotification(response?.data?.message || "Status updated successfully", "success"));
      return Promise.resolve(response.data);
   } catch (err) {
      console.log(err);
      let errorMessage = err.response?.data?.message || "Failed to update collection status";
      dispatch(showNotification(errorMessage, "error"));
      return Promise.reject(errorMessage);
   }
};
