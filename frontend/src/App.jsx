import React, { lazy } from "react";
import { connect } from "react-redux";
import { Route, Routes } from "react-router-dom";

import BackendLayout from "./layouts/BackendLayout";

import "./App.css";
import AddProduct from "./components/Products/AddProduct";
import Products from "./components/Products/Products";
import Home from "./pages/Home";
import LoginRegistration from "./pages/LoginRegistration";

import Modal from "./components/Modal/Modal";
import Notification from "./components/Notifications/Notifications";

function App({ modal }) {
	return (
		<React.Fragment>
			<div className="bg-zinc-100 min-h-screen">
				<Notification />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<LoginRegistration />} />
					<Route path="/register" element={<LoginRegistration />} />
					<Route element={<BackendLayout />}>
						<Route path="products">
							<Route index element={<Products />} />
							<Route path="add" element={<AddProduct />} />
						</Route>
					</Route>
				</Routes>
			</div>

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
