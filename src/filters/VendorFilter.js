import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
export default class VendorFilter {
    constructor() {
        this.global = {
            value: null,
            matchMode: FilterMatchMode.CONTAINS
        };
        this.vendor_code = {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
        };
        this.name = {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
        };
    }
} 