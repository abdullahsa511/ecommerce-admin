export interface ICompanyData {
    company_id?: number | null;
    company_name?: string;
    company_entity?: string | null;
    company_short?: string | null;
    sort_order?: number;
    company_code?: string;
    company_prefix?: string;
    company_trade_name?: string | null;
    company_entity_name?: string | null;
    phone_main?: string | null;
    krost_org_id?: string | null;
    krost_qld_org_id?: string | null;
    klein_org_id?: string | null;
    meloz_org_id?: string | null;
    gregbar_org_id?: string | null;
    vendor_id?: string;
    vendor_name?: string;
    ship_building?: string | null;
    ship_street?: string | null;
    ship_suburb?: string | null;
    ship_state?: string | null;
    ship_postcode?: string | null;
    ship_country?: string | null;
    bill_building?: string | null;
    bill_street?: string | null;
    bill_suburb?: string | null;
    bill_state?: string | null;
    bill_postcode?: string | null;
    bill_country?: string | null;
    po_box?: string | null;
    po_box_suburb?: string | null;
    po_box_state?: string | null;
    abn?: string | null;
    bsb?: string | null;
    account_number?: string | null;
    bpay_biller_code?: number | null;
    deleted_at?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
}

export default class Company implements ICompanyData {
    company_id: number | null;
    company_name: string;
    company_entity: string | null;
    company_short: string | null;
    sort_order: number;
    company_code: string;
    company_prefix: string;
    company_trade_name: string | null;
    company_entity_name: string | null;
    phone_main: string | null;
    krost_org_id: string | null;
    krost_qld_org_id: string | null;
    klein_org_id: string | null;
    meloz_org_id: string | null;
    gregbar_org_id: string | null;
    vendor_id: string;
    vendor_name: string;
    ship_building: string | null;
    ship_street: string | null;
    ship_suburb: string | null;
    ship_state: string | null;
    ship_postcode: string | null;
    ship_country: string | null;
    bill_building: string | null;
    bill_street: string | null;
    bill_suburb: string | null;
    bill_state: string | null;
    bill_postcode: string | null;
    bill_country: string | null;
    po_box: string | null;
    po_box_suburb: string | null;
    po_box_state: string | null;
    abn: string | null;
    bsb: string | null;
    account_number: string | null;
    bpay_biller_code: number | null;
    deleted_at: string | null;
    created_at: string | null;
    updated_at: string | null;

    constructor(data: Partial<ICompanyData> = {}) {
        this.company_id = data.company_id ?? null;
        this.company_name = data.company_name ?? '';
        this.company_entity = data.company_entity ?? null;
        this.company_short = data.company_short ?? null;
        this.sort_order = data.sort_order ?? 0;
        this.company_code = data.company_code ?? '';
        this.company_prefix = data.company_prefix ?? '';
        this.company_trade_name = data.company_trade_name ?? null;
        this.company_entity_name = data.company_entity_name ?? null;
        this.phone_main = data.phone_main ?? null;
        this.krost_org_id = data.krost_org_id ?? null;
        this.krost_qld_org_id = data.krost_qld_org_id ?? null;
        this.klein_org_id = data.klein_org_id ?? null;
        this.meloz_org_id = data.meloz_org_id ?? null;
        this.gregbar_org_id = data.gregbar_org_id ?? null;
        this.vendor_id = data.vendor_id ?? '';
        this.vendor_name = data.vendor_name ?? '';
        this.ship_building = data.ship_building ?? null;
        this.ship_street = data.ship_street ?? null;
        this.ship_suburb = data.ship_suburb ?? null;
        this.ship_state = data.ship_state ?? null;
        this.ship_postcode = data.ship_postcode ?? null;
        this.ship_country = data.ship_country ?? null;
        this.bill_building = data.bill_building ?? null;
        this.bill_street = data.bill_street ?? null;
        this.bill_suburb = data.bill_suburb ?? null;
        this.bill_state = data.bill_state ?? null;
        this.bill_postcode = data.bill_postcode ?? null;
        this.bill_country = data.bill_country ?? null;
        this.po_box = data.po_box ?? null;
        this.po_box_suburb = data.po_box_suburb ?? null;
        this.po_box_state = data.po_box_state ?? null;
        this.abn = data.abn ?? null;
        this.bsb = data.bsb ?? null;
        this.account_number = data.account_number ?? null;
        this.bpay_biller_code = data.bpay_biller_code ?? null;
        this.deleted_at = data.deleted_at ?? null;
        this.created_at = data.created_at ?? null;
        this.updated_at = data.updated_at ?? null;
    }

    static fromDBRow(row: any): Company {
        return new Company({
            company_id: row.company_id,
            company_name: row.company_name ?? '',
            company_entity: row.company_entity ?? null,
            company_short: row.company_short ?? null,
            sort_order: row.sort_order ?? 0,
            company_code: row.company_code ?? '',
            company_prefix: row.company_prefix ?? '',
            company_trade_name: row.company_trade_name ?? null,
            company_entity_name: row.company_entity_name ?? null,
            phone_main: row.phone_main ?? null,
            krost_org_id: row.krost_org_id ?? null,
            krost_qld_org_id: row.krost_qld_org_id ?? null,
            klein_org_id: row.klein_org_id ?? null,
            meloz_org_id: row.meloz_org_id ?? null,
            gregbar_org_id: row.gregbar_org_id ?? null,
            vendor_id: row.vendor_id ?? '',
            vendor_name: row.vendor_name ?? '',
            ship_building: row.ship_building ?? null,
            ship_street: row.ship_street ?? null,
            ship_suburb: row.ship_suburb ?? null,
            ship_state: row.ship_state ?? null,
            ship_postcode: row.ship_postcode ?? null,
            ship_country: row.ship_country ?? null,
            bill_building: row.bill_building ?? null,
            bill_street: row.bill_street ?? null,
            bill_suburb: row.bill_suburb ?? null,
            bill_state: row.bill_state ?? null,
            bill_postcode: row.bill_postcode ?? null,
            bill_country: row.bill_country ?? null,
            po_box: row.po_box ?? null,
            po_box_suburb: row.po_box_suburb ?? null,
            po_box_state: row.po_box_state ?? null,
            abn: row.abn ?? null,
            bsb: row.bsb ?? null,
            account_number: row.account_number ?? null,
            bpay_biller_code: row.bpay_biller_code ?? null,
            deleted_at: row.deleted_at ?? null,
            created_at: row.created_at ?? null,
            updated_at: row.updated_at ?? null,
        });
    }
}

