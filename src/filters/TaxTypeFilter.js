export class TaxTypeFilter {
    constructor() {
        this.name = '';
    }

    apply(taxTypes) {
        return taxTypes.filter(taxType => {
            let matches = true;

            if (this.name) {
                matches = matches && taxType.name.toLowerCase().includes(this.name.toLowerCase());
            }

            return matches;
        });
    }
} 