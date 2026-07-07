/**
 * @fileoverview Component model class for managing component configurations
 */

import { DynamicModel, DynamicModelObject } from './Input';
import { FileModel, IFileModel } from './Media';

/**
 * Interface for button items in a component
 */
export interface ButtonItem {
    id: number;
    title: string;
    url: string;
    target: string;
    icon: string;
    type?: string;
}

/**
 * Interface for link items in a component
 */
export interface LinkItem {
    id: number;
    title: string;
    url: string;
    target: string;
    icon: string;
}

export class LinkItemObject implements LinkItem {
    id: number;
    title: string;
    url: string;
    target: string;
    icon: string;

    constructor(data: LinkItem | null) {
        this.id = data?.id ?? 0;
        this.title = data?.title ?? '';
        this.url = data?.url ?? '';
        this.target = data?.target ?? '';
        this.icon = data?.icon ?? '';
    }
}

export class ImageItemObject implements IFileModel {
    id: number;
    media_id: number;
    image: string;
    name: string;
    description: string;
    size: string;
    type: string;
    objectURL: string;
    file: File | undefined;
    status: any;
    created_at: string;
    
    constructor(data: any | null) {
        this.id = data?.id ?? 0;
        this.media_id = data?.media_id ?? 0;
        this.image = data?.image ?? '';
        this.name = data?.name ?? '';
        this.description = data?.description ?? '';
        this.file = data?.file ?? undefined;
        this.size = data?.file?.size ?? data?.size ?? '';
        this.type = data?.file?.type ?? data?.type ?? '';
        this.objectURL = data?.objectURL ?? data?.file?.image ?? '';
        this.status = data?.status ?? '';
        this.created_at = data?.created_at ?? data?.file?.created_at ?? '';
    }
}

export class ButtonItemObject implements ButtonItem {
    id: number;
    title: string;
    url: string;
    target: string;
    icon: string;
    type: string;

    constructor(data: ButtonItem | null) {
        this.id = data?.id ?? 0;
        this.title = data?.title ?? '';
        this.url = data?.url ?? '';
        this.target = data?.target ?? '';
        this.icon = data?.icon ?? '';
        this.type = data?.type ?? '';
    }
}


export interface ComponentVisible {
    imageModal: boolean;
    linkModal: boolean;
    buttonModal: boolean;
}

// Interface for model field items
export interface ComponentModelFieldItem {
    fieldName: string;
    fieldType: string;
    source: string;
    model?: string;
    joinType?: string;
}
export interface ComponentModelFieldItemRow {
    name: string;
    source: string;
}

// Interface for field options with source
export interface ComponentFieldOptionWithSource {
    label: string;
    value: any;
    source: string;
}

export class ItemForm {
    component_id: number | null;
    component_item_id: number | null;
    property_name: string;
    title: string;
    subtitle: string;
    description: string;
    link_text: string;
    image: any;
    mobile_banner: any;
    count: number;
    fields: ComponentItemField[];

    constructor(data: Partial<ItemForm> = {}) {
        this.component_id = data.component_id ?? null;
        this.component_item_id = data.component_item_id ?? null;
        this.property_name = data.property_name ?? '';
        this.title = data.title ?? '';
        this.subtitle = data.subtitle ?? '';
        this.description = data.description ?? '';
        this.link_text = data.link_text ?? '';
        this.image = data.image ?? null;
        this.mobile_banner = data.mobile_banner ?? null;
        this.count = data.count ?? 0;
        this.fields = data.fields ?? [];
    }   
}
export interface ItemRelatedModel{
    name: string;
    title: string;
    class: string;
    type: string;
    fieldsExist: boolean;
    joinType: string;
    joinFields: string[];
    source: string;
}
export class ItemModelForm {
    component_id: number | null;
    component_item_id: number | null;
    property_name: string;
    title: string;
    subtitle: string;
    description: string;
    model: string;
    fieldsExist: boolean;
    is_recent: boolean;
    is_featured: boolean;
    item_count: number;
    related_models: ItemRelatedModel[];
    fields: ComponentModelFieldItem[];
    fieldsRows: {name: string, source: string}[];

