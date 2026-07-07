interface TaxTypeContent {
    name: string;
    content: string;
}

interface ImportSummary {
    success_rate: string;
    tax_type_processed: number;
    [key: string]: any; // For additional summary fields
}

interface ITaxTypeImportResponse {
    success: boolean;
    summary: ImportSummary;
    total_records: number;
    inserted: number;
    valid_records: number;
    valid_data: TaxTypeContent[];
    invalid_records: number;
    invalid_data: TaxTypeContent[];
    updated_records: number;
    updated_data: TaxTypeContent[];
    duplicated_records: number;
    duplicated_data: TaxTypeContent[];
    processed_records: number;
    processed_data: TaxTypeContent[];
}
export default class TaxTypeImportResponse implements ITaxTypeImportResponse {
    success: boolean;
    summary: ImportSummary;
    total_records: number;
    inserted: number;
    valid_records: number;
    valid_data: TaxTypeContent[];
    invalid_records: number;
    invalid_data: TaxTypeContent[];
    updated_records: number;
    updated_data: TaxTypeContent[];
    duplicated_records: number;
    duplicated_data: TaxTypeContent[];
    processed_records: number;
    processed_data: TaxTypeContent[];
    constructor(data: Partial<ITaxTypeImportResponse> = {}) {
        this.success = data.success ?? false;
        this.summary = data.summary ?? { success_rate: '', tax_type_processed: 0 };
        this.total_records = data.total_records ?? 0;
        this.inserted = data.inserted ?? 0;
        this.valid_records = data.valid_records ?? 0;
        this.valid_data = data.valid_data ?? [];
        this.invalid_records = data.invalid_records ?? 0;
        this.invalid_data = data.invalid_data ?? [];
        this.updated_records = data.updated_records ?? 0;
        this.updated_data = data.updated_data ?? [];
        this.duplicated_records = data.duplicated_records ?? 0;
        this.duplicated_data = data.duplicated_data ?? [];
        this.processed_records = data.processed_records ?? 0;
        this.processed_data = data.processed_data ?? [];
    }
}