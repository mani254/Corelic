import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink } from "react-router-dom";

function Login() {
	const [showPassword, setShowPassword] = useState(false);
	return (
		<>
			<div className="mt-3">
				<h3 className="text-center sm:text-start">Sign in to your account</h3>
				<p className=" text-center sm:text-start font-regular text-opacity-60">
					Not a member?{" "}
					<span>
						<NavLink to="/register" className="text-logo font-medium">
							Create Account
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

			<p className="font-medium text-logo text-end cursor-pointer">Forgot Password?</p>

			<button className="btn-1"> Sign In</button>
		</>
	);
}

export default Login;
