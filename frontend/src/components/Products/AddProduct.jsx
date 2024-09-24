import React, { useState } from "react";
import { EditorComponent } from "editorify-dev/editor";
import "editorify-dev/css/editor";

import { ImageUploaderComponent } from "editorify-dev/imageUploader";
import "editorify-dev/css/imageUploader";

import OptionsComponent from "./Options";
import VariantsComponent from "./Variants";

import { validation } from "../../utils";

function AddProduct() {
	const [productVariants, setProductVariants] = useState([]);

	const [productOptions, setProductOptions] = useState([]);

	const [productInfo, setProductInfo] = useState({
		title: "",
		overview: "",
		status: "draft",
		vendor: "",
		price: "",
		comparePrice: "",
		gst: "",
	});

	const [errors, setErrors] = useState({
		title: "",
		overview: "",
		price: "",
		comparePrice: "",
		gst: "",
	});

	function handleChange(event) {
		let { name, value } = event.target;

		if (name === "price" || name === "comparePrice" || name === "gst") {
			if (value < 0) {
				setErrors((prevErrors) => ({ ...prevErrors, [name]: "can't be negetive" }));
				return;
			}
		}

		setProductInfo((prevState) => ({ ...prevState, [name]: value }));
		let error = validation(name, value);
		console.log(error);
		setErrors((prevState) => ({ ...prevState, [name]: error }));
	}

	function handleImagesChange(images) {
		console.log(images);
	}

	function handleOnBlur(event) {
		let { name, value } = event.target;
		value = parseFloat(value).toFixed(2);
		setProductInfo((prevState) => ({ ...prevState, [name]: value }));
	}

	return (
		<React.Fragment>
			<div className="w-full min-h-screen max-w-4xl m-auto">
				<h3>Add Product</h3>
				<div className="flex gap-5">
					<div className="w-full">
						<div className="outer-box">
							<div className="input-wrapper">
								<label htmlFor="title">Title</label>
								<input id="title" name="title" className="input" type="text" placeholder="Product Title" onChange={handleChange} value={productInfo.title} />
								{errors.title && <p className="error">{errors.title}</p>}
							</div>
							<div className="input-wrapper">
								<label htmlFor="overview">Overview</label>
								<textarea id="overview" name="overview" placeholder="Product overview" onChange={handleChange} value={productInfo.overview}></textarea>
								{errors.overview && <p className="error">{errors.overview}</p>}
							</div>
							<div className="input-wrapper">
								<label htmlFor="description">Description</label>
								<EditorComponent id="editor-component" className="editor-component" />
							</div>
						</div>
						<div className="outer-box">
							<h4 className="mb-3">Media</h4>
							<div clasName="input-wrapper">
								<ImageUploaderComponent id="ic" maxImages={5} maxFileSize={1024} onImagesChange={handleImagesChange} />
							</div>
						</div>
						{/* ----------------------- price and SKU ------------------------ */}
						<div className="outer-box">
							<h4 className="mb-3">Price & SKU</h4>

							<div className="flex gap-3">
								<div className="input-wrapper">
									<label hrmlfor="price">Price</label>
									<input type="number" id="price" placeholder="Selling Price" name="price" value={productInfo.price} onChange={handleChange} onBlur={handleOnBlur}></input>
									{errors.price && <p className="error">{errors.price}</p>}
								</div>
								<div className="input-wrapper">
									<label hrmlfor="comparePrice">Compare Price</label>
									<input type="number" id="comparePrice" placeholder="Compare with" name="comparePrice" value={productInfo.comparePrice} onChange={handleChange} onBlur={handleOnBlur}></input>
									{errors.comparePrice && <p className="error">{errors.comparePrice}</p>}
								</div>
								<div className="input-wrapper">
									<label hrmlfor="gst">Gst</label>
									<input type="number" id="gst" placeholder="gst" name="gst" value={productInfo.gst} onChange={handleChange} onBlur={handleOnBlur}></input>
									{errors.gst && <p className="error">{errors.gst}</p>}
								</div>
							</div>

							{/* <div className="input-wrapper">
                        <label
                     </div> */}
						</div>
					</div>
					<div className="w-1/4 min-w-[280px]">
						<div className="outer-box">
							<div className="input-wrapper">
								<label htmlFor="status">Status</label>
								<select name="status" value={productInfo.status} onChange={handleChange} id="status">
									<option value="draft">Draft</option>
									<option value="active">Active</option>
									<option value="inactive">InActive</option>
								</select>
							</div>
							<div className="input-wrapper">
								<label htmlFor="vendor">Vendor</label>
								<input id="vendor" name="vendor" className="input" type="text" placeholder="Brand Name" onChange={handleChange} value={productInfo.vendor} />
							</div>
						</div>

						{/* ----------------------- options box -------------------------- */}
						<OptionsComponent state={productOptions} setState={setProductOptions} />

						{/* ----------------------- variants-box ------------------------ */}
						<VariantsComponent state={productVariants} setState={setProductVariants} />
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export default AddProduct;
