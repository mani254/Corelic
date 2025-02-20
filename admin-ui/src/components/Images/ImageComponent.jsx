import React from "react";

function ImageComponent({ className, path, ...other }) {
	const actualUrl = `${import.meta.env.VITE_API_BACKEND_URI}/${path}`;
	return <img src={actualUrl} className={className} {...other} />;
}

export default ImageComponent;
