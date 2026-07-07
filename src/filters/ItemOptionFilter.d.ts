export default class ItemOptionFilter {

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
    item_code: {
        operator: FilterOperator;
        constraints: {
            value: null | string;
            matchMode: FilterMatchMode;
        }[];
    };
    product_code: { 
        operator: FilterOperator;
        constraints: {
            value: null | string;
            matchMode: FilterMatchMode;
        }[];
    };
    variant_name: {
        operator: FilterOperator;
        constraints: {
            value: null | string;
            matchMode: FilterMatchMode;
        }[];
    };
    option_group_name: {
        operator: FilterOperator;
        constraints: {
            value: null | string;
            matchMode: FilterMatchMode;
        }[];
    };
    option_name: {
        operator: FilterOperator;
        constraints: {
            value: null | string;
            matchMode: FilterMatchMode;
        }[];
    };
    type: {
        operator: FilterOperator;
        constraints: {
            value: null | string;
            matchMode: FilterMatchMode;
        }[];
    };
    constructor();
}
