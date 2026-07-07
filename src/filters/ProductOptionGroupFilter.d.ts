
export default class ProductOptionGroupFilter {

    global: {
        value: null | string;
        matchMode: FilterMatchMode;
    };
    option_group_name: {
        operator: FilterOperator;
        constraints: {
            value: null | string;
            matchMode: FilterMatchMode;
        }[];
    };
    constructor();
}
