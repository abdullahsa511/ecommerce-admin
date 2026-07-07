// import { IFileModel } from "./Media.ts";

// Correction of PostTagData to match IPostTagData structure
export interface PostTagData {
    post_tag_id: number | null;
    // image?: IFileModel[] | [];
    name?: string | null;
    slug?: string | null;
    description?: string | null;
    status?: number | null;
    created_at?: string;
    post_id?: number | null;
}

interface ImportSummary {
    success_rate: string;
    post_tag_processed: number;
    [key: string]: any; // Additional summary fields if any
}

export interface IPostTagImportResponse {
    post_tags: {
        inserted_count: number;
        valid_data: PostTagData[];
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
    updated_data: PostTagData[];
    updated_records: number;
    valid_records: number;
    valid_data: PostTagData[];
}

export default class PostTagImportResponse implements IPostTagImportResponse {
    post_tags: {
        inserted_count: number;
        valid_data: PostTagData[];
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
    updated_data: PostTagData[];
    updated_records: number;
    valid_records: number;
    valid_data: PostTagData[];

    constructor(data: Partial<IPostTagImportResponse> = {}) {
        this.post_tags = data.post_tags ?? { inserted_count: 0, valid_data: [] };
        this.duplicated_data = data.duplicated_data ?? [];
        this.duplicated_records = data.duplicated_records ?? 0;
        this.invalid_data = data.invalid_data ?? [];
        this.invalid_records = data.invalid_records ?? 0;
        this.language_map = data.language_map ?? {};
        this.success = data.success ?? false;
        this.summary = data.summary ?? { success_rate: '', post_tag_processed: 0 };
        this.total_records = data.total_records ?? 0;
        this.updated_data = data.updated_data ?? [];
        this.updated_records = data.updated_records ?? 0;
        this.valid_records = data.valid_records ?? 0;
        this.valid_data = data.valid_data ?? [];
    }
}