// import LengthType from '../models/LengthType';

import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

export default class ProductOptionGroupFilter {
    constructor() {
        this.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
        this.option_group_name = {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
        };
    }
} 