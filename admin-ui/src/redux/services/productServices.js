import axios from "axios";

const API = axios.create({
   baseURL: `${import.meta.env.VITE_API_BACKEND_URI}/api/products`,
   headers: { "Content-Type": "application/json" },
});

class ProductServices {

   static async addProduct(productData) {
      try {
         const response = await API.post("/", productData);
         return response.data;
      } catch (error) {
         throw new Error(error.response?.data?.message || "Failed to add product");
      }
   }

}

export default ProductServices;
