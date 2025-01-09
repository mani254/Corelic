import "./App.css";
import { Route, Routes } from "react-router-dom";
import Products from "./components/Products/Products";
import AddProduct from "./components/Products/AddProduct";
import ProductsWrapper from "./components/Products/ProductsWrapper";

import Notifications from "./components/Notifications/Notifications";

function App() {
	return (
		<main className="">
			<Notifications />
			<Routes>
				<Route path="/products" element={<ProductsWrapper />}>
					<Route index element={<Products />}></Route>
					<Route path="add" element={<AddProduct />}></Route>
				</Route>
			</Routes>
		</main>
	);
}

export default App;
