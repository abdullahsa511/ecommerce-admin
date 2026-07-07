export default class OrderStatus {
    constructor(data) {
        this.order_status_id = data?.order_status_id ?? null;
        this.name = data?.name ?? '';
        this.language_id = data?.language_id ?? 1;
    }

    static fromJSON(json) {
        return new OrderStatus(json);
    }
} 