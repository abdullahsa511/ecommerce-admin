export class InstalledPlugin {
    constructor(plugin_id, thumb, extension, status, description, version, author, category) {
        this.plugin_id = plugin_id;
        this.thumb = thumb;
        this.extension = extension;
        this.status = status;
        this.description = description;
        this.version = version;
        this.author = author;
        this.category = category;
    }

    static fromJSON(json) {
        return new InstalledPlugin(
            json.plugin_id,
            json.thumb,
            json.extension,
            json.status,
            json.description,
            json.version,
            json.author,
            json.category
        );
    }
} 