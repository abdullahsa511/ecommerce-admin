export default class MenuFilter {
    constructor() {
        this.name = null;
        this.location = null;
        this.dateFrom = null;
        this.dateTo = null;
    }

    matches(menu) {
        if (this.name && !menu.name.toLowerCase().includes(this.name.toLowerCase())) {
            return false;
        }

        if (this.location && menu.location !== this.location) {
            return false;
        }

        if (this.dateFrom && new Date(menu.created_at) < new Date(this.dateFrom)) {
            return false;
        }

        if (this.dateTo && new Date(menu.created_at) > new Date(this.dateTo)) {
            return false;
        }

        return true;
    }
} 