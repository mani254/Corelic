import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { validation } from "../../utils";

import { connect } from "react-redux";
import { register } from "../../redux/auth/authActions";

function Register({ register }) {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const [registerData, setRegisterData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		name: "",
	});

	const [error, setError] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		name: "",
	});

	const navigate = useNavigate();

	function handleChange(e) {
		const { name, value } = e.target;

		setRegisterData((prev) => ({ ...prev, [name]: value }));

		const error = validation(name, value);
		setError((prev) => ({ ...prev, [name]: error ? error : "" }));

		if (name === "confirmPassword") {
			if (!value) return;
			if (registerData.password !== value) {
				return setError({ ...error, confirmPassword: "passwords not match" });
			} else {
				return setError({ ...error, confirmPassword: "" });
			}
		}
		if (name === "password") {
			if (!registerData.confirmPassword) return;
			console.log(registerData.confirmPassword, value);
			if (registerData.confirmPassword !== value) {
				return setError({ ...error, confirmPassword: "passwords not match" });
			} else {
				return setError({ ...error, confirmPassword: "" });
			}
		}
	}

	async function handleSubmit(e) {
		e.preventDefault();

		const hasErrors = Object.values(error).some((value) => value !== "");
		if (hasErrors) return;

		try {
			await register(registerData);
			navigate("/login");
		} catch (error) {
			console.error("Registration failed:", error);
		}
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				<div className="mt-3">
					<h3 className="text-center sm:text-start">Welcome! Create your account</h3>
					<p className=" text-center sm:text-start font-regular text-opacity-60">
						Already have account?{" "}
						<span>
							<NavLink to="/login" className="text-logo font-medium">
								Login
							</NavLink>
						</span>
					</p>
				</div>

				<div className="input-wrapper mt-5 variant-2">
					<label htmlFor="name">User name</label>
					<input type="text" placeholder="User name" name="name" id="name" value={registerData.name} onChange={handleChange} required />
					{error.name && <p className="error">{error.name}</p>}
				</div>

				<div className="input-wrapper mt-5 variant-2">
					<label htmlFor="email">E-mail</label>
					<input type="email" placeholder="Email" name="email" id="email" value={registerData.email} onChange={handleChange} required />
					{error.email && <p className="error">{error.email}</p>}
				</div>

				<div className="input-wrapper mt-5 variant-2">
					<label htmlFor="password">Password</label>
					<div className="relative">
						<input type={`${showPassword ? "text" : "password"}`} placeholder="Password" name="password" id="password" value={registerData.password} onChange={handleChange} required />
						<span
							className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
							onClick={() => {
								setShowPassword(!showPassword);
							}}>
							{showPassword ? <FaEyeSlash className="fill-gray-700" /> : <FaEye className="fill-gray-700" />}
						</span>
					</div>
					{error.password && <p className="error">{error.password}</p>}
				</div>

				<div className="input-wrapper mt-5 variant-2">
					<label htmlFor="confirmPassword">Confirm Password</label>
					<div className="relative">
						<input type={`${showConfirmPassword ? "text" : "password"}`} placeholder="Confirm Password" name="confirmPassword" id="confirmPassword" value={registerData.confirmPassword} onChange={handleChange} required />
						<span
							className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
							onClick={() => {
								setShowConfirmPassword(!showConfirmPassword);
							}}>
							{showConfirmPassword ? <FaEyeSlash className="fill-gray-700" /> : <FaEye className="fill-gray-700" />}
						</span>
					</div>
					{error.confirmPassword && <p className="error">{error.confirmPassword}</p>}
				</div>

				<button className="btn-1" type="submit">
					Register
				</button>
			</form>
		</>
	);
}

const mapDispatchToProps = (dispatch) => {
	return {
		register: (registerData) => dispatch(register(registerData)),
	};
};

export default connect(null, mapDispatchToProps)(Register);
