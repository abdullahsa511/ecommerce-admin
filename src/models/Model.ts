/**
 * @fileoverview Model model class for managing model metadata
 */

/**
 * Interface for model data
 */
export interface ModelData {
    model_id?: number | null;
    name?: string | null;
    type?: string | null;
    class?: string | null;
    created_at?: string | null;
    table_name?: string | null;
    [key: string]: any; // For dynamic properties
}

/**
 * Interface for model option in dropdowns
 */
export interface ModelOption {
    name: string;
    type: string;
    class: string;
    [key: string]: any;
}

/**
 * Model class
 * Represents a model metadata in the system
 */
export default class Model {
    model_id: number | null;
    name: string | null;
    type: string | null;
    class: string | null;
    created_at: string | null;
    table_name: string | null;
    [key: string]: any; // For dynamic properties

    /**
     * Creates a new Model instance
     * @param {ModelData} data - Model data
     */
    constructor(data: ModelData = {}) {
        this.model_id = data.model_id || null;
        this.name = data.name || null;
        this.type = data.type || null;
        this.class = data.class || null;
        this.created_at = data.created_at || null;
        this.table_name = data.type || null; // For backward compatibility
        
        // Add any other properties that might be in the data
        for (const [key, value] of Object.entries(data)) {
            if (!['model_id', 'name', 'type', 'class', 'created_at', 'table_name'].includes(key)) {
                this[key] = value;
            }
        }
    }

    /**
     * Create a Model instance from a plain object
     * @param {ModelData} json - Plain object containing model data
     * @returns {Model} New Model instance
     */
    static fromJSON(json: ModelData): Model {
        return new Model(json);
    }

    /**
     * Convert Model to a plain object
     * @returns {ModelData} Plain object representation of Model
     */
    toJSON(): ModelData {
        return {
            model_id: this.model_id,
            name: this.name,
            type: this.type,
            class: this.class,
            created_at: this.created_at,
            table_name: this.table_name
        };
    }
} 