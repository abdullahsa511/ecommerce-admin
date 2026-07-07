export default class Region {
    constructor(data) {
        this.region_id = data?.region_id??null;
        this.name = data?.name??'';
        this.code = data?.code??'';
        this.country_id = data?.country_id?? null;
        this.status = data?.status??1;
    }

    static fromJSON(json) {
        return new Region(json);
    }

} 