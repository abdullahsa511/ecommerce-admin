interface VariantItem {
    item_id: number;
    product_variant_id: number;
    product_id: number;
    km_item_id: string | number;
    sort_order: number;
    active_status: boolean;
}

interface ImportSummary {
    success_rate: string;
    variant_items_processed: number;
    [key: string]: any; // For additional summary fields
}

interface IVariantItemImportResponse {
    success: boolean;
    total_records: number;
    valid_records: number;
    valid_data: VariantItem[];
    updated_records: number;
    updated_data: VariantItem[];
    invalid_records: number;
    invalid_data: VariantItem[];
    duplicated_records: number;
    duplicated_data: VariantItem[];
    variant_items: {
        inserted_count: number;
        valid_data: VariantItem[];
    };
    summary: ImportSummary;
    mapping_data: {
        itemCodeToIdMap: {
            [key: string]: number;
        };
        productVariantNameToIdMap: {
            [key: string]: number;
        };
        productCodeToIdMap: {
            [key: string]: number;
        };
        variantItemUniqueToIdMap: {
            [key: string]: number;
        };
    };
}
export default class VariantItemImportResponse implements IVariantItemImportResponse {
    success: boolean;
    total_records: number;
    updated_data: VariantItem[];
    updated_records: number;
    valid_records: number;
    valid_data: VariantItem[];
    variant_items: {
        inserted_count: number;
        valid_data: VariantItem[];
    };
    duplicated_data: VariantItem[];
    duplicated_records: number;
    invalid_data: VariantItem[];
    invalid_records: number;
    summary: ImportSummary;
    mapping_data: {
        itemCodeToIdMap: {
            [key: string]: number;
        };
        productVariantNameToIdMap: {
            [key: string]: number;
        };
        productCodeToIdMap: {
            [key: string]: number;
        };
        variantItemUniqueToIdMap: {
            [key: string]: number;
        };
    };
    constructor(data: Partial<IVariantItemImportResponse> = {}) {
        this.variant_items = data.variant_items ?? { inserted_count: 0, valid_data: [] };
        this.duplicated_data = data.duplicated_data ?? [];
        this.duplicated_records = data.duplicated_records ?? 0;
        this.invalid_data = data.invalid_data ?? [];
        this.invalid_records = data.invalid_records ?? 0;
        this.success = data.success ?? false;
        this.summary = data.summary ?? { success_rate: '', variant_items_processed: 0 };
        this.total_records = data.total_records ?? 0;
        this.updated_data = data.updated_data ?? [];
        this.updated_records = data.updated_records ?? 0;
        this.valid_records = data.valid_records ?? 0;
        this.valid_data = data.valid_data ?? [];
        this.mapping_data = data.mapping_data ?? { itemCodeToIdMap: {}, productVariantNameToIdMap: {}, productCodeToIdMap: {}, variantItemUniqueToIdMap: {} };
    }
}