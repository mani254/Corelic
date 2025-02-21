import React, { useState, useCallback, useRef, useEffect } from "react";
import { CheckboxInput } from "../FormComponents/FormComponents";
import Actions from "../Actions/Actions";
import ProductActions from "../Actions/ProductActions";
import { useSearchParams } from "react-router-dom";
import Pagination from "../Pagination/Pagination";
import ProductsFilter from "./ProductsFilter";
import ImageComponent from "../Images/ImageComponent";
import SkeletonTable from "../Loaders/SkeletonTable";

import { connect } from "react-redux";
import { fetchProducts } from "../../redux/actions/productActions";

const Products = ({ productData, fetchProducts }) => {
	const products = productData.products;

	const [searchParams] = useSearchParams();
	const [loader, setLoader] = useState(true);
	const initialRender = useRef(true);
	const [totalItems, setTotalItems] = useState(0);
	const [selectedProducts, setSelectedProducts] = useState([]);

	// Function to fetch products
	const fetchProductsData = useCallback(async () => {
		setLoader(true);
		try {
			const res = await fetchProducts(searchParams);
			setTotalItems(res.totalItems);
		} catch (err) {
			console.error("Error fetching products:", err);
		}
		setLoader(false);
	}, [fetchProducts, searchParams]);

	// Fetch products when searchParams change
	useEffect(() => {
		if (initialRender.current) {
			initialRender.current = false;
			return;
		}
		fetchProductsData();
	}, [fetchProductsData]);

	// Function to handle checkbox click
	const handleCheckboxChange = useCallback((id) => {
		setSelectedProducts((prev) => (prev.includes(id) ? prev.filter((productId) => productId !== id) : [...prev, id]));
	}, []);

	// Function to handle "Select All" checkbox
	const handleSelectAll = useCallback(() => {
		setSelectedProducts((prev) => (prev.length === products.length ? [] : products.map((p) => p._id)));
	}, [products]);

	// Check if all items are selected
	const allSelected = products.length > 0 && selectedProducts.length === products.length;

	const limit = parseInt(searchParams.get("limit"), 10) || 10;

	return (
		<div className="overflow-x-auto">
			<h4 className="mb-5">Products</h4>
			<ProductsFilter />

			{loader ? (
				<SkeletonTable />
			) : products.length ? (
				<table className="w-full border-collapse">
					<thead>
						<tr className="bg-main-2">
							<th className="px-6 py-3 text-left font-medium w-10">
								<CheckboxInput onChange={handleSelectAll} checked={allSelected} />
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
							<ProductRow key={product._id} product={product} isSelected={selectedProducts.includes(product._id)} onCheckboxChange={handleCheckboxChange} />
						))}
					</tbody>
				</table>
			) : (
				<h2>No Products available</h2>
			)}

			{totalItems > limit && <Pagination totalItems={totalItems} />}
		</div>
	);
};

// Optimized ProductRow Component
const ProductRow = React.memo(({ product, isSelected, onCheckboxChange }) => (
	<tr className="border-t border-main-2 hover:bg-opacity-50 hover:bg-main-2 cursor-pointer">
		<td className="px-6 py-2">
			<CheckboxInput checked={isSelected} onChange={() => onCheckboxChange(product._id)} />
		</td>
		<td className="px-6 py-2 w-10">
			<div className="relative h-10 w-10 overflow-hidden rounded-lg bg-main-3">
				<ImageComponent path={product.images[0]?.path} alt={product.title} className="w-full h-full object-cover object-center" />
			</div>
		</td>
		<td className="px-6 py-2">{product.title}</td>
		<td className="px-6 py-2">{product.price}</td>
		<td className="px-6 py-2">{product.stock}</td>
		<td className="px-6 py-2">
			<span className={`inline-block px-3 py-1 rounded-full text-xxs ${product.status === "active" ? "bg-green-100 text-green-800" : product.status === "inactive" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>{product.status}</span>
		</td>
		<td className="px-6 py-2">
			<Actions>
				<ProductActions />
			</Actions>
		</td>
	</tr>
));

const mapStateToProps = (state) => ({ productData: state.product });

const mapDispatchToProps = (dispatch) => ({
	fetchProducts: (params) => dispatch(fetchProducts(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Products);
