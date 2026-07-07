interface AdminUserData {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    url: string;
    display_name: string;
    avatar: string;
    bio: string;
    subscribe: number;
    status: number;
    token: string;
}

interface ImportSummary {
    success_rate: string;
    admin_processed: number;
    [key: string]: any; // For additional summary fields
}

interface IAdminUserImportResponse {
    admins: {
        inserted_count: number;
        valid_data: AdminUserData[];
    };
    duplicated_data: any[];
    duplicated_records: number;
    invalid_data: any[];
    invalid_records: number;
    success: boolean;
    summary: ImportSummary;
    total_records: number;
    updated_data: AdminUserData[];
    updated_records: number;
    valid_records: number;
    valid_data: AdminUserData[];
}
export default class AdminUserImportResponse implements IAdminUserImportResponse {
    admins: {
        inserted_count: number;
        valid_data: AdminUserData[];
    };
    duplicated_data: any[];
    duplicated_records: number;
    invalid_data: any[];
    invalid_records: number;
    success: boolean;
    summary: ImportSummary;
    total_records: number;
    updated_data: AdminUserData[];
    updated_records: number;
    valid_records: number;
    valid_data: AdminUserData[];
    constructor(data: Partial<IAdminUserImportResponse> = {}) {
        this.admins = data.admins ?? { inserted_count: 0, valid_data: [] };
        this.duplicated_data = data.duplicated_data ?? [];
        this.duplicated_records = data.duplicated_records ?? 0;
        this.invalid_data = data.invalid_data ?? [];
        this.invalid_records = data.invalid_records ?? 0;
        this.success = data.success ?? false;
        this.summary = data.summary ?? { success_rate: '', admin_processed: 0 };
        this.total_records = data.total_records ?? 0;
        this.updated_data = data.updated_data ?? [];
        this.updated_records = data.updated_records ?? 0;
        this.valid_records = data.valid_records ?? 0;
        this.valid_data = data.valid_data ?? [];
    }
}