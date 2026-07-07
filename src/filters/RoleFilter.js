import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

export default class RoleFilter {
    constructor() {
        this.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
        this.name = { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] };
    }
}