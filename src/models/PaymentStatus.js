export default class PaymentStatus {
    constructor(data) {
        this.payment_status_id = data?.payment_status_id ?? null;
        this.name = data?.name ?? '';
        this.language_id = data?.language_id ?? 1;
    }

    static fromJSON(json) {
        return new PaymentStatus(json);
    }
} 