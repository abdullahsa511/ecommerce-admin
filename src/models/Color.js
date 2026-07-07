export default class Color {
    constructor({
        color_id = null,
        name = '',
        hex_code = '',
        rgb_code = '',
        description = '',
        date_added = null,
        date_updated = null
    } = {}) {
        this.color_id = color_id;
        this.name = name;
        this.hex_code = hex_code;
        this.rgb_code = rgb_code;
        this.description = description;
        this.date_added = date_added;
        this.date_updated = date_updated;
    }

    static fromJSON(json) {
        return new Color({
            color_id: json.color_id,
            name: json.name,
            hex_code: json.hex_code,
            rgb_code: json.rgb_code,
            description: json.description,
            date_added: json.date_added,
            date_updated: json.date_updated
        });
    }
}
