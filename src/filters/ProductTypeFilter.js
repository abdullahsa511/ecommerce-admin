import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

export default class ProductTypeFilter {
    constructor() {
        this.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
        this.name = { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] };
        this.type = { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] };
        this.source = { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] };
    }
} 