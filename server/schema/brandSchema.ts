import mongoose, { Schema } from 'mongoose';
import slugify from 'slugify';
import { BrandType } from '../types/brandTypes';


const brandSchema = new Schema<BrandType>(
   {
      title: {
         type: String,
         required: [true, 'Title is required'],
         unique: true,
         maxlength: [60, 'Title should be less than 60 characters'],
         trim: true,
      },
      slug: {
         type: String,
         unique: true,
         lowercase: true,
      },
      status: {
         type: String,
         enum: ["active", "inactive"],
         default: "active",
      }, 
      description: {
         type: String,
         maxlength: [450, 'Description should be less than 450 characters'],
         trim: true,
      },
      metaData: {
         metaTitle: {
            type: String,
            trim: true,
         },
         metaDescription: {
            type: String,
            trim: true,
         },
      },
   },
   { timestamps: true }
);

brandSchema.pre('validate', function (next) {
   if (this.isModified('title')) {
      this.slug = slugify(this.title, { lower: true, strict: true });
   }
   next();
});

const Brand = mongoose.model<BrandType>('Brand', brandSchema);

export default Brand;
