import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
export default class AccessoriesFilter {
    global: {
        value: null | string;
        matchMode: FilterMatchMode.CONTAINS;
    };
    // name: {
    //     operator: FilterOperator;
    //     constraints: {
    //         value: null | string;
    //         matchMode: FilterMatchMode.CONTAINS;
    //     }[];
    // };
    constructor(){
        this.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
        // this.name = { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] };
    };
}