import _ from "lodash";
import moment from "moment";
import { formatDateForDatabase } from "@/utils/DateTimeUtils";

/**
 * Checks if a value should be excluded from query string
 * Excludes: null, undefined, empty string, and 0
 */
function shouldExcludeValue(value) {
    return value === null || value === undefined || value === "" || value === 0;
}

/**
 * Checks if a field filter should be excluded
 * A field filter is excluded if all constraints have null/empty/0 values
 */
function shouldExcludeFieldFilter(fieldFilter) {
    if (!fieldFilter || typeof fieldFilter !== "object") return true;
    
    // Check if it's a field filter with constraints
    if (Array.isArray(fieldFilter.constraints)) {
        // If all constraints have null/empty/0 values, exclude the entire field filter
        const hasValidValue = fieldFilter.constraints.some(constraint => {
            return constraint && constraint.value !== null && 
                   constraint.value !== undefined && 
                   constraint.value !== "" && 
                   constraint.value !== 0;
        });
        return !hasValidValue;
    }
    
    // Check if it's a global filter with null/empty/0 value
    if (fieldFilter.value !== undefined) {
        return shouldExcludeValue(fieldFilter.value);
    }
    
    return false;
}

export function jsonToQueryParams(params, prefix) {
    const queryParams = [];
    //Removing null values and Formatting Date and Encoding object to Array of query params
    
    // Handle arrays with numeric indices
    if (Array.isArray(params)) {
        for (let i = 0; i < params.length; i++) {
            let value = params[i];
            // Skip null, undefined, empty string, or 0 for primitive values
            if (value === null || value === undefined) continue;
            
            let prop = prefix ? prefix + "[" + i + "]" : String(i);
            
            if (typeof value === "string" || typeof value === "number") {
                if (!shouldExcludeValue(value)) {
                    queryParams.push(prop + "=" + encodeURIComponent(value));
                }
            } else if (typeof value === "boolean") {
                queryParams.push(prop + "=" + encodeURIComponent(Number(value)));
            } else if (moment.isDate(value)) {
                const dateString = formatDateForDatabase(value);
                queryParams.push(prop + "=" + encodeURIComponent(dateString));
            } else if (Array.isArray(value)) {
                let queryComponent = jsonToQueryParams(value, prop);
                if (queryComponent) {
                    queryParams.push(queryComponent);
                }
            } else if (typeof value === "object" && value !== null) {
                let queryComponent = jsonToQueryParams(value, prop);
                if (queryComponent) {
                    queryParams.push(queryComponent);
                }
            }
        }
    } else {
        // Handle objects
        for (let param in params) {
            let value = params[param];
            // Skip null, undefined, empty string, or 0 for primitive values
            if (value === null || value === undefined) continue;
            
            // Special handling for filter objects - exclude entire field filter if all constraint values are null/empty/0
            // Check if this looks like a filter field (has constraints array or is a global filter with value property)
            if (typeof value === "object" && value !== null) {
                if (shouldExcludeFieldFilter(value)) {
                    continue; // Skip this entire field filter
                }
            }
            
            let prop = prefix
                ? prefix + "[" + encodeURIComponent(param) + "]"
                : encodeURIComponent(param);
            
            if (typeof value === "string" || typeof value === "number") {
                if (!shouldExcludeValue(value)) {
                    queryParams.push(prop + "=" + encodeURIComponent(value));
                }
            } else if (typeof value === "boolean") {
                queryParams.push(prop + "=" + encodeURIComponent(Number(value)));
            } else if (moment.isDate(value)) {
                const dateString = formatDateForDatabase(value);
                queryParams.push(prop + "=" + encodeURIComponent(dateString));
            } else if (Array.isArray(value)) {
                let queryComponent = jsonToQueryParams(value, prop);
                if (queryComponent) {
                    queryParams.push(queryComponent);
                }
            } else if (typeof value === "object" && value !== null) {
                // Special handling for filter fields with constraints
                // Format: filters[field_name][operator]=and&filters[field_name][matchMode]=contains&filters[field_name][0]=value
                if (Array.isArray(value.constraints)) {
                    // Include operator if it exists
                    if (value.operator && !shouldExcludeValue(value.operator)) {
                        queryParams.push(prop + "[operator]=" + encodeURIComponent(value.operator));
                    }
                    
                    // Include matchMode from the first constraint (if it exists)
                    if (value.constraints.length > 0 && value.constraints[0] && value.constraints[0].matchMode) {
                        queryParams.push(prop + "[matchMode]=" + encodeURIComponent(value.constraints[0].matchMode));
                    }
                    
                    // Process constraints - only include those with valid values
                    // Format: filters[field_name][index]=value (not filters[field_name][constraints][index][value]=value)
                    for (let i = 0; i < value.constraints.length; i++) {
                        const constraint = value.constraints[i];
                        if (constraint && constraint.value !== null && 
                            constraint.value !== undefined && 
                            constraint.value !== "" && 
                            constraint.value !== 0) {
                            const constraintProp = prop + "[" + i + "]";
                            queryParams.push(constraintProp + "=" + encodeURIComponent(constraint.value));
                        }
                    }
                } else {
                    // Regular object processing for non-filter objects
                    let queryComponent = jsonToQueryParams(value, prop);
                    if (queryComponent) {
                        queryParams.push(queryComponent);
                    }
                }
            }
        }
    }
    return queryParams.length ? queryParams : null;
}

export function createQueryString(params) {
    const queryParams = jsonToQueryParams(params);
    const flat = _.flattenDeep(queryParams);
    const queryString = flat.join("&");
    return queryString;
}
//query string to object
export function parseQueryString(query) {
    const params = new URLSearchParams(query);
    let queryObject = {};
    for (const [key, value] of params) {
        queryObject = parseQueryParameter(queryObject, key, value);
    }
    return queryObject;
}

/**
 *
 * @param {Object} object
 * @param {String} key
 * @param {*} value
 */
function parseQueryParameter(object, key, value) {
    if (key.includes('[')) {
        const baseField = key.slice(0, key.indexOf('['));
        const nestedKey = key.slice(key.indexOf('[') + 1, key.lastIndexOf(']'));
        if (isNaN(nestedKey)) {
            object[baseField] = object[baseField] ?? {};
            object[baseField][nestedKey] = value;
        } else {
            object[baseField] = object[baseField] ?? [];
            object[baseField].push(value);
        }
    } else {
        object[key] = value;
    }
    return object;
}

