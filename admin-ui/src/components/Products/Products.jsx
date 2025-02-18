import React, { useState, useCallback, useRef, useEffect } from "react";
import { CheckboxInput } from "../FormComponents/FormComponents";
// import ProductActions from "./ProductActions";
import Actions from "../Actions/Actions";
import ProductActions from "../Actions/ProductActions";
import { useSearchParams } from "react-router-dom";
import Pagination from "../Pagination/Pagination";
import ProductsFilter from "./ProductsFilter";
import ImageComponent from "../Images/ImageComponent";

const Products = () => {
	const [products, setProducts] = useState([
		{
			_id: 1,
			image: "/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=400",
			title: "Denim Jacket",
			price: "$50",
			stock: 30,
			status: "Active",
		},
		{
			_id: 2,
			image: "/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=400",
			title: "Casual T-Shirt",
			price: "$20",
			stock: 100,
			status: "Active",
		},
		{
			_id: 3,
			image: "/photos/6311395/pexels-photo-6311395.jpeg?auto=compress&cs=tinysrgb&w=400",
			title: "Formal Blazer",
			price: "$75",
			stock: 15,
			status: "Draft",
		},
		{
			_id: 4,
			image: "/photos/460256/pexels-photo-460256.jpeg?auto=compress&cs=tinysrgb&w=400",
			title: "Leather Boots",
			price: "$90",
			stock: 20,
			status: "Inactive",
		},
		{
			_id: 5,
			image: "/photos/6311523/pexels-photo-6311523.jpeg?auto=compress&cs=tinysrgb&w=400",
			title: "Summer Dress",
			price: "$60",
			stock: 25,
			status: "Active",
		},
		{
			_id: 6,
			image: "/photos/6311395/pexels-photo-6311395.jpeg?auto=compress&cs=tinysrgb&w=400",
			title: "Men's Sneakers",
			price: "$40",
			stock: 50,
			status: "Draft",
		},
		{
			_id: 7,
			image: "/photos/6311523/pexels-photo-6311523.jpeg?auto=compress&cs=tinysrgb&w=400",
			title: "Hooded Sweatshirt",
			price: "$35",
			stock: 40,
			status: "Active",
		},
		{
			_id: 8,
			image: "/photos/460256/pexels-photo-460256.jpeg?auto=compress&cs=tinysrgb&w=400",
			title: "Knitted Scarf",
			price: "$15",
			stock: 60,
			status: "Active",
		},
		{
			_id: 9,
			image: "/photos/6311517/pexels-photo-6311517.jpeg?auto=compress&cs=tinysrgb&w=400",
			title: "Baseball Cap",
			price: "$10",
			stock: 100,
			status: "Active",
		},
		{
			_id: 10,
			image: "/photos/6311513/pexels-photo-6311513.jpeg?auto=compress&cs=tinysrgb&w=400",
			title: "Woolen Gloves",
			price: "$20",
			stock: 30,
			status: "Inactive",
		},
	]);

	const [searchParams] = useSearchParams();
	const initialRender = useRef(true);

	const [selectedProducts, setSelectedProducts] = useState([]);

	//useEffect to send the request to the backend whenever there is a change in the searchParams
	useEffect(() => {
		if (initialRender.current) {
			initialRender.current = false;
			return;
		}
		if (searchParams.size !== 0) {
			console.log("Request sent to backend with params:", Object.fromEntries(searchParams.entries()));
		}
	}, [searchParams]);

	//function to select all the items _id that are in the products to the selected products state
	const handleSelectAll = useCallback(
		(e) => {
			setSelectedProducts(e.target.checked ? products.map((p) => p._id) : []);
		},
		[products]
	);

	//function to handle checkblox click functionality
	const handleCheckboxChange = useCallback((id) => {
		setSelectedProducts((prev) => (prev.includes(id) ? prev.filter((productId) => productId !== id) : [...prev, id]));
	}, []);

	return (
		<div className="overflow-x-auto">
			<h4 className="mb-5">Products</h4>
			<ProductsFilter />
			<table className="w-full border-collapse">
				<thead>
					<tr className="bg-main-2">
						<th className="px-6 py-3 text-left font-medium w-10">
							<CheckboxInput onChange={handleSelectAll} checked={products.length > 0 && selectedProducts.length === products.length} />
						</th>
						<th className="px-6 py-3 text-left font-medium">Image</th>
						<th className="px-6 py-3 text-left font-medium w-1/3">Title</th>
						<th className="px-6 py-3 text-left font-medium">Price</th>
						<th className="px-6 py-3 text-left font-medium">Stock</th>
						<th className="px-6 py-3 text-left font-medium">Status</th>
						<th className="px-6 py-3 text-left font-medium">Actions</th>
					</tr>
				</thead>
				<tbody>
					{products.map((product) => (
						<tr key={product._id} className="border-t border-main-2 hover:bg-opacity-50 hover:bg-main-2 cursor-pointer">
							<td className="px-6 py-2">
								<CheckboxInput checked={selectedProducts.includes(product._id)} onChange={() => handleCheckboxChange(product._id)} />
							</td>
							<td className="px-6 py-2 w-10">
								<div className="relative h-10 w-10 overflow-hidden rounded-lg bg-main-3">
									<ImageComponent path={product.image} alt={product.title} className="w-full h-full object-cover object-center" />
								</div>
							</td>
							<td className="px-6 py-2">{product.title}</td>
							<td className="px-6 py-2">{product.price}</td>
							<td className="px-6 py-2">{product.stock}</td>
							<td className="px-6 py-2">
								<span className={`inline-block px-3 py-1 rounded-full text-xxs ${product.status === "Active" ? "bg-green-100 text-green-800" : product.status === "Inactive" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>{product.status}</span>
							</td>
							<td className="px-6 py-2">
								{selectedProducts.length > 1 ? (
									<Actions>
										<ProductActions />
									</Actions>
								) : (
									<Actions>
										<ProductActions />
									</Actions>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<Pagination totalItems={100} />
		</div>
	);
};

export default Products;
