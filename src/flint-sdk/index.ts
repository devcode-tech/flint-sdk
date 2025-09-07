// Core
import { FlintSDK } from './FlintSDK';
import { FlintForm } from './components/FlintForm';

export * from './types';
export * from './components/FlintForm';

export { FlintSDK };

declare global {
	interface HTMLElementTagNameMap {
		'flint-form': FlintForm;
	}
}
