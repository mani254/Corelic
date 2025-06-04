import axios, { AxiosError } from "axios";
import { showNotification } from "../notification/notificationActions";
import { AppDispatch } from "../store";
import { BrandActionTypes, BrandQueryParams, BrandType } from "./BrandTypes";

const API_URL = process.env.NEXT_PUBLIC_API_BACKEND_URI;

const handleError = (
  err: unknown,
  defaultMessage: string,
  dispatch: AppDispatch
): Promise<never> => {
  const error = err as AxiosError<{ message?: string; error?: string }>;
  const errorMessage = error.response?.data?.message || defaultMessage;

  dispatch(
    showNotification({
      message: errorMessage,
      subMessage: error.response?.data?.error,
      type: "error",
    })
  );

  return Promise.reject(errorMessage);
};

export const fetchBrands =
  (params?: BrandQueryParams) => async (dispatch: AppDispatch) => {
    dispatch({ type: BrandActionTypes.FETCH_REQUEST });

    try {
      const response = await axios.get<{
        brands: BrandType[];
        totalItems: number;
      }>(`${API_URL}/api/brands`, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        params,
      });

      dispatch({
        type: BrandActionTypes.FETCH_SUCCESS,
        payload: response.data.brands,
      });

      return response.data;
    } catch (err) {
      return handleError(err, "Failed to fetch brands", dispatch);
    }
  };

export const addBrand =
  (brandData: FormData) => async (dispatch: AppDispatch) => {
    dispatch({ type: BrandActionTypes.ADD_REQUEST });

    try {
      const response = await axios.post<{ brand: BrandType }>(
        `${API_URL}/api/brands`,
        brandData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      dispatch({
        type: BrandActionTypes.ADD_SUCCESS,
        payload: response.data.brand,
      });

      dispatch(
        showNotification({
          message: "Brand added successfully",
          type: "success",
        })
      );

      return response.data.brand;
    } catch (err) {
      return handleError(err, "Failed to add brand", dispatch);
    }
  };

export const updateBrand =
  (id: string, brandData: FormData) => async (dispatch: AppDispatch) => {
    dispatch({ type: BrandActionTypes.UPDATE_REQUEST });

    try {
      const response = await axios.put<{ brand: BrandType }>(
        `${API_URL}/api/brands/${id}`,
        brandData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      dispatch({
        type: BrandActionTypes.UPDATE_SUCCESS,
        payload: response.data.brand,
      });

      dispatch(
        showNotification({
          message: "Brand updated successfully",
          type: "success",
        })
      );

      return response.data.brand;
    } catch (err) {
      return handleError(err, "Failed to update brand", dispatch);
    }
  };

export const deleteBrand = (id: string) => async (dispatch: AppDispatch) => {
  dispatch({ type: BrandActionTypes.DELETE_REQUEST });
  try {
    await axios.delete(`${API_URL}/api/brands/${id}`);

    dispatch({
      type: BrandActionTypes.DELETE_SUCCESS,
      payload: id,
    });

    dispatch(
      showNotification({
        message: "Brand deleted successfully",
        type: "success",
      })
    );

    return id;
  } catch (err) {
    return handleError(err, "Failed to delete brand", dispatch);
  }
};

export const deleteMultipleBrands =
  (ids: string[]) => async (dispatch: AppDispatch) => {
    dispatch({ type: BrandActionTypes.DELETE_MULTIPLE_REQUEST });

    try {
      await axios.delete(`${API_URL}/api/brands`, { data: { ids } });

      dispatch({
        type: BrandActionTypes.DELETE_MULTIPLE_SUCCESS,
        payload: ids,
      });

      dispatch(
        showNotification({
          message: `Successfully deleted ${ids.length} brands`,
          type: "success",
        })
      );

      return ids;
    } catch (err) {
      return handleError(err, "Failed to delete brands", dispatch);
    }
  };

export const bulkUploadBrands =
  (uploadType: "add" | "update", uniqueField: string, data: unknown[]) =>
  async (dispatch: AppDispatch) => {
    dispatch({ type: BrandActionTypes.UPDATE_REQUEST });

    try {
      const response = await axios.post<{ message: string }>(
        `${API_URL}/api/brands/bulkupload`,
        { uploadType, uniqueField, data },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.data) {
        dispatch(
          showNotification({
            message: "Bulk upload successful",
            subMessage: response.data.message,
            type: "success",
          })
        );
      }
    } catch (err) {
      return handleError(err, "Bulk upload Failed", dispatch);
    }
  };

export const updateBrandStatus =
  (id: string, status: "active" | "inactive") =>
  async (dispatch: AppDispatch) => {
    dispatch({ type: BrandActionTypes.UPDATE_REQUEST });

    try {
      await axios.patch(`${API_URL}/api/brands/${id}`, { status });

      dispatch({
        type: BrandActionTypes.UPDATE_STATUS_SUCCESS,
        payload: { ids: [id], status },
      });

      dispatch(
        showNotification({
          message: `Successfully updated brand status to ${status}`,
          type: "success",
        })
      );

      return { id, status };
    } catch (err) {
      return handleError(err, "Failed to update brand status", dispatch);
    }
  };

export const updateMultipleBrandsStatus =
  (ids: string[], status: "active" | "inactive") =>
  async (dispatch: AppDispatch) => {
    dispatch({ type: BrandActionTypes.UPDATE_REQUEST });

    try {
      await axios.patch(`${API_URL}/api/brands/status`, { ids, status });

      dispatch({
        type: BrandActionTypes.UPDATE_STATUS_SUCCESS,
        payload: { ids, status },
      });

      dispatch(
        showNotification({
          message: `Successfully updated status of ${ids.length} brands to ${status}`,
          type: "success",
        })
      );

      return { ids, status };
    } catch (err) {
      return handleError(err, "Failed to update brands status", dispatch);
    }
  };
