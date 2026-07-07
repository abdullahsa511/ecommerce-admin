import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

export default class TaxonomyFilter {
    constructor() {
        this.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
        this.name = { 
            operator: FilterOperator.OR, 
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] 
        };
        this.post_type = { 
            operator: FilterOperator.OR, 
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] 
        };
        this.type = { 
            operator: FilterOperator.OR, 
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] 
        };
        this.site_id = { 
            operator: FilterOperator.OR, 
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] 
        };
        this.taxonomyNames = { value: null, matchMode: FilterMatchMode.IN };
    }
}
