export interface IContactRequest {
  visit_showroom_id: number;
  showroom_contact_id: number;
  showroom_contact_name: string;
  customer_name: string;
  customer_email: string;
  showroom_title: string;
  pinboard_name?: string;
  pinboard_id: number;
  showroom_id: number;
  tour_type: string;
  date: string;
  meeting_time: string;
  time_zone: string;
  note: string;
  created_at: string;
  updated_at: string;
  source: string;
  enquiry_type: string;
}

export class ContactRequest implements IContactRequest {        
    visit_showroom_id: number;
    showroom_contact_id: number;
    showroom_contact_name: string;
    customer_name: string;
    customer_email: string;
    showroom_title: string;
    pinboard_id: number;
    pinboard_name?: string;
    showroom_id: number;
    tour_type: string;
    date: string;
    meeting_time: string;
    time_zone: string;
    note: string;
    created_at: string;
    updated_at: string;
    source: string;
    enquiry_type: string;

    constructor(data: Partial<IContactRequest> = {}) {
        this.visit_showroom_id = data.visit_showroom_id ?? 0;
        this.showroom_contact_id = data.showroom_contact_id ?? 0;
        this.showroom_contact_name = data.showroom_contact_name ?? '';
        this.customer_name = data.customer_name ?? '';
        this.customer_email = data.customer_email ?? '';
        this.pinboard_id = data.pinboard_id ?? 0;
        this.showroom_title = data.showroom_title ?? '';
        this.pinboard_name = data.pinboard_name ?? '';
        this.showroom_id = data.showroom_id ?? 0;
        this.tour_type = data.tour_type ?? '';
        this.date = data.date ?? '';
        this.meeting_time = data.meeting_time ?? '';
        this.time_zone = data.time_zone ?? '';
        this.note = data.note ?? '';
        this.created_at = data.created_at ?? '';
        this.updated_at = data.updated_at ?? '';
        this.source = data.source ?? '';
        this.enquiry_type = data.enquiry_type ?? '';
    }


    // static fromJSON(data: Partial<ICustomerData>): CustomerData {
    //   return new CustomerData(data);
    // }
  
    // toJSON(): ICustomerData {
    //   return {
    //     name: this.name,
    //     customerDetails: this.customerDetails,
    //     billingDetails: this.billingDetails,
    //     shippingDetails: this.shippingDetails
    //   };
    // }
}

