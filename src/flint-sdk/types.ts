// Base field interface that all field types will extend
export interface BaseField {
	id: string;
	name: string;
	type: string;
	label: string;
	required?: boolean;
	helperText?: string;
	placeholder?: string;
	[key: string]: any; // For additional type-specific properties
}

// Specific field types
export interface TextField extends BaseField {
	type: 'text';
	maxLength?: number;
	minLength?: number;
}

export interface NumberField extends BaseField {
	type: 'number';
	min?: number;
	max?: number;
	step?: number;
}

export interface SelectField extends BaseField {
	type: 'select';
	options: string[];
	multiple?: boolean;
}

export interface CheckboxField extends BaseField {
	type: 'checkbox';
	options: string[];
}

export interface DateField extends BaseField {
	type: 'date';
	min?: number; // timestamp
	max?: number; // timestamp
}

export interface FileField extends BaseField {
	type: 'file';
	acceptedTypes?: string[];
	maxFileSize?: number; // in MB
	multiple?: boolean;
}

export interface AutocompleteField extends BaseField {
	type: 'autocomplete';
	options?: string[];
	csvData?: string; // Alternative to options for CSV data
}

export interface PhoneField extends BaseField {
	type: 'phone';
	validationRegion?: string;
}

export interface PostalCodeField extends BaseField {
	type: 'postalcode';
	validationRegion?: string;
}

// Union type for all field types
export type Field =
	| TextField
	| NumberField
	| SelectField
	| CheckboxField
	| DateField
	| FileField
	| AutocompleteField
	| PhoneField
	| PostalCodeField;

// Form schema
export interface FormSchema {
	title: string;
	description?: string;
	fields: Field[];
	submitText?: string; // Add this line
}

// Form data type
export type FormData = Record<string, any>;

// Form submission response
export interface FormSubmitResponse {
	success: boolean;
	data?: any;
	error?: string;
}
