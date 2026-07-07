export default class TaxType {
    constructor(data) {
        this.tax_type_id = data?.tax_type_id??1;
        this.name = data?.name??'';
        this.content = data?.content??'';
        this.created_at = data?.created_at??'';
        this.updated_at = data?.updated_at??'';
    }

    static fromJSON(json) {
        return new TaxType(json);
    }
} 