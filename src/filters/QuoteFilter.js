// import LengthType from '../models/LengthType';

import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

export default class QuoteFilter {
    constructor() {
        this.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
        this.name = {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
        };
    }


    // constructor() {
    //     this.name = null;
    //     this.unit = null;
    //     this.value = null;
    // }

    // matches(lengthType) {
    //     if (!lengthType) return false;

    //     if (this.name && !lengthType.name.toLowerCase().includes(this.name.toLowerCase())) {
    //         return false;
    //     }

    //     if (this.unit && !lengthType.unit.toLowerCase().includes(this.unit.toLowerCase())) {
    //         return false;
    //     }

    //     if (this.value && !lengthType.value.toString().includes(this.value.toString())) {
    //         return false;
    //     }

    //     return true;
    // }
} 