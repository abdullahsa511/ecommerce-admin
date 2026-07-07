// AttributeFilter.js
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

export default class AttributeFilter {
    constructor() {
        this.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
        this.name = {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
        };
    }
}
