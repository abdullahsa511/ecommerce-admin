export default class Country {
    constructor(data) {
        this.timezone_id = data?.timezone_id??null; 
        this.country_code = data?.country_code??'';
        this.timezone = data?.timezone??'';
        this.gmt_offset = data?.gmt_offset??0;
        this.dst_offset = data?.dst_offset??0;
        this.raw_offset = data?.raw_offset??0;
        this.created_at = data?.created_at??null;
        this.updated_at = data?.updated_at??null;
        this.deleted_at = data?.deleted_at??null;
    }

} 