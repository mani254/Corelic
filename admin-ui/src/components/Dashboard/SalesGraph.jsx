import React, { useState, useEffect } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from "recharts";

const SalesGraph = () => {
	const [activeFilter, setActiveFilter] = useState("1 Week");
	const [graphData, setGraphData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [graphType, setGraphType] = useState("Line");

	// Simulating fetching data from a server
	const fetchData = async (filter) => {
		setLoading(true);
		// Simulate an API call delay
		const response = await new Promise((resolve) =>
			setTimeout(() => {
				const mockData = {
					"1 Day": [
						{ name: "00:00", sales: 30 },
						{ name: "06:00", sales: 50 },
						{ name: "12:00", sales: 80 },
						{ name: "18:00", sales: 60 },
						{ name: "24:00", sales: 100 },
					],
					"3 Days": [
						{ name: "Day 1", sales: 200 },
						{ name: "Day 2", sales: 350 },
						{ name: "Day 3", sales: 500 },
					],
					"1 Week": [
						{ name: "Mon", sales: 300 },
						{ name: "Tue", sales: 450 },
						{ name: "Wed", sales: 400 },
						{ name: "Thu", sales: 500 },
						{ name: "Fri", sales: 600 },
						{ name: "Sat", sales: 700 },
						{ name: "Sun", sales: 800 },
					],
					"2 Weeks": [
						{ name: "Week 1", sales: 3000 },
						{ name: "Week 2", sales: 4500 },
					],
					"1 Month": [
						{ name: "Week 1", sales: 1200 },
						{ name: "Week 2", sales: 1500 },
						{ name: "Week 3", sales: 1800 },
						{ name: "Week 4", sales: 2000 },
					],
					"3 Months": [
						{ name: "Month 1", sales: 4000 },
						{ name: "Month 2", sales: 4500 },
						{ name: "Month 3", sales: 5000 },
					],
					"6 Months": [
						{ name: "Jan", sales: 1000 },
						{ name: "Feb", sales: 1200 },
						{ name: "Mar", sales: 1500 },
						{ name: "Apr", sales: 1800 },
						{ name: "May", sales: 2000 },
						{ name: "Jun", sales: 2200 },
					],
					"1 Year": [
						{ name: "Jan", sales: 1000 },
						{ name: "Feb", sales: 1200 },
						{ name: "Mar", sales: 1500 },
						{ name: "Apr", sales: 1800 },
						{ name: "May", sales: 2000 },
						{ name: "Jun", sales: 2200 },
						{ name: "Jul", sales: 2400 },
						{ name: "Aug", sales: 2500 },
						{ name: "Sep", sales: 2600 },
						{ name: "Oct", sales: 2700 },
						{ name: "Nov", sales: 2800 },
						{ name: "Dec", sales: 3000 },
					],
					Quarterly: [
						{ name: "Q1", sales: 4000 },
						{ name: "Q2", sales: 5000 },
						{ name: "Q3", sales: 6000 },
						{ name: "Q4", sales: 7000 },
					],
				};
				resolve(mockData[filter]);
			}, 1500)
		);
		setGraphData(response);
		setLoading(false);
	};

	useEffect(() => {
		fetchData(activeFilter);
	}, [activeFilter]);

	return (
		<div className="bg-white p-6 rounded-2xl shadow-md">
			<h2 className="text-xl font-semibold mb-4">Sales Overview</h2>

			{/* Filter Buttons */}
			<div className="flex gap-4 mb-6">
				{["1 Day", "3 Days", "1 Week", "2 Weeks", "1 Month", "3 Months", "6 Months", "1 Year", "Quarterly"].map((filter) => (
					<button key={filter} className={`px-4 py-2 rounded-lg ${activeFilter === filter ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setActiveFilter(filter)}>
						{filter}
					</button>
				))}
			</div>

			{/* Graph Type Selection */}
			<div className="flex gap-4 mb-6">
				{["Line", "Bar", "Area"].map((type) => (
					<button key={type} className={`px-4 py-2 rounded-lg ${graphType === type ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setGraphType(type)}>
						{type} Chart
					</button>
				))}
			</div>

			{/* Graph */}
			<div className="w-full h-64">
				{loading ? (
					<div className="flex justify-center items-center h-full">
						<span className="text-gray-500">Loading...</span>
					</div>
				) : (
					<ResponsiveContainer>
						{graphType === "Line" && (
							<LineChart data={graphData}>
								<Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
								<CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
							</LineChart>
						)}
						{graphType === "Bar" && (
							<BarChart data={graphData}>
								<Bar dataKey="sales" fill="#3b82f6" />
								<CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
							</BarChart>
						)}
						{graphType === "Area" && (
							<AreaChart data={graphData}>
								<Area type="monotone" dataKey="sales" stroke="#3b82f6" fill="#bfdbfe" />
								<CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
							</AreaChart>
						)}
					</ResponsiveContainer>
				)}
			</div>
		</div>
	);
};

export default SalesGraph;
