export default class SubscriptionStatus {
    constructor(data) {
        this.subscription_status_id = data?.subscription_status_id ?? null;
        this.name = data?.name ?? '';
        this.language_id = data?.language_id ?? 1;
    }

    static fromJSON(json) {
        return new SubscriptionStatus(json);
    }
} 