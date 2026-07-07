// export default class SubscriptionFilter {
//     constructor() {
//         this.global = { value: null, matchMode: 'contains' };
//         this.subscription_id = { value: null, matchMode: 'equals' };
//         this.user = { value: null, matchMode: 'contains' };
//         this.reason = { value: null, matchMode: 'contains' };
//         this.status = { value: null, matchMode: 'equals' };
//         this.action = { value: null, matchMode: 'equals' };
//     }
// } 



import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

export default class SubscriptionFilter {
    constructor() {
        this.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
        this.user = {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
        };
        this.status = {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
        };
        this.action = {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
        };
    }
} 