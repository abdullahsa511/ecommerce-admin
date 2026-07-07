export default class Order {
    constructor(order_id, user, status, payment_status, shipping_status, total, date_added, date_modified) {
        this.order_id = order_id;
        this.user = user;
        this.status = status;
        this.payment_status = payment_status;
        this.shipping_status = shipping_status;
        this.total = total;
        this.date_added = date_added;
        this.date_modified = date_modified;
    }

    static fromJSON(json) {
        return new Order(
            json.order_id,
            json.user,
            json.status,
            json.payment_status,
            json.shipping_status,
            json.total,
            json.date_added,
            json.date_modified
        );
    }
} 