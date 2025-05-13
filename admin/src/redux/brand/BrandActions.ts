import axios, { AxiosError } from "axios";
import { showNotification } from "../notification/notificationActions";
import { AppDispatch } from "../store";
import { BrandActionTypes, BrandQueryParams, BrandType } from "./BrandTypes";

export const fetchBrands =
  (params?: BrandQueryParams) =>
  async (
    dispatch: AppDispatch
  ): Promise<{ brands: BrandType[]; totalItems: number }> => {
    dispatch({ type: BrandActionTypes.REQUEST });

    try {
      const response = await axios.get<{
        brands: BrandType[];
        totalItems: number;
      }>(`${process.env.NEXT_PUBLIC_API_BACKEND_URI}/api/brands`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params,
      });

      dispatch({
        type: BrandActionTypes.FETCH_SUCCESS,
        payload: response.data.brands,
      });

      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ message?: string; error?: string }>;
      const errorMessage =
        error.response?.data?.message || "Failed to fetch brands";
      dispatch(
        showNotification({
          message: errorMessage || "",
          subMessage: error.response?.data?.error,
          type: "error",
        })
      );
      return Promise.reject(errorMessage);
    }
  };

// delete single brand
export const deleteBrand =
  (id: string) =>
  async (dispatch: AppDispatch): Promise<string> => {
    dispatch({ type: BrandActionTypes.REQUEST });
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URI}/api/brands/${id}`
      );
      dispatch({ type: BrandActionTypes.TRIGGER_FETCH });
      dispatch(
        showNotification({
          message: "Brand deleted successfully",
          subMessage: `Brand ID: ${id}`,
          type: "success",
        })
      );
      return id;
    } catch (err) {
      const error = err as AxiosError<{ message?: string; error?: string }>;
      const errorMessage =
        error.response?.data?.message || "Failed to delete brand";

      dispatch(
        showNotification({
          message: errorMessage,
          subMessage: error.response?.data?.error,
          type: "error",
        })
      );

      return Promise.reject(errorMessage);
    }
  };

//update status of single brand
// export const updateStatus =(id:string)=> async (dispatch:AppDispatch):Promise<string[]> =>{

//   dispatch({type:BrandActionTypes.REQUEST})

//   try{
//     await axios.delete(`${process.env.NEXT_PUBLIC_API_BACKEND_URI}/api/brands`)

//   }catch (err) {
//       const error = err as AxiosError<{ message?: string; error?: string }>;
//       const errorMessage = error.response?.data?.message || "Failed to delete brands";

//       dispatch(
//         showNotification({
//           message: errorMessage,
//           subMessage: error.response?.data?.error,
//           type: "error",
//         })
//       );
// }

// Delete Multiple Brands
// export const deleteMultipleBrands =
//   (selectedBrands: string[]) =>
//   async (dispatch: AppDispatch): Promise<void> => {
//     try {
//       dispatch({
//         type: BrandActionTypes.DELETE_MULTIPLE_SUCCESS,
//         payload: selectedBrands,
//       });

//       const response = await axios.delete(
//         `${process.env.NEXT_PUBLIC_API_BACKEND_URI}/api/brands`,
//         {
//           data: { ids: selectedBrands },
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       dispatch({ type: BrandActionTypes.TRIGGER_FETCH });
//       // dispatch(showNotification("Brands deleted successfully", "success"));

//       return response.data;
//     } catch (err) {
//       const error = err as AxiosError<{ message?: string }>;
//       const errorMessage =
//         error.response?.data?.message || "Failed to delete brands";

//       // dispatch(showNotification(errorMessage, "error"));
//       return Promise.reject(errorMessage);
//     }
//   };
