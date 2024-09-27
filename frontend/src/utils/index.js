export function validation(action, value) {
   switch (action) {
      case "title":
         const regex = /^.{1,100}$/;
         if (!regex.test(value)) {
            return "Title should be between 1 and 100 characters";
         }
         return "";
      case "overview":
         const overview = /^.{1,100}$/;
         if (!overview.test(value)) {
            return "Overview should be between 1 and 400 characters";
         }
         return "";
      case "sku":
         const sku = /^.{1,20}$/;
         if (!sku.test(value)) {
            return "SKU must be less then 1 and 20";
         }
      default:
         console.log(action);
   }
}


export const options = [
   {
      type: "Clothing",
      sizes: "XS, S, M, L, XL, XXL, XXXL"
   },
   {
      type: "Footwear",
      sizes: "8, 9, 10, 11, 12, 13"
   },

   {
      type: "Ornaments",
      sizes: "5, 6, 7, 8, 9, 10, 11"
   },
   {
      type: "Accessories",
      sizes: "One Size"
   },
   {
      type: "Bags",
      sizes: "Small, Medium, Large"
   },
   {
      type: "Hats",
      sizes: "S/M, L/XL"
   },
];

export function generate11DigitNumber() {
   const number = Math.floor(10000000000 + Math.random() * 90000000000);
   return number.toString();
}
