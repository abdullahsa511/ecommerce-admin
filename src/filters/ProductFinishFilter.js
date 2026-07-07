import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

export default class ProductFinishFilter {
    constructor() {
        // Global search filter
        this.global = { value: null, matchMode: FilterMatchMode.CONTAINS };

        // Individual field filters
        this.name = { value: null, matchMode: FilterMatchMode.CONTAINS };
        this.slug = { value: null, matchMode: FilterMatchMode.CONTAINS };
        this.description = { value: null, matchMode: FilterMatchMode.CONTAINS };
        this.dateFrom = { value: null, matchMode: FilterMatchMode.DATE_IS };
        this.dateTo = { value: null, matchMode: FilterMatchMode.DATE_IS };
    }

    matches(finish) {
        if (!finish) return false;

        if (this.name.value && !finish.name.toLowerCase().includes(this.name.value.toLowerCase())) {
            return false;
        }

        if (this.slug.value && !finish.slug.toLowerCase().includes(this.slug.value.toLowerCase())) {
            return false;
        }

        if (this.description.value && !finish.description.toLowerCase().includes(this.description.value.toLowerCase())) {
            return false;
        }

        if (this.dateFrom.value && new Date(finish.date_added) < new Date(this.dateFrom.value)) {
            return false;
        }

        if (this.dateTo.value && new Date(finish.date_added) > new Date(this.dateTo.value)) {
            return false;
        }

        return true;
    }
}
