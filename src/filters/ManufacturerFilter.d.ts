export default class ManufacturerFilter {
    global: {
        value: null | string;
        matchMode: FilterMatchMode.CONTAINS;
    };
    manufacturer_code: {
        value: null | string;
        matchMode: FilterMatchMode.CONTAINS;
    };
    name: {
        value: null | string;
        matchMode: FilterMatchMode.CONTAINS;
    };
    constructor() {
        this.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
        this.manufacturer_code = { value: null, matchMode: FilterMatchMode.CONTAINS };
        this.name = { value: null, matchMode: FilterMatchMode.CONTAINS };
    }
} 