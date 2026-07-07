import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
export default class ComponentFilter {
    constructor() {
        this.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
        this.name = { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] };
        this.title = { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] };
        this.subtitle = { value: null, matchMode: FilterMatchMode.IN };
        this.description = { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] };
        this.template = { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] };
        this.active = { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] };
    }
}