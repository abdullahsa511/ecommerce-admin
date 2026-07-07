// export class OrderStatusFilter {
//     constructor() {
//         this.name = '';
//     }

//     apply(orderStatuses) {
//         return orderStatuses.filter(orderStatus => {
//             let matches = true;

//             if (this.name) {
//                 matches = matches && orderStatus.name.toLowerCase().includes(this.name.toLowerCase());
//             }

//             return matches;
//         });
//     }
// } 


import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

export default class OrderStatusFilter {
    constructor(data = null) {
        this.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
        this.name = { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] };
    }

    static fromJSON(json = null) {
        return new OrderStatusFilter(json);
    }
} 