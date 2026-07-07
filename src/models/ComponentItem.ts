/**
 * @fileoverview ComponentItem model class for managing component item configurations
 */

// @ts-ignore - Import Field from JS file until it's fully converted
import Field, { FieldData } from './Field.ts';

/**
 * Interface for component item data
 */
export interface ComponentItemData {
    id?: number | null;
    component_id?: number | null;
    model_id?: number | null;
    fields?: any[];
    item_count?: number;
    items?: any[];
    property_name?: string;
    model?: string;
    is_recent?: number;
    is_featured?: number;
}

/**
 * Interface for a field reference in a component item
 */
export interface FieldReference {
    field_id: number;
    name: string;
    alias?: string;
}

/**
 * Class representing a field reference in a component item
 */
export class FieldReferenceObject implements FieldReference {
    field_id: number;
    name: string;
    alias?: string;

    constructor(data: FieldReference | null) {
        this.field_id = data?.field_id ?? 0;
        this.name = data?.name ?? '';
        this.alias = data?.alias ?? '';
    }
}

/**
 * ComponentItem Model
 * Represents a component item configuration in the system
 */
export default class ComponentItem {
    id: number | null;
    component_id: number | null;
    model_id: number | null;
    fields: Field[];
    item_count: number;
    items: any[];
    [key: string]: any; // For dynamic properties

    /**
     * Creates a new ComponentItem instance
     * @param {ComponentItemData} data - ComponentItem data
     */
    constructor(data: ComponentItemData = {}) {
        this.id = data.id ?? null;
        this.component_id = data.component_id ?? null;
        this.model_id = data.model_id ?? null;
        this.fields = (data.fields ?? []).map(field => new Field(field));
        this.item_count = data.item_count ?? 0;
        this.items = data.items ?? [];
        
        // Add any other properties that might be in the data
        for (const [key, value] of Object.entries(data)) {
            if (!['id', 'component_id', 'model_id', 'fields', 'item_count', 'items'].includes(key)) {
                this[key] = value;
            }
        }
    }

    /**
     * Create a ComponentItem instance from a plain object
     * @param {ComponentItemData} json - Plain object containing component item data
     * @returns {ComponentItem} New ComponentItem instance
     */
    static fromJSON(json: ComponentItemData): ComponentItem {
        return new ComponentItem(json);
    }

    /**
     * Convert ComponentItem to a plain object
     * @returns {ComponentItemData} Plain object representation of ComponentItem
     */
    toJSON(): ComponentItemData {
        return {
            id: this.id,
            component_id: this.component_id,
            model_id: this.model_id,
            fields: this.fields.map(field => field.toJSON()),
            item_count: this.item_count,
            items: this.items
        };
    }
}

/**
 * Interface for component item API request data
 */
export interface ComponentItemRequestData {
    items: ComponentItemRequestItem[];
}

/**
 * Interface for a single item in the component item API request
 */
export interface ComponentItemRequestItem {
    property_name: string;
    component_id: number | string;
    model?: string;
    item_count: number;
    is_recent: number;
    is_featured: number;
    fields: string[] | Record<string, any>;
}

/**
 * Class for component item request data
 */
export class ComponentItemRequest implements ComponentItemRequestData {
    items: ComponentItemRequestItem[];

    constructor(data: ComponentItemRequestData = { items: [] }) {
        this.items = data.items;
    }
} 