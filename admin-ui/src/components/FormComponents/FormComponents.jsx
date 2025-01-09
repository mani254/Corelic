import React from "react";
import "./FormComponents.css";

export const TextInput = ({ className, variant, id, label, error, ...props }) => {
	return (
		<div className={`input-wrapper  variant-${variant} ${className || ""} ${error && "error"}`}>
			<div>
				{label && <label htmlFor={id}>{label}</label>}
				<input type="text" id={id} {...props} />
			</div>
			{error && <p className="text-xxs mt-[2px] text-accent">{error}</p>}
		</div>
	);
};

export const TextArea = ({ className, variant, id, label, error, ...props }) => {
	return (
		<div className={`input-wrapper  variant-${variant} ${className || ""} ${error && "error"}`}>
			{label && <label htmlFor={id}>{label}</label>}
			<textarea type="text" id={id} {...props} />
			{error && <p className="text-xxs mt-[2px] text-accent">{error}</p>}
		</div>
	);
};

export const NumberInput = ({ className, variant, id, label, error, ...props }) => {
	return (
		<div className={`input-wrapper  variant-${variant} ${className || ""}`}>
			{label && <label htmlFor={id}>{label}</label>}
			<input type="number" id={id} {...props} />
			{error && <p className="text-xxs mt-[2px] text-accent">{error}</p>}
		</div>
	);
};

export const CheckboxInput = ({ className, variant, id, label, checked, ...props }) => {
	return (
		<div className={`input-wrapper  checkbox variant-${variant} ${className || ""}`}>
			<input type="checkbox" id={id} className={`checkbox-input`} checked={checked} {...props} />
			{label && <label htmlFor={id}>{label}</label>}
		</div>
	);
};

export const SelectInput = ({ className, variant, label, options, ...props }) => {
	return (
		<div className={`input-wrapper variant-${variant} ${className || ""}`}>
			<label>{label}</label>
			<select {...props}>
				{options.map((option, index) => (
					<option key={index} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
};
