# Flint SDK

A powerful SDK for building dynamic forms with Supabase integration. Built with TypeScript, Lit, and Tailwind CSS.

## Version

Current version: 1.0.1

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
# Using npm
npm install butopen-web-components-tailwind-starter-kit@1.0.1

# Using yarn
yarn add butopen-web-components-tailwind-starter-kit@1.0.1

# Using pnpm
pnpm add butopen-web-components-tailwind-starter-kit@1.0.1
```

## Quick Start

### 1. Include the SDK in your project

```html
<script type="module" src="path/to/flint-sdk.js"></script>
```

Or import it in your JavaScript/TypeScript:

```typescript
import { FlintSDK } from 'butopen-web-components-tailwind-starter-kit';
```

### 2. Initialize the SDK

```typescript
const flint = new FlintSDK({
	supabaseUrl: 'your-supabase-url',
	supabaseKey: 'your-supabase-key',
});
```

### 3. Use the Form Component

```html
<flint-form
	form-id="your-form-id"
	data="{}"
	@submit="handleSubmit"
	@submit-success="handleSuccess"
	@submit-error="handleError"
>
</flint-form>
```

## API Reference

### FlintSDK

#### Constructor

```typescript
new FlintSDK(config: {
  supabaseUrl: string;
  supabaseKey: string;
})
```

#### Methods

##### `loadSchema(schemaId: string): Promise<FormSchema>`

Loads a form schema from Supabase.

##### `submitForm(formId: string, data: Record<string, any>): Promise<void>`

Submits form data to Supabase.

### FlintForm Component

#### Properties

| Property | Type   | Required | Description                       |
| -------- | ------ | -------- | --------------------------------- |
| formId   | string | Yes      | The ID of the form schema to load |
| data     | object | No       | Initial form data                 |
| schema   | object | No       | Direct schema definition          |

#### Events

| Event          | Description                         |
| -------------- | ----------------------------------- |
| submit         | Fires when the form is submitted    |
| submit-success | Fires on successful form submission |
| submit-error   | Fires when form submission fails    |
| change         | Fires when form data changes        |

## Form Schema

Example schema:

```typescript
{
  id: 'form-id',
  title: 'Contact Form',
  description: 'A sample contact form',
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      required: true,
      placeholder: 'Enter your name'
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
      placeholder: 'Enter your email'
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Message',
      required: true,
      placeholder: 'Enter your message'
    }
  ]
}
```

## Development

### Prerequisites

- Node.js 16+
- pnpm

### Building

```bash
# Install dependencies
pnpm install

# Build the SDK
pnpm build:sdk
```

## License

MIT
