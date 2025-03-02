import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { connect } from "react-redux";

import BaseLayout from "./Layouts/BaseLayout";
import Notifications from "./components/Notifications/Notifications";
import Modal from "./components/Modal/Modal";
import Dashboard from "./components/Dashboard/Dashboard";

import ProductsWrapper from "./components/Products/ProductsWrapper";
import Products from "./components/Products/Products";
import AddProduct from "./components/Products/AddProduct";

import OrdersWrapper from "./components/Orders/OrdersWrapper";
import Orders from "./components/Orders/Orders";

import CollectionsWrapper from "./components/Collections/CollectionsWrapper";
import Collections from "./components/Collections/Collections";
import AddCollection from "./components/Collections/AddCollection";
import BrandsWrapper from "./components/Brands/BrandsWrapper";
import Brands from "./components/Brands/Brands";
import AddBrand from "./components/Brands/AddBrand";

function App({ modal }) {
	return (
		<React.Fragment>
			<main className="max-w-[1800px] mx-auto">
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
						<Route path="/brands" element={<BrandsWrapper />}>
							<Route index element={<Brands />}></Route>
							<Route path="add" element={<AddBrand />}></Route>
						</Route>
					</Route>
				</Routes>
			</main>
			{modal.showModal && <Modal props={modal.modalProps} component={modal.modalComponent} />}
		</React.Fragment>
	);
}

const mapStateToProps = (state) => {
	return {
		modal: state.modal,
	};
};
export default connect(mapStateToProps, null)(App);
