interface DesignResourceData {
    design_resource_document_id: number;
    name: string;
    format: string;
    description: string;
    media_id: number;
    design_resource_id: number;
}

interface ImportSummary {
    success_rate: string;
    design_resource_processed: number;
    [key: string]: any; // For additional summary fields
}

interface IDesignResourceImportResponse {
    design_resource_contents: {
        inserted_count: number;
        valid_data: DesignResourceData[];
    };
    design_resources: {
        inserted_count: number;
        valid_data: DesignResourceData[];
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
    updated_data: DesignResourceData[];
    updated_records: number;
    valid_records: number;
    valid_data: DesignResourceData[];
}
export default class DesignResourceImportResponse implements IDesignResourceImportResponse {
    design_resource_contents: {
        inserted_count: number;
        valid_data: DesignResourceData[];
    };
    design_resources: {
        inserted_count: number;
        valid_data: DesignResourceData[];
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
    updated_data: DesignResourceData[];
    updated_records: number;
    valid_records: number;
    valid_data: DesignResourceData[];
    constructor(data: Partial<IDesignResourceImportResponse> = {}) {
        this.design_resource_contents = data.design_resource_contents ?? { inserted_count: 0, valid_data: [] };
        this.design_resources = data.design_resources ?? { inserted_count: 0, valid_data: [] };
        this.duplicated_data = data.duplicated_data ?? [];
        this.duplicated_records = data.duplicated_records ?? 0;
        this.invalid_data = data.invalid_data ?? [];
        this.invalid_records = data.invalid_records ?? 0;
        this.language_map = data.language_map ?? {};
        this.success = data.success ?? false;
        this.summary = data.summary ?? { success_rate: '', design_resource_processed: 0 };
        this.total_records = data.total_records ?? 0;
        this.updated_data = data.updated_data ?? [];
        this.updated_records = data.updated_records ?? 0;
        this.valid_records = data.valid_records ?? 0;
        this.valid_data = data.valid_data ?? [];
    }
}