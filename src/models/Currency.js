export default class Currency {
    constructor(data) {
        this.currency_id = data?.currency_id??null;
        this.name = data?.name??'';
        this.code = data?.code??'';
        this.value = data?.value??1.0000;
        this.sign_start = data?.sign_start??'';
        this.sign_end = data?.sign_end??'';
        this.decimal_place = data?.decimal_place??1;
        this.status = data?.status??1;
        this.updated_at = data?.updated_at??'';
    }

} 