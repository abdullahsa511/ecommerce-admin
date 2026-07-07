export interface DynamicModel {
    type: any;
    name?: string;
    value?: any;
    required?: boolean;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    options?: any[];
    suggestions?: any[];
    mask?: string;
    keyfilter?: string | RegExp;
    cascadeOptions?: any[];
    treeOptions?: any[];
    editorConfig?: any;
    length?: number;
}


export class DynamicModelObject implements DynamicModel {
    type: any;
    name?: string;
    value?: any;
    required?: boolean;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    options?: any[];
    suggestions?: any[];
    mask?: string;
    keyfilter?: string | RegExp;
    cascadeOptions?: any[];
    treeOptions?: any[];
    editorConfig?: any;
    length?: number;
    constructor() {
       this.type = {type_id: 13, type: 'InputText'};
       this.name = 'InputText';
       this.value = '';
       this.required = false;
       this.placeholder = 'InputText';
       this.min = 0;
       this.max = 100;
       this.step = 1;
       this.options = [];
       this.suggestions = [];
       this.mask = '';
       this.keyfilter = '';
       this.cascadeOptions = [];
       this.treeOptions = [];
       this.editorConfig = {};
       this.length = 0;
    }
}