export default class ShippingStatus {
    constructor(data) {
        this.shipping_status_id = data?.shipping_status_id ?? null;
        this.name = data?.name ?? '';
        this.language_id = data?.language_id ?? 1;
    }

    static fromJSON(json) {
        return new ShippingStatus(json);
    }
} 