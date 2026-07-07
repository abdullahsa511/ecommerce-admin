/**
 * Utility function to safely extract array data from API responses
 * @param {any} response - The API response
 * @param {string} dataKey - Optional key to look for in the response object
 * @returns {Array} - The extracted array data
 */
export function extractArrayFromResponse(response, dataKey = null) {
    // If response is already an array, return it
    if (Array.isArray(response)) {
        return response;
    }
    
    // If response is an object, try to extract array data
    if (response && typeof response === 'object') {
        // If a specific dataKey is provided, try that first
        if (dataKey && response[dataKey] && Array.isArray(response[dataKey])) {
            return response[dataKey];
        }
        
        // Try common data properties
        const commonKeys = ['data', 'items', 'list', 'results', 'models', 'fields', 'componentItems'];
        for (const key of commonKeys) {
            if (response[key] && Array.isArray(response[key])) {
                return response[key];
            }
        }
        
        // If no array found in common keys, return empty array
        console.warn('No array data found in response:', response);
        return [];
    }
    
    // If response is not an object or array, return empty array
    console.warn('Response is not an object or array:', response);
    return [];
}

/**
 * Utility function to safely map over API response data
 * @param {any} response - The API response
 * @param {Function} mapper - Function to map over each item
 * @param {string} dataKey - Optional key to look for in the response object
 * @returns {Array} - The mapped array data
 */
export function safeMapResponse(response, mapper, dataKey = null) {
    const arrayData = extractArrayFromResponse(response, dataKey);
    return arrayData.map(mapper);
} 