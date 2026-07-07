interface LengthTypeContent {
    name: string;
    unit: string;
    language_id: number;
    length_type_id: number;
}

interface LengthTypeData {
    length_type_id: number;
    value: number;
}

interface ImportSummary {
    success_rate: string;
    lengthType_processed: number;
    [key: string]: any; // For additional summary fields
}

interface ILengthTypeImportResponse {
    lengthType_contents: {
        inserted_count: number;
        valid_data: LengthTypeContent[];
    };
    lengthTypes: {
        inserted_count: number;
        valid_data: LengthTypeData[];
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
    updated_data: LengthTypeContent[];
    updated_records: number;
    valid_records: number;
    valid_data: LengthTypeContent[];
}
export default class LengthTypeImportResponse implements ILengthTypeImportResponse {
    lengthType_contents: {
        inserted_count: number;
        valid_data: LengthTypeContent[];
    };
    lengthTypes: {
        inserted_count: number;
        valid_data: LengthTypeData[];
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
    updated_data: LengthTypeContent[];
    updated_records: number;
    valid_records: number;
    valid_data: LengthTypeContent[];
    constructor(data: Partial<ILengthTypeImportResponse> = {}) {
        this.lengthType_contents = data.lengthType_contents ?? { inserted_count: 0, valid_data: [] };
        this.lengthTypes = data.lengthTypes ?? { inserted_count: 0, valid_data: [] };
        this.duplicated_data = data.duplicated_data ?? [];
        this.duplicated_records = data.duplicated_records ?? 0;
        this.invalid_data = data.invalid_data ?? [];
        this.invalid_records = data.invalid_records ?? 0;
        this.language_map = data.language_map ?? {};
        this.success = data.success ?? false;
        this.summary = data.summary ?? { success_rate: '', lengthType_processed: 0 };
        this.total_records = data.total_records ?? 0;
        this.updated_data = data.updated_data ?? [];
        this.updated_records = data.updated_records ?? 0;
        this.valid_records = data.valid_records ?? 0;
        this.valid_data = data.valid_data ?? [];
    }
}