import type { FilterMatchMode, FilterOperator } from '@primevue/core/api';

export default class PostTypeFilter {
   
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
    type: {
        operator: FilterOperator;
        constraints: {
            value: null | string;
            matchMode: FilterMatchMode;
        }[];
    };
    source: {
        operator: FilterOperator;
        constraints: {
            value: null | string;
            matchMode: FilterMatchMode;
        }[];
    };
   
    constructor();
}