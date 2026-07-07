export class LanguageFilter {
    constructor() {
        this.name = null;
        this.code = null;
        this.status = null;
    }

    matches(language) {
        if (!language) return false;

        if (this.name && !language.name.toLowerCase().includes(this.name.toLowerCase())) {
            return false;
        }

        if (this.code && !language.code.toLowerCase().includes(this.code.toLowerCase())) {
            return false;
        }

        if (this.status && !language.status.toLowerCase().includes(this.status.toLowerCase())) {
            return false;
        }

        return true;
    }
} 