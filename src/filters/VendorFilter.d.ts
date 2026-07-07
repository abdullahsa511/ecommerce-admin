declare module '@/filters/VendorFilter.js' {
  type FilterMatchModeValue = string;

  interface Constraint {
    value: unknown;
    matchMode: FilterMatchModeValue;
  }

  interface FieldFilter {
    operator: string;
    constraints: Constraint[];
  }

  export default class VendorFilter {
    global: {
      value: unknown;
      matchMode: FilterMatchModeValue;
    };
    vendor_code: FieldFilter;
    name: FieldFilter;
  }
}

