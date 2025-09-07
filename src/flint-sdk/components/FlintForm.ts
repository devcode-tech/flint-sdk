import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { TailwindElement } from '../../shared/tailwind.element';
import { Field, FormSchema } from '../types';

const styles = css`
	.form-field {
		margin-bottom: 1rem;
	}
	.error {
		color: #ef4444;
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}
	label {
		display: block;
		font-size: 0.875rem;
		font-weight: 500;
		color: #6b7280;
		margin-bottom: 0.5rem;
	}
	input,
	select,
	textarea {
		padding: 0.5rem;
		border: 1px solid #cbd5e1;
		border-radius: 0.25rem;
		width: 100%;
	}
	button {
		padding: 0.5rem 1rem;
		background-color: #3b82f6;
		color: #fff;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
	}
`;

@customElement('flint-form')
export class FlintForm extends TailwindElement(styles) {
	@property({ type: Object }) schema!: FormSchema;
	@property({ type: Object }) data: Record<string, any> = {};

	@state() private formData: Record<string, any> = {};
	@state() private errors: Record<string, string> = {};

	connectedCallback() {
		super.connectedCallback();
		this.formData = { ...this.data };
	}

	private handleInput(field: Field, value: any) {
		this.formData = {
			...this.formData,
			[field.name]: value,
		};
		this.validateField(field, value);
		this.dispatchEvent(
			new CustomEvent('change', {
				detail: { data: this.formData },
				bubbles: true,
				composed: true,
			})
		);
	}

	private validateField(field: Field, value: any): boolean {
		if (field.required && !value) {
			this.errors = {
				...this.errors,
				[field.name]: 'This field is required',
			};
			return false;
		}

		// Clear error if validation passes
		const { [field.name]: _, ...rest } = this.errors;
		this.errors = rest;
		return true;
	}

	private handleSubmit(e: Event) {
		e.preventDefault();
		if (!this.schema) return;

		// Validate all fields
		const isValid = this.schema.fields.every(field =>
			this.validateField(field, this.formData[field.name])
		);

		if (isValid) {
			this.dispatchEvent(
				new CustomEvent('submit', {
					detail: { data: this.formData },
					bubbles: true,
					composed: true,
				})
			);
		}
	}

	private renderField(field: Field) {
		const value = this.formData[field.name] ?? '';
		const error = this.errors[field.name];

		const baseField = html`
			<div class="form-field">
				<label for="${field.name}">
					${field.label}${field.required ? ' *' : ''}
				</label>
				${field.helperText
					? html`<p class="text-sm text-gray-500 mb-1">${field.helperText}</p>`
					: ''}
				${error ? html`<p class="error">${error}</p>` : ''}
			</div>
		`;

		switch (field.type) {
			case 'text':
				return html`
					${baseField}
					<input
						type="text"
						id="${field.name}"
						.value="${value}"
						@input="${(e: Event) => {
							const target = e.target as HTMLInputElement;
							this.handleInput(field, target.value);
						}}"
						placeholder="${field.placeholder || 'sss'}"
						?required="${field.required}"
					/>
				`;

			case 'number':
				return html`
					${baseField}
					<input
						type="number"
						id="${field.name}"
						.value="${value}"
						@input="${(e: Event) => {
							const target = e.target as HTMLInputElement;
							this.handleInput(field, target.valueAsNumber);
						}}"
						min="${field.min || ''}"
						max="${field.max || ''}"
						?required="${field.required}"
					/>
				`;

			case 'select':
				return html`
					${baseField}
					<select
						id="${field.name}"
						.value="${value}"
						@change="${(e: Event) => {
							const target = e.target as HTMLSelectElement;
							this.handleInput(field, target.value);
						}}"
						?required="${field.required}"
						?multiple="${field.multiple || false}"
					>
						<option value="">${field.placeholder || 'Select an option'}</option>
						${field.options?.map(
							option => html`<option value="${option}">${option}</option>`
						)}
					</select>
				`;

			// Add other field types (checkbox, date, file, etc.)

			default:
				return html`<p>Unsupported field type: ${field.type}</p>`;
		}
	}

	render() {
		if (!this.schema) {
			return html`<p>No schema provided</p>`;
		}

		return html`
			<form @submit="${this.handleSubmit}">
				<h2 class="text-xl font-bold mb-4">${this.schema.title}</h2>
				${this.schema.description
					? html`<p class="text-gray-600 mb-6">${this.schema.description}</p>`
					: ''}

				<div class="space-y-4">
					${this.schema.fields.map(field => this.renderField(field))}
				</div>

				<button type="submit" class="mt-6">
					${this.schema.submitText || 'Submit'}
				</button>
			</form>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'flint-form': FlintForm;
	}
}
