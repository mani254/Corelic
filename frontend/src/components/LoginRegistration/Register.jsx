import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink } from "react-router-dom";

function Register() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	return (
		<>
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
				<label htmlFor="email">E-mail:</label>
				<input type="email" placeholder="Email" name="email" id="email" />
			</div>

			<div className="input-wrapper mt-5 variant-2">
				<label htmlFor="password">Password:</label>
				<div className="relative">
					<input type={`${showPassword ? "text" : "password"}`} placeholder="Password" name="password" id="password" />
					<span
						className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
						onClick={() => {
							setShowPassword(!showPassword);
						}}>
						{showPassword ? <FaEyeSlash className="fill-gray-700" /> : <FaEye className="fill-gray-700" />}
					</span>
				</div>
			</div>

			<div className="input-wrapper mt-5 variant-2">
				<label htmlFor="confirmPassword">Confirm Password:</label>
				<div className="relative">
					<input type={`${showPassword ? "text" : "password"}`} placeholder="Confirm Password" name="confirmPassword" id="confirmPassword" />
					<span
						className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
						onClick={() => {
							setShowConfirmPassword(!showConfirmPassword);
						}}>
						{showConfirmPassword ? <FaEyeSlash className="fill-gray-700" /> : <FaEye className="fill-gray-700" />}
					</span>
				</div>
			</div>

			<button className="btn-1">Register</button>
		</>
	);
}

export default Register;
