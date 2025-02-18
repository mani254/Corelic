import React, { useState, useEffect } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from "recharts";

import { ChartLine, ChartColumn, ChartArea } from "lucide-react";

const SalesGraph = () => {
	const [activeFilter, setActiveFilter] = useState("Total");
	const [graphData, setGraphData] = useState([]);
	const [graphType, setGraphType] = useState("Area");
	const [loading, setLoading] = useState(true);

	const graphOptions = [
		{ type: "Area", icon: ChartArea },
		{ type: "Line", icon: ChartLine },
		{ type: "Bar", icon: ChartColumn },
	];

	// Simulating fetching data from a server
	const fetchData = async (filter) => {
		setLoading(true);
		// Simulate an API call delay
		const response = await new Promise((resolve) =>
			setTimeout(() => {
				const mockData = {
					"1D": [
						{ name: "00:00", sales: 30 },
						{ name: "03:00", sales: 80 },
						{ name: "06:00", sales: 20 },
						{ name: "09:00", sales: 90 },
						{ name: "12:00", sales: 50 },
						{ name: "15:00", sales: 120 },
						{ name: "18:00", sales: 60 },
						{ name: "21:00", sales: 10 },
						{ name: "24:00", sales: 100 },
					],
					"1W": [
						{ name: "Mon", sales: 500 },
						{ name: "Tue", sales: 200 },
						{ name: "Wed", sales: 800 },
						{ name: "Thu", sales: 300 },
						{ name: "Fri", sales: 1000 },
						{ name: "Sat", sales: 400 },
						{ name: "Sun", sales: 700 },
					],
					"1M": [
						{ name: "Week 1", sales: 1800 },
						{ name: "Week 2", sales: 1000 },
						{ name: "Week 3", sales: 2500 },
						{ name: "Week 4", sales: 900 },
					],
					"6M": [
						{ name: "Jan", sales: 1300 },
						{ name: "Feb", sales: 700 },
						{ name: "Mar", sales: 1800 },
						{ name: "Apr", sales: 1200 },
						{ name: "May", sales: 2700 },
						{ name: "Jun", sales: 800 },
					],
					"1Y": [
						{ name: "Jan", sales: 1500 },
						{ name: "Feb", sales: 900 },
						{ name: "Mar", sales: 2000 },
						{ name: "Apr", sales: 800 },
						{ name: "May", sales: 2500 },
						{ name: "Jun", sales: 700 },
						{ name: "Jul", sales: 3000 },
						{ name: "Aug", sales: 1700 },
						{ name: "Sep", sales: 2200 },
						{ name: "Oct", sales: 1200 },
						{ name: "Nov", sales: 2800 },
						{ name: "Dec", sales: 1000 },
					],
					"5Y": [
						{ name: "Year 1", sales: 20000 },
						{ name: "Year 2", sales: 17000 },
						{ name: "Year 3", sales: 25000 },
						{ name: "Year 4", sales: 18000 },
						{ name: "Year 5", sales: 28000 },
					],
					Total: [
						{ name: "2019", sales: 50000 },
						{ name: "2020", sales: 60000 },
						{ name: "2021", sales: 55000 },
						{ name: "2022", sales: 70000 },
						{ name: "2023", sales: 65000 },
						{ name: "2024", sales: 80000 },
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
		<div className="bg-bright p-6 rounded-xl shadow-md">
			<div className="flex items-center justify-between align-items-center mb-4 gap-10">
				<h5>Sales Overview</h5>

				<div className="flex gap-4">
					{graphOptions.map((graph) => (
						<div key={graph.type} className="cursor-pointer" onClick={() => setGraphType(graph.type)}>
							<graph.icon className={`px-1 py-1 w-7 h-7 rounded-lg ${graphType === graph.type ? "bg-primary text-white" : "bg-main-2"}`} />
						</div>
					))}
				</div>

				{/* Filter Buttons */}
				<div className="flex gap-3">
					{["Total", "5Y", "1Y", "6M", "1M", "1W", "1D"].map((filter) => (
						<button key={filter} className={`px-4 py-1 rounded-xl text-xs  ${activeFilter === filter ? "bg-primary text-white" : "bg-main-2"}`} onClick={() => setActiveFilter(filter)}>
							{filter}
						</button>
					))}
				</div>
			</div>

			{/* Graph */}
			<div className="w-full h-64">
				{loading ? (
					<div className="animate-pulse flex justify-center items-center h-full bg-gray-200 rounded-lg">
						<div className="w-3/4 h-48 bg-gray-300 rounded-md"></div>
					</div>
				) : (
					<ResponsiveContainer>
						{graphType === "Line" && (
							<LineChart data={graphData}>
								<Line type="monotone" dataKey="sales" stroke="rgb(139,92,246)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
								<CartesianGrid stroke="rgba(150,150,150,0.2)" strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
							</LineChart>
						)}
						{graphType === "Bar" && (
							<BarChart data={graphData}>
								<Bar dataKey="sales" fill="rgb(237,233,254)" />
								<CartesianGrid stroke="rgba(150,150,150,0.2)" strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
							</BarChart>
						)}
						{graphType === "Area" && (
							<AreaChart data={graphData}>
								<Area type="monotone" dataKey="sales" stroke="rgb(139,92,246)" fill="rgb(237,233,254)" />
								<CartesianGrid stroke="rgba(150,150,150,0.2)" strokeDasharray="3 3" />
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
