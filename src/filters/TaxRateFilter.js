import TaxRate from '../models/TaxRate';

export class TaxRateFilter {
    constructor() {
        this.name = '';
        this.rate = '';
        this.type = '';
    }

    matches(taxRate) {
        if (!(taxRate instanceof TaxRate)) {
            return false;
        }

        if (this.name && !taxRate.name.toLowerCase().includes(this.name.toLowerCase())) {
            return false;
        }

        if (this.rate && !taxRate.rate.toString().includes(this.rate)) {
            return false;
        }

        if (this.type && !taxRate.type.toLowerCase().includes(this.type.toLowerCase())) {
            return false;
        }

        return true;
    }
} 