export default class DiscountCoupon {
    constructor({
        name,
        code,
        discount,
        type,
        free_shipping,
        status,
        date_added,
        date_updated
    }) {
        this.name = name;
        this.code = code;
        this.discount = discount;
        this.type = type;
        this.free_shipping = free_shipping;
        this.status = status;
        this.date_added = date_added;
        this.date_updated = date_updated;
    }

    static fromJSON(json) {
        return new DiscountCoupon({
            name: json.name,
            code: json.code,
            discount: json.discount,
            type: json.type,
            free_shipping: json.free_shipping,
            status: json.status,
            date_added: json.date_added,
            date_updated: json.date_updated
        });
    }
} 