
// export default class WeightTypeFilter {

//     global: {
//         value: null | string;
//         matchMode: FilterMatchMode;
//     };
//     name: {
//         operator: FilterOperator;
//         constraints: {
//             value: null | string;
//             matchMode: FilterMatchMode;
//         }[];
//     };
//     constructor();
// }


declare module '@/filters/WeightTypeFilter' {
    type FilterMatchModeValue = string;
  
    interface Constraint {
      value: unknown;
      matchMode: FilterMatchModeValue;
    }
  
    interface FieldFilter {
      operator: string;
      constraints: Constraint[];
    }
  
    export default class WeightTypeFilter {
      global: {
        value: unknown;
        matchMode: FilterMatchModeValue;
      };
      name: FieldFilter;
      unit: FieldFilter;
      value: FieldFilter;   
    }
  }