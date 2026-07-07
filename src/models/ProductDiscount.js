export default class ProductDiscount {
    constructor(data) {
        this.product_discount_id = data?.product_discount_id ?? null;
        this.product_id = data?.product_id ?? null;
        this.product_code = data?.product_code ?? null;
        this.user_group_id = data?.user_group_id ?? null;
        this.user_group_name = data?.user_group_name ?? null;
        this.quantity = data?.quantity ?? null;
        this.priority = data?.priority ?? null;
        this.price = data?.price ?? null;
        this.from_date = data?.from_date ?? null;
        this.to_date = data?.to_date ?? null;
    }

    static fromJSON(json) {
        return new ProductDiscount(json);
    }
} 
