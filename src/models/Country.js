export default class Country {
    constructor(data) {
        this.country_id = data?.country_id??null;
        this.name = data?.name??'';
        this.iso_code_2 = data?.iso_code_2??'';
        this.iso_code_3 = data?.iso_code_3??'';
        this.status = data?.status??1;
    }

} 