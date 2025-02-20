import ProductService from "../services/productServices";


// Add Product
export const addProduct = (productData) => async (dispatch) => {
   dispatch({ type: "PRODUCTS_REQUEST" });
   try {
      const data = await ProductService.addProduct(productData);
      dispatch({ type: "ADD_PRODUCT_SUCCESS", payload: data });
   } catch (error) {
      dispatch({ type: "PRODUCTS_FAILURE", payload: error });
   }
};



