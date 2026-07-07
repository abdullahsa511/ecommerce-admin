import { createQueryString } from "@/utils/SearchUtils";
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

// Filter constraint interface
export interface IFilterConstraint {
  value: string | number | null;
  matchMode: "contains" | "equals" | "startsWith" | "endsWith" | "notEquals" | "lt" | "lte" | "gt" | "gte" | "between" | "in";
}

// Global filter interface
export interface IGlobalFilter {
  value: string | number | null;
  matchMode: "contains" | "equals" | "startsWith" | "endsWith" | "notEquals" | "lt" | "lte" | "gt" | "gte" | "between" | "in";
}

// Field filter with constraints interface
export interface IFieldFilter {
  operator: "and" | "or";
  constraints: IFilterConstraint[];
}

// Filters object interface
export interface IFilters {
  global?: IGlobalFilter;
  product_code?: IFieldFilter;
  item_code?: IFieldFilter;
  product_variant?: IFieldFilter;
  km_item_id?: IFieldFilter;
  [key: string]: IGlobalFilter | IFieldFilter | undefined;
}

// Pagination event interface
export interface IPaginationEvent {
  page: number;
  first: number;
  rows: number;
  pageCount: number;
}

// Request interface
export interface IRequest {
  filters: IFilters;
  originalEvent: IPaginationEvent;
  page: number;
  first: number;
  rows: number;
  pageCount: number;
  totalRecords: number;
}

// Request class
export default class Request implements IRequest {
  filters: IFilters;
  originalEvent: IPaginationEvent;
  page: number;
  first: number;
  rows: number;
  pageCount: number;
  totalRecords: number;

  constructor(data: Partial<IRequest> = {}) {
    this.filters = data.filters ?? {};

    this.originalEvent = data.originalEvent ?? {
      page: 0,
      first: 0,
      rows: 500,
      pageCount: 0
    };
    this.page = (data.page ?? 1);
    this.first = data.first ?? 0;
    this.rows = data.rows ?? 500;
    this.pageCount = data.pageCount ?? 0;
    this.totalRecords = data.totalRecords ?? 0;

  }

  /**
   * Converts the Request object to a query string for backend filtering with pagination
   * @returns {string} Query string representation of the request
   */
  toQueryString(): string {
    const params: any = {
      filters: this.filters,
      page: this.page,
      first: 0,
      rows: this.rows,
      pageCount: this.pageCount
    };

    return createQueryString(params);
  }

  /**
   * Converts the Request object to a plain object for API requests
   * @returns {object} Plain object representation of the request
   */
  toObject(): object {
    return {
      filters: this.filters,
      page: this.page,
      first: this.first,
      rows: this.rows,
      pageCount: this.pageCount
    };
  }

  /**
   * Creates and populates a filter object from provided filter data
   * @param {any} filterObject - The filter object instance (e.g., ItemFilter)
   * @param {any} filterData - The filter data object with field, operator, matchMode, and values
   * @returns {any} The populated filter object
   */
  static createFilterObject(filterObject: any, filterData: any): any {
    // Helper function to convert string matchMode to FilterMatchMode
    const getMatchMode = (matchMode: string): any => {
      const matchModeMap: { [key: string]: any } = {
        'contains': FilterMatchMode.CONTAINS,
        'equals': FilterMatchMode.EQUALS,
        'startsWith': FilterMatchMode.STARTS_WITH,
        'endsWith': FilterMatchMode.ENDS_WITH,
        'notEquals': FilterMatchMode.NOT_EQUALS,
        'lt': FilterMatchMode.LESS_THAN,
        'lte': FilterMatchMode.LESS_THAN_OR_EQUAL_TO,
        'gt': FilterMatchMode.GREATER_THAN,
        'gte': FilterMatchMode.GREATER_THAN_OR_EQUAL_TO,
        'between': FilterMatchMode.BETWEEN,
        'in': FilterMatchMode.IN
      };
      return matchModeMap[matchMode.toLowerCase()] || FilterMatchMode.CONTAINS;
    };

    // Helper function to convert string operator to FilterOperator
    const getOperator = (operator: string): any => {
      return operator.toLowerCase() === 'or' ? FilterOperator.OR : FilterOperator.AND;
    };

    // Iterate over each field in the filterData
    for (const fieldName in filterData) {
      if (filterData.hasOwnProperty(fieldName) && filterObject[fieldName]) {
        const fieldData = filterData[fieldName];
        const filterField = filterObject[fieldName];

        // Update operator if the field has an operator property
        if (fieldData.operator && filterField.operator !== undefined) {
          filterField.operator = getOperator(fieldData.operator);
        }

        // Handle fields with constraints array (e.g., product_code, item_code)
        if (filterField.constraints !== undefined) {
          if (Array.isArray(fieldData.values)) {
            // Create multiple constraints - one for each value in the array
            filterField.constraints = fieldData.values.map((value: any) => ({
              value: value,
              matchMode: getMatchMode(fieldData.matchMode || 'contains')
            }));
          } else if (fieldData.value !== undefined || fieldData.values !== undefined) {
            // Single value case - create a single constraint
            const singleValue = fieldData.value !== undefined ? fieldData.value : fieldData.values;
            filterField.constraints = [{
              value: singleValue,
              matchMode: getMatchMode(fieldData.matchMode || 'contains')
            }];
          } else if (fieldData.matchMode) {
            // Only matchMode provided - update existing constraints' matchMode
            if (filterField.constraints && filterField.constraints.length > 0) {
              filterField.constraints = filterField.constraints.map((constraint: any) => ({
                ...constraint,
                matchMode: getMatchMode(fieldData.matchMode)
              }));
            }
          }
        } else if (fieldData.matchMode && filterField.matchMode !== undefined) {
          // For global filter or fields without constraints array
          filterField.matchMode = getMatchMode(fieldData.matchMode);
          if (Array.isArray(fieldData.values) && fieldData.values.length > 0) {
            filterField.value = fieldData.values[0];
          } else if (fieldData.value !== undefined) {
            filterField.value = fieldData.value;
          }
        }
      }
    }

    return filterObject;
  }
}

