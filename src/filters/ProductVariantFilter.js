// import LengthType from '../models/LengthType';

import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

export default class ProductVariantFilter {
    constructor() {
        this.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
        this.variant_name = {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
        };
    }
} 