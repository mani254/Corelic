import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import SkeletonDescription from "../Loaders/SkeletonDescription";

function DescEditor({ productDetails, setProductDetails }) {
	const [isLoading, setIsLoading] = useState(true);

	const handleEditorChange = (content) => {
		setProductDetails({ ...productDetails, description: content });
	};

	return (
		<div className="min-h-[350px]">
			{isLoading && (
				<div>
					<SkeletonDescription />
				</div>
			)}
			<Editor
				apiKey="bv4vkpuxs4ekwdo7tqyw32knbe4dqdzdzbv08de4m32pe2q6"
				init={{
					plugins: ["link", "lists", "code", "visualblocks", "lineheight"],
					toolbar: "undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | link lineheight | numlist bullist | code",
					menubar: false,
					height: 350,
					branding: false,
					content_style: `
						.mce-content-body { font-size: 16px;}
					`,
				}}
				initialValue="Product Description here!"
				onEditorChange={handleEditorChange}
				onInit={() => setIsLoading(false)}
			/>
		</div>
	);
}

export default DescEditor;
