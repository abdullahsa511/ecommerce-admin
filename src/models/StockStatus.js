export default class StockStatus {
    constructor(data) {
        this.stock_status_id = data?.stock_status_id ?? null;
        this.name = data?.name ?? '';
        this.language_id = data?.language_id ?? 1;
    }

    static fromJSON(json) {
        return new StockStatus(json);
    }
} 