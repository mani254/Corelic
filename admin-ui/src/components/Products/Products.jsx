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
	const initialRender = useRef(true);
	const [totalItems, setTotalItems] = useState(0);
	const [selectedProducts, setSelectedProducts] = useState([]);

	// Function to fetch products
	const fetchProductsData = useCallback(async () => {
		try {
			const data = await fetchProducts(searchParams);
			setTotalItems(data.totalItems);
			setSelectedProducts([]);
		} catch (err) {
			console.error("Error fetching products:", err);
		}
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

	useEffect(() => {
		if (productData.triggerFetch) {
			fetchProductsData();
		}
	}, [productData.triggerFetch]);

	// Function to handle "Select All" checkbox
	const handleSelectAll = useCallback(() => {
		setSelectedProducts((prev) => (prev.length === products.length ? [] : products.map((p) => p._id)));
	}, [products]);

	// Check if all items are selected
	const allSelected = products.length > 0 && selectedProducts.length === products.length;

	const limit = parseInt(searchParams.get("limit"), 10) || 10;

	return (
		<div className="relative">
			<div className="overflow-x-auto min-h-screen">
				<h4 className="mb-5">Products</h4>
				<ProductsFilter />

				{productData.loading ? (
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
								<ProductRow key={product._id} product={product} isSelected={selectedProducts.includes(product._id)} onCheckboxChange={handleCheckboxChange} selectedProducts={selectedProducts} />
							))}
						</tbody>
					</table>
				) : (
					<div className="flex flex-col items-center justify-center text-gray-500 p-8 rounded-lg border border-dashed border-gray-300 bg-gray-50">
						<svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-gray-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path d="M3 9.5V17a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9.5" />
							<path d="M3 9.5 12 4l9 5.5" />
							<path d="M12 4v13" />
						</svg>
						<h3 className="font-semibold">No Products Found</h3>
						<p className="text-sm text-gray-500 text-center">If No Products Added try adding some Products</p>
					</div>
				)}

				{totalItems > limit && <Pagination totalItems={totalItems} />}
			</div>
			{selectedProducts.length ? (
				<div className="w-[163px] fixed right-[100px] top-1/2 -translate-y-1/2 bg-main border border-main-2 rounded-lg shadow-lg">
					<ProductActions selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts}></ProductActions>
				</div>
			) : null}
		</div>
	);
};

// Optimized ProductRow Component
const ProductRow = React.memo(({ product, isSelected, onCheckboxChange, selectedProducts }) => (
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
			<Actions disable={selectedProducts.length}>
				<ProductActions id={product._id} />
			</Actions>
		</td>
	</tr>
));

const mapStateToProps = (state) => ({ productData: state.product });

const mapDispatchToProps = (dispatch) => ({
	fetchProducts: (params) => dispatch(fetchProducts(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Products);
