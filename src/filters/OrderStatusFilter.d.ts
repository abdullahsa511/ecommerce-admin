declare module '@/filters/OrderStatusFilter' {
    type FilterMatchModeValue = string;
  
    interface Constraint {
      value: unknown;
      matchMode: FilterMatchModeValue;
    }
  
    interface FieldFilter {
      operator: string;
      constraints: Constraint[];
    }
  
    export default class OrderStatusFilter {
      global: {
        value: unknown;
        matchMode: FilterMatchModeValue;
      };
      name: FieldFilter;
    }
  }