import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
export default class ShowRoomFilter {
    global: {
        value: null | string;
        matchMode: FilterMatchMode.CONTAINS;
    };
    title: {
        operator: FilterOperator;
        constraints: {
            value: null | string;
            matchMode: FilterMatchMode.CONTAINS;
        }[];
    };
    slug: {
        operator: FilterOperator;
        constraints: {
            value: null | string;
            matchMode: FilterMatchMode.CONTAINS;
        }[];
    };
    description: {
        operator: FilterOperator;
        constraints: {
            value: null | string;
            matchMode: FilterMatchMode.CONTAINS;
        }[];
    };
    address: {
        operator: FilterOperator;
        constraints: {
            value: null | string;
            matchMode: FilterMatchMode.CONTAINS;
        }[];
    };
    status: {
        operator: FilterOperator;
        constraints: {
            value: null | string;
            matchMode: FilterMatchMode.CONTAINS;
        }[];
    };
    created_at: {
        operator: FilterOperator;
        constraints: {
            value: null | string;
            matchMode: FilterMatchMode.CONTAINS;
        }[];
    };
    constructor(){
        this.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
        this.title = { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] };
        this.slug = { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] };
        this.description = { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] };
        this.address = { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] };
        this.status = { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] };
        this.created_at = { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] };
    };
}