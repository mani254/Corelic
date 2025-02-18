import React from "react";
import { DollarSign, ShoppingCart, Calendar } from "lucide-react";
import SalesGraph from "./SalesGraph";
import Orders from "../Orders/Orders";

const dashboardData = [
	{ title: "Total Orders", value: "1,280", icon: ShoppingCart, color: "text-blue-500" },
	{ title: "Total Income", value: "₹ 45,620", icon: DollarSign, color: "text-green-500" },
	{ title: "Today's Orders", value: "85", icon: Calendar, color: "text-yellow-500" },
	{ title: "Today's Income", value: "₹ 3,540", icon: DollarSign, color: "text-purple-500" },
];

const Dashboard = () => {
	return (
		<div className="p-6 bg-main min-h-screen ">
			<h4 className="mb-2">Dashboard</h4>
			<hr className="my-4 border-main-2 " />

			<div className="">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
					{dashboardData.map((item, index) => (
						<div key={index} className=" shadow-md rounded-xl p-6 flex  space-x-4 bg-bright transition duration-200 ease-in-out">
							<item.icon className={`w-5 h-5 mt-1 ${item.color}`} />
							<div>
								<p className="text-gray-500 text-sm">{item.title}</p>
								<p className="text-lg font-semibold">{item.value}</p>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="mt-6">
				<SalesGraph />
			</div>

			<div className="mt-6 bg-bright rounded-xl shadow-md p-6">
				<Orders recent />
			</div>
		</div>
	);
};

export default Dashboard;
