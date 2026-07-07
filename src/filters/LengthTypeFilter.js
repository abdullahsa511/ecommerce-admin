// import LengthType from '../models/LengthType';

import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

export default class LengthTypeFilter {
    constructor() {
        this.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
        this.name = {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
        };
        this.unit = {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
        };
        this.value = {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
        };
    }
} 