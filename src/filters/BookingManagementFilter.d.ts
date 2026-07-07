import BookingManagementItem from "@/models/BookingManagement";
import { FilterMatchMode, FilterOperator } from "@primevue/core/api";

export default class BookingManagementFilter {

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
    data: {
        operator: FilterOperator;
        constraints: {
            value: null | BookingManagementItem[];
            matchMode: FilterMatchMode.IN;
        }[];
    };
    booking_date: {
        operator: FilterOperator;
        constraints: {
            value: null | Date;
            matchMode: FilterMatchMode.DATE_IS;
        }[];
    };
    constructor();
}
