import React, { useState, useCallback, useRef, useEffect } from "react";
import { CheckboxInput } from "../FormComponents/FormComponents";
import Actions from "../Actions/Actions";
import OrderActions from "../Actions/OrderActions";
import Pagination from "../Pagination/Pagination";
import { useSearchParams } from "react-router-dom";
import OrdersFilter from "./OrdersFilter";

const Orders = () => {
	const [orders, setOrders] = useState([
		{
			_id: 101,
			deliveryDate: "2025-01-25",
			status: "Delivered",
			totalPrice: "$120",
			noOfProducts: 5,
			customer: {
				name: "John Doe",
				email: "john.doe@example.com",
				phone: "+1234567890",
			},
			shippingAddress: {
				street: "123 Main St",
				city: "Los Angeles",
				state: "CA",
				postalCode: "90001",
				country: "USA",
			},
			paymentMethod: "Credit Card",
			orderedAt: "2025-01-20",
		},
		{
			_id: 102,
			deliveryDate: "2025-01-27",
			status: "Shipped",
			totalPrice: "$75",
			noOfProducts: 3,
			customer: {
				name: "Alice Smith",
				email: "alice.smith@example.com",
				phone: "+9876543210",
			},
			shippingAddress: {
				street: "456 Oak St",
				city: "New York",
				state: "NY",
				postalCode: "10001",
				country: "USA",
			},
			paymentMethod: "PayPal",
			orderedAt: "2025-01-19",
		},
		{
			_id: 103,
			deliveryDate: "2025-01-30",
			status: "Pending",
			totalPrice: "$200",
			noOfProducts: 8,
			customer: {
				name: "Bob Lee",
				email: "bob.lee@example.com",
				phone: "+1122334455",
			},
			shippingAddress: {
				street: "789 Pine St",
				city: "Chicago",
				state: "IL",
				postalCode: "60601",
				country: "USA",
			},
			paymentMethod: "Debit Card",
			orderedAt: "2025-01-18",
		},
		{
			_id: 104,
			deliveryDate: "2025-01-22",
			status: "Cancelled",
			totalPrice: "$50",
			noOfProducts: 2,
			customer: {
				name: "Mary Johnson",
				email: "mary.johnson@example.com",
				phone: "+3344556677",
			},
			shippingAddress: {
				street: "101 Maple Ave",
				city: "San Francisco",
				state: "CA",
				postalCode: "94102",
				country: "USA",
			},
			paymentMethod: "Credit Card",
			orderedAt: "2025-01-15",
		},
		{
			_id: 105,
			deliveryDate: "2025-02-05",
			status: "Packed",
			totalPrice: "$150",
			noOfProducts: 6,
			customer: {
				name: "Steve Green",
				email: "steve.green@example.com",
				phone: "+1456789234",
			},
			shippingAddress: {
				street: "202 Birch Rd",
				city: "Austin",
				state: "TX",
				postalCode: "73301",
				country: "USA",
			},
			paymentMethod: "Credit Card",
			orderedAt: "2025-01-20",
		},
		{
			_id: 106,
			deliveryDate: "2025-02-01",
			status: "Shipped",
			totalPrice: "$180",
			noOfProducts: 4,
			customer: {
				name: "Sara Adams",
				email: "sara.adams@example.com",
				phone: "+7654321098",
			},
			shippingAddress: {
				street: "303 Cedar Blvd",
				city: "Miami",
				state: "FL",
				postalCode: "33101",
				country: "USA",
			},
			paymentMethod: "Stripe",
			orderedAt: "2025-01-18",
		},
		{
			_id: 107,
			deliveryDate: "2025-02-10",
			status: "Pending",
			totalPrice: "$90",
			noOfProducts: 3,
			customer: {
				name: "David Clark",
				email: "david.clark@example.com",
				phone: "+2334455667",
			},
			shippingAddress: {
				street: "404 Elm St",
				city: "Seattle",
				state: "WA",
				postalCode: "98101",
				country: "USA",
			},
			paymentMethod: "Cash on Delivery",
			orderedAt: "2025-01-22",
		},
		{
			_id: 108,
			deliveryDate: "2025-02-03",
			status: "Delivered",
			totalPrice: "$210",
			noOfProducts: 7,
			customer: {
				name: "Olivia Turner",
				email: "olivia.turner@example.com",
				phone: "+4455667788",
			},
			shippingAddress: {
				street: "505 Pineapple Rd",
				city: "San Diego",
				state: "CA",
				postalCode: "92101",
				country: "USA",
			},
			paymentMethod: "Bank Transfer",
			orderedAt: "2025-01-17",
		},
		{
			_id: 109,
			deliveryDate: "2025-01-28",
			status: "Shipped",
			totalPrice: "$130",
			noOfProducts: 5,
			customer: {
				name: "William Scott",
				email: "william.scott@example.com",
				phone: "+5566778899",
			},
			shippingAddress: {
				street: "606 Water St",
				city: "Dallas",
				state: "TX",
				postalCode: "75201",
				country: "USA",
			},
			paymentMethod: "PayPal",
			orderedAt: "2025-01-21",
		},
		{
			_id: 110,
			deliveryDate: "2025-02-07",
			status: "Packed",
			totalPrice: "$300",
			noOfProducts: 10,
			customer: {
				name: "Emma White",
				email: "emma.white@example.com",
				phone: "+6677889900",
			},
			shippingAddress: {
				street: "707 Rosewood Ln",
				city: "Denver",
				state: "CO",
				postalCode: "80202",
				country: "USA",
			},
			paymentMethod: "Credit Card",
			orderedAt: "2025-01-23",
		},
	]);

	const [searchParams] = useSearchParams();
	const initialRender = useRef(true);
	const [selectedOrders, setSelectedOrders] = useState([]);

	// useEffect to send the request to the backend when ever there is a change in the search params
	useEffect(() => {
		if (initialRender.current) {
			initialRender.current = false;
			return;
		}
		if (searchParams.size !== 0) {
			console.log("Request sent to backend with params:", Object.fromEntries(searchParams.entries()));
		}
	}, [searchParams]);

	// function to select all orders
	const handleSelectAll = useCallback(
		(e) => {
			setSelectedOrders(e.target.checked ? orders.map((o) => o._id) : []);
		},
		[orders]
	);

	// function to handle order select
	const handleCheckboxChange = useCallback((id) => {
		setSelectedOrders((prev) => (prev.includes(id) ? prev.filter((orderId) => orderId !== id) : [...prev, id]));
	}, []);

	return (
		<div className="overflow-x-auto">
			<h4 className="mb-5">Orders</h4>
			<OrdersFilter />
			<table className="w-full border-collapse">
				<thead>
					<tr className="bg-main-2">
						<th className="px-6 py-3 text-left font-medium w-10">
							<CheckboxInput onChange={handleSelectAll} checked={orders.length > 0 && selectedOrders.length === orders.length} />
						</th>
						<th className="px-6 py-3 text-left font-medium">Customer</th>
						<th className="px-6 py-3 text-left font-medium">No. of Products</th>
						<th className="px-6 py-3 text-left font-medium">Total Price</th>
						<th className="px-6 py-3 text-left font-medium">Delivery Date</th>
						<th className="px-6 py-3 text-left font-medium">Status</th>
						<th className="px-6 py-3 text-left font-medium">Actions</th>
					</tr>
				</thead>
				<tbody>
					{orders.map((order) => (
						<tr key={order._id} className="border-t border-main-2 hover:bg-opacity-50 hover:bg-main-2 cursor-pointer">
							<td className="px-6 py-2">
								<CheckboxInput checked={selectedOrders.includes(order._id)} onChange={() => handleCheckboxChange(order._id)} />
							</td>
							<td className="px-6 py-2">
								<span className="block">{order.customer.name}</span>
								<span className="block text-xs text-gray-500">{order.customer.email}</span>
							</td>
							<td className="px-6 py-2">{order.noOfProducts}</td>
							<td className="px-6 py-2">{order.totalPrice}</td>
							<td className="px-6 py-2">{order.deliveryDate}</td>
							<td className="px-6 py-2">
								<span className={`inline-block px-3 py-1 rounded-full text-xxs ${order.status === "Delivered" ? "bg-green-100 text-green-800" : order.status === "Shipped" ? "bg-yellow-100 text-yellow-800" : order.status === "Pending" ? "bg-blue-100 text-blue-800" : order.status === "Packed" ? "bg-purple-100 text-purple-800" : "bg-red-100 text-red-800"}`}>{order.status}</span>
							</td>

							<td className="px-6 py-2">
								<Actions>
									<OrderActions multiSelect={selectedOrders.length > 1} />
								</Actions>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<Pagination totalItems={100} />
		</div>
	);
};

export default Orders;
