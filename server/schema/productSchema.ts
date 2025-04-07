import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';

interface IImage {
   path: string;
   alt: string;
}

interface IOption {
   name: string;
   stock: number;
}

interface IMetaData {
   metaTitle?: string;
   metaDescription?: string;
}

export interface IProduct extends Document {
   title: string;
   slug: string;
   overview: string;
   description?: string;
   vendor?: mongoose.Types.ObjectId;
   collections?: mongoose.Types.ObjectId[];
   price: number;
   comparePrice: number;
   gst: number;
   sku: number;
   status: 'draft' | 'active' | 'inactive';
   images: IImage[];
   trackInventory: boolean;
   stock: number;
   options: IOption[];
   metaData?: IMetaData;
   createdAt: Date;
   updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
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
      overview: {
         type: String,
         required: [true, 'overview is required'],
         maxlength: [450, 'overview should be less than 450 characters'],
         trim: true
      },
      description: {
         type: String,
         trim: true
      },
      vendor: {
         type: Schema.Types.ObjectId,
         ref: 'Brands',
      },
      collections: {
         type: [Schema.Types.ObjectId],
         ref: 'Collections'
      },
      price: {
         type: Number,
         required: true,
         min: 0,
      },
      comparePrice: {
         type: Number,
         required: true,
         min: 0,
         validate: {
            validator: function(this: IProduct, v: number): boolean {
               return v >= this.price;
            },
            message: 'Compare price should be greater than or equal to the actual price'
         }
      },
      gst: {
         type: Number,
         default: 0,
         min: 0
      },
      sku: {
         type: Number,
         required: true,
         unique: true,
      },
      status: {
         type: String,
         enum: ["draft", "active", "inactive"],
         default: "draft"
      },
      images: {
         type: [
            {
               path: { type: String, trim: true },
               alt: { type: String, trim: true }
            }
         ],
         default: [],
         _id: false
      },
      trackInventory: {
         type: Boolean,
         default: false
      },
      stock: {
         type: Number,
         min: -1,
         default: -1
      },
      options: {
         type: [
            {
               name: { type: String, required: true, trim: true },
               stock: { type: Number, required: true, min: -1,default:-1}
            }
         ],
         default: [],
         _id: false,
      },
      metaData: {
         metaTitle: {
            type: String,
            trim: true
         },
         metaDescription: {
            type: String,
            trim: true
         }
      }
   },
   { timestamps: true }
);

productSchema.pre('validate', function(next) {
   if (this.isModified('title')) {
      this.slug = slugify(this.title, { lower: true, strict: true });
   }

   if (this.images && this.images.length > 0) {
      this.images = this.images.map((image) => ({
         path: image.path,
         alt: image.alt ? image.alt : this.title,
      }));
   }

   next();
});

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;