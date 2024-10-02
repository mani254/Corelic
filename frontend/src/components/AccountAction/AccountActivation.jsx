import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";

import { connect } from "react-redux";
import { activateUser } from "../../redux/auth/authActions";

function AccountActivation({ auth, activateUser }) {
	const [searchParams] = useSearchParams();
	const email = searchParams.get("email");
	const activationcode = searchParams.get("activationcode");

	const [message, setMessage] = useState();
	const navigate = useNavigate();

	useEffect(() => {
		async function activate() {
			try {
				await activateUser(email, activationcode);
				navigate("/login");
			} catch (err) {
				console.log(err);
				setMessage(err);
			}
		}
		activate();
	}, []);

	return (
		<div className="relative h-screen">
			{auth.loading ? (
				<Loader></Loader>
			) : (
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[350px] text-center">
					<h3>{message}</h3>
					<button
						className="btn-1"
						onClick={() => {
							navigate("/login");
						}}>
						Login
					</button>
				</div>
			)}
		</div>
	);
}

const mapStateToProps = (state) => {
	return {
		auth: state.auth,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		activateUser: (email, activationcode) => dispatch(activateUser(email, activationcode)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountActivation);
