export interface BrandType {
  _id: string;
  title: string;
  slug: string;
  status: "active" | "inactive";
  description?: string;
  metaData?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  image?: {
    url?: string;
    alt?: string;
    publicId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface BrandInput {
  title: string;
  status?: "active" | "inactive";
  image?: unknown;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaData?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

export interface BrandQueryParams {
  search?: string;
  sortBy?: string;
  orderBy?: string;
  page?: number;
  limit?: number;
  status?: "active" | "inactive";
  fetchFields?: Record<string, number>;
}

// Reducer state
export interface BrandState {
  brands: BrandType[];
  singleBrand: Partial<BrandType>;
  fetchLoading: boolean;
  addLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  error: unknown;
}

// Action Types
export const enum BrandActionTypes {
  FETCH_REQUEST = "BRANDS_FETCH_REQUEST",
  ADD_REQUEST = "BRAND_ADD_REQUEST",
  UPDATE_REQUEST = "BRAND_UPDATE_REQUEST",
  DELETE_REQUEST = "BRAND_DELETE_REQUEST",
  DELETE_MULTIPLE_REQUEST = "BRANDS_DELETE_MULTIPLE_REQUEST",
  FETCH_SUCCESS = "BRANDS_FETCH_SUCCESS",
  ADD_SUCCESS = "BRAND_ADD_SUCCESS",
  UPDATE_SUCCESS = "BRAND_UPDATE_SUCCESS",
  DELETE_SUCCESS = "BRAND_DELETE_SUCCESS",
  DELETE_MULTIPLE_SUCCESS = "BRANDS_DELETE_MULTIPLE_SUCCESS",
  UPDATE_STATUS_SUCCESS = "BRANDS_STATUS_UPDATE_SUCCESS",
}

// Action Interfaces (Discriminated Union)
export type BrandActions =
  | { type: BrandActionTypes.FETCH_REQUEST }
  | { type: BrandActionTypes.ADD_REQUEST }
  | { type: BrandActionTypes.UPDATE_REQUEST }
  | { type: BrandActionTypes.DELETE_REQUEST }
  | { type: BrandActionTypes.DELETE_MULTIPLE_REQUEST }
  | { type: BrandActionTypes.FETCH_SUCCESS; payload: BrandType[] }
  | { type: BrandActionTypes.ADD_SUCCESS; payload: BrandType }
  | { type: BrandActionTypes.UPDATE_SUCCESS; payload: BrandType }
  | { type: BrandActionTypes.DELETE_SUCCESS; payload: string }
  | { type: BrandActionTypes.DELETE_MULTIPLE_SUCCESS; payload: string[] }
  | {
      type: BrandActionTypes.UPDATE_STATUS_SUCCESS;
      payload: { ids: string[]; status: "active" | "inactive" };
    };
