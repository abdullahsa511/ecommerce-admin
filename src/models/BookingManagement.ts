// this file not use
// use BookingManagement.js
export interface IBookingManagementItem {
    visit_showroom_id: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    label: string;
    title: string;
    tour_type: string;
    enquiry_type: string;
}
export class BookingManagementItem implements IBookingManagementItem{
    visit_showroom_id: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    label: string;
    title: string;
    tour_type: string;
    enquiry_type: string;

    constructor(data: Partial<IBookingManagementItem> = {}) {
        console.log('🔥 REAL constructor running, raw input:', data);
        this.visit_showroom_id = data.visit_showroom_id ?? "";
        this.start_date = data.start_date ?? "";
        this.end_date = data.end_date ?? "";
        this.start_time = data.start_time ?? "";
        this.end_time = data.end_time ?? "";
        this.label = data.label ?? "";
        this.title = data.title ?? "";
        this.tour_type = data.tour_type ?? "";
        this.enquiry_type = data.enquiry_type ?? "";
    }
}


export interface IBookingManagement {
    title: string;
    data: BookingManagementItem[];
    grouped_data?: Record<string, BookingManagementItem[]>;
    booking_date?:Date | Date[] | (Date | null)[] | null;
}

export default class BookingManagement implements IBookingManagement{
    title: string;
    data: BookingManagementItem[];
    grouped_data?: Record<string, BookingManagementItem[]>;
    booking_date?:Date | Date[] | (Date | null)[] | null;

    constructor(data:Partial<IBookingManagement> = {}){
        this.title = data.title ?? "";
        this.data = (data.data ?? []).map((item) => new BookingManagementItem(item));
        this.grouped_data = data.grouped_data ?? {};
        this.booking_date = data.booking_date ?? null;
    }

    static fromJSON(data: Partial<IBookingManagement>): BookingManagement{
        return new BookingManagement(data);
    }
}
