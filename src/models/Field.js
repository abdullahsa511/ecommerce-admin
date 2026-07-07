export default class Field {
    static defaultFields = [
        'id',
        'name',
        'label',
        'alias',
        'type',
        'is_editable',
        'is_required'
    ];
    constructor(data = {}) {
        this.id = data.id || null;
        this.name = data.name || '';
        this.label = data.label ??'Label';
        // this.alias = data.alias || '';
        this.type = data.type || 'text';
        this.is_required = data.is_required ?? false;
        for(const field of Object.keys(data)){
            if(!Field.defaultFields.includes(field)){
                this[field] = data[field];
            }
        }
        this.length = data.length || null;
        this.nullable = data.nullable || false;
        this.primary = data.primary || false;
        this.default = data.default || null;
        this.comment = data.comment || '';
        this.is_auto_increment = data.is_auto_increment || false;
        
        // For UI display
        this.alias = data.alias || this.formatAlias(this.name);
        this.is_editable = data.is_editable !== undefined ? data.is_editable : true;
        this.defaultValue = data.defaultValue !== undefined ? data.defaultValue : '';
        this.required = data.required !== undefined ? data.required : false;
    }

    // static fromJSON(json) {
    //     return new Field(json);
    // }

    formatAlias(name) {
        if (!name) return '';
        // Convert snake_case to Title Case
        return name.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    toJSON() {
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