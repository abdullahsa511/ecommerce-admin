export default class ProductFinish {
    constructor({
        finish_id = null,
        thumbnail = null,
        name = '',
        slug = '',
        description = '',
        date_added = null,
        date_updated = null
    } = {}) {
        this.finish_id = finish_id;
        this.thumbnail = thumbnail;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.date_added = date_added;
        this.date_updated = date_updated;
    }

    static fromJSON(json) {
        return new ProductFinish({
            finish_id: json.finish_id,
            thumbnail: json.thumbnail,
            name: json.name,
            slug: json.slug,
            description: json.description,
            date_added: json.date_added,
            date_updated: json.date_updated
        });
    }
}
