export default class ContactRequestImportExport {
    constructor(data = {}) {
        this.visit_showroom_id = data?.visit_showroom_id ?? 0;
        this.showroom_contact_id = data?.showroom_contact_id ?? 0;
        this.pinboard_id = data?.pinboard_id ?? 0;
        this.showroom_id = data?.showroom_id ?? 0;
        this.tour_type = data?.tour_type ?? '';
        this.date = data?.date ?? '';
        this.meeting_time = data?.meeting_time ?? '';
        this.time_zone = data?.time_zone ?? '';
        this.created_at = data?.created_at ?? '';
        this.updated_at = data?.updated_at ?? '';
    }

    static fromJSON(data) {
        return new ContactRequestImportExport(data);
    }
}