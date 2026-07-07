
export default class ProductVariantFilter {

    global: {
        value: null | string;
        matchMode: FilterMatchMode;
    };
    variant_name: {
        operator: FilterOperator;
        constraints: {
            value: null | string;
            matchMode: FilterMatchMode;
        }[];
    };
    constructor();
}
