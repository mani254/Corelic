import "./App.css";
import { Route, Routes } from "react-router-dom";
import Products from "./components/Products/Products";
import AddProduct from "./components/Products/AddProduct";
import ProductsWrapper from "./components/Products/ProductsWrapper";

import Notifications from "./components/Notifications/Notifications";
import BaseLayout from "./Layouts/BaseLayout";
import Dashboard from "./components/Dashboard/Dashboard";
import OrdersWrapper from "./components/Orders/OrdersWrapper";
import Orders from "./components/Orders/Orders";
import Collections from "./components/Collections/Collections";
import CollectionsWrapper from "./components/Collections/CollectionsWrapper";
import AddCollection from "./components/Collections/AddCollection";

function App() {
	return (
		<main className=" max-w-[1800px] mx-auto">
			<Notifications />
			<Routes>
				<Route path="/" element={<BaseLayout />}>
					<Route index element={<Dashboard />} />
					<Route path="/products" element={<ProductsWrapper />}>
						<Route index element={<Products />}></Route>
						<Route path="add" element={<AddProduct />}></Route>
					</Route>
					<Route path="/orders" element={<OrdersWrapper />}>
						<Route index element={<Orders />}></Route>
					</Route>
					<Route path="/collections" element={<CollectionsWrapper />}>
						<Route index element={<Collections />}></Route>
						<Route path="add" element={<AddCollection />}></Route>
					</Route>
				</Route>
			</Routes>
		</main>
	);
}

export default App;
