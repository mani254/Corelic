import React, { useState } from "react";

import CloseModelBtn from "../Modal/CloseModelBtn";

function ForgotPassword() {
	const [showOtp, setShowOtp] = useState(true);

	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState(Array(6).fill(""));

	const [timer, setTimer] = useState(30);

	const handleChange = (e, index) => {
		const value = e.target.value;
		if (/\d/.test(value) && value.length <= 1) {
			const newOtp = [...otp];
			newOtp[index] = value;
			setOtp(newOtp);
			if (index < 5) {
				document.getElementById(`otp-${index + 1}`).focus();
			}
		}
	};

	const handleKeyDown = (e, index) => {
		if (e.key === "Backspace" && index >= 0) {
			const newOtp = [...otp];
			newOtp[index] = "";
			setOtp(newOtp);
			document.getElementById(`otp-${index - 1}`).focus();
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle OTP submission logic here
		console.log("OTP:", otp.join(""));
	};

	return (
		<div className="relative w-full max-w-md p-7 bg-white rounded-xl shadow-md">
			{showOtp ? (
				<>
					<h3>Enter Otp Here</h3>

					<div className="flex items-center justify-between gap-3 mt-5">
						{otp.map((digit, index) => (
							<input key={index} type="text" id={`otp-${index}`} value={digit} onChange={(e) => handleChange(e, index)} onKeyDown={(e) => handleKeyDown(e, index)} maxLength={1} className="w-14 h-14 text-center border border-gray-500  outline-none rounded" />
						))}
					</div>

					<div className="flex justify-between mt-6">
						<p className="cursor-pointer">Change email Address?</p>
						<p className=" text-logo font-medium">Resend OTP</p>
					</div>

					<button type="submit" className="btn-1 mt-6">
						Verify OTP
					</button>
				</>
			) : (
				<>
					<h3>Forgot Password?</h3>
					<p>Enter Your Registered email to change password</p>
					<div className="input-wrapper mt-3 variant-2 w-full">
						<label htmlFor="email">E-mail:</label>
						<input type="email" placeholder="Email" name="email" id="email" />
					</div>
					<button className="btn-1">Get OTP</button>
				</>
			)}

			<div className="absolute right-5 top-5">
				<CloseModelBtn />
			</div>
		</div>
	);
}

export default ForgotPassword;
