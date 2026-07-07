export class RegionFilter {
    constructor() {
        this.name = null;
        this.country = null;
        this.status = null;
    }

    matches(region) {
        if (!region) return false;

        if (this.name && !region.name.toLowerCase().includes(this.name.toLowerCase())) {
            return false;
        }

        if (this.country && !region.country.toLowerCase().includes(this.country.toLowerCase())) {
            return false;
        }

        if (this.status && !region.status.toLowerCase().includes(this.status.toLowerCase())) {
            return false;
        }

        return true;
    }
} 