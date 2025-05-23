import React, { useState, useCallback, useMemo } from "react";
import { CheckboxInput, NumberInput, SelectInput, TextArea, TextInput } from "../FormComponents/FormComponents";
import MultiSelect from "../MultiSelect/MultiSelect";
import "editorify-dev/css/imageUploader";
import { ImageUploaderComponent } from "editorify-dev/imageUploader";

import DescEditor from "./DescEditor";
import Inventory from "./Inventory";
import Options from "./Options";
import { validation } from "../../utils";
import { connect } from "react-redux";
import { showNotification } from "../../redux/actions/notificationActions.js";
import { addProduct } from "../../redux/actions/productActions.js";
import { useNavigate } from "react-router-dom";
import SuggestionSearch from "../FormComponents/SuggestionSearch.jsx";
import { fetchCollections } from "../../redux/actions/collectionActions.js";
import { fetchBrands } from "../../redux/actions/brandActions.js";

function AddProduct({ showNotification, addProduct, fetchCollections, fetchBrands }) {
	const navigate = useNavigate();

	const [productDetails, setProductDetails] = useState({
		title: "",
		overview: "",
		description: "",
		price: "",
		comparePrice: "",
		gst: "",
		sku: "",
		status: "Draft",
		vendor: "",
	});

	const [metaData, setMetaData] = useState({
		metaTitle: "",
		metaDescription: "",
	});

	const [trackInventory, setTrackInventory] = useState(false);
	const [images, setImages] = useState([]);
	const [options, setOptions] = useState([]);
	const [stock, setStock] = useState(0);

	const [collections, setCollections] = useState([]);

	const [errors, setErrors] = useState({
		title: "",
		overview: "",
		price: "",
		sku: "",
		metaTitle: "",
		metaDescription: "",
	});

	const handleInputChange = useCallback(({ target: { name, value } }) => {
		if (name == "metaTitle" || name == "metaDescription") {
			setMetaData((prev) => ({ ...prev, [name]: value }));
		} else {
			setProductDetails((prev) => ({ ...prev, [name]: value }));
		}

		let error = validation(name, value);
		setErrors((prevState) => ({ ...prevState, [name]: error }));
	}, []);

	const handleImagesChange = (images) => {
		setImages(images);
	};

	const generateSKU = useCallback(({ target: { checked } }) => {
		setProductDetails((prev) => ({
			...prev,
			sku: checked ? Math.floor(10000000000 + Math.random() * 90000000000) : "",
		}));
		setErrors((prev) => ({ ...prev, sku: "" }));
	}, []);

	const handleBlur = (title, value) => {
		const numericValue = parseFloat(value);

		if (!isNaN(numericValue)) {
			const formattedValue = numericValue.toFixed(2);
			setProductDetails((prev) => ({ ...prev, [title]: formattedValue }));
		}
	};

	const statusOptions = useMemo(
		() => [
			{ label: "Draft", value: "Draft" },
			{ label: "Active", value: "Active" },
			{ label: "Inactive", value: "Inactive" },
		],
		[]
	);

	const handleSubmit = async () => {
		const requiredFields = ["title", "overview", "price", "sku"];

		// Validate required fields
		const emptyField = requiredFields.find((field) => {
			return !productDetails[field];
		});

		if (emptyField) {
			setErrors((prev) => ({ ...prev, [emptyField]: "Field is required" }));
			return showNotification(`The field "${emptyField}" is required`, "warning");
		}

		if (Number(productDetails.price) < 0 || Number(productDetails.comparePrice) < 0) {
			return showNotification("Price and compare Price should be greater than 0", "warning");
		}

		if (Number(productDetails.price) > Number(productDetails.comparePrice)) {
			return showNotification("Price should be less then the compare Price", "warning");
		}

		// Check if there are any existing errors
		if (Object.values(errors).some((error) => error?.trim())) {
			return showNotification("Please fix all errors before submitting.", "warning");
		}

		if (images.length <= 0) {
			return showNotification("Please add images", "warning");
		}

		// Inventory validation
		if (trackInventory) {
			const isStockEmpty = options.length > 0 ? options.some((option) => option.stock === "" || option.stock === null || option.stock === undefined) : stock === "" || stock === null || stock === undefined;

			if (isStockEmpty) {
				return showNotification("Stock cannot be empty", "warning");
			}
		}

		const formData = new FormData();

		Object.keys(productDetails).forEach((key) => {
			formData.append(key, productDetails[key]);
		});

		images.forEach((image) => {
			formData.append(`images`, image);
		});

		formData.append("trackInventory", trackInventory);
		formData.append("stock", stock);

		formData.append("options", JSON.stringify(options));
		formData.append("collections", JSON.stringify(collections));
		formData.append("metaData", JSON.stringify(metaData));

		try {
			const data = await addProduct(formData);
			if (data) {
				navigate("/products");
			}
		} catch (err) {
			console.log(err);
		}
	};

	const fetchCollectionSuggestions = useCallback(async (query) => {
		try {
			const response = await fetchCollections(query);

			if (response?.collections) {
				const data = response.collections.map((col) => col.title);
				return data;
			}
			return [];
		} catch (err) {
			console.error("Error fetching collections:", err);
			return [];
		}
	}, []);

	const fetchVendorSuggestions = useCallback(async (query) => {
		try {
			const response = await fetchBrands(query);

			if (response?.brands) {
				const data = response.brands.map((brand) => brand.title);
				return data;
			}
			return [];
		} catch (err) {
			console.error("Error fetching brands:", err);
			return [];
		}
	}, []);

	return (
		<div className="max-w-6xl m-auto mt-5 mb-10">
			<h4>Add Product</h4>
			<div className="flex gap-3">
				<div className="w-4/6">
					<div className="outer-box">
						<TextInput label="Title" placeholder="Product Title" name="title" id="title" className="mb-4" error={errors.title || ""} value={productDetails.title} onChange={handleInputChange} />

						<TextArea label="Overview" placeholder="Product Overview" name="overview" id="overview" error={errors.overview || ""} className="mb-4" value={productDetails.overview} onChange={handleInputChange} rows={3} />

						<div className="input-wrapper">
							<label htmlFor="description">Description</label>
							<DescEditor productDetails={productDetails} setProductDetails={setProductDetails} />
						</div>
					</div>

					<div className="outer-box">
						<h5 className="mb-5">Media</h5>
						<div className="space-y-5">
							<div className="input-wrapper ">
								<ImageUploaderComponent id="12345" maxImages={8} onImagesChange={(images) => handleImagesChange(images)} />
							</div>
						</div>
					</div>

					<div className="outer-box">
						<h5 className="mb-5">Price & SKU</h5>

						<div className="flex gap-3 mb-5">
							<NumberInput label="Price" id="price" name="price" value={productDetails.price} error={errors.price || ""} placeholder="Selling Price" onChange={handleInputChange} onBlur={(e) => handleBlur("price", e.target.value)} />
							<NumberInput label="Compare Price" id="comparePrice" name="comparePrice" value={productDetails.comparePrice} error={errors.comparePrice || ""} placeholder="Compare Price" onChange={handleInputChange} onBlur={(e) => handleBlur("comparePrice", e.target.value)} />
							<NumberInput label="GST" id="gst" name="gst" value={productDetails.gst} placeholder="GST Price" error={errors.gst || ""} onChange={handleInputChange} onBlur={(e) => handleBlur("gst", e.target.value)} />
						</div>

						<div className="flex gap-3 items-end">
							<div className="w-1/3">
								<NumberInput label="SKU" id="sku" name="sku" value={productDetails.sku} error={errors.sku || ""} placeholder="Product SKU" onChange={handleInputChange} />
							</div>

							<div className="mt-3">
								<CheckboxInput label="Generate SKU" className="flex items-center gap-3 mb-0" id="generateSKU" onChange={generateSKU} />
								<p className="text-xxs">Click Here to generate a SKU for the product</p>
							</div>
						</div>
					</div>

					<div className="outer-box">
						<h5 className="mb-2">Inventory</h5>
						<p className="text-xxs mb-2">Track inventory to keep track of no.of products available</p>

						<Inventory options={options} setOptions={setOptions} stock={stock} setStock={setStock} trackInventory={trackInventory} setTrackInventory={setTrackInventory} />
					</div>

					<div className="outer-box">
						<h5 className="mb-1">Meta Details</h5>
						<p className="text-xxs mb-4">This is the data for the seo Details</p>
						<TextInput label="Meta Title" placeholder="Meta Title" name="metaTitle" id="metaTitle" className="mb-4" error={errors.metaTitle || ""} value={metaData.metaTitle} onChange={handleInputChange} />
						<TextArea label="Meta Description" placeholder="Meta Description" name="metaDescription" id="metaDescription" error={errors.metaDescription || ""} className="mb-4" rows={3} value={metaData.metaDescription} onChange={handleInputChange} />
					</div>
				</div>

				<div className="w-2/6">
					<div className="top-3 sticky">
						<div className="outer-box">
							<SelectInput options={statusOptions} label="Status" name="status" className="mb-5" value={productDetails.status} onChange={handleInputChange} />
							<SuggestionSearch label="Vendor" placeholder="Vendor" selected={productDetails} setSelected={setProductDetails} allowManual={true} single={true} value={"vendor"} fetchSuggestions={fetchVendorSuggestions} />
						</div>

						<div className="outer-box">
							<h5 className="mb-2">Collections</h5>
							<p className="text-xxs mb-2">Select Under Which Collection this product should comes under</p>
							<MultiSelect array={collections} setArray={setCollections} />
							<SuggestionSearch selected={collections} setSelected={setCollections} fetchSuggestions={fetchCollectionSuggestions} placeholder="collection" />
						</div>

						<div className="outer-box">
							<div className="outer-box w-full">
								<h5 className="mb-2">Options</h5>
								<p className="text-xxs mb-2">Add Options likes Sizes and Types to the Product</p>
								<Options options={options} setOptions={setOptions} />
							</div>
						</div>

						<button className="btn-primary w-full mt-4" onClick={handleSubmit}>
							Upload Product
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

const mapDispatchToProps = (dispatch) => {
	return {
		showNotification: (message, type) => dispatch(showNotification(message, type)),
		addProduct: (productData) => dispatch(addProduct(productData)),
		fetchCollections: (query) => dispatch(fetchCollections(query)),
		fetchBrands: (query) => dispatch(fetchBrands(query)),
	};
};

// const mapStateToProps = () => {
// 	return {};
// };

export default connect(null, mapDispatchToProps)(AddProduct);
