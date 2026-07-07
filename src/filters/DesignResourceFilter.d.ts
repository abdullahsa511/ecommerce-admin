import { FilterMatchMode, FilterOperator } from '@primevue/core/api'

export default class DesignResourceFilter {
    global: {
        value: null | string;
        matchMode: FilterMatchMode.CONTAINS;
    };
    title: {
        operator: FilterOperator;
        constraints: [{
            value: null | string;
            matchMode: FilterMatchMode.CONTAINS;
        }];
    };
    type: {
        operator: FilterOperator;
        constraints: [{
            value: null | string;
            matchMode: FilterMatchMode.CONTAINS;
        }];
    };
    brand: {
        operator: FilterOperator;
        constraints: [{
            value: null | string;
            matchMode: FilterMatchMode.CONTAINS;
        }];
    };
    constructor(){
        this.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
        this.title = { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] };
        this.type = { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] };
        this.brand = { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] };
    };
}
