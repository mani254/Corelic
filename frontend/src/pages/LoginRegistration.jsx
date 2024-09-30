import React, { useEffect, useState } from "react";
import { google, apple, loginBackground } from "../utils";

import Register from "../components/LoginRegistration/Register";
import Login from "../components/LoginRegistration/Login";

import { useLocation, NavLink } from "react-router-dom";

function LoginRegistration() {
	const [register, setRegister] = useState(false);

	const { pathname } = useLocation();

	useEffect(() => {
		if (pathname == "/login") return setRegister(false);

		setRegister(true);
	}, [pathname]);
	return (
		<section className="w-full h-screen flex justify-end bg-zinc-500">
			<div className="relative sm:w-full">
				<img className="absolute w-full h-full object-cover object-center" src={loginBackground} alt="login page background" />
			</div>
			<div className="w-full md:w-[700px] sm:min-w-[500px] bg-white p-5 sm:p-10 flex items-center">
				<div className="w-full">
					<img className="m-auto sm:m-0 w-12 h-12" src="https://t3.ftcdn.net/jpg/08/26/72/82/360_F_826728280_eNTbNai5v92vHiW1efSfWK5XoDteQkIC.jpg" alt="logo" />

					{register ? <Register /> : <Login />}

					<div className="flex items-center mt-6">
						<div className="h-[1px] bg-gray-400 w-full"></div>
						<p className="whitespace-nowrap px-4"> Or continue with</p>
						<div className="h-[1px] bg-gray-400 w-full"></div>
					</div>

					<div className="flex justify-around mt-6 gap-4">
						<div className=" flex items-center justify-center border border-gray-300 px-3 py-1 rounded-md bg-white shadow-sm cursor-pointer w-full">
							<img className="w-6 mr-3" src={google} alt="google svg icon"></img>
							<p className="whitespace-nowrap font-medium">Google</p>
						</div>
						<div className="flex items-center justify-center border border-gray-300 px-3 py-1 rounded-md bg-white shadow-sm cursor-pointer w-full">
							<img className="w-6 mr-3" src={apple} alt="apple svg icon"></img>
							<p className="whitespace-nowrap font-medium">Apple</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default LoginRegistration;