    constructor(data: Partial<ItemModelForm> = {}) {
        this.component_id = data.component_id ?? null;
        this.component_item_id = data.component_item_id ?? null;
        this.property_name = data.property_name ?? '';
        this.title = data.title ?? '';
        this.subtitle = data.subtitle ?? '';
        this.description = data.description ?? '';
        this.model = data.model ?? '';
        this.fieldsExist = data.fieldsExist ?? false;
        this.is_recent = data.is_recent ?? false;
        this.is_featured = data.is_featured ?? false;
        this.item_count = data.item_count ?? 0;
        this.related_models = data.related_models ?? [];
        this.fields = data.fields ?? [];
        this.fieldsRows = data.fieldsRows ?? [];
    }

    // Method to add fields to the fields array
    addFields(newFields: ComponentModelFieldItem[]) {
        this.fields = [...this.fields, ...newFields];
    }

    // Method to remove fields from the fields array
    removeField(fieldName: string) {
        this.fields = this.fields.filter(field => {
            if(typeof field === 'string') {
                return field !== fieldName;
            } else {
                return field.fieldName !== fieldName;
            }
        });
    }

    // Method to clear all fields
    clearFields() {
        this.fields = [];
    }
}

/**
 * Interface for component item field
 */
export interface ComponentItemField {
    name: string;
    type: {type: DynamicModel}; // DynamicModel type
    imagesData: IFileModel[];
    value: string;
    value_editor: string;
    options: any[];
}
export class ComponentItemFieldObject implements ComponentItemField{
    name: string;
    type: {type: DynamicModel};
    imagesData: IFileModel[];
    value: string;
    value_editor: string;
    options: any[];

    constructor(data: any){
        this.name = data?.name ?? '';
        this.type = data?.type ?? {type: new DynamicModelObject()};
        this.imagesData = data?.imagesData ?? [];
        this.value = data?.value ?? '';
        this.value_editor = data?.value_editor ?? '';
        this.options = data?.options ?? [];
    }
}
export interface ComponentItemModelField extends Array<String>{}



export interface ComponentItemRelatedModel{
    model_id: number;
    name: string;
    type: string;
    joinType: string;
    class: string;
    source: string;
}
/**
 * Interface for component item
 */
export interface ComponentItem {
    id?: number;
    component_id?: number;
    component_item_id?: number;
    property_name: string;
    title: string;
    subtitle?: string;
    description?: string;
    link_text?: string;
    image?: any;
    mobile_banner?: any;
    is_recent?: boolean;
    is_featured?: boolean;
    item_count?: number;
    type: 'item' | 'model';
    fields: ComponentItemField[] | ComponentItemModelField[];
    model?: string;
    modelFields?: any[];
    related_models?: ComponentItemRelatedModel[];
}


  
class ComponentItemObject implements ComponentItem {
    id?: number;
    component_id?: number;
    component_item_id?: number;
    property_name: string;
    title: string;
    subtitle?: string;
    description?: string;
    link_text?: string;
    image?: IFileModel[];
    mobile_banner?: IFileModel[];
    is_recent?: boolean;
    is_featured?: boolean;
    item_count?: number;
    type: 'item' | 'model';
    fields: ComponentItemField[] | ComponentItemModelField[];
    model?: string;
    modelFields?: any[];
    related_models?: ComponentItemRelatedModel[];

