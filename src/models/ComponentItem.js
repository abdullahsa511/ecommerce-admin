import Field from './Field';

export default class ComponentItem {
    constructor(data = {}) {
        this.id = data.id || null;
        this.component_id = data.component_id || null;
        this.model_id = data.model_id || null;
        this.fields = (data.fields || []).map(field => new Field(field));
        this.item_count = data.item_count || 0;
        this.items = data.items || [];
    }

    static fromJSON(json) {
        return new ComponentItem(json);
    }

    toJSON() {
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