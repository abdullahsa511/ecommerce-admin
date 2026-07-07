
export default class QuoteFilter {

    global: {
        value: null | string;
        matchMode: FilterMatchMode;
    };
    name: {
        operator: FilterOperator;
        constraints: {
            value: null | string;
            matchMode: FilterMatchMode;
        }[];
    };
    constructor();
}
