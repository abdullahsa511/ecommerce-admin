
export default class OrderFilter {

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
    // {
    //     global: { value: null, matchMode: 'contains' },
    //     order_id: { value: null, matchMode: 'equals' },
    //     user: { value: null, matchMode: 'contains' },
    //     status: { value: null, matchMode: 'equals' },
    //     payment_status: { value: null, matchMode: 'equals' },
    //     shipping_status: { value: null, matchMode: 'equals' },
    //     total: { value: null, matchMode: 'equals' }
    // }
    constructor();
}
