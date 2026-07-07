export default class BookingManagement{
    constructor(data){
        this.title = data?.title ?? '';
        this.grouped_data = data?.grouped_data ?? {};
        this.data = Array.isArray(data?.data)
            ? data.data.map((item) => ({
                visit_showroom_id: item?.visit_showroom_id ?? '',
                start_date: item?.start_date ?? '',
                end_date: item?.end_date ?? '',
                start_time: item?.start_time ?? '',
                end_time: item?.end_time ?? '',
                label: item?.label ?? '',
                title: item?.title ?? '',
                meeting_link: item?.meeting_link ?? '',
                tour_type: item?.tour_type ?? '',
                enquiry_type: item?.enquiry_type ?? ''
            }))
            : [];
    }

    static fromJSON(json){
        return new BookingManagement(json);
    }
}