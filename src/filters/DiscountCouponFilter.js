class DiscountCouponFilter {
    constructor() {
        this.global = { value: null, matchMode: 'contains' };
        this.code = { value: null, matchMode: 'contains' };
        this.description = { value: null, matchMode: 'contains' };
        this.discount_type = { value: null, matchMode: 'equals' };
        this.status = { value: null, matchMode: 'equals' };
        this.min_purchase = { value: null, matchMode: 'equals' };
        this.max_discount = { value: null, matchMode: 'equals' };
        this.usage_limit = { value: null, matchMode: 'equals' };
    }
}

export default DiscountCouponFilter; 