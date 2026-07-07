interface ItemOption {
    item_id: number;
    product_variant_id: number;
    product_option_group_id: number;
    product_id: number;
    option_id: number;
    type_id: number;
    name: string;
    value: any;
    meta_description: string;
    required: boolean;
}

interface ImportSummary {
    success_rate: string;
    item_options_processed: number;
    [key: string]: any; // For additional summary fields
}

interface IItemOptionImportResponse {
    success: boolean;
    total_records: number;
    valid_records: number;
    valid_data: ItemOption[];
    updated_records: number;
    updated_data: ItemOption[];
    invalid_records: number;
    invalid_data: ItemOption[];
    duplicated_records: number;
    duplicated_data: ItemOption[];
    item_options: {
        inserted_count: number;
        valid_data: ItemOption[];
    };
    summary: ImportSummary;
    mapping_data: {
        itemIdToIdMap: {
            [key: string]: number;
        };
        productVariantIdToIdMap: {
            [key: string]: number;
        };
        productOptionGroupIdToIdMap: {
            [key: string]: number;
        };
        productIdToIdMap: {
            [key: string]: number;
        };
        optionIdToIdMap: {
            [key: string]: number;
        };
        typeIdToIdMap: {
            [key: string]: number;
        };
        itemOptionUniqueToIdMap: {
            [key: string]: number;
        };
    };
}
export default class ItemOptionImportResponse implements IItemOptionImportResponse {
    success: boolean;
    total_records: number;
    updated_data: ItemOption[];
    updated_records: number;
    valid_records: number;
    valid_data: ItemOption[];
    item_options: {
        inserted_count: number;
        valid_data: ItemOption[];
    };
    duplicated_data: ItemOption[];
    duplicated_records: number;
    invalid_data: ItemOption[];
    invalid_records: number;
    summary: ImportSummary;
    mapping_data: {
        itemIdToIdMap: {
            [key: string]: number;
        };
        productVariantIdToIdMap: {
            [key: string]: number;
        };
        productOptionGroupIdToIdMap: {
            [key: string]: number;
        };
        productIdToIdMap: {
            [key: string]: number;
        };
        optionIdToIdMap: {
            [key: string]: number;
        };
        typeIdToIdMap: {
            [key: string]: number;
        };
        itemOptionUniqueToIdMap: {
            [key: string]: number;
        };
    };
    constructor(data: Partial<IItemOptionImportResponse> = {}) {
        this.item_options = data.item_options ?? { inserted_count: 0, valid_data: [] };
        this.duplicated_data = data.duplicated_data ?? [];
        this.duplicated_records = data.duplicated_records ?? 0;
        this.invalid_data = data.invalid_data ?? [];
        this.invalid_records = data.invalid_records ?? 0;
        this.success = data.success ?? false;
        this.summary = data.summary ?? { success_rate: '', item_options_processed: 0 };
        this.total_records = data.total_records ?? 0;
        this.updated_data = data.updated_data ?? [];
        this.updated_records = data.updated_records ?? 0;
        this.valid_records = data.valid_records ?? 0;
        this.valid_data = data.valid_data ?? [];
        this.mapping_data = data.mapping_data ?? { itemIdToIdMap: {}, productVariantIdToIdMap: {}, productOptionGroupIdToIdMap: {}, productIdToIdMap: {}, optionIdToIdMap: {}, typeIdToIdMap: {}, itemOptionUniqueToIdMap: {} };
    }
}