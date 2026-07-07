import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

export default class UserFilter {
    constructor() {
        // Global search filter
        this.global = { value: null, matchMode: FilterMatchMode.CONTAINS };

        // Individual field filters
        this.username = { value: null, matchMode: FilterMatchMode.CONTAINS };
        this.display_name = { value: null, matchMode: FilterMatchMode.CONTAINS };
        this.first_name = { value: null, matchMode: FilterMatchMode.CONTAINS };
        this.last_name = { value: null, matchMode: FilterMatchMode.CONTAINS };
        this.email = { value: null, matchMode: FilterMatchMode.CONTAINS };
        this.role = { value: null, matchMode: FilterMatchMode.EQUALS };
        this.status = { value: null, matchMode: FilterMatchMode.EQUALS };
        this.dateFrom = { value: null, matchMode: FilterMatchMode.DATE_IS };
        this.dateTo = { value: null, matchMode: FilterMatchMode.DATE_IS };
    }

    matches(user) {
        if (!user) return false;

        if (this.username.value && !user.username.toLowerCase().includes(this.username.value.toLowerCase())) {
            return false;
        }

        if (this.display_name.value && !user.display_name.toLowerCase().includes(this.display_name.value.toLowerCase())) {
            return false;
        }

        if (this.first_name.value && !user.first_name.toLowerCase().includes(this.first_name.value.toLowerCase())) {
            return false;
        }

        if (this.last_name.value && !user.last_name.toLowerCase().includes(this.last_name.value.toLowerCase())) {
            return false;
        }

        if (this.email.value && !user.email.toLowerCase().includes(this.email.value.toLowerCase())) {
            return false;
        }

        if (this.role.value && user.role !== this.role.value) {
            return false;
        }

        if (this.status.value && user.status !== this.status.value) {
            return false;
        }

        if (this.dateFrom.value && new Date(user.created_at) < new Date(this.dateFrom.value)) {
            return false;
        }

        if (this.dateTo.value && new Date(user.created_at) > new Date(this.dateTo.value)) {
            return false;
        }

        return true;
    }
}