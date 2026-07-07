interface Item {
    product_id: number;
    product_variant_id: number;
    km_item_id: number;
    vendor_id: number;
    import_vendor_id: number;
    factory_vendor_id: number;
    item_category_id: number;
    item_type_id: number;
    sort_order: number;
    item_code: string;
    web_sku: string;
    class: string;
    description: string;
    specifications: string;
    warranty_period: string;
    active: number;
    width: number;
    height: number;
    depth: number;
    carton_qm: number;
    carton_width: number;
    carton_depth: number;
    carton_height: number;
    gross_weight: number;
    boradusages_sixteen: number;
    boardusages_eighteen: number;
    boardusages_twentyfive: number;
    boardusages_thirtythree: number;
    krost_zoho_id: string;
    krost_qld_zoho_id: string;
    meloz_zoho_id: string;
    gregbar_zoho_id: string;
    klein_zoho_id: string;
    lead_days: number;
    melbourne_lead_days: number;
    brisbane_lead_days: number;
    safety_stock: number;
    quote_image: string;
    delay_until: string;
    delay_until_reason: string;
    web_link: string;
    products_per_cartoon: number;
    track_stock: number;
    user_note: string;
    archive: number;
    project_price_qty: number;
    project_price_discount: number;
}

interface ImportSummary {
    success_rate: string;
    items_processed: number;
}

interface IItemImportResponse {
    items: {
        inserted_count: number;
        valid_data: Item[];
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
    updated_data: Item[];
    updated_records: number;
    valid_records: number;
    valid_data: Item[];
    mapping_data: {
        productMap: {
            [key: string]: number;
        };
        variantMap: {
            [key: string]: number;
        };
        itemMap: number[];
    };
}
export default class ItemImportResponse implements IItemImportResponse {
    items: {
        inserted_count: number;
        valid_data: Item[];
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
    updated_data: Item[];
    updated_records: number;
    valid_records: number;
    valid_data: Item[];
    mapping_data: {
        productMap: {
            [key: string]: number;
        };
        variantMap: {
            [key: string]: number;
        };
        itemMap: number[];
    };

    constructor(data: Partial<IItemImportResponse> = {}) {
        this.items = data.items ?? { inserted_count: 0, valid_data: [] };
        this.duplicated_data = data.duplicated_data ?? [];
        this.duplicated_records = data.duplicated_records ?? 0;
        this.invalid_data = data.invalid_data ?? [];
        this.invalid_records = data.invalid_records ?? 0;
        this.language_map = data.language_map ?? {};
        this.success = data.success ?? false;
        this.summary = data.summary ?? { success_rate: '', items_processed: 0 };
        this.total_records = data.total_records ?? 0;
        this.updated_data = data.updated_data ?? [];
        this.updated_records = data.updated_records ?? 0;
        this.valid_records = data.valid_records ?? 0;
        this.valid_data = data.valid_data ?? [];
        // Accept either correctly-spelled `mapping_data` or misspelled `maping_data` from API responses
        this.mapping_data = data.mapping_data ?? (data as any).maping_data ?? { productMap: {}, variantMap: {}, itemMap: [] };
    }
}