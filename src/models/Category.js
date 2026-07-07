export default class Category {
    constructor(category_id, name, slug, parent_id = null) {
        this.category_id = category_id;
        this.name = name;
        this.slug = slug;
        this.parent_id = parent_id;
        this.children = [];
    }

    static fromJSON(json) {
        return new Category(
            json.category_id,
            json.name,
            json.slug,
            json.parent_id
        );
    }
} 