interface OrderContent {
    name: string;
    unit: string;
    language_id: number;
    length_type_id: number;
}

interface OrderData {
    length_type_id: number;
    value: number;
}

interface ImportSummary {
    success_rate: string;
    order_processed: number;
    [key: string]: any; // For additional summary fields
}

interface IOrderImportResponse {
    order_contents: {
        inserted_count: number;
        valid_data: OrderContent[];
    };
    orders: {
        inserted_count: number;
        valid_data: OrderData[];
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
    updated_data: OrderContent[];
    updated_records: number;
    valid_records: number;
    valid_data: OrderContent[];
}
export default class OrderImportResponse implements IOrderImportResponse {
    order_contents: {
        inserted_count: number;
        valid_data: OrderContent[];
    };
    orders: {
        inserted_count: number;
        valid_data: OrderData[];
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
    updated_data: OrderContent[];
    updated_records: number;
    valid_records: number;
    valid_data: OrderContent[];
    constructor(data: Partial<IOrderImportResponse> = {}) {
        this.order_contents = data.order_contents ?? { inserted_count: 0, valid_data: [] };
        this.orders = data.orders ?? { inserted_count: 0, valid_data: [] };
        this.duplicated_data = data.duplicated_data ?? [];
        this.duplicated_records = data.duplicated_records ?? 0;
        this.invalid_data = data.invalid_data ?? [];
        this.invalid_records = data.invalid_records ?? 0;
        this.language_map = data.language_map ?? {};
        this.success = data.success ?? false;
        this.summary = data.summary ?? { success_rate: '', order_processed: 0 };
        this.total_records = data.total_records ?? 0;
        this.updated_data = data.updated_data ?? [];
        this.updated_records = data.updated_records ?? 0;
        this.valid_records = data.valid_records ?? 0;
        this.valid_data = data.valid_data ?? [];
    }
}