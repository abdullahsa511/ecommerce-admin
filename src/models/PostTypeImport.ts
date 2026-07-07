interface PostTypeData {
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
    post_type_processed: number;
    [key: string]: any; // For additional summary fields
}

interface IPostTypeImportResponse {
    post_types: {
        inserted_count: number;
        valid_data: PostTypeData[];
    };
    duplicated_data: any[];
    duplicated_records: number;
    invalid_data: any[];
    invalid_records: number;
    success: boolean;
    summary: ImportSummary;
    total_records: number;
    updated_data: PostTypeData[];
    updated_records: number;
    valid_records: number;
    valid_data: PostTypeData[];
}

export default class PostTypeImportResponse implements IPostTypeImportResponse {
    post_types: {
        inserted_count: number;
        valid_data: PostTypeData[];
    };
    duplicated_data: any[];
    duplicated_records: number;
    invalid_data: any[];
    invalid_records: number;
    success: boolean;
    summary: ImportSummary;
    total_records: number;
    updated_data: PostTypeData[];
    updated_records: number;
    valid_records: number;
    valid_data: PostTypeData[];
    
    constructor(data: Partial<IPostTypeImportResponse> = {}) {
        this.post_types = data.post_types ?? { inserted_count: 0, valid_data: [] };
        this.duplicated_data = data.duplicated_data ?? [];
        this.duplicated_records = data.duplicated_records ?? 0;
        this.invalid_data = data.invalid_data ?? [];
        this.invalid_records = data.invalid_records ?? 0;
        this.success = data.success ?? false;
        this.summary = data.summary ?? { success_rate: '', post_type_processed: 0 };
        this.total_records = data.total_records ?? 0;
        this.updated_data = data.updated_data ?? [];
        this.updated_records = data.updated_records ?? 0;
        this.valid_records = data.valid_records ?? 0;
        this.valid_data = data.valid_data ?? [];
    }
}