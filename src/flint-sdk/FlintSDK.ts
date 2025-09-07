import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FormSchema, FormData, FormSubmitResponse } from './types';

export class FlintSDK {
	private supabase!: SupabaseClient;
	private initialized = false;

	constructor(supabaseUrl?: string, supabaseKey?: string) {
		if (supabaseUrl && supabaseKey) {
			this.init(supabaseUrl, supabaseKey);
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
		const { data, error } = await this.supabase
			.from('schemas')
			.select('*')
			.eq('id', schemaId)
			.single();
		if (error) throw new Error(`Failed to load schema: ${error.message}`);
		return data as FormSchema;
	}

	public async saveSchema(schema: FormSchema): Promise<string> {
		this.ensureInitialized();
		const { data, error } = await this.supabase
			.from('schemas')
			.upsert(schema)
			.select()
			.single();
		if (error) throw new Error(`Failed to save schema: ${error.message}`);
		return data.id;
	}

	public async submitForm(
		schemaId: string,
		formData: FormData
	): Promise<FormSubmitResponse> {
		this.ensureInitialized();
		try {
			const { data, error } = await this.supabase
				.from('form_submissions')
				.insert([{ schema_id: schemaId, form_data: formData }])
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
