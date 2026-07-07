export class CountryFilter {
    constructor() {
        this.name = null;
        this.iso = null;
        this.status = null;
    }

    matches(country) {
        if (!country) return false;

        if (this.name && !country.name.toLowerCase().includes(this.name.toLowerCase())) {
            return false;
        }

        if (this.iso && !country.iso.toLowerCase().includes(this.iso.toLowerCase())) {
            return false;
        }

        if (this.status && !country.status.toLowerCase().includes(this.status.toLowerCase())) {
            return false;
        }

        return true;
    }
} 