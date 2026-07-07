export default class Language {
    constructor(data ) {
        this.language_id = data?.language_id??null;
        this.name = data?.name??'';
        this.code = data?.code??'';
        this.locale = data?.locale??'';
        this.rtl = data?.rtl??0;
        this.sort_order = data?.sort_order??0;
        this.status = data?.status??1;
        this.default = data?.default??0;
    }

} 