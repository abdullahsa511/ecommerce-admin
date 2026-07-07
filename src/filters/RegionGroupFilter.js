export class RegionGroupFilter {
    constructor() {
        this.name = null;
    }

    matches(regionGroup) {
        if (this.name && !regionGroup.name.toLowerCase().includes(this.name.toLowerCase())) {
            return false;
        }
        return true;
    }
} 