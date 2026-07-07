interface ReturnResolutionStatusData {
    sort_order: number;
    code: string;
}

interface ImportSummary {
    success_rate: string;
    return_resolution_processed: number;
    [key: string]: any; // For additional summary fields
}

interface IReturnResolutionImportResponse {
    return_resolutions: {
        inserted_count: number;
        valid_data: ReturnResolutionStatusData[];
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
    updated_data: ReturnResolutionStatusData[];
    updated_records: number;
    valid_records: number;
    valid_data: ReturnResolutionStatusData[];
}
export default class ReturnResolutionImportResponse implements IReturnResolutionImportResponse {
    return_resolutions: {
        inserted_count: number;
        valid_data: ReturnResolutionStatusData[];
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
    updated_data: ReturnResolutionStatusData[];
    updated_records: number;
    valid_records: number;
    valid_data: ReturnResolutionStatusData[];
    constructor(data: Partial<IReturnResolutionImportResponse> = {}) {
        this.return_resolutions = data.return_resolutions ?? { inserted_count: 0, valid_data: [] };
        this.duplicated_data = data.duplicated_data ?? [];
        this.duplicated_records = data.duplicated_records ?? 0;
        this.invalid_data = data.invalid_data ?? [];
        this.invalid_records = data.invalid_records ?? 0;
        this.language_map = data.language_map ?? {};
        this.success = data.success ?? false;
        this.summary = data.summary ?? { success_rate: '', return_resolution_processed: 0 };
        this.total_records = data.total_records ?? 0;
        this.updated_data = data.updated_data ?? [];
        this.updated_records = data.updated_records ?? 0;
        this.valid_records = data.valid_records ?? 0;
        this.valid_data = data.valid_data ?? [];
    }
}