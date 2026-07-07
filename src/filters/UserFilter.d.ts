import { FilterMatchMode } from '@primevue/core/api';

export interface User {
    username: string;
    display_name: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    status: string;
    created_at: string | Date;
}

export interface FilterConfig<T = string | null> {
    value: T;
    matchMode: FilterMatchMode;
}

export default class UserFilter {
    global: FilterConfig<string | null>;
    username: FilterConfig<string | null>;
    display_name: FilterConfig<string | null>;
    first_name: FilterConfig<string | null>;
    last_name: FilterConfig<string | null>;
    email: FilterConfig<string | null>;
    role: FilterConfig<string | null>;
    status: FilterConfig<string | null>;
    dateFrom: FilterConfig<string | Date | null>;
    dateTo: FilterConfig<string | Date | null>;

    constructor();
    matches(user: User | null | undefined): boolean;
}

