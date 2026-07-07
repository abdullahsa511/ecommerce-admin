

interface ShowroomContactData {
    showroom_contact_id: number;
    showroom_id: number;
    showroom: string;
    name: string;
    phone: string;
    email: string;
    message: string;
    status: string;
    image: string;

}
interface ImportSummary {
    success_rate: string;
    showroom_contact_processed: number;
    [key: string]: any; // For additional summary fields
}

interface IShowroomContactImportResponse {
    showroom_contact_contents: {
        inserted_count: number;
        valid_data: ShowroomContactData[];
    };
    showroom_contacts: {
        inserted_count: number;
        valid_data: ShowroomContactData[];
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
    updated_data: ShowroomContactData[];
    updated_records: number;
    valid_records: number;
    valid_data: ShowroomContactData[];
}
export default class ShowroomContactImportResponse implements IShowroomContactImportResponse {
    showroom_contact_contents: {
        inserted_count: number;
        valid_data: ShowroomContactData[];
    };
    showroom_contacts: {
        inserted_count: number;
        valid_data: ShowroomContactData[];
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
    updated_data: ShowroomContactData[];
    updated_records: number;
    valid_records: number;
    valid_data: ShowroomContactData[];
    constructor(data: Partial<IShowroomContactImportResponse> = {}) {
        this.showroom_contact_contents = data.showroom_contact_contents ?? { inserted_count: 0, valid_data: [] };
        this.showroom_contacts = data.showroom_contacts ?? { inserted_count: 0, valid_data: [] };
        this.duplicated_data = data.duplicated_data ?? [];
        this.duplicated_records = data.duplicated_records ?? 0;
        this.invalid_data = data.invalid_data ?? [];
        this.invalid_records = data.invalid_records ?? 0;
        this.language_map = data.language_map ?? {};
        this.success = data.success ?? false;
        this.summary = data.summary ?? { success_rate: '', showroom_contact_processed: 0 };
        this.total_records = data.total_records ?? 0;
        this.updated_data = data.updated_data ?? [];
        this.updated_records = data.updated_records ?? 0;
        this.valid_records = data.valid_records ?? 0;
        this.valid_data = data.valid_data ?? [];
    }
}