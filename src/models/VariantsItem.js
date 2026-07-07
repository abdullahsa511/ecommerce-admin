export default class VariantsItem {
    constructor(data) {
        this.variant_item_id = data?.variant_item_id ?? null;
        this.variant_name = data?.variant_name ?? null;
        this.product_id = data?.product_id ?? null;
        this.product_variant_id = data?.product_variant_id ?? null;
        this.item_id = data?.item_id ?? null;
        this.km_item_id = data?.km_item_id ?? null;
        this.sort_order = data?.sort_order ?? null;
        this.active_status = data?.active_status ?? null;
        this.created_at = data?.created_at ?? null;
        this.updated_at = data?.updated_at ?? null;
        this.item_id = data?.item_id ?? null;
        this.item_code = data?.item_code ?? null;

        // add more column here
    }

    static fromJSON(json) {
        return new VariantsItem(json);
    }
}