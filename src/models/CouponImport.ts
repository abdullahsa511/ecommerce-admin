
interface CouponData {
    coupon_id: number;
    name: string;
    code: string;
    type: string;
    discount: number;
    cart_total_min: number | null;
    coupon_limit: number | null;
    user_limit: string | null;
    registered_user_only: string | null;
    free_shipping: number;
    status: number;
    date_start: string;
    date_end: string;
}

interface ImportSummary {
    success_rate: string;
    lengthType_processed: number;
    [key: string]: any; // For additional summary fields
}

interface ICouponImportResponse {
  
    coupons: {
        inserted_count: number;
        valid_data: CouponData[];
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
    updated_data: CouponData[];
    updated_records: number;
    valid_records: number;
    valid_data: CouponData[];
}
export default class CouponImportResponse implements ICouponImportResponse {
    
    coupons: {
        inserted_count: number;
        valid_data: CouponData[];
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
    updated_data: CouponData[];
    updated_records: number;
    valid_records: number;
    valid_data: CouponData[];
    constructor(data: Partial<ICouponImportResponse> = {}) {
        this.coupons = data.coupons ?? { inserted_count: 0, valid_data: [] };
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