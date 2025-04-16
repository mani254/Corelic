import { Document, ObjectId } from 'mongoose';

// Database Brand type
export interface BrandType extends Document {
  _id: ObjectId;
  title: string;
  slug: string;
  status: "active" | "inactive";
  description?: string;
  metaData?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Request input type for creating/updating brand
export interface BrandInput {
  title: string;
  status?: "active" | "inactive";
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
}

// Query parameters interface
export interface BrandQueryParams {
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
  fetchFields?:  Record<string, number>;
}



