interface ProductMetaData {
    product_id?: number;
    product_code: string;
    meta_keywords?: string;
    meta_description?: string;
    meta_content?: string;
    [key: string]: any;
}

interface ImportSummary {
    success_rate: string;
    product_meta_processed: number;
    [key: string]: any;
}

interface IProductMetaImportResponse {
    product_meta: {
        inserted_count: number;
        valid_data: ProductMetaData[];
    };
    duplicated_data: any[];
    duplicated_records: number;
    invalid_data: any[];
    invalid_records: number;
    language_map: {
        [key: string]: number;
    };
    success: boolean;
    summary: ImportSummary;
    total_records: number;
    updated_data: ProductMetaData[];
    updated_records: number;
    valid_records: number;
    valid_data: ProductMetaData[];
}

export default class ProductMetaImportResponse implements IProductMetaImportResponse {
    product_meta: {
        inserted_count: number;
        valid_data: ProductMetaData[];
    };
    duplicated_data: any[];
    duplicated_records: number;
    invalid_data: any[];
    invalid_records: number;
    language_map: {
        [key: string]: number;
    };
    success: boolean;
    summary: ImportSummary;
    total_records: number;
    updated_data: ProductMetaData[];
    updated_records: number;
    valid_records: number;
    valid_data: ProductMetaData[];

    constructor(data: Partial<IProductMetaImportResponse> = {}) {
        this.product_meta = data.product_meta ?? { inserted_count: 0, valid_data: [] };
        this.duplicated_data = data.duplicated_data ?? [];
        this.duplicated_records = data.duplicated_records ?? 0;
        this.invalid_data = data.invalid_data ?? [];
        this.invalid_records = data.invalid_records ?? 0;
        this.language_map = data.language_map ?? {};
        this.success = data.success ?? false;
        this.summary = data.summary ?? { success_rate: '', product_meta_processed: 0 };
        this.total_records = data.total_records ?? 0;
        this.updated_data = data.updated_data ?? [];
        this.updated_records = data.updated_records ?? 0;
        this.valid_records = data.valid_records ?? 0;
        this.valid_data = data.valid_data ?? [];
    }
}
