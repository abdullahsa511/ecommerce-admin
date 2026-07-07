import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import PostTag from '../models/PostTag';

export default class PostTagFilter {
    global;
    name;
    slug;
    description;
    dateFrom;
    dateTo;

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

    matches(tag) {
        if (!tag) return false;

        if (this.name.value && !tag.name.toLowerCase().includes(this.name.value.toLowerCase())) {
            return false;
        }

        if (this.slug.value && !tag.slug.toLowerCase().includes(this.slug.value.toLowerCase())) {
            return false;
        }

        if (this.description.value && !tag.description.toLowerCase().includes(this.description.value.toLowerCase())) {
            return false;
        }

        if (this.dateFrom.value && new Date(tag.date_added) < new Date(this.dateFrom.value)) {
            return false;
        }

        if (this.dateTo.value && new Date(tag.date_added) > new Date(this.dateTo.value)) {
            return false;
        }

        return true;
    }
} 