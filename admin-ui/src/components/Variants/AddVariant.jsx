import React, { useState, useCallback } from "react";
import { FaTrash } from "react-icons/fa"; // Import trash icon
import SuggestionSearch from "../FormComponents/SuggestionSearch";
import { fetchProducts } from "../../redux/actions/productActions";
import { connect } from "react-redux";
import ImageComponent from "../Images/ImageComponent";
import { addVariant } from "../../redux/actions/variantActions";
import { showNotification } from "../../redux/actions/notificationActions";

function AddVariant({ fetchProducts, addVariant, showNotification }) {
	const [selectedProducts, setSelectedProducts] = useState([]);

	// Fetch product suggestions
	const fetchProductSuggestions = useCallback(
		async (query) => {
			try {
				const fetchingData = {
					_id: 1,
					title: 1,
					images: 1,
				};
				const response = await fetchProducts({ ...query, limit: 20, fetchingData });

				return response?.products || [];
			} catch (err) {
				console.error("Error fetching products:", err);
				return [];
			}
		},
		[fetchProducts]
	);

	// Remove product from selected list
	const removeProduct = useCallback((id) => {
		setSelectedProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
	}, []);

	const handleSubmit = useCallback(async () => {
		// Show a warning notification if less than 2 products are selected
		if (selectedProducts.length < 2) {
			showNotification("At least 2 products are required to create a variant.", "warning");
			return;
		}

		// Extract product IDs
		const productIds = selectedProducts.map((product) => product._id);

		try {
			await addVariant(productIds);

			setSelectedProducts([]);
		} catch (error) {
			console.error("Error adding variant:", error);
		}
	}, [selectedProducts, addVariant, showNotification]);

	return (
		<div className="max-w-6xl m-auto mt-5 mb-10">
			<h4 className="mb-4">Add Variant</h4>

			<div className="outer-box p-4 border rounded-lg shadow-sm bg-gray-50">
				{/* Product List */}
				<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 py-5">
					{selectedProducts.map((product) => (
						<div key={product._id} className="bg-white rounded-lg shadow-md p-4 flex  gap-5 items-center justify-between">
							<div className="flex items-center gap-4">
								<ImageComponent path={product.images[0]?.path} alt={product.images[0]?.alt} className="w-14 h-14 rounded-lg object-cover border" />
								<p className="text-gray-700">{product.title}</p>
							</div>
							{/* Delete Icon */}
							<button onClick={() => removeProduct(product._id)} className="text-red-500 hover:text-red-700 transition-colors" aria-label="Remove product">
								<FaTrash size={18} />
							</button>
						</div>
					))}
				</div>

				{/* Product Search Box */}
				<div className="mt-6">
					<SuggestionSearch selected={selectedProducts} setSelected={setSelectedProducts} fetchSuggestions={fetchProductSuggestions} placeholder="Search for products..." className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
				</div>
			</div>
			<button className="btn-primary w-full mt-4" onClick={handleSubmit}>
				Add Variant
			</button>
		</div>
	);
}

const mapDispatchToProps = (dispatch) => ({
	fetchProducts: (query) => dispatch(fetchProducts(query)),
	addVariant: (products) => dispatch(addVariant(products)),
	showNotification: (message, type) => dispatch(showNotification(message, type)),
});

export default connect(null, mapDispatchToProps)(AddVariant);
