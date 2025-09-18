import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { TailwindElement } from '../../shared/tailwind.element';
import { Field, FormSchema } from '../types';
import { FlintSDK } from '../FlintSDK';

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
	@property({ type: Object }) schema?: FormSchema;
	@property({ type: Object }) data: Record<string, any> = {};
	@property({ type: String }) formId: string = '';
	@property({ type: Object }) flintSdk?: FlintSDK;

	@state() private formData: Record<string, any> = {};
	@state() private errors: Record<string, string> = {};
	@state() private loading = true;
	@state() private error: string | null = null;
	private _flintSdkInstance?: FlintSDK;

	async connectedCallback() {
		super.connectedCallback();
		this.formData = { ...this.data };

		// Use provided instance or create a new one if not provided
		if (!this.flintSdk) {
			this._flintSdkInstance = new FlintSDK({
				supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
				supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
			});
		}

		// Load schema if formId is provided
		if (this.formId) {
			await this.loadSchema();
		}
	}

	private get getFlintSdk(): FlintSDK {
		return this.flintSdk || this._flintSdkInstance!;
	}

	private async loadSchema() {
		try {
			console.log('Starting to load schema for formId:', this.formId);
			this.schema = await this.getFlintSdk.loadSchema(this.formId);
			console.log('Schema loaded successfully:', this.schema);
			this.error = null;
		} catch (err) {
			console.error('Failed to load form schema:', err);
			this.error = 'Failed to load form. Please try again later.';
		} finally {
			this.loading = false;
		}
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

	private async handleSubmit(e: Event) {
		e.preventDefault();
		if (!this.schema) return;

		// Validate all fields
		const isValid = this.schema.fields.every(field =>
			this.validateField(field, this.formData[field.name])
		);

		if (!isValid) return;

		// Dispatch the form-submit event
		const submitEvent = new CustomEvent('form-submit', {
			detail: {
				data: this.formData,
				formId: this.formId,
				preventDefault: () => {
					/* noop */
				},
				defaultPrevented: false,
			},
			bubbles: true,
			cancelable: true,
			composed: true,
		});

		const wasNotCancelled = this.dispatchEvent(submitEvent);

		// If no one is listening to form-submit or if default wasn't prevented
		if (wasNotCancelled) {
			try {
				const flintSdk = this.getFlintSdk;
				if (flintSdk && this.formId) {
					await flintSdk.submitForm(this.formId, this.formData);
					// Dispatch success event
					this.dispatchEvent(
						new CustomEvent('submit-success', {
							detail: { data: this.formData },
							bubbles: true,
							composed: true,
						})
					);
				}
			} catch (error) {
				console.error('Form submission failed:', error);
				// Dispatch error event
				this.dispatchEvent(
					new CustomEvent('submit-error', {
						detail: { error },
						bubbles: true,
						composed: true,
					})
				);
			}
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
						placeholder="${field.placeholder || ''}"
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
		if (this.loading) {
			return html`<div class="text-center py-4">Loading form...</div>`;
		}

		if (this.error) {
			return html`
				<div class="text-red-600 p-4 rounded bg-red-50">
					<p>${this.error}</p>
				</div>
			`;
		}

		if (!this.schema) {
			return html`<p>No form schema available</p>`;
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
