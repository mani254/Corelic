import React, { useState, useCallback, useMemo } from "react";
import { CheckboxInput, NumberInput, SelectInput, TextArea, TextInput } from "../FormComponents/FormComponents";
import MultiSelect from "../MultiSelect/MultiSelect";
import "editorify-dev/css/imageUploader";

import { ImageUploaderComponent } from "editorify-dev/imageUploader";
import DescEditor from "./DescEditor";
import Inventory from "./Inventory";
import Options from "./Options";
import { v4 as uuidv4 } from "uuid";
import { validation } from "../../utils";
import { showNotification } from "../../redux/actions/notificationActions.js";
import { connect } from "react-redux";

function AddProduct({ showNotification }) {
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
		metaTitle: "",
		metaDescription: "",
	});

	const [options, setOptions] = useState([]);

	const [singleVariant, setSingleVariant] = useState("");
	const [variants, setVariants] = useState([{ id: uuidv4(), name: "Main", images: [] }]);

	const [singleCollection, setSingleCollection] = useState("");
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
		setProductDetails((prev) => ({ ...prev, [name]: value }));

		let error = validation(name, value);
		setErrors((prevState) => ({ ...prevState, [name]: error }));
	}, []);

	const handleImagesChange = useCallback((images, index) => {
		setVariants((prev) => prev.map((variant, i) => (index === i ? { ...variant, images } : variant)));
	}, []);

	const generateSKU = useCallback(({ target: { checked } }) => {
		setProductDetails((prev) => ({
			...prev,
			sku: checked ? Math.floor(10000000000 + Math.random() * 90000000000) : "",
		}));
		setErrors((prev) => ({ ...prev, sku: "" }));
	}, []);

	const handleVariantEntry = useCallback(
		(e) => {
			if (e.key === "Enter") {
				setVariants((prev) => [...prev, { id: uuidv4(), name: singleVariant, images: [] }]);
				setSingleVariant("");
			}
		},
		[singleVariant]
	);

	const handleCollectionEntry = useCallback(
		(e) => {
			if (e.key === "Enter") {
				setCollections((prev) => [...prev, singleCollection]);
				setSingleCollection("");
			}
		},
		[singleCollection]
	);

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

	const handleSubmit = () => {
		const required = ["title", "overview", "price", "sku"];
		const emptyFeild = required.find((item) => productDetails[item] === "");
		if (emptyFeild) {
			setErrors((prev) => ({ ...prev, [emptyFeild]: "feild is required" }));
			showNotification(`The feild ${emptyFeild} is required`, "warning");
			return;
		}

		const hasErrors = Object.values(errors).some((error) => error !== "" && error !== undefined);

		if (hasErrors) {
			showNotification("Please fix all errors before submitting.", "warning");
			return;
		}

		if (variants.length === 0) {
			showNotification("Add atleast One Variant", "warning");
			return;
		}
	};

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

					<div className="flex gap-3">
						<div className="outer-box w-full flex flex-col justify-between">
							<div>
								<h5 className="mb-2">Variants</h5>
								<p className="text-xxs mb-2">Select this option to add multiple variants</p>
								<MultiSelect array={variants} setArray={setVariants} value="name" />
							</div>
							<div>
								<TextInput name="singleVariant" id="singleVariant" placeholder="Variant Name" value={singleVariant} onChange={({ target: { value } }) => setSingleVariant(value)} onKeyDown={handleVariantEntry} />
							</div>
						</div>
						<div className="outer-box w-full">
							<h5 className="mb-2">Options</h5>
							<p className="text-xxs mb-2">Add Options likes Sizes and Types to the Product</p>
							<Options options={options} setOptions={setOptions} />
						</div>
					</div>

					<div className="outer-box">
						<h5 className="mb-5">Media</h5>
						<div className="space-y-5">
							{variants.length === 0 && <p className="text-xs">Add Atleast One Variant to Upload Images</p>}
							{variants.map((variant, index) => (
								<div key={variant.id} className="input-wrapper ">
									{variants.length > 1 && <label className="text-center">-------- {variant.name} images --------</label>}
									<ImageUploaderComponent id={`variant-${index}`} maxImages={5} onImagesChange={(images) => handleImagesChange(images, index)} />
								</div>
							))}
						</div>
					</div>

					<div className="outer-box">
						<h5 className="mb-5">Price & SKU</h5>

						<div className="flex gap-3 mb-5">
							<NumberInput label="Price" id="price" name="price" value={productDetails.price} placeholder="Selling Price" onChange={handleInputChange} onBlur={(e) => handleBlur("price", e.target.value)} />
							<NumberInput label="Compare Price" id="comparePrice" name="comparePrice" value={productDetails.comparePrice} placeholder="Compare Price" onChange={handleInputChange} onBlur={(e) => handleBlur("comparePrice", e.target.value)} />
							<NumberInput label="GST" id="gst" name="gst" value={productDetails.gst} placeholder="GST Price" onChange={handleInputChange} onBlur={(e) => handleBlur("gst", e.target.value)} />
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

						<Inventory variants={variants} setVariants={setVariants} options={options} />
					</div>

					<div className="outer-box">
						<h5 className="mb-1">Meta Details</h5>
						<p className="text-xxs mb-4">This is the data for the seo Details</p>
						<TextInput label="Meta Title" placeholder="Meta Title" name="metaTitle" id="metaTitle" className="mb-4" error={errors.metaTitle || ""} value={productDetails.metaTitle} onChange={handleInputChange} />
						<TextArea label="Meta Description" placeholder="Meta Description" name="metaDescription" id="metaDescription" error={errors.metaDescription || ""} className="mb-4" rows={3} value={productDetails.metaDescription} onChange={handleInputChange} />
					</div>
				</div>

				<div className="w-2/6">
					<div className="top-3 sticky">
						<div className="outer-box">
							<SelectInput options={statusOptions} label="Status" name="status" className="mb-5" value={productDetails.status} onChange={handleInputChange} />

							<TextInput label="Vendor" placeholder="Brand Name" name="vendor" id="vendor" value={productDetails.vendor} onChange={handleInputChange} />
						</div>

						<div className="outer-box">
							<h5 className="mb-2">Collections</h5>
							<p className="text-xxs mb-2">Select Under Which Collection this product should comes under</p>
							<MultiSelect array={collections} setArray={setCollections} />
							<TextInput name="singleCollection" id="singleCollection" placeholder="Collection Name" value={singleCollection} onChange={({ target: { value } }) => setSingleCollection(value)} onKeyDown={handleCollectionEntry} />
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
	};
};

// const mapStateToProps = () => {
// 	return {};
// };

export default connect(null, mapDispatchToProps)(AddProduct);
