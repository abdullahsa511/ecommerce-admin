export interface IItemOption {

    item_option_id: number | null;
    item_id: number | null;
    product_variant_id: number | null;
    product_option_group_id: number | null;
    product_id: number | null;
    option_id: number | null;
    type_id: number | null;
    name: string;
    value: any;
    meta_description: string;
    required: boolean;
    item_code: string;
    product_code: string;
    variant_name: string;
    option_group_name: string;
    option_name: string;
    type: string;

    
}


export default class ItemOption implements IItemOption {
    item_option_id: number | null;
    item_id: number | null;
    product_variant_id: number | null;
    product_option_group_id: number | null;
    product_id: number | null;
    option_id: number | null;
    type_id: number | null;
    name: string;
    value: any;
    meta_description: string;
    required: boolean;
    item_code: string;
    product_code: string;
    variant_name: string;
    option_group_name: string;
    option_name: string;
    type: string;


    constructor(data) {
        this.item_option_id = data?.item_option_id ?? null;
        this.product_id = data?.product_id ?? null;
        this.product_variant_id = data?.product_variant_id ?? null;
        this.product_option_group_id = data?.product_option_group_id ?? null;
        this.option_name = data?.option_name ?? null;
        this.item_id = data?.item_id ?? null;
        this.item_code = data?.item_code ?? null;
        this.product_code = data?.product_code ?? null;
        this.variant_name = data?.variant_name ?? null;
        this.option_group_name = data?.option_group_name ?? null;
        this.option_name = data?.option_name ?? null;
        this.type = data?.type ?? null;
        // add more column here
    }

    static fromJSON(json) {
        return new OptionsItem(json);
    }
} 
