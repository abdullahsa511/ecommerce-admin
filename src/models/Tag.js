export default class Tag {
    constructor(tag_id, name, slug, description, thumbnail) {
        this.tag_id = tag_id;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.thumbnail = thumbnail;
    }

    static fromJSON(json) {
        return new Tag(
            json.tag_id,
            json.name,
            json.slug,
            json.description,
            json.thumbnail
        );
    }
} 