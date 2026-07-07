export default class OrderFilter {
    constructor() {
        this.global = { value: null, matchMode: 'contains' };
        this.order_id = { value: null, matchMode: 'equals' };
        this.user = { value: null, matchMode: 'contains' };
        this.status = { value: null, matchMode: 'equals' };
        this.payment_status = { value: null, matchMode: 'equals' };
        this.shipping_status = { value: null, matchMode: 'equals' };
        this.total = { value: null, matchMode: 'equals' };
    }
} 