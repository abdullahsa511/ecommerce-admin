export default class Menu {
    constructor(menu_id, name, slug, location, items = [], created_at, updated_at) {
        this.menu_id = menu_id;
        this.name = name;
        this.slug = slug;
        this.location = location;
        this.items = items;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    static fromJSON(json) {
        return new Menu(
            json.menu_id,
            json.name,
            json.slug,
            json.location,
            json.items,
            json.created_at,
            json.updated_at
        );
    }
} 