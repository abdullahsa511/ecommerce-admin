export default class TagFilter {
    constructor() {
        this.name = null;
        this.slug = null;
        this.description = null;
    }

    matches(tag) {
        if (this.name && !tag.name.toLowerCase().includes(this.name.toLowerCase())) {
            return false;
        }
        if (this.slug && !tag.slug.toLowerCase().includes(this.slug.toLowerCase())) {
            return false;
        }
        if (this.description && !tag.description.toLowerCase().includes(this.description.toLowerCase())) {
            return false;
        }
        return true;
    }
} 