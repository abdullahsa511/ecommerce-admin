
export interface ISubscription {
    subscription_id: number | null;
    order_id: number;
    order_product_id: number;
    user_id: number;
    site_id: number;
    payment_address_id: number;
    payment_method: string;
    shipping_address_id: number;
    shipping_method: string;
    product_id: number;
    quantity: number;
    price: number;
    period: number;
    cycle: number;
    length: number;
    left: number;
    trial_price: number;
    trial_period: number;
    trial_cycle: number;
    trial_length: number;
    trial_left: number;
    trial_status: number;
    date_next: Date | Date[] | (Date | null)[] | null;
    notes: string;
    created_at: string;
    updated_at: string;
    email: string;
    subscription_plan_id: number;
    subscription_status_id: number;

    // extra
    user?:string | null;
    reason?:string | null;
    status?:string | null;
    
}

export default class Subscription implements ISubscription{
    subscription_id: number | null;
    order_id: number;
    order_product_id: number;
    user_id: number;
    site_id: number;
    payment_address_id: number;
    payment_method: string;
    shipping_address_id: number;
    shipping_method: string;
    product_id: number;
    quantity: number;
    price: number;
    period: number;
    cycle: number;
    length: number;
    left: number;
    trial_price: number;
    trial_period: number;
    trial_cycle: number;
    trial_length: number;
    trial_left: number;
    trial_status: number;
    date_next: Date | Date[] | (Date | null)[] | null;
    notes: string;
    created_at: string;
    updated_at: string;
    email: string;
    subscription_plan_id: number;
    subscription_status_id: number;

    user:string | null;
    reason:string | null;
    status:string | null;

    constructor(data:Partial<ISubscription> = {}){
        this.subscription_id = data.subscription_id ?? null;
        this.order_id = data.order_id ?? 0;
        this.order_product_id = data.order_product_id ?? 0;
        this.user_id = data.user_id ?? 0;
        this.site_id = data.site_id ?? 0;
        this.payment_address_id = data.payment_address_id ?? 0;
        this.payment_method = data.payment_method ?? "";
        this.shipping_address_id = data.shipping_address_id ?? 0;
        this.shipping_method = data.shipping_method ?? "";
        this.product_id = data.product_id ?? 0;
        this.quantity = data.quantity ?? 0;
        this.price = data.price ?? 0;
        this.period = data.period ?? 0;
        this.cycle = data.cycle ?? 0;
        this.length = data.length ?? 0;
        this.left = data.left ?? 0;
        this.trial_price = data.trial_price ?? 0;
        this.trial_period = data.trial_period ?? 0;
        this.trial_cycle = data.trial_cycle ?? 0;
        this.trial_length = data.trial_length ?? 0;
        this.trial_left = data.trial_left ?? 0;
        this.trial_status = data.trial_status ?? 0;
        this.date_next = data.date_next ?? null;
        this.notes = data.notes ?? "";
        this.created_at = data.created_at ?? "";
        this.updated_at = data.updated_at ?? "";
        this.email = data.email ?? "";
        this.subscription_plan_id = data.subscription_plan_id ?? 0;
        this.subscription_status_id = data.subscription_status_id ?? 0;

        this.user = data.user?? null;
        this.reason = data.reason ?? null;
        this.status = data.status ?? null;
    }

    static fromJSON(data: Partial<ISubscription>): Subscription{
        return new Subscription(data);
    }
}