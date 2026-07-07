export default class ReturnFilter {
    constructor() {
        this.global = { value: null, matchMode: 'contains' };
        this.return_id = { value: null, matchMode: 'equals' };
        this.user = { value: null, matchMode: 'contains' };
        this.reason = { value: null, matchMode: 'contains' };
        this.status = { value: null, matchMode: 'equals' };
        this.action = { value: null, matchMode: 'equals' };
    }
} 