import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
	FormSchema,
	FormData,
	FormSubmitResponse,
	DatabaseFormSchema,
} from './types';

// Default configuration that can be overridden
const defaultConfig = {
	supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
	supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
};

export interface FlintSDKConfig {
	supabaseUrl: string;
	supabaseKey: string;
}

export class FlintSDK {
	private supabase!: SupabaseClient;
	private initialized = false;
	private readonly TABLE_NAME = 'form_schemas';

	constructor(config?: Partial<FlintSDKConfig>) {
		// Merge provided config with defaults
		const finalConfig = { ...defaultConfig, ...config };

		if (finalConfig.supabaseUrl && finalConfig.supabaseKey) {
			this.init(finalConfig.supabaseUrl, finalConfig.supabaseKey);
		} else {
			console.warn(
				'FlintSDK: Missing Supabase URL or Key. Call init() with valid credentials.'
			);
		}
	}

	public init(supabaseUrl: string, supabaseKey: string): void {
		this.supabase = createClient(supabaseUrl, supabaseKey);
		this.initialized = true;
	}

	private ensureInitialized(): void {
		if (!this.initialized) {
			throw new Error('FlintSDK not initialized. Call init() first.');
		}
	}

	public async loadSchema(schemaId: string): Promise<FormSchema> {
		this.ensureInitialized();

		try {
			const { data, error } = await this.supabase
				.from(this.TABLE_NAME)
				.select('*')
				.eq('id', schemaId)
				.single<DatabaseFormSchema>();

			if (error) {
				throw new Error(`Failed to load schema: ${error.message}`);
			}

			if (!data) {
				throw new Error(
					`Schema with ID ${schemaId} not found in table ${this.TABLE_NAME}`
				);
			}

			// Convert from database format to FormSchema
			return {
				id: data.id,
				title: data.title,
				description: data.description,
				fields: data.schema?.fields || [],
				submitText: data.schema?.submitText,
				created_at: data.created_at,
				updated_at: data.updated_at,
			};
		} catch (error) {
			console.error('Error in loadSchema:', error);
			throw error;
		}
	}

	public async saveSchema(schema: FormSchema): Promise<string> {
		this.ensureInitialized();

		const dbSchema: Omit<
			DatabaseFormSchema,
			'id' | 'created_at' | 'updated_at'
		> = {
			title: schema.title,
			description: schema.description || null,
			schema: {
				fields: schema.fields || [],
				submitText: schema.submitText,
			},
		};

		const { data, error } = await this.supabase
			.from(this.TABLE_NAME)
			.upsert({
				...(schema.id && { id: schema.id }),
				...dbSchema,
			} as any)
			.select('id')
			.single();

		if (error) throw new Error(`Failed to save schema: ${error.message}`);
		if (!data) throw new Error('No data returned from save operation');

		return data.id;
	}

	public async submitForm(
		schemaId: string,
		formData: FormData
	): Promise<FormSubmitResponse> {
		this.ensureInitialized();
		try {
			('unknown');
			const { data, error } = await this.supabase
				.from('form_submissions')
				.insert([{ form_id: schemaId, data: formData }])
				.select();
			if (error) throw error;
			return { success: true, data: data[0] };
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			};
		}
	}

	public async uploadFile(file: File, path: string, bucket = 'form-uploads') {
		this.ensureInitialized();
		const fileName = `${Date.now()}-${file.name}`;
		const filePath = `${path}/${fileName}`;

		const { error } = await this.supabase.storage
			.from(bucket)
			.upload(filePath, file);
		if (error) throw new Error(`Upload failed: ${error.message}`);

		const {
			data: { publicUrl },
		} = this.supabase.storage.from(bucket).getPublicUrl(filePath);

		return { path: filePath, url: publicUrl };
	}
}
