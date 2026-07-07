// import { IFileModel } from "./Media";


interface ProductAccessories {
    product_accessories_id: number;
    product_id: number;
    parent_product_id: number;
    item_id: string;
    price: number;
    active_status: number;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    sort_order: number;
}
interface ImportSummary {
    success_rate: string;
    product_accessories_processed: number;
    [key: string]: any; // For additional summary fields
}

interface IProductAccessoriesImportResponse {
    product_accessories_contents: {
        inserted_count: number;
        valid_data: ProductAccessories[];
    };
    product_accessories: {
        inserted_count: number;
        valid_data: ProductAccessories[];
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
    updated_data: ProductAccessories[];
    updated_records: number;
    valid_records: number;
    valid_data: ProductAccessories[];
    inserted_data: ProductAccessories[];
    inserted_records: number;
}
export default class ProductAccessoriesImportResponse implements IProductAccessoriesImportResponse {
    product_accessories_contents: {
        inserted_count: number;
        valid_data: ProductAccessories[];
    };
    
    product_accessories: {
        inserted_count: number;
        valid_data: ProductAccessories[];
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
    updated_data: ProductAccessories[];
    updated_records: number;
    valid_records: number;
    valid_data: ProductAccessories[];
    inserted_data: ProductAccessories[];
    inserted_records: number;
    constructor(data: Partial<IProductAccessoriesImportResponse> = {}) {
        this.product_accessories_contents = data.product_accessories_contents ?? { inserted_count: 0, valid_data: [] };
        this.product_accessories = data.product_accessories ?? { inserted_count: 0, valid_data: [] };
        this.duplicated_data = data.duplicated_data ?? [];
        this.duplicated_records = data.duplicated_records ?? 0;
        this.invalid_data = data.invalid_data ?? [];
        this.invalid_records = data.invalid_records ?? 0;
        this.language_map = data.language_map ?? {};
        this.success = data.success ?? false;
        this.summary = data.summary ?? { success_rate: '', product_accessories_processed: 0 };
        this.total_records = data.total_records ?? 0;
        this.updated_data = data.updated_data ?? [];
        this.updated_records = data.updated_records ?? 0;
        this.valid_records = data.valid_records ?? 0;
        this.valid_data = data.valid_data ?? [];
        this.inserted_data = data.inserted_data ?? [];
        this.inserted_records = data.inserted_records ?? 0;
    }
}