import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

/**
 * Constraint structure for filter operators
 */
interface FilterConstraint {
    value: any;
    matchMode: FilterMatchMode;
}

/**
 * Filter with operator and constraints
 */
interface OperatorFilter {
    operator: FilterOperator;
    constraints: FilterConstraint[];
}

/**
 * Simple filter with value and match mode
 */
interface SimpleFilter {
    value: any;
    matchMode: FilterMatchMode;
}

/**
 * ShowRoomFilter class for managing showroom data table filters
 */
export default class ShowRoomFilter {
    /**
     * Global search filter
     */
    global: SimpleFilter;
    
    /**
     * Thumbnail URL filter
     */
    thumbnailUrl: OperatorFilter;
    
    /**
     * Display name filter
     */
    displayName: OperatorFilter;
    
    /**
     * Author name filter
     */
    authorName: SimpleFilter;
    
    /**
     * Formatted date filter
     */
    formattedDate: OperatorFilter;
    
    /**
     * Comment count filter
     */
    comment_count: OperatorFilter;
    
    /**
     * Constructor to initialize all filter properties
     */
    constructor();
}

