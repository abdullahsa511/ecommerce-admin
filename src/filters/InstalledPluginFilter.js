export class InstalledPluginFilter {
    constructor() {
        this.extension = null;
        this.status = null;
        this.category = null;
    }

    matches(plugin) {
        if (this.extension && !plugin.extension.toLowerCase().includes(this.extension.toLowerCase())) {
            return false;
        }
        if (this.status && plugin.status !== this.status) {
            return false;
        }
        if (this.category && plugin.category !== this.category) {
            return false;
        }
        return true;
    }
} 