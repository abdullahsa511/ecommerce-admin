export interface IService {
    service_request_id: number;
    uuid: string;
    company: string | null;
    full_name: string | null;
    first_name: string | null;
    last_name: string | null;
    catalogue_format: string | null;
    request_type: string | null;
    form_type: string | null;
    pinboard_id: number | null;
    customer_id: number | null;
    email: string;
    content: string | null;
    phone_number: string | null;
    mailing_address: string | null;
    source_of_enquiry: string | null;
    comment_attachment: string | null;
    attachments: string;
    created_at: string;
    updated_at: string;
}

export class Service implements IService {
    service_request_id: number;
    uuid: string;
    company: string | null;
    full_name: string | null;
    first_name: string | null;
    last_name: string | null;
    catalogue_format: string | null;
    request_type: string | null;
    form_type: string | null;
    pinboard_id: number | null;
    customer_id: number | null;
    email: string;
    content: string | null;
    phone_number: string | null;
    mailing_address: string | null;
    source_of_enquiry: string | null;
    comment_attachment: string | null;
    attachments: string;
    created_at: string;
    updated_at: string;

    constructor(data: Partial<IService> = {}) {
        this.service_request_id = data.service_request_id ?? 0;
        this.uuid = data.uuid ?? '';
        this.company = data.company ?? null;
        this.full_name = data.full_name ?? null;
        this.first_name = data.first_name ?? null;
        this.last_name = data.last_name ?? null;
        this.catalogue_format = data.catalogue_format ?? null;
        this.request_type = data.request_type ?? null;
        this.form_type = data.form_type ?? null;
        this.pinboard_id = data.pinboard_id ?? null;
        this.customer_id = data.customer_id ?? null;
        this.email = data.email ?? '';
        this.content = data.content ?? null;
        this.phone_number = data.phone_number ?? null;
        this.mailing_address = data.mailing_address ?? null;
        this.source_of_enquiry = data.source_of_enquiry ?? null;
        this.comment_attachment = data.comment_attachment ?? null;
        this.attachments = data.attachments ?? '[]';
        this.created_at = data.created_at ?? '';
        this.updated_at = data.updated_at ?? '';
    }

    get customer_name(): string {
        if (this.full_name && this.full_name.trim()) return this.full_name;
        return [this.first_name, this.last_name].filter(Boolean).join(' ').trim();
    }
}
