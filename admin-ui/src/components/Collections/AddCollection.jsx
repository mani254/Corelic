import React, { useState, useMemo, useCallback } from "react";
import { TextInput, TextArea, SelectInput } from "../FormComponents/FormComponents";
import { ImageUploaderComponent } from "editorify-dev/imageUploader";
import { connect } from "react-redux";
import { showNotification } from "../../redux/actions/notificationActions";
import { addCollection } from "../../redux/actions/collectionActions";

function CollectionAddComponent({ showNotification, addCollection }) {
	const [collectionDetails, setCollectionDetails] = useState({
		title: "",
		description: "",
		status: "active",
		showInHome: false,
		metaTitle: "",
		metaDescription: "",
	});

	const [image, setImage] = useState(null);

	const [errors, setErrors] = useState({
		title: "",
		metaTitle: "",
		description: "",
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
			{ label: "Active", value: "active" },
			{ label: "Inactive", value: "Inactive" },
		],
		[]
	);

	const handleSubmit = async () => {
		const requiredFields = ["title", "description", "metaTitle", "metaDescription"];
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
		const formData = new FormData();

		formData.append("image", image);
		formData.append("title", collectionDetails.title);
		formData.append("description", collectionDetails.description);
		formData.append("status", collectionDetails.status);
		formData.append("showInHome", collectionDetails.showInHome);
		formData.append("metaTitle", collectionDetails.metaTitle);
		formData.append("metaDescription", collectionDetails.metaDescription);

		try {
			const data = await addCollection(formData);
			if (data) {
				setCollectionDetails({
					title: "",
					description: "",
					status: "active",
					showInHome: false,
					metaTitle: "",
					metaDescription: "",
				});
				setImage(null);
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="max-w-4xl m-auto mt-5 mb-10">
			<h4>Add Collection</h4>

			<div className="flex gap-3">
				<div className="w-3/5">
					<div className="outer-box">
						<TextInput label="Title" className="mb-4" placeholder="Collection Title" name="title" id="title" value={collectionDetails.title} error={errors.title || ""} onChange={handleInputChange} />

						<TextArea label="Description" placeholder="Collection description" name="description" id="description" error={errors.description || ""} className="mb-4" value={collectionDetails.description} onChange={handleInputChange} rows={4} />
					</div>

					<div className="outer-box">
						<h5 className="mb-2">Meta Details</h5>
						<TextInput label="Meta Title" placeholder="Meta Title" name="metaTitle" id="metaTitle" value={collectionDetails.metaTitle} error={errors.metaTitle || ""} onChange={handleInputChange} className="mb-4" />
						<TextArea label="Meta Description" placeholder="Meta Description" name="metaDescription" id="metaDescription" value={collectionDetails.metaDescription} error={errors.metaDescription || ""} rows={5} onChange={handleInputChange} className="mb-4" />
					</div>
				</div>

				<div className="w-2/5">
					<div className="outer-box">
						<h5 className="mb-2">Status & Home</h5>
						<SelectInput options={statusOptions} label="Status" name="status" className="mb-5" value={collectionDetails.status} onChange={handleInputChange} />

						<SelectInput
							options={[
								{ label: "Yes", value: true },
								{ label: "No", value: false },
							]}
							label="Show In Home"
							name="showInHome"
							className="mb-5"
							value={collectionDetails.showInHome}
							onChange={handleInputChange}
						/>
					</div>
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
		addCollection: (collection) => dispatch(addCollection(collection)),
	};
};

export default connect(null, mapDispatchToProps)(CollectionAddComponent);
