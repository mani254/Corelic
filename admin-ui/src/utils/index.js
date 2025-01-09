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