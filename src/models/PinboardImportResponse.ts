// pinboard data
interface PinboardData {
    reference_number: string;
    created_by_company: string;
    dispatch_location: string;
    job_title: string;
    pinboard_description: string;
    account_manager: string;
    project_manager: string;
    created_by: string;
    customer_po: string;
    expiry_date: string;
    organisation_code: string;
    organisation_name: string;
    // more fields can be added here
}

// pinboard item data
interface PinboardItemData {
    product_id: string;
    project_id: string;
    comment_id: string;
    blog_post_id: string;
    media_id: string;
    item_type: string;
    // more fields can be added here
}

interface ImportSummary {
    success_rate: string;
    pinboard_processed: number;
    [key: string]: any; // For additional summary fields
}

interface IPinboardImportResponse {
    pinboards: {
        inserted_count: number;
        valid_data: PinboardData[];
    };
    pinboardItems: {
        inserted_count: number;
        valid_data: PinboardItemData[];
    };
    duplicated_data: any[];
    duplicated_records: number;
    invalid_data: any[];
    invalid_records: number;
    language_map: {
        [key: string]: number; // e.g., { en_US: 1 }
    };
    success: boolean;
    summary: ImportSummary;
    total_records: number;
    updated_data: PinboardData[];
    updated_records: number;
    valid_records: number;
    valid_data: PinboardData[];
}
export default class PinboardImportResponse implements IPinboardImportResponse {
    pinboards: {
        inserted_count: number;
        valid_data: PinboardData[];
    };
    pinboardItems: {
        inserted_count: number;
        valid_data: PinboardItemData[];
    };
    duplicated_data: any[];
    duplicated_records: number;
    invalid_data: any[];
    invalid_records: number;
    language_map: {
        [key: string]: number; // e.g., { en_US: 1 }
    };
    success: boolean;
    summary: ImportSummary;
    total_records: number;
    updated_data: PinboardData[];
    updated_records: number;
    valid_records: number;
    valid_data: PinboardData[];
    constructor(data: Partial<IPinboardImportResponse> = {}) {
        this.pinboards = data.pinboards ?? { inserted_count: 0, valid_data: [] };
        this.pinboardItems = data.pinboardItems ?? { inserted_count: 0, valid_data: [] };
        this.duplicated_data = data.duplicated_data ?? [];
        this.duplicated_records = data.duplicated_records ?? 0;
        this.invalid_data = data.invalid_data ?? [];
        this.invalid_records = data.invalid_records ?? 0;
        this.language_map = data.language_map ?? {};
        this.success = data.success ?? false;
        this.summary = data.summary ?? { success_rate: '', pinboard_processed: 0 };
        this.total_records = data.total_records ?? 0;
        this.updated_data = data.updated_data ?? [];
        this.updated_records = data.updated_records ?? 0;
        this.valid_records = data.valid_records ?? 0;
        this.valid_data = data.valid_data ?? [];
    }
}