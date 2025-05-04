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
  loading: boolean;
  error: unknown;
  triggerFetch: boolean;
}

// Action Types
export const enum BrandActionTypes {
  REQUEST = "BRANDS_REQUEST",
  FAILURE = "BRANDS_FAILURE",
  FETCH_SUCCESS = "FETCH_BRANDS_SUCCESS",
  ADD_SUCCESS = "ADD_BRAND_SUCCESS",
  DELETE_SUCCESS = "DELETE_BRAND_SUCCESS",
  DELETE_MULTIPLE_SUCCESS = "DELETE_MULTIPLE_BRANDS_SUCCESS",
  UPDATE_STATUS_SUCCESS = "UPDATE_BRAND_STATUS_SUCCESS",
  TRIGGER_FETCH = "TRIGGER_FETCH",
}

// Action Interfaces (Discriminated Union)
export type BrandAction =
  | { type: BrandActionTypes.REQUEST }
  | { type: BrandActionTypes.FAILURE; payload: unknown }
  | { type: BrandActionTypes.FETCH_SUCCESS; payload: BrandType[] }
  | { type: BrandActionTypes.ADD_SUCCESS; payload: BrandType }
  | { type: BrandActionTypes.DELETE_SUCCESS; payload: string }
  | { type: BrandActionTypes.DELETE_MULTIPLE_SUCCESS; payload: string[] }
  | {
      type: BrandActionTypes.UPDATE_STATUS_SUCCESS;
      payload: { ids: string[]; status: "active" | "inactive" };
    }
  | { type: BrandActionTypes.TRIGGER_FETCH };
