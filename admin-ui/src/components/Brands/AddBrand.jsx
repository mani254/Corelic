import React, { useState, useCallback } from "react";
import { TextInput, TextArea } from "../FormComponents/FormComponents";
import { connect } from "react-redux";
import { showNotification } from "../../redux/actions/notificationActions";
import { addBrand } from "../../redux/actions/brandActions";

function BrandAddComponent({ showNotification, addBrand }) {
	const [brandDetails, setBrandDetails] = useState({
		title: "",
		description: "",
		metaTitle: "",
		metaDescription: "",
	});

	const [errors, setErrors] = useState({
		title: "",
		metaTitle: "",
		description: "",
		metaDescription: "",
	});

	const handleInputChange = useCallback(({ target: { name, value } }) => {
		setBrandDetails((prev) => ({ ...prev, [name]: value }));

		if (name === "title") {
			if (!value.trim()) {
				setErrors((prev) => ({ ...prev, [name]: `${name} is required` }));
			} else {
				setErrors((prev) => ({ ...prev, [name]: "" }));
			}
		}
	}, []);

	const handleSubmit = async () => {
		const requiredFields = ["title"];
		const emptyField = requiredFields.find((field) => !brandDetails[field]);

		if (emptyField) {
			setErrors((prev) => ({ ...prev, [emptyField]: `${emptyField} is required` }));
			showNotification(`${emptyField} is required`, "warning");
			return;
		}

		try {
			const data = await addBrand(brandDetails);
			if (data) {
				setBrandDetails({
					title: "",
					description: "",
					metaTitle: "",
					metaDescription: "",
				});
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="max-w-4xl m-auto mt-5 mb-10">
			<h4>Add Brand</h4>
			<div className="flex gap-3">
				<div className="w-full">
					<div className="outer-box">
						<TextInput label="Title" className="mb-4" placeholder="Brand Title" name="title" id="title" value={brandDetails.title} error={errors.title || ""} onChange={handleInputChange} />

						<TextArea label="Description" placeholder="Brand description" name="description" id="description" error={errors.description || ""} className="mb-4" value={brandDetails.description} onChange={handleInputChange} rows={4} />
					</div>

					<div className="outer-box">
						<h5 className="mb-2">Meta Details</h5>
						<TextInput label="Meta Title" placeholder="Meta Title" name="metaTitle" id="metaTitle" value={brandDetails.metaTitle} error={errors.metaTitle || ""} onChange={handleInputChange} className="mb-4" />
						<TextArea label="Meta Description" placeholder="Meta Description" name="metaDescription" id="metaDescription" value={brandDetails.metaDescription} error={errors.metaDescription || ""} rows={5} onChange={handleInputChange} className="mb-4" />
					</div>

					<button className="btn-primary w-full mt-4" onClick={handleSubmit}>
						Add Brand
					</button>
				</div>
			</div>
		</div>
	);
}

const mapDispatchToProps = (dispatch) => {
	return {
		showNotification: (message, type) => dispatch(showNotification(message, type)),
		addBrand: (brand) => dispatch(addBrand(brand)),
	};
};

export default connect(null, mapDispatchToProps)(BrandAddComponent);
