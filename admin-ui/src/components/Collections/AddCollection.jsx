import React, { useState, useMemo, useCallback } from "react";
import { TextInput, TextArea, SelectInput } from "../FormComponents/FormComponents";
import { ImageUploaderComponent } from "editorify-dev/imageUploader";
import { connect } from "react-redux";
import { showNotification } from "../../redux/notification/notificationActions";

function CollectionAddComponent({ showNotification }) {
	const [collectionDetails, setCollectionDetails] = useState({
		title: "",
		metaTitle: "",
		metaDescription: "",
		status: "Active",
	});

	const [image, setImage] = useState(null);

	const [errors, setErrors] = useState({
		title: "",
		metaTitle: "",
		metaDescription: "",
	});

	const handleInputChange = useCallback(({ target: { name, value } }) => {
		setCollectionDetails((prev) => ({ ...prev, [name]: value }));

		// Basic validation logic
		if (!value.trim()) {
			setErrors((prev) => ({ ...prev, [name]: `${name} is required` }));
		} else {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	}, []);

	const statusOptions = useMemo(
		() => [
			{ label: "Active", value: "Active" },
			{ label: "Inactive", value: "Inactive" },
		],
		[]
	);

	const handleSubmit = () => {
		const requiredFields = ["title", "metaTitle", "metaDescription"];
		const emptyField = requiredFields.find((field) => !collectionDetails[field]);

		if (emptyField) {
			setErrors((prev) => ({ ...prev, [emptyField]: `${emptyField} is required` }));
			showNotification(`${emptyField} is required`, "warning");
			return;
		}

		if (!image) {
			showNotification("Please upload an image.", "warning");
			return;
		}

		showNotification("Collection added successfully!", "success");
		// Add logic to submit the collection details
	};

	return (
		<div className="max-w-4xl m-auto mt-5 mb-10">
			<h4>Add Collection</h4>

			<div className="flex gap-3">
				<div className="w-3/5">
					<div className="outer-box">
						<TextInput label="Title" className="mb-4" placeholder="Collection Title" name="title" id="title" value={collectionDetails.title} error={errors.title || ""} onChange={handleInputChange} />

						<SelectInput options={statusOptions} label="Status" name="status" className="mb-5" value={collectionDetails.status} onChange={handleInputChange} />
					</div>

					<div className="outer-box">
						<h5 className="mb-2">Meta Details</h5>
						<TextInput label="Meta Title" placeholder="Meta Title" name="metaTitle" id="metaTitle" value={collectionDetails.metaTitle} error={errors.metaTitle || ""} onChange={handleInputChange} className="mb-4" />
						<TextArea label="Meta Description" placeholder="Meta Description" name="metaDescription" id="metaDescription" value={collectionDetails.metaDescription} error={errors.metaDescription || ""} rows={3} onChange={handleInputChange} className="mb-4" />
					</div>
				</div>

				<div className="w-2/5">
					<div className="outer-box">
						<h5 className="mb-2">Collection Image</h5>
						<ImageUploaderComponent id="collection-image" maxImages={1} onImagesChange={(images) => setImage(images[0] || null)} />
					</div>

					<button className="btn-primary w-full mt-4" onClick={handleSubmit}>
						Add Collection
					</button>
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

export default connect(null, mapDispatchToProps)(CollectionAddComponent);
