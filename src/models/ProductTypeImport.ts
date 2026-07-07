interface ProductTypeData {
    name: string;
    type: string;
    plural: string;
    icon: string;
    image: string;
    source: string;
    site_id: number;
}

interface ImportSummary {
    success_rate: string;
    product_type_processed: number;
    [key: string]: any; // For additional summary fields
}

interface IProductTypeImportResponse {
    product_types: {
        inserted_count: number;
        valid_data: ProductTypeData[];
    };
    duplicated_data: any[];
    duplicated_records: number;
    invalid_data: any[];
    invalid_records: number;
    success: boolean;
    summary: ImportSummary;
    total_records: number;
    updated_data: ProductTypeData[];
    updated_records: number;
    valid_records: number;
    valid_data: ProductTypeData[];
}

export default class ProductTypeImportResponse implements IProductTypeImportResponse {
    product_types: {
        inserted_count: number;
        valid_data: ProductTypeData[];
    };
    duplicated_data: any[];
    duplicated_records: number;
    invalid_data: any[];
    invalid_records: number;
    success: boolean;
    summary: ImportSummary;
    total_records: number;
    updated_data: ProductTypeData[];
    updated_records: number;
    valid_records: number;
    valid_data: ProductTypeData[];
    
    constructor(data: Partial<IProductTypeImportResponse> = {}) {
        this.product_types = data.product_types ?? { inserted_count: 0, valid_data: [] };
        this.duplicated_data = data.duplicated_data ?? [];
        this.duplicated_records = data.duplicated_records ?? 0;
        this.invalid_data = data.invalid_data ?? [];
        this.invalid_records = data.invalid_records ?? 0;
        this.success = data.success ?? false;
        this.summary = data.summary ?? { success_rate: '', product_type_processed: 0 };
        this.total_records = data.total_records ?? 0;
        this.updated_data = data.updated_data ?? [];
        this.updated_records = data.updated_records ?? 0;
        this.valid_records = data.valid_records ?? 0;
        this.valid_data = data.valid_data ?? [];
    }
}