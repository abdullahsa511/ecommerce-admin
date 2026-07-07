
export default class CouponFilter {

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