    constructor(data: Partial<ComponentItem> = {}) {
        // console.log('ComponentItemObject constructor called with data:', data);
        this.id = data.id;
        this.component_id = data.component_id;
        this.component_item_id = data.component_item_id;
        this.property_name = data.property_name ?? '';
        this.title = data.title ?? '';
        this.subtitle = data.subtitle;
        this.description = data.description;
        this.link_text = data.link_text;
        this.image = data.image??[new FileModel({})];
        this.mobile_banner = data.mobile_banner??[new FileModel({})];
        this.is_recent = data.is_recent;
        this.is_featured = data.is_featured;
        this.item_count = data.item_count;
        this.type = data.type ?? 'item';
        this.model = data.model;
        this.modelFields = data.modelFields;
        this.related_models = data.related_models;
        this.fields = this.prepareFields(data.fields);
    }
    prepareFields(data: any){
        // console.log('prepareFields called with data:', data);
        // console.log('this.model:', this.model);
        // console.log('this.type:', this.type);
        
        const modelFields = [];
        if(this.model !== undefined && this.model !== null && this.model !== ''){
            // console.log('Processing as model item');
            // For model items, fields should be strings (field names)
            if(Array.isArray(data)){
                for(let field of data){
                    if(typeof field === 'string'){
                        // console.log('Adding string field:', field);
                        modelFields.push(field);
                    } else if(typeof field === 'object' && field !== null){
                        // Handle case where field might be an object with field information
                        if(field.name || field.fieldName){
                            // console.log('Adding field from object:', field.name || field.fieldName);
                            modelFields.push(field.name || field.fieldName);
                        } else {
                            // Fallback: try to extract field name from object
                            const fieldName = Object.keys(field)[0];
                            if(fieldName){
                                // console.log('Adding field from object keys:', fieldName);
                                modelFields.push(fieldName);
                            }
                        }
                    }
                }
            } 
            else if(data && typeof data === 'object'){
                // Handle case where data is a single object
                if(data.name || data.fieldName){
                    // console.log('Adding single field:', data.name || data.fieldName);
                    modelFields.push(data.name || data.fieldName);
                }
            }
        }
        else
        {
            // console.log('Processing as non-model item');
            // For non-model items, data should be an array of field objects
            if(Array.isArray(data)){
                for(let fieldData of data){
                    modelFields.push(new ComponentItemFieldObject(fieldData));
                }
            } else {
                // Fallback for single field object
                modelFields.push(new ComponentItemFieldObject(data));
            }
        }
        // console.log('Final modelFields:', modelFields);
        return modelFields;
    }
  }

/**
 * Interface for component data
 */
export interface ComponentData {
    component_id?: number | null;
    name?: string;
    section_title?: string;
    section_subtitle?: string;
    section_link?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    image?: IFileModel[];
    images?: IFileModel[];
    mobile_banner?: IFileModel[];
    buttons?: ButtonItem[];
    links?: LinkItem[];
    template?: string;
    model?: string | null;
    property_name?: string;
    is_recent?: boolean;
    is_featured?: boolean;
    active?: number | boolean;
    items?: ComponentItemObject[];
    banner_way_points?: any[];
}

/**
 * Component Model
 * Represents a component configuration in the system
 */
export default class Component {
    component_id: number | null;
    name: string;
    section_title: string;
    section_subtitle: string;
    section_link: string;
    title: string;
    subtitle: string;
    description: string;
    image: IFileModel[];
    images: IFileModel[];
    mobile_banner: IFileModel[];
    buttons: ButtonItem[];
    links: LinkItem[];
    template: string;
    model: string | null;
    active: number | boolean;
    items: ComponentItemObject[];
    banner_way_points: any[];

    /**
     * Creates a new Component instance
     * @param {ComponentData} data - Component data
     */
    constructor(data: ComponentData = {}) {
        this.component_id = data.component_id ?? null;
        this.name = data.name ?? '';
        this.section_title = data.section_title ?? '';
        this.section_subtitle = data.section_subtitle ?? '';
        this.section_link = data.section_link ?? '';
        this.title = data.title ?? '';
        this.subtitle = data.subtitle ?? '';
        this.description = data.description ?? '';
        this.image = data.image && data.image.length > 0 ? (typeof data.image === 'string' ? JSON.parse(data.image) : data.image) : [];
        this.mobile_banner = data.mobile_banner && data.mobile_banner.length > 0 ? (typeof data.mobile_banner === 'string' ? JSON.parse(data.mobile_banner) : data.mobile_banner) : [];
        this.images = data.images ?? [];
        this.buttons = data.buttons && Array.isArray(data.buttons) ? data.buttons : [];
        this.links = data.links && Array.isArray(data.links) ? data.links : [];
        this.template = data.template ?? '';
        this.model = data.model ?? null;
        this.active = data.active ?? false;
        this.items = data.items && Array.isArray(data.items) ? data.items.map(item => new ComponentItemObject(item)) : [];
        this.banner_way_points = data.banner_way_points ?? [];
    }

    /**
     * Create a Component instance from a plain object
     * @param {ComponentData} data - Plain object containing component data
     * @returns {Component} New Component instance
     */
    static fromJSON(data: ComponentData): Component {
        return new Component(data);
    }
}