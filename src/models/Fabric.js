export default class Fabric {
    constructor({
        fabric_id = null,
        name = '',
        material_type = '',
        texture = '',
        description = '',
        preview_image = null,
        date_added = null,
        date_updated = null
    } = {}) {
        this.fabric_id = fabric_id;
        this.name = name;
        this.material_type = material_type;
        this.texture = texture;
        this.description = description;
        this.preview_image = preview_image;
        this.date_added = date_added;
        this.date_updated = date_updated;
    }

    static fromJSON(json) {
        return new Fabric({
            fabric_id: json.fabric_id,
            name: json.name,
            material_type: json.material_type,
            texture: json.texture,
            description: json.description,
            preview_image: json.preview_image,
            date_added: json.date_added,
            date_updated: json.date_updated
        });
    }
}
