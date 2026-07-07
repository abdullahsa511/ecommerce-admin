/**
 * @fileoverview Field model class for managing field configurations
 */

/**
 * Interface for field data
 */
export interface FieldData {
    id?: number | null;
    name?: string;
    label?: string;
    alias?: string;
    type?: string;
    is_editable?: boolean;
    is_required?: boolean;
    length?: number | null;
    nullable?: boolean;
    primary?: boolean;
    default?: any;
    comment?: string;
    is_auto_increment?: boolean;
    defaultValue?: any;
    required?: boolean;
    [key: string]: any; // For dynamic properties
}

/**
 * Interface for custom field in the component item editor
 */
export interface CustomField {
    id: number;
    name: string;
    type: string;
    defaultValue: string;
    required: boolean;
    [key: string]: any;
}

/**
 * Interface for custom field type options
 */
export interface CustomFieldType {
    label: string;
    value: string;
}

/**
 * Interface for field option in dropdowns
 */
export interface FieldOption {
    label: string;
    value: Field;
}

/**
 * Field Model
 * Represents a field configuration in the system
 */
export default class Field {
    static defaultFields: string[] = [
        'id',
        'name',
        'label',
        'alias',
        'type',
        'is_editable',
        'is_required'
    ];

    id: number | null;
    name: string;
    label: string;
    type: string;
    is_required: boolean;
    alias: string;
    length: number | null;
    nullable: boolean;
    primary: boolean;
    default: any;
    comment: string;
    is_auto_increment: boolean;
    is_editable: boolean;
    defaultValue: any;
    required: boolean;
    [key: string]: any; // For dynamic properties

    /**
     * Creates a new Field instance
     * @param {FieldData} data - Field data
     */
    constructor(data: FieldData = {}) {
        this.id = data.id ?? null;
        this.name = data.name ?? '';
        this.label = data.label ?? 'Label';
        this.type = data.type ?? 'text';
        this.is_required = data.is_required ?? false;

        // Add any custom properties
        for (const field of Object.keys(data)) {
            if (!Field.defaultFields.includes(field)) {
                this[field] = data[field];
            }
        }

        this.length = data.length ?? null;
        this.nullable = data.nullable ?? false;
        this.primary = data.primary ?? false;
        this.default = data.default ?? null;
        this.comment = data.comment ?? '';
        this.is_auto_increment = data.is_auto_increment ?? false;
        
        // For UI display
        this.alias = data.alias ?? this.formatAlias(this.name);
        this.is_editable = data.is_editable !== undefined ? data.is_editable : true;
        this.defaultValue = data.defaultValue !== undefined ? data.defaultValue : '';
        this.required = data.required !== undefined ? data.required : false;
    }

    /**
     * Formats a field name to a human-readable alias
     * @param {string} name - The field name to format
     * @returns {string} The formatted alias
     */
    formatAlias(name: string): string {
        if (!name) return '';
        // Convert snake_case to Title Case
        return name.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * Convert Field to a plain object
     * @returns {FieldData} Plain object representation of Field
     */
    toJSON(): FieldData {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            length: this.length,
            nullable: this.nullable,
            primary: this.primary,
            default: this.default,
            comment: this.comment,
            is_auto_increment: this.is_auto_increment,
            alias: this.alias,
            is_editable: this.is_editable,
            defaultValue: this.defaultValue,
            required: this.required
        };
    }
}

/**
 * Class implementing the CustomField interface
 */
export class CustomFieldObject implements CustomField {
    id: number;
    name: string;
    type: string;
    defaultValue: string;
    required: boolean;
    [key: string]: any;

    constructor(data: CustomField | null) {
        this.id = data?.id ?? 0;
        this.name = data?.name ?? '';
        this.type = data?.type ?? 'text';
        this.defaultValue = data?.defaultValue ?? '';
        this.required = data?.required ?? false;
        
        // Copy any other properties
        if (data) {
            for (const [key, value] of Object.entries(data)) {
                if (!['id', 'name', 'type', 'defaultValue', 'required'].includes(key)) {
                    this[key] = value;
                }
            }
        }
    }
} 