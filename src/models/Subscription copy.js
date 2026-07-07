export default class Subscription {
    constructor({
        subscription_id,
        user,
        reason,
        status,
        action,
        date_ordered,
        date_added,
        date_updated
    }) {
        this.subscription_id = subscription_id;
        this.user = user;
        this.reason = reason;
        this.status = status;
        this.action = action;
        this.date_ordered = date_ordered;
        this.date_added = date_added;
        this.date_updated = date_updated;
    }

    static fromJSON(json) {
        return new Subscription({
            subscription_id: json.subscription_id,
            user: json.user,
            reason: json.reason,
            status: json.status,
            action: json.action,
            date_ordered: json.date_ordered,
            date_added: json.date_added,
            date_updated: json.date_updated
        });
    }
} 