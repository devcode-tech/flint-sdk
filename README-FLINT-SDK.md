# Flint SDK

A powerful SDK for building dynamic forms with Supabase integration. Built with TypeScript, Lit, and Tailwind CSS.

## Features

- 🏗️ Dynamic form generation from JSON schema
- 🔒 Built-in form validation
- ☁️ Seamless Supabase integration
- 🎨 Styled with Tailwind CSS
- 🚀 Framework-agnostic web components
- 📱 Responsive design
- ✨ TypeScript support

## Installation

```bash
npm install @your-org/flint-sdk
# or
yarn add @your-org/flint-sdk
```

## Quick Start

1. Initialize the SDK with your Supabase credentials:

```typescript
import { FlintSDK } from '@your-org/flint-sdk';

const flint = new FlintSDK(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

2. Load and render a form:

```html
<flint-form id="my-form"></flint-form>

<script type="module">
	import { FlintSDK } from '@your-org/flint-sdk';

	const flint = new FlintSDK('your-supabase-url', 'your-supabase-key');
	const form = document.getElementById('my-form');

	// Load schema
	flint.loadSchema('your-schema-id').then(schema => {
		form.schema = schema;
	});

	// Handle form submission
	form.addEventListener('submit', async e => {
		const result = await flint.submitForm('your-schema-id', e.detail.data);
		if (result.success) {
			alert('Form submitted successfully!');
		} else {
			console.error('Form submission failed:', result.error);
		}
	});
</script>
```

## Schema Format

Flint SDK uses a JSON schema to define forms. Here's an example:

```json
{
	"title": "Contact Form",
	"description": "A sample contact form",
	"fields": [
		{
			"id": "name",
			"name": "name",
			"type": "text",
			"label": "Full Name",
			"required": true,
			"placeholder": "Enter your name"
		},
		{
			"id": "email",
			"name": "email",
			"type": "text",
			"label": "Email Address",
			"required": true,
			"helperText": "We'll never share your email."
		},
		{
			"id": "message",
			"name": "message",
			"type": "textarea",
			"label": "Your Message",
			"required": true
		}
	]
}
```

## Field Types

Flint SDK supports the following field types:

- `text` - Single line text input
- `number` - Number input with min/max validation
- `select` - Dropdown select
- `checkbox` - Checkbox group
- `radio` - Radio button group
- `date` - Date picker
- `file` - File upload
- `phone` - Phone number with validation
- `postalcode` - Postal code with validation
- `autocomplete` - Autocomplete input

## API Reference

### FlintSDK

#### Constructor

```typescript
new FlintSDK(supabaseUrl: string, supabaseKey: string)
```

#### Methods

- `loadSchema(schemaId: string): Promise<FormSchema>` - Load a form schema
- `saveSchema(schema: FormSchema): Promise<string>` - Save a form schema
- `submitForm(schemaId: string, data: Record<string, any>): Promise<FormSubmitResponse>` - Submit form data
- `uploadFile(file: File, path: string, bucket?: string): Promise<{path: string, url: string}>` - Upload a file

### FlintForm Component

#### Properties

- `schema: FormSchema` - The form schema to render
- `data: Record<string, any>` - Initial form data (optional)

#### Events

- `change` - Fired when form data changes
- `submit` - Fired when the form is submitted

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```
4. Build the SDK:
   ```bash
   pnpm build:sdk
   ```

## License

MIT
