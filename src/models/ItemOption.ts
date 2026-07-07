import { FileModel, IFileModel } from "./Media.ts";

export interface IItemOption {
    item_option_id: number | null;
    item_id: number | null;
    product_variant_id: number | null;
    product_option_group_id: number | null;
    product_id: number | null;
    product_option_id: number | null;
    type_id: number | null;
    value: any;
    meta_description: string;
    option_description: string | null;
    price: number | null;
    required: number | null;
    item_code: string;
    product_code: string;
    variant_name: string;
    option_group_name: string;
    option_name: string;
    product_option_name: string|null;
    type: string;
    image: IFileModel[];
    hex_color: string;
}


export default class ItemOption implements IItemOption {
    item_option_id: number | null;
    item_id: number | null;
    product_variant_id: number | null;
    product_option_group_id: number | null;
    product_id: number | null;
    product_option_id: number | null;
    type_id: number | null;
    value: any;
    meta_description: string;
    option_description: string | null;
    price: number | null;
    required: number | null;
    item_code: string;
    product_code: string;
    variant_name: string;
    option_group_name: string;
    option_name: string;
    product_option_name: string|null;
    image: IFileModel[];
    type: string;
    hex_color: string;

    constructor(data: Partial<IItemOption> = {}) {
        // console.log('data constructor:', data);
        this.item_option_id = data.item_option_id ?? null;
        this.item_id = data.item_id ?? null;
        this.product_variant_id = data.product_variant_id ?? null;
        this.product_option_group_id = data.product_option_group_id ?? null;
        this.product_id = data.product_id ?? null;
        this.product_option_id = data.product_option_id ?? null;
        this.type_id = data.type_id ?? null;
        this.value = data.value ?? null;
        this.meta_description = data.meta_description ?? '';
        this.option_description = data.option_description ?? null;
        this.price = data.price ?? null;
        this.required = data.required ?? 1;
        this.item_code = data.item_code ?? '';
        this.product_code = data.product_code ?? '';
        this.variant_name = data.variant_name ?? '';
        this.option_group_name = data.option_group_name ?? '';
        this.option_name = data.option_name ?? '';
        this.product_option_name = data.product_option_name ?? null;
        this.type = data.type ?? '';
        this.image = Array.isArray(data.image)
            ? data.image.map((file) => (file instanceof FileModel ? file : new FileModel(file)))
            : [];
        this.hex_color = data.hex_color ?? '';
        // add more column here
    }

    static fromJSON(json: any): ItemOption {
        return new ItemOption(json);
    }
} 
