import React, { lazy } from "react";
import { connect } from "react-redux";

const Modal = lazy(() => import("./components/Modal/Modal"));

function App({ modal }) {
	return (
		<React.Fragment>
			<h1>Hello World</h1>
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
