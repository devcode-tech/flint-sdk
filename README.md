# Web Components with Tailwind CSS and Flint SDK

This is a starter kit for developing web components using Tailwind CSS and the Flint SDK for dynamic form generation with Supabase integration.

## Features

- 🏗️ Dynamic form generation from JSON schema
- 🔒 Built-in form validation
- ☁️ Seamless Supabase integration
- 🎨 Styled with Tailwind CSS
- 🚀 Framework-agnostic web components
- 📱 Responsive design
- ✨ TypeScript support

## Quick Start

### Installation

```bash
# Using npm
npm install butopen-web-components-tailwind-starter-kit@1.0.1

# Using yarn
yarn add butopen-web-components-tailwind-starter-kit@1.0.1

# Using pnpm
pnpm add butopen-web-components-tailwind-starter-kit@1.0.1
```

### Basic Usage

1. Include the form component in your HTML:

```html
<flint-form form-id="your-form-id"></flint-form>
<script type="module" src="path/to/flint-sdk.js"></script>
```

2. Or use it in your JavaScript/TypeScript:

```typescript
import { FlintSDK } from 'butopen-web-components-tailwind-starter-kit';

// Initialize with your Supabase credentials
const flint = new FlintSDK({
	supabaseUrl: 'your-supabase-url',
	supabaseKey: 'your-supabase-key',
});
```

## Form Component

The `<flint-form>` component provides a complete form solution:

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

### Properties

- `form-id`: The ID of the form schema to load from Supabase
- `data`: Initial form data (optional)
- `schema`: Direct schema definition (alternative to form-id)

### Events

- `submit`: Fires when the form is submitted
- `submit-success`: Fires on successful form submission
- `submit-error`: Fires when form submission fails
- `change`: Fires when form data changes

## Development

### Prerequisites

- Node.js 16+
- pnpm

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

### Building

```bash
# Development build
pnpm dev

# Production build
pnpm build

# Build the SDK
pnpm build:sdk
```

## License

MIT

## How will you create a tailwind component?

Here is a sample code:

```typescript
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { TailwindElement } from '../shared/tailwind.element';

import style from './test.component.scss?inline'; // #1

@customElement('test-component')
export class TestComponent extends TailwindElement(style) {
	// #2

	@property()
	name?: string = 'World';

	render() {
		return html`
			<p>
				Hello,
				<b>${this.name}</b>
				!
			</p>
			<button class="bg-blue-200 text-yellow-200 p-2 rounded-full text-2xl">
				Hello world!
			</button>
		`;
	}
}
```

It is based on the [lit element](https://lit.dev/docs/) technology: if you wrote a lit component before, you'll find it familiar.

There are only two differences to a standard _LitElement_:

1. You must import your styles from a separate file. And this is good for two reasons:
   - it separates the CSS from the logic
   - you can decide to use CSS or SCSS
   - note the `?inline` at the end of the file path: if you don't add it, then vite will add the style to the head of the html. If you add it, the style is scoped into the component only
2. the class extends a _TailwindElement_ rather than a LitElement

A _TailwindElement_ extends a _LitElmement_ (see below) and adds the logic to integrate tailwind and your styles.

## Get started

To run the project:

1. `pnpm install` (only the first time)
2. `pnpm start` to run the server
3. to develop the library, run `pnpm build` and copy the static assets where you need them.

You may clone this repo and start developing your components by looking at the _test.component_ as reference.

As an alternative, and if you like to have control over every piece, do the following:

1. copy the files in the shared folder:
   - _tailwind.element.ts_ extends LitElement by adding the tailwind support
   - _tailwind.global.css_ includes tha Tailwind base classes into each component
   - _globals.d.ts_ is used to avoid TypeScript errors whe nimporting CSS/Scss files in typescript files (thanks [@emaant96](https://github.com/emaant96))
2. copy the _package.json_ or the devDependencies inside into your own _package.json_ (**there are no dependencies**)
3. copy _postcss.config.js_, _tailwind.config.js_ and _tsconfig.js_

That's all.

## Show me the pieces

If you want to understand how it works, it's simple:

- the **package.json** integrates these technolgies:

```json
"autoprefixer": "^10.4.12",
"postcss": "^8.4.18",
"lit": "^2.4.0",
"tailwindcss": "^3.2.0",
"typescript": "^4.8.4",
"vite": "^3.1.8",
"sass": "^1.55.0"
```

- **vite** does almost all the work automatically
- to integrate tailwind, the most important file is in _src/shared/tailwind.element.ts_

```typescript
import { LitElement, unsafeCSS } from 'lit';

import style from './tailwind.global.css';

const tailwindElement = unsafeCSS(style);

export const TailwindElement = style =>
	class extends LitElement {
		static styles = [tailwindElement, unsafeCSS(style)];
	};
```

It extends a _LitElement_ class at runtime and adds the component tailwind classes.

The _style_ variable comes from your component, where it is imported from an external CSS (or SCSS) file.

Then it is combined with the default tailwind classes.

If you add more components, the common parts are reused.

## Who uses it?

We developed this starter kit to implement a web session player for our open source SaaS [browserbot](https://browserbot.io/).

If you want to contribute or share soem thoughts, just get in touch with us.

Enjoy.
