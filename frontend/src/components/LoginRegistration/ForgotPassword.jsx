import React, { useState, useEffect } from "react";
import { validation } from "../../utils";
import CloseModelBtn from "../Modal/CloseModelBtn";

import { FaEye, FaEyeSlash } from "react-icons/fa";

function ForgotPassword() {
	const [showOtp, setShowOtp] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const [otp, setOtp] = useState(Array(6).fill(""));

	const [data, setData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
	});

	const [error, setError] = useState({
		email: "",
		password: "",
		confirmPassword: "",
	});

	const [timer, setTimer] = useState(30);
	const [isTimerActive, setIsTimerActive] = useState(false);
	const [changePassword, setChangePassword] = useState(false);

	useEffect(() => {
		let countdown;
		if (isTimerActive && timer > 0) {
			countdown = setInterval(() => {
				setTimer((prevTimer) => prevTimer - 1);
			}, 1000);
		} else if (timer === 0) {
			setIsTimerActive(false);
		}
		return () => clearInterval(countdown);
	}, [isTimerActive, timer]);

	const handleOtpChange = (e, index) => {
		const value = e.target.value;

		// Allow only one digit input
		if (/\d/.test(value) && value.length <= 1) {
			const newOtp = [...otp];
			newOtp[index] = value;
			setOtp(newOtp);
			console.log(newOtp);

			if (index < 5 && value.length === 1) {
				document.getElementById(`otp-${index + 1}`).focus();
			}
		}
	};

	const handleKeyDown = (e, index) => {
		if (e.key === "Backspace") {
			const newOtp = [...otp];
			newOtp[index] = "";
			setOtp(newOtp);
			console.log(newOtp);

			if (index > 0 && otp[index] === "") {
				const el = document.getElementById(`otp-${index - 1}`);
				if (el) {
					el.focus();
				}
			}
		}
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setData((prev) => ({ ...prev, [name]: value }));

		const error = validation(name, value);
		setError((prev) => ({ ...prev, [name]: error }));

		if (name === "confirmPassword") {
			if (!value) return;
			if (data.password !== value) {
				return setError({ ...error, confirmPassword: "passwords not match" });
			}
		}
		if (name === "password") {
			if (!data.confirmPassword) return;
			if (data.confirmPassword !== value) {
				return setError({ ...error, confirmPassword: "passwords not match" });
			} else {
				return setError({ ...error, confirmPassword: "" });
			}
		}
	};

	function handleGetOtp() {
		setTimer(30);
		setIsTimerActive(true);
		setShowOtp(true);
	}

	function verifyOTP() {
		setChangePassword(true);
	}

	return (
		<div className="relative w-full max-w-md p-7 bg-white rounded-xl shadow-md">
			{changePassword ? (
				<>
					<h3>Set new password</h3>
					<div className="input-wrapper mt-3 variant-2">
						<label htmlFor="password">Password:</label>
						<div className="relative">
							<input type={`${showPassword ? "text" : "password"}`} placeholder="Password" name="password" id="password" value={data.password} onChange={handleChange} />
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

					<div className="input-wrapper mt-3 variant-2">
						<label htmlFor="confirmPassword">Confirm Password:</label>
						<div className="relative">
							<input type={`${showPassword ? "text" : "password"}`} placeholder="Confirm Password" name="confirmPassword" id="confirmPassword" value={data.confirmPassword} onChange={handleChange} />
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

					<button className="btn-1">Set Password</button>
				</>
			) : (
				<>
					{showOtp ? (
						<>
							<h3>Enter OTP Here</h3>
							<p>Please check your spam folder as well.</p>
							<div className="flex items-center justify-between gap-3 mt-5">
								{otp.map((digit, index) => (
									<input key={index} type="text" id={`otp-${index}`} value={digit} onChange={(e) => handleOtpChange(e, index)} onKeyDown={(e) => handleKeyDown(e, index)} maxLength={1} className="w-12 h-12 text-center border border-gray-500 text-lg outline-none rounded" />
								))}
							</div>
							<div className="flex justify-between mt-6">
								<p
									className="cursor-pointer"
									onClick={() => {
										setTimer(30);
										setIsTimerActive(false);
										setShowOtp(false);
									}}>
									Change email?
								</p>
								{timer > 0 ? <p>{timer} seconds left to request OTP.</p> : <p className="text-logo cursor-pointer">Resend OTP</p>}
							</div>
							<button type="button" className="btn-1 mt-6" onClick={verifyOTP}>
								Verify OTP
							</button>
						</>
					) : (
						<>
							<h3>Forgot Password?</h3>
							<p>Enter Your Registered email to change password</p>
							<div className="input-wrapper mt-3 variant-2 w-full">
								<label htmlFor="email">E-mail:</label>
								<input type="email" placeholder="Email" name="email" id="email" value={data.email} onChange={handleChange} />
								{error.email && <p className="error">{error.email}</p>}
							</div>
							<button className="btn-1" onClick={() => handleGetOtp()}>
								Get OTP
							</button>
						</>
					)}
				</>
			)}
			<div className="absolute right-5 top-5">
				<CloseModelBtn />
			</div>
		</div>
	);
}

export default ForgotPassword;
