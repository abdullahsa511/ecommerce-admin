export class StockStatusFilter {
    constructor() {
        this.name = '';
    }

    apply(stockStatuses) {
        return stockStatuses.filter(stockStatus => {
            let matches = true;

            if (this.name) {
                matches = matches && stockStatus.name.toLowerCase().includes(this.name.toLowerCase());
            }

            return matches;
        });
    }
} 