import logo from '../assets/images/logo.png'

export { logo }

export function validation(action, value) {
   switch (action) {
      case "title":
         let regex = /^.{1,60}$/;
         if (value === "") {
            return "Title is required"
         }
         else if (!regex.test(value)) {
            return "Title must be less than 60 charecters";
         }
         return "";
      case "metaTitle":
         let metaTitle = /^.{0,60}$/;
         if (!metaTitle.test(value)) {
            return "Title must be less than 60 charecters";
         }
         return "";
      case "metaDescription":
         let metaDesc = /^.{0,400}$/;
         if (!metaDesc.test(value)) {
            return "Title must be less than 400 charecters";
         }
         return "";
      case "overview":
         const overview = /^.{1,450}$/;
         if (value === "") {
            return "Overview is required"
         }
         else if (!overview.test(value)) {
            return "Overview should be less than 450 characters";
         }
         return "";
      case "sku":
         const sku = /^.{1,20}$/;
         if (value === "") {
            return "Sku is required"
         }
         else if (!sku.test(value)) {
            return "SKU must be less then 20 Charecters";
         }
         return ""
      case "email":
         const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
         if (!emailRegex.test(value)) {
            return "Invalid email address"
         }
         return ""
      case "password":
         const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
         if (!passwordRegex.test(value)) {
            return "At least 6 charecters and 1 special Charecter"
         }
         return ""
      default:
         console.log(action);
   }
}

export const defaultOptions = [
   { type: "None", sizes: [] },
   {
      type: "Clothing",
      sizes: [
         { name: "XS", stock: 0 },
         { name: "S", stock: 0 },
         { name: "M", stock: 0 },
         { name: "L", stock: 0 },
         { name: "XL", stock: 0 },
         { name: "XXL", stock: 0 },
         { name: "XXXL", stock: 0 },
      ],
   },
   {
      type: "Footwear",
      sizes: [
         { name: "8", stock: 0 },
         { name: "9", stock: 0 },
         { name: "10", stock: 0 },
         { name: "11", stock: 0 },
         { name: "12", stock: 0 },
         { name: "13", stock: 0 },
      ],
   },
   {
      type: "Ornaments",
      sizes: [
         { name: "5", stock: 0 },
         { name: "6", stock: 0 },
         { name: "7", stock: 0 },
         { name: "8", stock: 0 },
         { name: "9", stock: 0 },
         { name: "10", stock: 0 },
         { name: "11", stock: 0 },
      ],
   },
   { type: "Accessories", sizes: [{ name: "One Size", stock: 0 }] },
   {
      type: "Bags",
      sizes: [
         { name: "Small", stock: 0 },
         { name: "Medium", stock: 0 },
         { name: "Large", stock: 0 },
      ],
   },
   {
      type: "Hats",
      sizes: [
         { name: "S/M", stock: 0 },
         { name: "L/XL", stock: 0 },
      ],
   },
];