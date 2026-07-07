export default class TaxRate {
    constructor(data) {
        this.tax_rate_id = data?.tax_rate_id??null;
        this.region_group_id = data?.region_group_id??1;
        this.name = data?.name??'';
        this.rate = data?.rate??0;
        this.type = data?.type??'P'; // Default to Percentage
        this.created_at = data?.created_at??'';
        this.updated_at = data?.updated_at??'';
    }

    static fromJSON(json) {
        return new TaxRate(json);
    }
} 