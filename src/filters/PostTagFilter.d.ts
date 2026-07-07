// AttributeFilter.js
// import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

export default class PostTagFilter {
    // constructor() {
    //     this.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
    //     this.name = {
    //         operator: FilterOperator.AND,
    //         constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
    //     };
    // }
    global: {
        value: null | string;
        matchMode: FilterMatchMode;
    };
    name: {
        operator: FilterOperator;
        constraints: {
            value: null | string;
            matchMode: FilterMatchMode;
        }[];
    };
    constructor();
}
